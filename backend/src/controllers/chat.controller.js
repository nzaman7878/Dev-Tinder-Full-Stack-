import { Chat } from "../models/chat.js";
import imagekit from "../utils/imagekit.js";

export const getChat = async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
};

export const uploadChatImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `chat_${req.user._id}_${Date.now()}`,
      folder: "/devtinder_chats",
    });

    res.json({
      message: "Image uploaded successfully",
      imageUrl: result.url,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image: " + err.message });
  }
};
