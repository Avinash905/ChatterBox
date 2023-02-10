const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getAllMessages = async (req, res, next) => {
  try {
    const message = await Message.find({
      chat: req.params.chatid,
    });
    res.send(message);
  } catch (error) {
    next(error);
  }
};

const getMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageid);
    console.log("message", req.params.messageid);
    res.send(message);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    let msg = Message({
      chat: req.body.chatid,
      senderPic: user.pic,
      senderId: user._id,
      content: req.body.content,
    });

    let message = await msg.save();

    await Chat.findByIdAndUpdate(req.body.chatid, {
      latestMessage: message._id,
    });
    res.send(message);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessage, getAllMessages, sendMessage };
