module.exports = (app) => {
  const User = require("../models/user");
  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const UserController = require("../controllers/user.controller");

  //signup user
  app.post("/user/signup", UserController.signup);

  //user login
  app.post("/user/login", UserController.login);

  //delete user
  app.delete("/user/:userId", UserController.deleteUser);
};
