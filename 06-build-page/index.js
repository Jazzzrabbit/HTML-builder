const fs = require('fs');
const path = require('path');

const pathToComponents = path.join(__dirname, 'components');
const pathToDistIndex = path.join(__dirname, 'project-dist', 'index.html');
const pathToAssets = path.join(__dirname, 'assets');
const pathToStyles = path.join(__dirname, 'styles');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToDist = path.join(__dirname, 'project-dist');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const pathToAssetsDist = path.join(__dirname, 'project-dist', 'assets');

const makeFolder = async () => {
  return new Promise((res, rej) => {
    fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, err => {
      if (err) rej(err.message);
      res();
    });
  });
};

const copyFolders = async (pathToAssets) => {
  return new Promise((res, rej) => {
    fs.readdir(pathToAssets, (err, files) => {
      if (err) rej(err.message);
      files.forEach(file => {
        let currentPath = pathToAssets + '/' + file;
        fs.stat(currentPath, (err, stats) => {
          if (err) console.log(err);
          if (stats.isDirectory()) {
            let deepPath = pathToAssets + '/' + file;
            fs.mkdir(deepPath.replace(/assets/, 'project-dist/assets'), {recursive: true}, (err) => {
              if (err) console.log(err);
            });
            currentPath = deepPath;
            copyFolders(deepPath);
          }
          else {
            fs.readFile(currentPath, (err, data) => {
              if (err) console.log(err);
              fs.writeFile(currentPath.replace(/assets/, 'project-dist/assets'), data, (err) => {
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
        let currentPath = pathToDist + '/' + exFile;
        fs.stat(currentPath, (err, stats) => {
          if (err) console.log(err);
          if (stats.isDirectory()) {
            const deepPath = pathToDist + '/' + exFile;
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

const readFilesFromDir = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(console.error(err));
      resolve(files);
    });
  });
};

readFilesFromDir(pathToStyles)
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
  });

const getTemplate = async () => {
  return new Promise((res, rej) => {
    fs.readFile(pathToTemplate, 'utf8', (err, data) => {
      if (err) rej(err.message);
      res(data);
    });
  });
};

const getComponents = async () => {
  return new Promise((res, rej) => {
    fs.readdir(pathToComponents, 'utf8', (err, files) => {
      if (err) rej(err.message);
      res(files);
    });
  });
};

const createFolder = async () => {
  return new Promise((res, rej) => {
    fs.mkdir(pathToDist, {recursive: true}, (err) => {
      if (err) rej(err.message);
      res();
    });
  });
};

const getArticles = async (file) => {
  return new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, 'components', file), 'utf8', (err, data) => {
      if (err) rej(err.message);
      res(data);
    });
  });
};

const replaceTags = async () => {
  let html = await getTemplate();
  const tags = await getComponents();
  
  for (let i = 0; i < tags.length; i++) {
    const tagName = tags[i].replace(/\.html/, '');
    const regex = new RegExp(`{{${tagName}}}`);
    const article = await getArticles(tags[i]);
    
    html = html.replace(regex, article);
  }
  
  fs.writeFile(pathToDistIndex, html, err => {
    if (err) console.log(err);
  });
};

createFolder()
  .then(replaceTags())
  .then(makeFolder())
  .then(cleanFolder(pathToAssetsDist))
  .then(copyFolders(pathToAssets))
  .then(console.log('All files are assembled in project-dist folder.'));