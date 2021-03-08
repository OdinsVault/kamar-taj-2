const AdminController = require('../controllers/admin.controller'),
      checkAdminAuth = require('../middleware/check-admin-auth'),
      {ROUTES} = require('../resources/constants');

module.exports = (app) => {

    // TODO: Add admin auth middleware

    // Admin login route
    app.post(
        `/${ROUTES.ADMIN}/${ROUTES.LOGIN}`,
        AdminController.login
    );

    // Practice question administration
    // Create Practice question
    app.post(
        `/${ROUTES.ADMIN}/${ROUTES.PRACTICEQ}`,
        checkAdminAuth,
        AdminController.createPracticeQ);

    // Update a practice question
    app.patch(
        `/${ROUTES.ADMIN}/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`,
        checkAdminAuth,
        AdminController.updatePracticeQ);
    
    // Delete a practice question
    app.delete(
        `/${ROUTES.ADMIN}/${ROUTES.PRACTICEQ}/${ROUTES.QUESTIONIDPARAM}`,
        checkAdminAuth,
        AdminController.deletePracticeQ);

            
    // Compete question administration
    // Create compete question
    app.post(
        `/${ROUTES.ADMIN}/${ROUTES.COMPETEQ}`,
        checkAdminAuth,
        AdminController.createCompeteQ);

    // Update compete question
    app.patch(
        `/${ROUTES.ADMIN}/${ROUTES.COMPETEQ}/${ROUTES.QUESTIONIDPARAM}`,
        checkAdminAuth,
        AdminController.updateCompeteQ);
    
    // Delete compete question
    app.delete(
        `/${ROUTES.ADMIN}/${ROUTES.COMPETEQ}/${ROUTES.QUESTIONIDPARAM}`,
        checkAdminAuth,
        AdminController.deleteCompeteQ);

}