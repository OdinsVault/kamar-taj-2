const checkAuth = require("../middleware/check-auth");
const QuestionsController = require("../controllers/question.controller");

module.exports = (app) => {
  //Get all questions
  app.get("/questions", QuestionsController.get_all);

  //Get # of levels
  app.get("/questions/bylevel", QuestionsController.get_by_level);

  //get question by id
  app.get("/questions/:questionId", QuestionsController.get_one);

  //Create a question
  app.post("/questions", checkAuth, QuestionsController.create_question);

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
