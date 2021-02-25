const DashboardController = require("../controllers/dashboard.controller"),
      checkAuth = require('../middleware/check-auth');

module.exports = (app) => {

    app.get('/dashboard', DashboardController.rankings);
};
