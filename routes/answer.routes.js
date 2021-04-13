const AnswerController = require("../controllers/answer.controller"),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');

// Run answer for practice question
// Does not update the user score, attempts or level
router.post(
    `/${ROUTES.PRACTICERUN}/${ROUTES.QUESTIONIDPARAM}`,
    AnswerController.runPracticeAnswer
);

// Answer practice question
// Updates the user score, attempts & level
router.post(
    `/${ROUTES.PRACTICEANSWER}/${ROUTES.QUESTIONIDPARAM}`,
    AnswerController.practiceAnswer
);

// Run answer for compete question
// Does not update the user score, attempts or level
router.post(
    `/${ROUTES.COMPETERUN}/${ROUTES.QUESTIONIDPARAM}`,
    AnswerController.runCompeteAnswer
);

// Answer compete question 
// Updates the user score, attempts & level
router.post(
    `/${ROUTES.COMPETEANSWER}/${ROUTES.QUESTIONIDPARAM}`,
    AnswerController.competeAnswer
);


module.exports = router;
