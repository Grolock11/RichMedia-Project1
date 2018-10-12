const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const apiHandler = require('./apiResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);
  const parsedUrl = url.parse(request.url);
  const queryParams = query.parse(parsedUrl.query);
  const body = [];
  // there are some changes being made you shoud restart

  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCss(request, response);
      break;
    case '/bundle.js':
      htmlHandler.getJS(request, response);
      break;
    case '/getTopData':
      apiHandler.getTop(request, response);
      break;
    case '/getCharacterData':
      apiHandler.getCharacter(request, response, queryParams);
      break;
    case '/addCharacter':
      request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
      });

      request.on('data', (chunk) => {
        body.push(chunk);
      });

      request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);
        apiHandler.addCharacter(request, response, bodyParams);
      });

      break;
    default:
      htmlHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
