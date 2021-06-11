const  runTests = require('../utils/runTests'),
      runAnswer = require('../utils/runAnswer');

exports.visualize = async (req, res) => {
          const output = {
            answer: req.body.answer,
            compilerResult: {
              status: 0,
              stdout: null,
              stderr: null,
            },
            sourceMap: [],
            runtimeData: []
          };

          /*
          Send code to transpiler
          In: simply english code
          Out: java code, source map, line array

          set source map to output

          Send target code to visualizer.jar
          In: java code, line array
          Out: output.json

          Return sourcemap, runtimeData
          */

  }