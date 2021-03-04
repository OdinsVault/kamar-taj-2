const AnswerController = require("../controllers/answer.controller"),
      checkAuth = require('../middleware/check-auth'),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {

    // Answer practice question
    app.post(
        `/${ROUTES.PRACTICEANSWER}/${ROUTES.QUESTIONIDPARAM}`,
        checkAuth,
        AnswerController.practiceAnswer
    );

    // Answer compete question
    // app.post(
    //     `/${ROUTES.COMPETEANSWER}/${ROUTES.QUESTIONIDPARAM}`,
    //     checkAuth,
    //     AnswerController.competeAnswer
    // );

};
