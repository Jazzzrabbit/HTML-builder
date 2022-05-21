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

const createFolder = async (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, {recursive: true}, (err) => {
      if (err) reject(err.message);
      resolve();
    });
  });
};

const cleanFolder = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
      if (err) reject(err.message);
      files.forEach(exFile => {
        fs.rm(path.join(__dirname, 'files-copy', exFile), (err) => {
          if (err) console.error(err);
        });
        resolve();
      });
    });
  });
};

readFilesFromDir(path.join(__dirname, 'files'))
  .then(createFolder(path.join(__dirname, 'files-copy')))
  .then(cleanFolder())
  .then((data) => {
    data.forEach(file => {
      fs.stat(path.join(__dirname, 'files', file), (err, stats) => {
        if (err) console.error(err);
        if (stats.isFile()) {
          fs.readFile(path.join(__dirname, 'files', file), 'utf8', (err, data) => {
            if (err) console.error(err);
            fs.writeFile(path.join(__dirname, 'files-copy', file), data, (err) => {
              if (err) console.error(err);
              console.log(`${file} was copied to files-copy folder.`);
            });
          });   
        }
      });
    });
  });


  

  

     