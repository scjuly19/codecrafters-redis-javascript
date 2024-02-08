const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const parseRequest = (data) => {
  const clientRequest = data.toString().trim().split("\r\n");

  return {
    command: clientRequest[2].toLowerCase(),
    key: clientRequest[4],
    value: clientRequest[6]
  }
}
const dataStore = new Map();
const server = net.createServer((connection) => {
  // Handle connection
  connection.on("data", (data) => {
    const { command, key, value } = parseRequest(data)

    switch (command) {
      case "echo":
        connection.write(`+${key}\r\n`)
        break;
      case "ping":
        connection.write("+PONG\r\n");
        break;
      case "set":
        dataStore.set(key, value);
        connection.write("+OK\r\n");
        break;
      case "get":
        const val = dataStore.get(key);
        if(val){
        connection.write(`+${val}\r\n`);
        }
        else return;
        break;
      default:
        connection.write("+unknown command\r\n");
        break
    }
  })
});

server.listen(6379, "127.0.0.1");
