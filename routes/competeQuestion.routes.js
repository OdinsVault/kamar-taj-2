
const CompeteController = require('../controllers/competeQuestion.controller'),
      { ROUTES } = require('../resources/constants');

module.exports = app => {

    //Get all compete questions
    app.get(`/${ROUTES.COMPETEQ}`, CompeteController.getAll);

    //Get compete questions by category
    app.get(`/${ROUTES.COMPETEQ}/${ROUTES.BYCATGEORY}`, CompeteController.getByCategory);

    // Get by id
    app.get(`/${ROUTES.COMPETEQ}/${ROUTES.QUESTIONIDPARAM}`, CompeteController.getOne);

}