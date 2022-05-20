const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

const readFilesFromDir = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(console.error(err));
      resolve(files);
    });
  });
};

readFilesFromDir(stylesPath)
  .then(fs.access(bundlePath, (err) => {
    if (err) return;
    fs.rm(bundlePath, (err) => {
      if (err) console.error(err);
    });
  }))
  .then((files) => {
    files.forEach(file => {
      if (path.extname(file) === '.css') {
        fs.readFile(path.join(__dirname, 'styles', file), 'utf8', (err, data) => {
          if (err) console.error(err);
          fs.appendFile(bundlePath, data + '\n', (err) => {
            if (err) console.error(err);
          });
        });     
      }
    });
    console.log('bundle.css was created.');
  });


