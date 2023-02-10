const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const searchUser = async (req, res, next) => {
  try {
    const searchquery = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    const user = await User.find(searchquery)
      .find({
        _id: { $ne: req.user.id },
      })
      .select("-password");
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userid).select("-password");
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).send("Incorrect credentials");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.send({ msg: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const alreadyPresent = await User.findOne({ email: req.body.email });
    if (alreadyPresent) {
      return res.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getUser, searchUser };
