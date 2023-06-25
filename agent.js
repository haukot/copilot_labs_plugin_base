const jayson = require('jayson');
const copilotLabsDist = require('./vscode_extension.js');

copilotLabsDist.init();

let commands = {
  "useBrush": "copilot-labs.use-brush"
}

let server = jayson.server({
  useBrush: function(args, callback) {
    console.log("Execute command agent ARGS", args);
    copilotLabsDist.executeCommand(commands.useBrush, ...args)
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
      setTimeout(() => {
        process.stdout.write(JSON.stringify(response));
      }, 10);
    });
  });