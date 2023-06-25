// This file is essentially a simple plugin - like with Github Copilot Vim plugin,
// it starts agent.js, and sends messages to it

const { spawn } = require('child_process');

console.log('STARTING CHILD');

// Create a child process
let child = spawn('node', ['agent.js']);

// Get output from the child process
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// Get error messages from the child process
child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// Handle the close event
child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// Send command
child.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  method: 'useBrush',
  params: ['document'],
  id: 1, // TODO: server will reply with the same id. need to use that
}));

child.stdin.end();

console.log('CHILD STARTED');

// wait
setTimeout(() => {
  console.log('DONE');
}, 50000);
