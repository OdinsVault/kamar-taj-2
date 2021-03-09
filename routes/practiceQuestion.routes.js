const PracticeController = require("../controllers/practiceQuestion.controller"),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');

//Get all questions
router.get('/', PracticeController.get_all);

//Get # of levels
router.get(`/${ROUTES.BYLEVEL}`, PracticeController.get_by_level);

//Get question by id
router.get(`/${ROUTES.QUESTIONIDPARAM}`, PracticeController.get_one);


module.exports = router;