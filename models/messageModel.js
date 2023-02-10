const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId },
    senderPic: {
      type: String,
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", schema);

module.exports = Message;
