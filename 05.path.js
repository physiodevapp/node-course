const path = require('node:path');

console.log(path.sep);

const filePath = path.join('content', 'subfolder', 'test.txt');
console.log(filePath);

const base = path.basename('content/subfolder/test.txt');
console.log(base);

const fileName = path.basename('content/subfolder/test.txt', '.txt');
console.log(fileName);

const extension = path.extname('super.image.jpg');
console.log(extension);