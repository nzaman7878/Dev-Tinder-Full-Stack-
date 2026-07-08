import { validateEditProfileData } from "../utils/validation.js";

export const viewProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email address is already in use." });
    }
    res.status(400).json({ message: err.message });
  }
};
