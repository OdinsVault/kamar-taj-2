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
        PRACTICEANSWER: 'practiceanswer',
        COMPETEANSWER: 'competeanswer',
        // leaderboard.routes
        LEADERBOARD: 'leaderboard',
        FILTER: 'filter',
        DISTINCTINSTITUTES: 'distinctinstitutes',
        // admin.routes
        ADMIN: 'admin',
    }
});