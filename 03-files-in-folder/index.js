const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), (err, list) => {
  if (err) console.error(err);
  for (let file of list) {
    fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
      if (err) console.error(err);
      if (stats.isFile()) console.log(file.replace(new RegExp(path.extname(file)), '')
      + ' - ' + path.extname(file).replace(/\./g, '') + ' - ' + stats.size + ' bytes');
    });
  }
});








