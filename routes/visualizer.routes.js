const VisualizerController = require('../controllers/visualizer.controller'),
      router = require('express').Router(),
      {ROUTES} = require('../resources/constants');


      router.post('/', VisualizerController.visualize);


      module.exports = router;