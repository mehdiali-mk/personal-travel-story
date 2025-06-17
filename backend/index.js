require("dotenv").config({
  path: "./.env",
});

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const upload = require("./multer.js");
const fs = require("fs");
const path = require("path");

const { authenticateToken } = require("./utilities.js");

const User = require("./models/user.model.js");
const TravelStory = require("./models/travelStory.model.js");

// mongoose.connect(config.connectionString);

console.log(`${process.env.MONGODB_URI}/travelstory`);
async function connectionToDatabase() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/travelstory`);

    console.log("\nDatabase connected successfully...");
  } catch (error) {
    console.log("\nDatabase not connected...\n", error);
  }
}

connectionToDatabase();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Test API
app.post("/create-account", async (request, response) => {
  if (!request.body) {
    return response
      .status(400)
      .json({ error: true, message: "Fill all the data." });
  }
  const { fullName, email, password } = request.body;

  if (!fullName || !email || !password) {
    return response
      .status(400)
      .json({ error: true, message: "All fields are required." });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return response
      .status(400)
      .json({ error: true, message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return response.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "Registration Successful",
  });
});

// Login Account
app.post("/login", async (request, response) => {
  if (!request.body) {
    return response
      .status(400)
      .json({ error: true, message: "Fill all the data." });
  }

  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ error: true, message: "Email and Password are required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return response
      .status(400)
      .json({ error: true, message: "User not found!" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return response
      .status(400)
      .json({ error: true, message: "Invalid Login Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return response.status(201).json({
    error: false,
    message: "Login Successful",
    user: {
      fullName: user.fullName,
      email: user.email,
    },
    accessToken,
  });
});

// Get User
app.get("/get-user", authenticateToken, async (request, response) => {
  const { userId } = request.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return response
      .status(401)
      .json({ error: true, message: "User not found." });
  }

  return response.status(201).json({ error: false, user: isUser, message: "" });
});

// Upload Story Image Route.
app.post("/image-upload", upload.single("image"), async (request, response) => {
  try {
    if (!request.file) {
      return response
        .status(400)
        .json({ error: true, message: "No image uploaded." });
    }

    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${request.file.filename}`;

    response.status(200).json({ imageUrl });
  } catch (error) {
    response.status(500).json({ error: true, message: error.message });
  }
});

// Delete an Image from uploads folder.
app.delete("/delete-image", async (request, response) => {
  const { imageUrl } = request.query;

  if (!imageUrl) {
    return response
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required." });
  }

  try {
    const filename = path.basename(imageUrl);

    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return response
        .status(200)
        .json({ error: false, message: "image deleted successfully." });
    } else {
      return response
        .status(200)
        .json({ error: false, message: "Image not Found." });
    }
  } catch (error) {
    return response.status(500).json({ error: true, message: error.message });
  }
});

// Static files from the uploads and asserts directory.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "uploads")));

// Add story
app.post("/add-travel-story", authenticateToken, async (request, response) => {
  if (!request.body) {
    return response
      .status(400)
      .json({ error: true, message: "Fill all the data." });
  }

  const { title, story, visitedLocation, imageUrl, visitedDate } = request.body;
  const { userId } = request.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return response
      .status(400)
      .json({ error: true, message: "All fields are required." });
  }

  // Visited Date is converted from milliseconds to Date Object.
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    await travelStory.save();

    response.status(201).json({
      error: false,
      story: travelStory,
      message: "Story added successfully",
    });
  } catch (error) {
    response.status(400).json({ error: true, message: error.message });
  }
});

// Get all stories.
app.get("/get-all-stories", authenticateToken, async (request, response) => {
  const { userId } = request.user;

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });
    response.status(200).json({ error: false, stories: travelStories });
  } catch (error) {
    response.status(500).json({ error: true, message: error.message });
  }
});

// Edit Travel Story.
app.put("/edit-story/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = request.body;
  const { userId } = request.user;

  if (!title || !story || !visitedLocation || !visitedDate) {
    return response
      .status(400)
      .json({ error: true, message: "All fields are required." });
  }

  // Visited Date is converted from milliseconds to Date Object.
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return response
        .status(404)
        .json({ error: true, message: "Travel Story not found." });
    }

    const placeholderImageUrl = `http://localhost:${process.env.PORT}/assets/placeholder.jpeg`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImageUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    response.status(200).json({
      error: false,
      story: travelStory,
      message: "Updated Successfully",
    });
  } catch (error) {
    return response.status(500).json({ error: true, message: error.message });
  }
});

// Delete Travel Stroy.
app.delete(
  "/delete-story/:id",
  authenticateToken,
  async (request, response) => {
    const { id } = request.params;
    const { userId } = request.user;

    try {
      const travelStroy = await TravelStory.findOne({
        _id: id,
        userId: userId,
      });

      // if (!travelStory) {
      //   return response
      //     .status(404)
      //     .json({ error: true, message: "Travel Story not found." });
      // }

      console.log(travelStroy);
      await TravelStory.deleteOne({ _id: id, userId: userId });

      console.log(travelStroy.imageUrl);

      const imageUrl = travelStroy.imageUrl;
      const filename = path.basename(imageUrl);

      const filePath = path.join(__dirname, "uploads", filename);

      fs.unlink(filePath, (error) => {
        if (error) {
          console.log("Failed to delete image file: ", error);
        }
      });

      return response
        .status(200)
        .json({ error: false, message: "Travel Story deleted successfully!!" });
    } catch (error) {
      return response.status(500).json({ error: true, message: error.message });
    }
  }
);

// Update isfavourite.
app.put(
  "/update-is-favourite/:id",
  authenticateToken,
  async (request, response) => {
    const { id } = request.params;
    const { isFavourite } = request.body;
    const { userId } = request.user;

    try {
      const travelStory = await TravelStory.findOne({
        _id: id,
        userId: userId,
      });

      if (!travelStory) {
        response
          .status(401)
          .json({ error: true, message: "Travel Story not found." });
      }

      travelStory.isFavourite = isFavourite;

      await travelStory.save();

      return response.status(200).json({
        error: false,
        story: travelStory,
        message: "Update successful.",
      });
    } catch (error) {
      return response.status(500).json({ error: true, message: error.message });
    }
  }
);

// Search Travel Story.
app.get("/search", authenticateToken, async (request, response) => {
  const { query } = request.query;
  const { userId } = request.user;

  if (!query) {
    return response
      .status(404)
      .json({ error: true, message: "Query required." });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    return response.status(200).json({ error: false, stories: searchResults });
  } catch (error) {
    return response.status(500).json({ error: true, message: error.message });
  }
});

// Filter Travel Stories by Date Range.
app.get(
  "/travel-stories/filter",
  authenticateToken,
  async (request, response) => {
    const { startDate, endDate } = request.query;
    const { userId } = request.user;

    try {
      const start = new Date(parseInt(startDate));
      const end = new Date(parseInt(endDate));

      const filteredStories = await TravelStory.find({
        userId: userId,
        visitedDate: { $gte: start, $lte: end },
      }).sort({ isFavourite: -1 });

      return response
        .status(200)
        .json({ error: false, stories: filteredStories });
    } catch (error) {
      return response.status(500).json({ error: true, message: error.message });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port number = ", process.env.PORT);
  console.log(`Link: http://localhost:${process.env.PORT}`);
});

module.exports = app;
