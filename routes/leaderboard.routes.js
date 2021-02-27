const LeaderboardController = require("../controllers/leaderboard.controller");

module.exports = (app) => {

    // get the leaderboard with pagination
    app.get('/leaderboard', LeaderboardController.rankings);

    // filter on score, institute
    app.get('/leaderboard/filter', LeaderboardController.filterLeaderboard);

    // get distinct institute values for institute filter
    app.get('/leaderboard/distinctinstitutes', LeaderboardController.distinctInstitutes);

    // get specific user ranking in leaderboard
    app.get('/leaderboard/:userId', LeaderboardController.getUserRanking);
};
