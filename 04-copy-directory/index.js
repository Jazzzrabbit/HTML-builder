const fs = require('fs');
const path = require('path');

const readFilesFromDir = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (err) reject(err.message);
      resolve(data);
    });
  });
};

readFilesFromDir(path.join(__dirname, 'files'))
  .then(fs.mkdir(path.join(__dirname, 'newFiles'), {recursive: true}, (err) => {
    if (err) console.error(err);
    console.log('"newFiles" folder was successfully created.');
  }))
  .then((data) => {
    data.forEach(item => {
      fs.readFile(path.join(__dirname, 'files', item), (err, data) => {
        if (err) console.error(err);
        fs.writeFile(path.join(__dirname, 'newFiles', item), data, (err) => {
          if (err) console.error(err);
          console.log(`File "${item}" was successfully copied to newFiles.`);
        });
      });
    });
  });
