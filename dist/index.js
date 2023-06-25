var extension = require('./extension/extension/dist/extension.js');
var vscode = require('vscode');

module.exports.init = async () => {
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
  // console.log(extension);
  console.log('ACTIVATED');

  return 'OK';
}

module.exports.executeCommand = (name, ...args) => {
  console.log('EXECUTE COMMAND COPILOT DIST', name, args);
  vscode.commands.executeCommand(name, ...args);

  return 'OK';
}

  // extension.deactivate(); // TODO: needed?
