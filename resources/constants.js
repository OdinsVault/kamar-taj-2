module.exports = Object.freeze({
    XP: {
        BEGINNER: 'Beginner',
        INTERMEDIATE: 'Intermediate',
        ADVANCED: 'Advanced',
    },

    // App roles
    ROLE: {
        ADMIN: 'admin',
        USER: 'user',
    },

    // Compete question difficulties
    DIFFICULTY: {
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard',
    },

    ROUTES: {
        // user.routes
        USER: 'user',
        LOGIN: 'login',
        SIGNUP: 'signup',
        AUTOCOMPLETE: 'autocomplete',
        PERFORMANCE: 'performance',
        USERID: 'userId',
        USERIDPARAM: ':userId',
        // competeQuestion.routes
        COMPETEQ: 'competequestion',
        BYCATGEORY: 'bycategory',
        // practiceQuestion.routes
        PRACTICEQ: 'questions',
        BYLEVEL: 'bylevel',

        QUESTIONID: 'questionId',
        QUESTIONIDPARAM: ':questionId',
        // answer.routes
        ANSWER: 'answer',
        PRACTICEANSWER: 'practice',
        COMPETEANSWER: 'compete',
        // leaderboard.routes
        LEADERBOARD: 'leaderboard',
        FILTER: 'filter',
        DISTINCTINSTITUTES: 'distinctinstitutes',
        // admin.routes
        ADMIN: 'admin',
    }
});