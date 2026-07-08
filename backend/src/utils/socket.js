import { Server } from "socket.io";
import crypto from "crypto";
import { Chat } from "../models/chat.js";

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // Simple online presence tracker
  const onlineUsers = new Set();

  io.on("connection", (socket) => {
    // When a user connects and identifies themselves
    socket.on("userConnected", ({ userId }) => {
      socket.userId = userId;
      onlineUsers.add(userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    // Typing indicators
    socket.on("typing", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("userTyping", { userId });
    });

    socket.on("stopTyping", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("userStoppedTyping", { userId });
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text, imageUrl }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " sent a message");

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          const newMessage = {
            senderId: userId,
            text,
            imageUrl,
          };
          chat.messages.push(newMessage);
          await chat.save();

          // Get the saved message (with timestamp and _id)
          const savedMessage = chat.messages[chat.messages.length - 1];

          io.to(roomId).emit("messageReceived", { 
            firstName, 
            lastName, 
            text: savedMessage.text,
            imageUrl: savedMessage.imageUrl,
            senderId: savedMessage.senderId,
            createdAt: savedMessage.createdAt,
            _id: savedMessage._id
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers));
      }
    });
  });
};

export default initializeSocket;