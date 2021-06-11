const VisualizerController = require('../controllers/visualizer.controller'),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');


      router.get(`/${ROUTES.VISUALIZE}`, VisualizerController.visualize);


      module.exports = router;