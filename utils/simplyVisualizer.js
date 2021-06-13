const { exec } = require("child_process"),
  { join } = require("path"),
  {
    CODEDIR,
    MAIN_CLASS,
    SN,
    ENG,
    SN_ERR,
    ENG_ERR,
  } = require("../resources/constants"),
  { promisify } = require("util"),
  { compileCode, execute } = require("./runner"),
  mapSimplyCode = require("./simplyMapper"),
  mapSimplyErrors = require("./simplyErrorMapper"),
  { unlink, stat, writeFile } = require("fs");

const runVisualizer = async (params) => {
  let { inputs, output, req, res } = params;

  //Run code through transpiler

  // generate unique filename for each compilation
  const className = `Class${params.userId}${Date.now()}`;
  const filePath = join(CODEDIR, `${className}.java`);

  // create promisified functions
  // const execPromise = promisify(exec);
  const writeFilePromise = promisify(writeFile);

  try {
    await writeFilePromise(filePath, output.answer);

    await writeFilePromise(
      filePath,
      output.answer.replace(new RegExp(MAIN_CLASS, "g"), className)
    );

    const compileProcessArgs = ["-d", `${CODEDIR}`, `${filePath}`];
    // compile
    // const compilerResult = await execPromise(`javac -d ${CODEDIR} ${filePath}`, {encoding: 'utf8'});
    const compilerResult = await compileCode(compileProcessArgs);
    //console.log(compilerResult);
    output.compilerResult.stdout = compilerResult.stdout;


    console.log(output);
  } catch (err) {
    // set compiler results
    output.compilerResult.status = err.status || -1;
    output.compilerResult.stdout = err.stdout || "";
    output.compilerResult.stderr = err.stderr || `${err}`;

    //translate error
    const err_flags =
      params.lang === SN ? `${SN_ERR} ${ENG_ERR}` : `${ENG_ERR} ${ENG_ERR}`;
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
      if (!err) unlink(filePath, () => {});
    });
    stat(filePath.replace(".java", ".class"), (err, _) => {
      if (!err) unlink(filePath.replace(".java", ".class"), () => {});
    });
  }
};

module.exports = runVisualizer;
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
