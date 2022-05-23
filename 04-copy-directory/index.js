const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'files');
const pathToDist = path.join(__dirname, 'files-copy');

const makeFolder = async () => {
  return new Promise((res, rej) => {
    fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
      if (err) rej(err.message);
      res(console.log('Folder made.'));
    });
  });
};

const copyFolders = async (pathToDir) => {
  return new Promise((res, rej) => {
    fs.readdir(pathToDir, (err, files) => {
      if (err) rej(err.message);
      files.forEach(file => {
        let currentPath = pathToDir + '/' + file;
        fs.stat(currentPath, (err, stats) => {
          if (err) console.log(err);
          if (stats.isDirectory()) {
            let deepPath = pathToDir + '/' + file;
            fs.mkdir(deepPath.replace(/files/, 'files-copy'), {recursive: true}, (err) => {
              if (err) console.log(err);
              console.log('folder copied.');
            });
            currentPath = deepPath;
            copyFolders(deepPath);
          }
          else {
            fs.readFile(currentPath, 'utf8', (err, data) => {
              if (err) console.log(err);
              fs.writeFile(currentPath.replace(/files/, 'files-copy'), data, (err) => {
                if (err) console.log(err);
                res(console.log('copied'));
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
        let currentPath = pathToDist + '/' + exFile;
        fs.stat(currentPath, (err, stats) => {
          if (err) console.log(err);
          if (stats.isDirectory()) {
            const deepPath = pathToDist + '/' + exFile;
            currentPath = deepPath;
            cleanFolder(deepPath);
          } else {
            fs.rm(currentPath, (err) => {
              if (err) console.log('err is here');
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
  .then(copyFolders(pathToDir));