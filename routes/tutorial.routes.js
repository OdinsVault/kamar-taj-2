const TutorialController = require('../controllers/tutorial.controller'),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');


// Tutorial section get by id
router.get(
    `/${ROUTES.TUTORIALIDPARAM}`,
    TutorialController.getTutorialById
);

// Tutorial get by level
router.get(
    `/${ROUTES.TUTORIALLEVEL}/${ROUTES.TUTORIALLEVELPARAM}`,
    TutorialController.getTutorialByLevel
);

module.exports = router;