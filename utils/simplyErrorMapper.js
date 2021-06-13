const { exec } = require("child_process"),
  { CODEDIR } = require("../resources/constants"),
  { promisify } = require("util"),
  { unlink, stat, readFile } = require("fs");

const mapping = require("../temp-code/Sinhala.json");
var translated = {
  stdout: "",
  stderr: "",
};

const mapSimplyErrors = async (flags, errorText, clean = true) => {

  const to = flags.split(" ")[0];
  const from = flags.split(" ")[1];
  const errors = mapping.errors;
  var translatedErr = "";

  try {
    if (to == "sn_error") {
      for (var key in errors) {
        if (errorText.includes(key)) {
          translatedErr = errors[key] + "\n\n" + errorText;
          break;
        } else {
          translatedErr = errors["GeneralError:GeneralError"] + "\n\n" + errorText;
        }
      }
    }
    else{
      translatedErr = errorText;
    }
    translated.stdout = translatedErr;
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

module.exports = mapSimplyErrors;
