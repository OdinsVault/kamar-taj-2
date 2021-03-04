const UserController = require("../controllers/user.controller"),
      checkAuth = require('../middleware/check-auth'),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {

  //signup user
  app.post(`/${ROUTES.USER}/${ROUTES.SIGNUP}`, UserController.signup);

  //user login
  app.post(`/${ROUTES.USER}/${ROUTES.LOGIN}`, UserController.login);

  //delete own user profile
  app.delete(`/${ROUTES.USER}`, checkAuth, UserController.deleteUser);

  // get logged in user personal profile - completed questions
  app.get(`/${ROUTES.USER}`, checkAuth, UserController.getUser);

  // edit user details
  app.put(`/${ROUTES.USER}`, checkAuth, UserController.editUser);

  // search users on fname/lname/email autocomplete results limit 10
  app.get(`/${ROUTES.USER}/${ROUTES.AUTOCOMPLETE}`, UserController.autocompleteUser);

  // user rank & performance details
  app.get(`/${ROUTES.USER}/${ROUTES.PERFORMANCE}/${ROUTES.USERID}`, UserController.getPeformance);
};
