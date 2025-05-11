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

const User = require("./models/user.model.js");

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

app.listen(process.env.PORT, () => {
  console.log("Server is running on port number = ", process.env.PORT);
  console.log(`Link: http://localhost:${process.env.PORT}`);
});

module.exports = app;
