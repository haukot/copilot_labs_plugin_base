const jayson = require('jayson');
const copilotLabsDist = require('./dist/index.js');

copilotLabsDist.init();

let commands = {
  "useBrush": "copilot-labs.use-brush"
}
// Create a server
let server = jayson.server({
  useBrush: function(args, callback) {
    console.log("Execute command agent ARGS", args);
    let result = copilotLabsDist.executeCommand(commands.useBrush, ...args);
    console.log("RESULT", result);
    callback(null, result);
  },
});

// Listen for data from the parent process
process.stdin
  .on('data', (data) => {
    let request = JSON.parse(data);
    console.log("EXECUTE REQUEST", request);

    server.call(request, (error, response) => {
      console.log("EXECUTION RESPONSE", error, response);
      // Send the JSON-RPC response to the parent process
      process.stdout.write(JSON.stringify(response));
    });
  });
