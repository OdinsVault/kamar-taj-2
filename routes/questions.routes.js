const checkAuth = require("../middleware/check-auth");
const QuestionsController = require("../controllers/question.controller");

module.exports = (app) => {
  //Get all questions
  app.get("/questions", QuestionsController.get_all);

  //Get # of levels
  app.get("/questions/bylevel", QuestionsController.get_by_level);

  //Create a question
  app.post("/questions", checkAuth, QuestionsController.create_question);

  //get question by id
  app.get("/questions/:questionId", QuestionsController.get_one);

  //update a question
  app.patch(
    "/questions/:questionId",
    checkAuth,
    QuestionsController.update_question
  );

  //delete a question
  app.delete(
    "/questions/:questionId",
    checkAuth,
    QuestionsController.delete_question
  );
};
