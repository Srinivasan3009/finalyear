const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");


// 🔹 Create new chat
router.post("/new", async (req, res) => {
  const { userId } = req.body;

  // count user's chats
  const count = await Chat.countDocuments({ userId });

  const chat = new Chat({
    userId,
    title: `Chat ${count + 1}`
  });

  await chat.save();
  res.json(chat);
});



// 🔹 Get all chats of user
router.get("/user/:userId", async (req, res) => {
  const chats = await Chat.find({ userId: req.params.userId })
    .sort({ createdAt: -1 });

  res.json(chats);
});


// 🔹 Add message
router.post("/message", async (req, res) => {
  const { chatId, sender, text } = req.body;

  await Chat.findByIdAndUpdate(chatId, {
    $push: { messages: { sender, text } }
  });

  res.json({ success: true });
});


// 🔹 Delete chat
router.delete("/:chatId", async (req, res) => {
  await Chat.findByIdAndDelete(req.params.chatId);
  res.json({ success: true });
});

module.exports = router;
