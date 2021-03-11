const AnswerController = require("../controllers/answer.controller"),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');


// Answer practice question
router.post(
    `/${ROUTES.PRACTICEANSWER}/${ROUTES.QUESTIONIDPARAM}`,
    AnswerController.practiceAnswer
);

// Answer compete question
router.post(
    `/${ROUTES.COMPETEANSWER}/${ROUTES.QUESTIONIDPARAM}`,
    AnswerController.competeAnswer
);


module.exports = router;
