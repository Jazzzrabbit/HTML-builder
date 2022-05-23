const fs = require('fs');
const { stdin, exit } = process;
const path = require('path');
const os = require('os');
let exitMessage = `Shutting down... Have a nice day!
Сворачиваюсь, расходимся...`;

console.log(`Useless programm greets you! Enter some text, please.
You can check the result in file text.txt.

Бесполезная программа приветствует тебя! Вводи текст, не стесняйся.
Результаты можешь глянуть в файле text.txt. \n`);

const write = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.on('exit', () => {
  console.log(exitMessage);
});

process.on('SIGINT', () => {
  exitMessage = '\n' + exitMessage;
  exit();
});

stdin.on('data', (chunk) => {
  if (chunk.toString()  === 'exit' + os.EOL) exit();
  write.write(chunk);
  console.log('\nEnter more or type "exit" / Вводи еще или пиши "exit". \n');
});