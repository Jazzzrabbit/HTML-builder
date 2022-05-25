const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'files');
const pathToDist = path.join(__dirname, 'files-copy');

const makeFolder = async () => {
  return new Promise((res, rej) => {
    fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
      if (err) rej(err.message);
      res();
    });
  });
};

const copyFolders = async (pathToDir) => {
  return new Promise((res, rej) => {
    fs.readdir(pathToDir, (err, files) => {
      if (err) rej(err.message);
      files.forEach(file => {
        let currentPath = path.join(pathToDir, file);
        fs.stat(currentPath, (err, stats) => {
          if (err) console.log(err);
          if (stats.isDirectory()) {
            let deepPath = path.join(pathToDir, file);
            fs.mkdir(deepPath.replace(/files/, 'files-copy'), {recursive: true}, (err) => {
              if (err) console.log(err);
            });
            currentPath = deepPath;
            copyFolders(deepPath);
          }
          else {
            fs.readFile(currentPath, 'utf8', (err, data) => {
              if (err) console.log(err);
              fs.writeFile(currentPath.replace(/files/, 'files-copy'), data, (err) => {
                if (err) console.log(err);
                res();
              });
            });
          }
        });
      });
    });
  });
};

const cleanFolder = async (pathToDist) => {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToDist, (err, files) => {
      if (err) reject(err.message);
      files.forEach(exFile => {
        let currentPath = path.join(pathToDist, exFile);
        fs.stat(currentPath, (err, stats) => {
          if (err) console.log(err);
          if (stats.isDirectory()) {
            const deepPath = path.join(pathToDist, exFile);
            currentPath = deepPath;
            cleanFolder(deepPath);
          } else {
            fs.rm(currentPath, (err) => {
              if (err) console.log(err);
              resolve();
            });
          }
        });
      });
    });
  });
};

makeFolder()
  .then(cleanFolder(pathToDist))
  .then(copyFolders(pathToDir))
  .then(console.log('Files were copied to files-copy folder.'));