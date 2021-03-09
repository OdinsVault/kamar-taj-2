const router = require('express').Router(),
      {ROUTES} = require('../resources/constants');

// Practice question routes
router.use(
        `/${ROUTES.PRACTICEQ}`,
        require('./practiceQuestion.routes')
    );

// Compete question routes
router.use(
        `/${ROUTES.COMPETEQ}`,
        require('./competeQuestion.routes')
    );

// User routes
router.use(
        `/${ROUTES.USER}`,
        require('./user.routes')
    );

// Leaderboard routes
router.use(
        `/${ROUTES.LEADERBOARD}`,
        require('./leaderboard.routes')
    );

// Answer routes
router.use(
        `/${ROUTES.ANSWER}`,
        require('../middleware/check-auth'),
        require('./answer.routes')
    );

// Admin routes
router.use(
        `/${ROUTES.ADMIN}`,
        require('./admin.routes')
    );



module.exports = router;
