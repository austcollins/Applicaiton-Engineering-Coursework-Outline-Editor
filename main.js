// A simple static server

const http = require('http')
      fs = require('fs'),
      path = require('path');

const websiteLocation = './outline-editor';

const server = http.createServer(
  (request, response) => {
    // respond to the request
    var resolvedWebsiteLocation = path.resolve(websiteLocation);
    var safePath = path.normalize(request.url).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/') { safePath = '/index.html' };

    var fileLoc = path.join(resolvedWebsiteLocation, safePath);

    fs.readFile(fileLoc, function(err, data) {
        if (err) {
            response.writeHead(404, 'Not Found');
            response.write('404: File Not Found!');
            return response.end();
        }

        response.statusCode = 200;

        response.write(data);
        return response.end();
    });
  }
);
server.listen(8080);
