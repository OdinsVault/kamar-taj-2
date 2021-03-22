const {execSync} = require('child_process'),
      {join} = require('path'),
      {CODEDIR: codeDir} = require('../resources/constants'),
      {writeFileSync, unlink, stat} = require('fs');
const util = require('util');
/**
 * Compile the answer code & runs the test cases.
 * Populates the output object. 
 * @param {[{'inputs': String, 'outputs': String, 'title': String, 'description': String}]} testCases - Array of testcases for question
 * @param {{
    * 'answer': String,
    * 'testResults': [],
    * 'compilerResult': {'status': Number, 'stdout': String, 'stderr': String},
    * 'failedTest': {},
    * passed: Boolean}} output - Output object to be populated
 * @param {String} mainClass - main class name exactly as in the code
 * @param {String} userId - userId of the user
 */
const runTestCases = (testCases, output, mainClass, userId) => {
    // generate unique filename for each compilation
    const className = `Class${userId}${Date.now()}`;
    const filePath = join(codeDir, `${className}.java`);

    try {
        // Replace the class name within the code &
        // create temp file with code
        writeFileSync(filePath, output.answer.replace(new RegExp(mainClass, 'g'), className));

        // compile
        output.compilerResult.stdout = execSync(`javac -d ${codeDir} ${filePath}`, {encoding: 'utf-8'});

        // try & run test cases
        try {
            for (const test of testCases) {
                // create result obj for this testcase
                const testCaseResult = {
                    testCase: test,
                    status: 0,
                    stdout: null,
                    stderr: null
                };
                
                // execute the code with testcase
                let results = execSync(`java -cp ${codeDir} ${className} ${test.inputs}`, {encoding: 'utf-8'});
                // Remove unnecessary escape chars if any - Linux does not have \r
                results = results.replace(new RegExp('\\r', 'g'), '');
                test.outputs = test.outputs.replace(new RegExp('\\r', 'g'), '');

                console.log('Test outputs::: ', JSON.stringify(test.outputs));
                console.log('Execution results::: ', JSON.stringify(results));
                console.log('Test passed::: ', test.outputs === results);

                // check if the results with expected output for the testcase
                // if any of the testcases fails, then ignore the rest & return failed state
                if (test.outputs === results) {
                    // set the result for the testcase if no execution errors
                    // & push the testResult obj to main output
                    testCaseResult.stdout = results;
                    output.testResults.push(testCaseResult);
                } else {
                    output.failedTest = {
                        testCase: test,
                        stdout: results,
                        expected: test.outputs
                    };
                    break;
                }
            }

            // if all the testcases passed, mark question as passed
            if (output.testResults.length === testCases.length) 
                output.passed = true;

        } catch (err) {
            // set testcase object
            testCaseResult.status = err.status;
            testCaseResult.stdout = err.stdout;
            testCaseResult.stderr = err.stderr || err;

            console.log('Error while running testcase', err);
        }

    } catch (err) { 
        // set compiler results
        output.compilerResult.status = err.status;
        output.compilerResult.stdout = err.stdout;
        output.compilerResult.stderr = err.stderr || err;

        console.log('Error while compiling answer', err);
    } finally {
         // remove the temp files async
         stat(filePath, (err, _) => {
            if (!err) unlink(filePath, () => {}); 
         });
         stat(filePath.replace('.java', '.class'), (err, _) => {
            if (!err) unlink(filePath.replace('.java', '.class'), () => {}); 
         });
    }
}

module.exports = runTestCases;