var extension = require('./extension/extension/dist/extension.js');
var vscode = require('vscode');

setTimeout(async () => {
  console.log('INIT EXT');
  await extension.init();
  console.log('ACTIVATE EXT');
  await extension.activate({
    // extensionMode: 'development',
    extension: {
      packageJSON: {
        name: 'vscode-copilot',
      }
    },
    subscriptions: [], // TODO: probably need to handle?
    globalState: {
      setKeysForSync: () => {},
    },
  });
  // extension.deactivate(); // TODO: needed?
  console.log('ACTIVATED');
  // TODO: we can event pass text to use brush?
  vscode.commands.executeCommand("copilot-labs.use-brush", "document");

  console.log(extension)
}, 5000);
