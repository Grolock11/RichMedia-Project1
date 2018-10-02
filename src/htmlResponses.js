const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const style = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};


const getJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javasript' });
  response.write(bundle);
  response.end();
};

module.exports.getIndex = getIndex;
module.exports.getCss = getCss;
module.exports.getJS = getJS;
