const PracticeController = require("../controllers/practiceQuestion.controller"),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {
  //Get all questions
  app.get(`/${ROUTES.PRACTICEQ}`, PracticeController.get_all);

  //Get # of levels
  app.get(`/${ROUTES.PRACTICEQ}/${ROUTES.BYLEVEL}`, PracticeController.get_by_level);

  //get question by id
  app.get(`/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`, PracticeController.get_one);

};
