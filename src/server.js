const http = require('http');
const { getIndex, getPage2, getPage3 } = require('./htmlResponses.js');
const { getParty, getBird, getBling } = require('./mediaResponses.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);
  switch (request.url) {
    case '/':
      getIndex(request, response);
      break;
    case '/page2':
      getPage2(request, response);
      break;
    case '/page3':
      getPage3(request, response);
      break;
    case '/party.mp4':
      getParty(request, response);
      break;
	case '/bird.mp4':
      getBird(request, response);
      break;
	case '/bling.mp3':
      getBling(request, response);
      break;
    default:
      getIndex(request, response);
      break;
  }
};
http.createServer(onRequest).listen(PORT);

console.log(`listening on ${PORT}`);
