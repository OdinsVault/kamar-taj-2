const { exec } = require("child_process"),
  { join } = require("path"),
  {
    CODEDIR,
    MAIN_CLASS,
    SN,
    ENG,
    SN_ERR,
    ENG_ERR,
    OUTPATH
  } = require("../resources/constants"),
  { promisify } = require("util"),
  { compileCode, execute } = require("./runner"),
  mapSimplyCode = require("../utils/simplyMapper"),
  mapSimplyErrors = require("../utils/simplyErrorMapper"),
  transpileCode = require('../utils/simplyTranspiler'),
  { unlink, stat, writeFile } = require("fs");


/**
 * Compile the answer code & runs the test cases.
 * Populates the output object. 
 * @param {[{inputs: String, outputs: String, title: String, description: String}]} testCases - Array of testcases for question
 * @param {{
    * answer: String,
    * testResults: [],
    * compilerResult: {status: Number, stdout: String, stderr: String},
    * failedTest: {},
    * passed: Boolean}} output - Output object to be populated
 * @param {String} userId - userId of the user
 * @param {String} lang - The language of the answer code - `sn` for sinhala or `eng` for english
 */
const runTestCases = async (testCases, output, userId, lang) => {
    // generate unique filename for each compilation
    const className = `Class${userId}${Date.now()}`;
    const filePath = join(CODEDIR, `${className}.java`);

    // create promisified functions
    // const execPromise = promisify(exec);
    const writeFilePromise = promisify(writeFile);

    try {
        // always convert to english before compilation
        const flags = (lang === SN) ? `${ENG} ${SN}` : `${ENG} ${ENG}`;
        // transpile the answer code & prevent the file from cleaning
        const translatedCode = await mapSimplyCode(output.answer, flags, filePath, false);
        output.answer = translatedCode.stdout;

        await writeFilePromise(filePath, output.answer);

      //transpile the answer code & prevent the file from cleaning
      const transpiledCode =  await transpileCode(
        filePath, 
        className,
        false
      );
      
      const newfilepath = join(OUTPATH, "Main.java");

      const compileProcessArgs = ["-d", `${OUTPATH}`, `${newfilepath}`];

        const compilerResult = await compileCode(compileProcessArgs);
        output.compilerResult.stdout = compilerResult.stdout;

        // create promises array for testcases
        const testcasePromises = [];
        const runProcessArgs = ['-cp', `${OUTPATH}`, "Main"];

        testCases.forEach(test => {
            const runProcessStdin = `${test.inputs.trim()} `.replace(new RegExp(/\s/, 'g'), '\n');;
            testcasePromises.push(
                // execPromise(`java -cp ${CODEDIR} ${className} ${test.inputs}`, {encoding: 'utf-8'})
                execute(runProcessArgs, runProcessStdin)
            );
        });

        // try & run test cases
        try {
            // run all the tests async
            const testResults = await Promise.all(testcasePromises);

            // check each test result
            testResults.forEach((results, index) => {
                const stdOut = results.stdout.replace(new RegExp('\\r', 'g'), '');
                testCases[index].outputs = testCases[index].outputs.replace(new RegExp('\\r', 'g'), '');

                const testCaseResult = {
                    testCase: testCases[index],
                    status: 0,
                    stdout: stdOut,
                    stderr: (results.stderr === '') ? null : results.stderr,
                    expected: testCases[index].outputs
                };

                // set the testcase passed status
                if (!(testCases[index].outputs === stdOut))
                    testCaseResult.status = -1;

                // push the testResult obj to main output
                output.testResults.push(testCaseResult);
            });

            // check if all the tests are passed
            // update passed status
            if (output.testResults.every(result => result.status === 0))
                output.passed = true;

        } catch (err) {
            console.log('Error while running testcase', err);
        }

    } catch (err) {
      // set compiler results
      output.compilerResult.status = err.status || -1;
      output.compilerResult.stdout = err.stdout || "";
      output.compilerResult.stderr = err.stderr || `${err}`;

      //translate error
      const err_flags =
        lang === SN ? `${SN_ERR} ${ENG_ERR}` : `${ENG_ERR} ${ENG_ERR}`;
      const err_filePath = "";

      const translatedErrors = await mapSimplyErrors(
        err_flags,
        err_filePath,
        false
      );
      output.compilerResult.stderr = translatedErrors.stdout || `${err}`;

      console.log("Error while compiling answer", err);
    } finally {
        // remove the temp files async
        stat(filePath, (err, _) => {
            if (!err) unlink(filePath, () => { });
        });
        stat(filePath.replace('.java', '.class'), (err, _) => {
            if (!err) unlink(filePath.replace('.java', '.class'), () => { });
        });
    }
}

module.exports = runTestCases;