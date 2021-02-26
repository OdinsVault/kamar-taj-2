const UserController = require("../controllers/user.controller"),
      checkAuth = require('../middleware/check-auth');

module.exports = (app) => {

  //signup user
  app.post("/user/signup", UserController.signup);

  //user login
  app.post("/user/login", UserController.login);

  //delete own user profile
  app.delete("/user", checkAuth, UserController.deleteUser);

  // get logged in user personal profile - completed questions
  app.get('/user', checkAuth, UserController.getUser);

  // edit user details
  app.put('/user', checkAuth, UserController.editUser);

  // user rank & performance details
  app.get('/user/performance/:userId', UserController.getPeformance);
};
