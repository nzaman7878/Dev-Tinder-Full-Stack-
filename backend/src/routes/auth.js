const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log("Received login request with email:", emailId);

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      console.log("User not found for email:", emailId);
      return res.status(400).json({ message: "User not found" }); // Return JSON
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("Is password valid:", isPasswordValid);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      return res.json(user); // Return JSON
    } else {
      console.log("Invalid password for email:", emailId);
      return res.status(400).json({ message: "Invalid credentials" }); // Return JSON
    }
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(400).json({ message: err.message }); // Return JSON
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;