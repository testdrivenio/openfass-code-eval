const path = require('path');
const fs = require('fs');
const shell = require('shelljs');


const format = `USAGE: {"code": "YOUR_CODE_GOES_HERE"}
EXAMPLE: {"code": "let test = 4; console.log(test + 2)"}`;

module.exports = (content, callback) => {
  const request = JSON.parse(content);
  const code = request.code;
  if (code) {
    fs.writeFile(path.join(__dirname, 'sample.js'), code, (err) => {
      if(err) {
        const returnObject = {
          status: 'error',
          message: err
        };
        callback(JSON.stringify(returnObject));
      } else {
        const results = shell.exec('node sample.js', { silent: true });
        callback(JSON.stringify(results));
        console.log(JSON.stringify({'results': results.trim()}));
        const returnObject = {
          status: 'success',
          results: results.trim()
        };
        callback(null, JSON.stringify(returnObject));
      }
    });
  } else {
    const returnObject = {
      status: 'error',
      message: format
    };
    callback(JSON.stringify(returnObject));
  }
};
