const { exec } = require("child_process"),
  { join } = require("path"),
  {
    CODEDIR,
    MAIN_CLASS,
    OUTPATH,
    SN,
    ENG,
    SN_ERR,
    ENG_ERR,
    VIZDIR,
  } = require("../resources/constants"),
  { promisify } = require("util"),
  { compileCode, execute } = require("./runner"),
  mapSimplyCode = require("./simplyMapper"),
  mapSimplyErrors = require("./simplyErrorMapper"),
  transpileCode = require("../utils/simplyTranspiler"),
  //outputData = require("../temp-code/VisualizerJar/Output.json"),
  { unlink, stat, writeFile, readFileSync } = require("fs");

const runVisualizer = async (params) => {
  let { inputs, output, lang } = params;

  //Run code through transpiler

  // generate unique filename for each compilation
  const className = `Class${params.userId}${Date.now()}`;
  const filePath = join(CODEDIR, `${className}.java`);

  // create promisified functions
  const execPromise = promisify(exec);
  const writeFilePromise = promisify(writeFile);

  try {
    await writeFilePromise(filePath, output.answer);

    try {
      transpiledCode = await transpileCode(filePath, className, false);
    } catch (e) {
      throw e;
    }

    const newfilepath = join(OUTPATH, "Main.java");

    const code = readFileSync(newfilepath).toString().split("\n");
    var sourceCode = output.answer.toString().split("\n");

    var lines = [];
    var sourceMap = [];
    var lineCount = 1;
    var simplyCode = "";

    for (var i = 0; i < sourceCode.length; i++) {
      if (/\S/.test(sourceCode[i])) {
        simplyCode += sourceCode[i] + "\n";
      }
    }

    output.answer = simplyCode;
    console.log(output.answer);

    for (var i = 8; i < code.length; i++) {
      if (/\S/.test(code[i])) {
        lines.push(i + 1);
      }
      sourceMap.push({
        Simply: lineCount,
        Java: i,
      });
      lineCount++;
    }
    const codeLines = lines.toString();

    try {
      const visualized = await execPromise(
        `java -jar ${CODEDIR}/VisualizerJar/visualizer-v3.jar "${codeLines}" ${newfilepath} ${CODEDIR}/VisualizerJar`
      );

      output.runtimeErr = visualized.stderr === "" ? null : visualized.stderr;
      output.sourceMap = sourceMap;
      output.passed = true;
      output.runtimeData = await readFileSync(
        "temp-code/VisualizerJar/Output.json"
      ).toString();

      console.log(output.runtimeData);

    } catch (e) {
      throw e;
    }

    return output;
  } catch (err) {
    output.runtimeData = [];
    output.runtimeErr = err;
    output.sourceMap = null;
    output.passed = false;

    console.log("Error in visualizing code", err);
  } finally {
    // remove the temp files async
    stat(filePath, (err, _) => {
      if (!err) unlink(filePath, () => {});
    });
    stat(filePath.replace(".java", ".class"), (err, _) => {
      if (!err) unlink(filePath.replace(".java", ".class"), () => {});
    });
  }
};

module.exports = runVisualizer;
