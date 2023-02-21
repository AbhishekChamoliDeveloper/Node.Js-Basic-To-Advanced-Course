const http = require("http");
const fs = require("fs");
const path = require("path");

//  Req -> Request, Res -> Response
const server = http.createServer((req, res) => {
  if (req.url === "/image" && req.method === "GET") {
    const filepath = path.join(__dirname, "image.jpg");

    const stream = fs.createReadStream(filepath);

    res.setHeader("Content-Type", "image/jpeg");
    stream.pipe(res);
  }

  if (req.url === "/video" && req.method === "GET") {
    const filepath = path.join(__dirname, "video.mp4");

    const stream = fs.createReadStream(filepath);

    res.setHeader("Content-Type", "video/mp4");
    stream.pipe(res);
  }

  if (req.url === "/document" && req.method === "GET") {
    const filepath = path.join(__dirname, "document.pdf");

    const stream = fs.createReadStream(filepath);

    res.setHeader("Content-Type", "application/pdf");
    stream.pipe(res);
  }

  if (req.url === "/html" && req.method === "GET") {
    const filepath = path.join(__dirname, "index.html");

    const data = fs.readFileSync(filepath);

    res.setHeader("Content-Type", "text/html");
    res.end(data);
  }
});

server.listen(3000, () => {
  console.log("Server has been started");
});

// url -> http://localhost:3000 ( Incoming Request Listen)
// http and https -> http - unsecure & https - secure

// http Request Type
/*

1. GET - default
2. DELETE 
3. POST
4. PATCH or Update


*/

// Routes

/*

www.google.com - Root Url
www.google.com/accounts - "/accounts" - Route or Path
www.google.com/accounts/chirag
www.google.com/accounts/chirag/name

www.youtube.com
www.youtube.com/video?v=122344

*/

// Route For my Application

/*

http://localhost:3000 - Root Url
http://localhost:3000/image - GET 
http://localhost:3000/video -GET
http://localhost:3000/document- Get
http://localhost:3000/audio - Get




*/
