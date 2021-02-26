const LeaderboardController = require("../controllers/leaderboard.controller");

module.exports = (app) => {

    app.get('/leaderboard', LeaderboardController.rankings);
};
