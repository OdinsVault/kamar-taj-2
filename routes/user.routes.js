const UserController = require("../controllers/user.controller"),
      checkAuth = require('../middleware/check-auth');

module.exports = (app) => {

  //signup user
  app.post("/user/signup", UserController.signup);

  //user login
  app.post("/user/login", UserController.login);

  //delete user
  app.delete("/user/:userId", UserController.deleteUser);

  // user rank & performance details
  app.get('/user/performance', checkAuth, UserController.getPeformance);
};
