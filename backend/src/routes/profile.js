import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { viewProfile, editProfile, uploadPhoto } from "../controllers/profile.controller.js";
import upload from "../middlewares/upload.js";

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, viewProfile);
profileRouter.patch("/profile/edit", userAuth, editProfile);
profileRouter.post("/profile/photo", userAuth, upload.single("photo"), uploadPhoto);

export default profileRouter;