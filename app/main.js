const net = require("net");
const process = require('process');


// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const expiryTimes = new Map();
const dataStore = new Map();
const parseRequest = (data) => {
  const clientRequest = data.toString().trim().split("\r\n");
  const command = clientRequest[2].toLowerCase()
  const key = clientRequest[4]
  const value = clientRequest[6]
  if (clientRequest.indexOf('px') !== -1) {
    const expiryIndex = clientRequest.indexOf('px') + 2
    const expiryTime = clientRequest[expiryIndex]
    expiryTimes[key] = new Date(new Date().getTime() + parseInt(expiryTime))
  }

  return {
    command, key, value
  }
}
let customPort = 6379;
process.argv.forEach((val, index) => {
  if (val.includes('port') && process.argv[index + 1] !== undefined) {
    customPort = parseInt(process.argv[index + 1])
  }
})
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
        if (expiryTimes[key] && expiryTimes[key] < new Date()) {
          delete expiryTimes[key]
          delete dataStore[key]
          connection.write("$-1\r\n");

        }
        else {
          connection.write(`+${val}\r\n`);
        }
        break;
        case "info":
          connection.write(`$11\r\nrole:master\r\n`);

      default:
        connection.write("+unknown command\r\n");
        break
    }
  })
});

server.listen(customPort, "127.0.0.1");
