// A simple static server
const http = require('http')
      fs = require('fs'),
      path = require('path');

const websiteLocation = 'outline-editor';

const server = http.createServer( (request, response) => {

    // get and sterilize the requested file path
    var resolvedWebsiteLocation = path.resolve(websiteLocation);
    var safePath = path.normalize(request.url).replace(/^(\.\.[\/\\])+/, '');
    // reroute base path to the index file
    if (safePath === '/') { safePath = '/index.html' };
    //
    var fileLocation = path.join(resolvedWebsiteLocation, safePath);

    // attempt to get the requested file
    fs.readFile(fileLocation, function(err, data) {

        // check if requested file exists
        if (err) {
          // file not found -> return 404
          response.writeHead(404, 'Not Found');
          fs.readFile('server/404.html', function(err, data) {
            // fancy 404 page not found -> give standard response
            if (err) {
              response.write('404: File Not Found!');
              return response.end();
            }
            // fancy 404 page found
            response.write(data);
            return response.end();
          });
        } else {
          // file user requested exists -> return it
          response.statusCode = 200; // HTTP 200 OK
          response.write(data);
          return response.end();
        }

    });

  });
server.listen(8080);
