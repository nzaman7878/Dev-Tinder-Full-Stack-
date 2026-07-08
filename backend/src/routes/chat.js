import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { getChat, uploadChatImage } from "../controllers/chat.controller.js";
import upload from "../middlewares/upload.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, getChat);
chatRouter.post("/chat/photo", userAuth, upload.single("photo"), uploadChatImage);

export default chatRouter;