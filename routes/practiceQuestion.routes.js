const checkAuth = require("../middleware/check-auth");
const PracticeController = require("../controllers/practiceQuestion.controller");

module.exports = (app) => {
  //Get all questions
  app.get("/questions", PracticeController.get_all);

  //Get # of levels
  app.get("/questions/bylevel", PracticeController.get_by_level);

  //Create a question
  // TODO: Move this to admin routes
  app.post("/questions", PracticeController.create_question);

  //get question by id
  app.get("/questions/:questionId", PracticeController.get_one);

  //update a question
  // TODO: Move this to admin routes
  app.patch(
    "/questions/:questionId",
    PracticeController.update_question
  );

  //delete a question
  // TODO: Move this to admin routes
  app.delete(
    "/questions/:questionId",
    PracticeController.delete_question
  );
};
