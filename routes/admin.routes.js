const AdminController = require('../controllers/admin.controller'),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {

    // TODO: Add admin auth middleware
    // Practice question administration
    // Create Practice question
    app.post(
        `/${ROUTES.ADMIN}/${ROUTES.PRACTICEQ}`,
        AdminController.createPracticeQ);

    // Update a practice question
    app.patch(
        `/${ROUTES.ADMIN}/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`,
        AdminController.updatePracticeQ);
    
    // Delete a practice question
    app.delete(
        `/${ROUTES.ADMIN}/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`,
        AdminController.deletePracticeQ);

            
    // Compete question administration
    // Create compete question
    app.post(
        `/${ROUTES.ADMIN}/${ROUTES.COMPETEQ}`,
        AdminController.createCompeteQ);

    // Update compete question
    app.patch(
        `/${ROUTES.ADMIN}/${ROUTES.COMPETEQ}/${ROUTES.QUESTIONIDPARAM}`,
        AdminController.updateCompeteQ);
    
    // Delete compete question
    app.delete(
        `/${ROUTES.ADMIN}/${ROUTES.COMPETEQ}/${ROUTES.QUESTIONIDPARAM}`,
        AdminController.deleteCompeteQ);

}