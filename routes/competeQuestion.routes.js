
const CompeteController = require('../controllers/competeQuestion.controller'),
      router = require('express').Router(),
      { ROUTES } = require('../resources/constants');

//Get all compete questions
router.get(`/`, CompeteController.getAll);

//Get compete questions by category
router.get(`/${ROUTES.BYCATGEORY}`, CompeteController.getByCategory);

// Get by id
router.get(`/${ROUTES.QUESTIONIDPARAM}`, CompeteController.getOne);


module.exports = router;