require("dotenv").config({
  path: "./.env",
});

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

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

app.listen(process.env.PORT, () => {
  console.log("Server is running on port number = ", process.env.PORT);
  console.log(`Link: http://localhost:${process.env.PORT}`);
});

module.exports = app;
