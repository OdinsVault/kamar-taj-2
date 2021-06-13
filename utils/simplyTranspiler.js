const { exec } = require("child_process"),
  { CODEDIR } = require("../resources/constants"),
  { promisify } = require("util"),
  { unlink, stat, writeFile, readFile } = require("fs");

/**
 * Translate the simply code into english/sinhala from sinhala/english.
 * Creates a file in the FilePath & performs cleaning after transpilation, based on the boolean parameter `clean`.
 * @param {String} filePath - File path with the file name & extension Ex: temp-code/test.simply
 * @param {Boolean} clean - Defaults to `true`. Signals whether to clean the created file - Used in the standalone endpoint for translating
 * @throws if error occurred while transpiling
 */
const transpileCode = async (filePath, className, clean= true) => {
  // create promise functions
  const execPromise = promisify(exec);
  const writeFilePromise = promisify(writeFile);
  const readFilePromise = promisify(readFile);
  
  try {
    const transpiled = await execPromise(
      `java -jar ${CODEDIR}/simply.jar ${filePath} ${CODEDIR}/mapper.json`
    );

    console.log(transpiled);
    
    // write code to file
    //await writeFilePromise(filePath, code);

    return null;
  } catch (err) {
    throw new Error(`Error occurred while Simply transpilation: ${err}`);
  } finally {
    // remove the temp files async
    if (clean)
      stat(filePath, (err, _) => {
        if (!err) unlink(filePath, () => {});
      });
  }
};

module.exports = transpileCode;
