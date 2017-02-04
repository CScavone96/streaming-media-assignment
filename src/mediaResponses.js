const fs = require('fs');
const path = require('path');

const getFileStream = (file, request, response, type) => {
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'EN0ENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }
    const range = request.headers.range;
    if (!range) {
      return response.writeHead(416);
    }
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunksize = (end - start) + 1;

    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Range': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': type,
    });

    const stream = fs.createReadStream(file, { start, end });
    stream.on('open', () => {
      stream.pipe(response);
    });
    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};

const loadFile = (fileName, request, response) => {
  const file = path.resolve(__dirname, `../client/${fileName}`);
  return getFileStream(file, request, response);
};

const getParty = (request, response) => loadFile('party.mp4', request, response, 'video/mp4');
const getBling = (request, response) => loadFile('bling.mp3', request, response, 'audio/mp3');
const getBird = (request, response) => loadFile('bird.mp4', request, response, 'video/mp4');
module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
