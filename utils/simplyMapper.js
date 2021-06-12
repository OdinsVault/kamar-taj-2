const { exec } = require("child_process"),
  { CODEDIR } = require("../resources/constants"),
  { promisify } = require("util"),
  { unlink, stat, writeFile } = require("fs");

const mapping = require("../temp-code/Sinhala.json");

/**
 * Translate the simply code into english/sinhala from sinhala/english.
 * Creates a file in the FilePath & performs cleaning after transpilation, based on the boolean parameter `clean`.
 * @param {String} code - Code to translate
 * @param {String} flags - Flags to control the conversion - Ex: `'sn eng'` - to sinhala from english
 * @param {String} filePath - File path with the file name & extension Ex: temp-code/test.simply
 * @param {Boolean} clean - Defaults to `true`. Signals whether to clean the created file - Used in the standalone endpoint for translating
 * @throws if error occurred while transpiling
 */
const mapSimplyCode = async (code, flags, filePath, clean = true) => {
  // create promise functions
  const execPromise = promisify(exec);
  const writeFilePromise = promisify(writeFile);

  const to = flags.split(" ")[0];
  const from = flags.split(" ")[1];
  const keywords = mapping.keywords;

  var codeBlock = code.toString();

  try {
    // write code to file
    await writeFilePromise(filePath, code);

    // run through the mapper
    const translated = await execPromise(
      `java -jar ${CODEDIR}/MapperJar.jar ${flags} ${filePath}`
    );
    // await for the transpilation to finish
    // else file might be cleaned before promise 

    if (to !== from) {
      if (to !== "eng") {
        if (to.includes("_error")) {
          //handle errors
        } else {
          if (codeBlock.includes("display") || codeBlock.includes("string")) {
            var splitCon = codeBlock.split('"');
            codeBlock = "";
            for (var i in splitCon) {
              if (i % 2 === 0) {
                for (var key in keywords) {
                  splitCon[i] = splitCon[i].replace(
                    new RegExp("\\b" + key + "\\b", "g"),
                    keywords[key]
                  );
                }
                codeBlock += splitCon[i];
              } else {
                codeBlock += '"' + splitCon[i] + '"';
              }
            }
          } else {
            for (var key in keywords) {
              codeBlock = codeBlock.replace(
                new RegExp("\\b" + key + "\\b", "g"),
                keywords[key]
              );
            }
          }
        }
      } else {
        for (var key in keywords) {
          codeBlock = codeBlock.replace(
            new RegExp(keywords[key], "g"),
            key
          );
        }
      }
    }

    translated.stdout = codeBlock;
    return translated;
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

module.exports = mapSimplyCode;
