const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((connection) => {
  // Handle connection
  connection.on("data", (data) => {
    const clientReq = data.toString().trim().split("\r\n");
    const cmd = clientReq[2].toLowerCase();
    const msg = clientReq[4]
    switch (cmd) {
      case "echo":
        connection.write(`+${msg}\r\n`)
        break;
      default:
        connection.write("+PONG\r\n");
        break
    }
  })
});

server.listen(6379, "127.0.0.1");
