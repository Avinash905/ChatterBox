const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//get all chats of a user
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ users: { $in: req.user.id } }).populate(
      "users"
    );
    res.send(chats);
  } catch (error) {
    next(error);
  }
};

//create one to one chat
const createChat = async (req, res, next) => {
  try {
    const present = await Chat.find({
      isGroupChat: false,
      $and: [{ users: req.user.id }, { users: req.body.otherid }],
    });

    if (present.length > 0) {
      return res.send(present[0]);
    }

    const chat = Chat({
      chatName: "sender",
      users: [req.user.id, req.body.otherid],
    });

    const result = await chat.save();
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const users = req.body.users;
    users.push(req.user.id);

    const group = Chat({
      chatName: req.body.chatName,
      isGroupChat: true,
      groupAdmin: req.user.id,
      users,
    });

    const result = await group.save();
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

const renameGroup = async (req, res, next) => {
  try {
    const group = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        chatName: req.body.chatName,
      },
      { new: true }
    );

    res.status(201).send(group);
  } catch (error) {
    next(error);
  }
};

//remove someone from group
const removeFromGroup = async (req, res, next) => {
  try {
    console.log(req.body);
    const group = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $pull: { users: req.body.userId },
      },
      { new: true }
    );
    res.status(201).send(group);
  } catch (error) {
    next(error);
  }
};

//add someone to group
const addToGroup = async (req, res, next) => {
  try {
    const group = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $push: { users: req.body.userId },
      },
      { new: true }
    );

    res.status(201).send(group);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
  createChat,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
