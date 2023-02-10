const express = require("express");
const messageController = require("../controllers/messageController");
const { verifyUser } = require("../middleware/auth");

const messageRouter = express.Router();

messageRouter.get(
  "/getmessage/:id/:messageid",
  verifyUser,
  messageController.getMessage
);
messageRouter.get(
  "/getallmessages/:id/:chatid",
  verifyUser,
  messageController.getAllMessages
);
messageRouter.post(
  "/sendmessage/:id",
  verifyUser,
  messageController.sendMessage
);

module.exports = messageRouter;
