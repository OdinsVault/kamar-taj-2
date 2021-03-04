const PracticeController = require("../controllers/practiceQuestion.controller"),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {
  //Get all questions
  app.get(`/${ROUTES.PRACTICEQ}`, PracticeController.get_all);

  //Get # of levels
  app.get(`/${ROUTES.PRACTICEQ}/${ROUTES.BYLEVEL}`, PracticeController.get_by_level);

  //Create a question
  // TODO: Move this to admin routes
  app.post(`/${ROUTES.PRACTICEQ}`, PracticeController.create_question);

  //get question by id
  app.get(`/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`, PracticeController.get_one);

  //update a question
  // TODO: Move this to admin routes
  app.patch(
    `/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`,
    PracticeController.update_question
  );

  //delete a question
  // TODO: Move this to admin routes
  app.delete(
    `/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`,
    PracticeController.delete_question
  );
};
