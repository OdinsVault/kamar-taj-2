const LeaderboardController = require("../controllers/leaderboard.controller"),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {

    // get the leaderboard with pagination
    app.get(`/${ROUTES.LEADERBOARD}`, LeaderboardController.rankings);

    // filter on score, institute
    app.get(`/${ROUTES.LEADERBOARD}/${ROUTES.FILTER}`, LeaderboardController.filterLeaderboard);

    // get distinct institute values for institute filter
    app.get(`/${ROUTES.LEADERBOARD}/${ROUTES.DISTINCTINSTITUTES}`, LeaderboardController.distinctInstitutes);

    // get specific user ranking in leaderboard
    app.get(`/${ROUTES.LEADERBOARD}/${ROUTES.USERIDPARAM}`, LeaderboardController.getUserRanking);
};
