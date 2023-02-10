const express = require("express");
const chatController = require("../controllers/chatController");
const { verifyUser } = require("../middleware/auth");

const chatRouter = express.Router();

// single chat routes
chatRouter.get("/getchats/:id", verifyUser, chatController.getChats);
chatRouter.post("/createchat/:id", verifyUser, chatController.createChat);

// group chat routes
chatRouter.post("/creategroup/:id", verifyUser, chatController.createGroup);
chatRouter.put("/renamegroup/:id", verifyUser, chatController.renameGroup);
chatRouter.put(
  "/removefromgroup/:id",
  verifyUser,
  chatController.removeFromGroup
);
chatRouter.put("/addtogroup/:id", verifyUser, chatController.addToGroup);

module.exports = chatRouter;
