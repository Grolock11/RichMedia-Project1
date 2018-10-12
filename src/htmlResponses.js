const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const style = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const notFoundPage = fs.readFileSync(`${__dirname}/../hosted/notFoundPage.html`);

// gets the page for the site
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// loads the css for the site
const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

// gets the JS for the site
const getJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/javasript' });
  response.write(bundle);
  response.end();
};

// get the 404 page
const get404 = (request, response) => {
  response.statusCode = 404;
  response.write(notFoundPage);
  response.end();
};

module.exports.getIndex = getIndex;
module.exports.getCss = getCss;
module.exports.getJS = getJS;
module.exports.notFound = get404;
