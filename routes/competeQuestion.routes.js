
const CompeteController = require('../controllers/competeQuestion.controller');

module.exports = app => {

    //Get all compete questions
    app.get("/competequestion", CompeteController.getAll);

    //Get compete questions by category
    app.get("/competequestion/bycategory", CompeteController.getByCategory);

    // Get by id
    app.get('/competequestion/:questionId', CompeteController.getOne);

    // Create compete questions
    // TODO: Move to admin routes
    app.post('/competequestion', CompeteController.createCompeteQuestion);

}