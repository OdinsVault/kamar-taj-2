const TutorialController = require('../controllers/tutorial.controller'),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');


// Tutorial section get by id
router.get(
    `/:${ROUTES.TUTORIALID}`,
    TutorialController.getTutorialById
);

// Tutorial get by level
router.get(
    `/${ROUTES.TUTORIALLEVEL}/:${ROUTES.TUTORIALLEVEL}`,
    TutorialController.getTutorialByLevel
);

module.exports = router;