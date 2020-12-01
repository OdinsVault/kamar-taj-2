const http = require("http");
const app = require("./app");

const port = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(port, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server started at port: " + port);
  }
});
