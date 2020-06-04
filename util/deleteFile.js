const fs = require('fs');

// unlink deletes file synchronously and unlinkSync deletes asynchrously
const deleteFile = (filePath) => {
  fs.unlink(filePath, err => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });
}

module.exports = deleteFile;