const express = require("express");
const userController = require("../controllers/userController");
const { verifyUser } = require("../middleware/auth");

const userRouter = express.Router();

userRouter.get("/getuser/:id/:userid", verifyUser, userController.getUser);
userRouter.get("/searchuser/:id", verifyUser, userController.searchUser);
userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);

module.exports = userRouter;
