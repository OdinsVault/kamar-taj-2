const User = require("../models/user"),
  mongoose = require("mongoose"),
  runTests = require("../utils/runTests"),
  runAnswer = require("../utils/runAnswer"),
  runVisualizer = require("../utils/simplyVisualizer"),
  { ROUTES, CODEDIR, SN, ENG } = require("../resources/constants"),
  { join } = require("path");

exports.visualize = async (req, res) => {
    try {
        // check if user has already completed the question
       /*  const user = await User.findById(req.userData.userId);
        if (!user) return res.status(404).json({message: 'User not found'}); */
        
        // run the tests & collect the console output to response object
        const output = {
            answer: req.body.answer,
            runtimeData: null,
            runtimeErr: null,
            sourceMap: null,
            passed: false
        };
        console.log(req.body);

        // Execute the tests & populate the output object
        const visualizer = await runVisualizer({
            inputs: req.body.answer,
            output: output,
            //userId: req.userData.userId,
            lang: req.body.lang,
        });

        const response = {
          status: visualizer.passed,
          message: visualizer.passed
            ? "Visualization Succeeful!"
            : "Visualization Unsuccessful! Check for errors in your code",
          consoleResult: visualizer,
          sourceMap: visualizer.sourceMap
        };

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error occurred while visualizing. Check for errors in your code!',
            error: err
        });
    }
}
