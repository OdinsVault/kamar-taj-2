module.exports = Object.freeze({
    ENV: {
        MONGO_PW: process.env.MONGO_ATLAS_PW,
        JWT_KEY: process.env.JWT_KEY,
        PORT: process.env.PORT,
        ADMIN_EMAILS: process.env.ADMIN_EMAILS,
        ADMIN_PASSWORDS: process.env.ADMIN_PASSWORDS,
        BASE_URL: process.env.BASE_URL,
        ORIGINS: process.env.ORIGINS || '*',
    },

    XP: {
        BEGINNER: 'Beginner',
        INTERMEDIATE: 'Intermediate',
        ADVANCED: 'Advanced',
    },

    // Test runner
    CODEDIR: 'temp-code',

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
        // tutorial.routes
        TUTORIAL: 'tutorial',
        TUTORIALID: 'tutorialId',
        TUTORIALIDPARAM: ':tutorialId',
        TUTORIALLEVEL: 'tutelevel',
        TUTORIALLEVELPARAM: ':tutelevel',
    }
});