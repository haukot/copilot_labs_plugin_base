// This file is essentially a simple plugin - like with Github Copilot Vim plugin,
// it starts agent.js, and sends messages to it

const { spawn } = require('child_process');

console.log('STARTING CHILD');

// Create a child process
let child = spawn('node', ['agent.js']);

// Get output from the child process
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  try {
    data = JSON.parse(data);
    console.log(data)
    if (data.result) {
      console.log("stdout RESULT:");
      console.log(data.result);
    }
  } catch (e) {
    // console.log('ERROR', e);
  }
});

// Get error messages from the child process
child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// Handle the close event
child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// These are existing brushes
const brushes = [{
  id: "readability",
  name: "readable",
  label: "Make this code more readable",
}, {
  id: "types",
  name: "add types",
  label: "Add types to this code",
}, {
  id: "find-bug",
  name: "fix bug",
  label: "Find a bug in this code",
}, {
  id: "debug",
  name: "debug",
  label: "Make this code easier to debug",
}, {
  id: "clean",
  name: "clean",
  label: "Clean up this code",
}, {
  id: "detailed-comments",
  name: "list steps",
  label: "Document the steps of this code",
}, {
  id: "robust",
  name: "make robust",
  label: "Make this code more robust",
}, {
  id: "chunk",
  name: "chunk",
  label: "Break this code into smaller chunks",
}, {
  id: "document",
  name: "document",
  label: "Document this code",
}, {
  id: "custom",
  name: "custom",
  label: "Use a custom brush",
}]

// This is our selection in the plugin
let fileContent = 'def hello():\n  print("Hello, world!")\n\nhello()'
let languageId = 'python';

// Send command
child.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  method: 'executeCommand', // TODO: should be 'executeCommand' to be in touch with lsp-server protocol
  params: ['copilot-labs.use-brush', { fileContent, languageId }, 'debug'],
  id: 1, // TODO: server will reply with the same id. But maybe more powerfull clients already use it?
}));

child.stdin.end();

console.log('CHILD STARTED');

// wait
setTimeout(() => {
  console.log('DONE');
}, 50000);
