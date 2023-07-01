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

// We redefine vscode stub's function here, so all code about extension will be in the one place.
vscode.commands.executeCommand = async (name, ourParams, ...args) => {
  let command = { name, args }
  console.log('#executeCommand', command)
  if (vscode._registeredCommands[name]) {
    return new Promise((resolve, reject) => {
      vscode.window.activeTextEditor = {
        ...vscode.window.activeTextEditor,
        ...{
          document: {
            getText: (t) => {
              // t - selection, could be null
              return ourParams.fileContent;
            },
            languageId: ourParams.languageId,
          },
          async edit(callback) {
            let toChange = {
              replace: (selection, newContent) => {
                console.log('REPLACE', selection, newContent),
                resolve(newContent)
              }
            }
            // callback(fileContent)
            callback(toChange)
          }
        }
      }
      vscode._registeredCommands[name](...args)
    });
  } else {
    console.log('command not registered', command)
    return { status: 'NotRegistered' }
  }
}

module.exports.executeCommand = async (name, ...args) => {
  console.log('EXECUTE COMMAND COPILOT DIST', name, args);
  return vscode.commands.executeCommand(name, ...args);
}

// extension.deactivate(); // TODO: needed?
