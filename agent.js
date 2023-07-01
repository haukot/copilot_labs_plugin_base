const jayson = require('jayson');
const copilotLabsDist = require('./vscode_extension.js');

copilotLabsDist.init();

let server = jayson.server({
  executeCommand: function(args, callback) {
    console.log("Execute command agent ARGS", args);
    const [command, ...rest] = args;
    copilotLabsDist.executeCommand(command, ...rest)
      .then((result) => {
        console.log("RESULT", result);
        callback(null, result);
      })
      .catch((error) => {
        console.log("ERROR", error);
        callback(null, error);
      });
  },
});

// Listen for data from the parent process
process.stdin
  .on('data', (data) => {
    let request = JSON.parse(data);
    console.log("SERVER GET REQUEST", request);

    server.call(request, (error, response) => {
      console.log("SERVER SENDS RESPONSE", error, response);
      // Send the JSON-RPC response to the parent process

      // setTimeout so it'll not interfere with logs, and will send
      // separate stdout
      // TODO: remove logs, so we don't have that problem. Or maybe it'll
      // go away if we'll use socket instead of stdin/stdout?(see the end of the file)
      setTimeout(() => {
        process.stdout.write(JSON.stringify(response));
      }, 10);
    });
  });


// TODO: maybe do through socket? Will we in this way have logs and response
// const net = require('net');
// const rpc_server = server.tcp();
// const server = net.createServer();
// server.on('connection', function(socket) {
//   socket.pipe(rpc_server).pipe(socket);
// });
// server.listen('/tmp/test.sock');
