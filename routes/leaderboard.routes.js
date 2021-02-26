const LeaderboardController = require("../controllers/leaderboard.controller");

module.exports = (app) => {

    // get the leaderboard with pagination
    app.get('/leaderboard', LeaderboardController.rankings);

    // search the leaderboard for specific user with name/email
    app.get('/leaderboard/search', LeaderboardController.searchLeaderboard);

    // filter on score, institute
    app.get('/leaderboard/filter', LeaderboardController.filterLeaderboard);
};
