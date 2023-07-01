# How to use VS Code plugins in your favorite editor(e.g. Emacs), with the example of Github Copilot Labs.

### TLDR: Proof of concept code is here https://github.com/haukot/copilot_labs_plugin_base

VS Code plugins are essentially JS files that VS Code runs with its own callbacks. So we can write our own wrapper, which will define the functions needed for the plugin, and stub all other functions.

A simple example is the (Github Copilot Labs)[https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-labs] extension, because it only needs selection and command.

VS Code extension is essentially a js module, which exports several functions. We are interested in `init()` and `activate()`.

Now, let's download it, unzip it, and move it to the `extension` folder.

Then we can initialize it

```javascript
var extension = require('./extension/extension/dist/extension.js');

await extension.init();
await extension.activate();
```

It fails, because it needs vscode to run(obviously!). So let's create our own VS Code.

```javascript
// vscode/index.js
let vscode = {}
vscode.version = 'MINE'
module.exports = vscode;

// package.json
...
  "dependencies": {
    "vscode": "file:vscode"
  }
...
```

Now our extension will use our own VS Code! It still fails, though.
We need to stub the methods the extension waits for, but most of them will be simple dummy methods like this

```javascript
vscode.Uri = {
  parse: (e) => {
    return {}
  }
}
```

You can see all of the methods [here](https://github.com/haukot/copilot_labs_plugin_base/blob/main/vscode/index.js).

Now let's initialize extension(we have also added several dummy settings in `activate`)
```javascript
await extension.init();
await extension.activate({
  extension: {
    packageJSON: {
      name: 'vscode-copilot',
    }
  },
  subscriptions: [],
  globalState: {
    setKeysForSync: () => {},
  },
});
```

Good, no errors! But we want output.
Github Copilot Labs main feature is "Use brush", which is works as an executeCommand in VS Code.

Let's look at our stub for commands

```javascript
// NOTE: this is our variable, not vscode's
vscode._registeredCommands = {}

vscode.commands = {
  registerCommand: (e, t) => {
    let command = { name: e, callback: t }
    vscode._registeredCommands[e] = t
    return command
  },
  // NOTE: you need to replace this method to implement your functionality
  executeCommand: async (e, ...z) => {
    let command = { name: e, args: z }
    if (vscode._registeredCommands[e]) {
      vscode._registeredCommands[e](...z)
    } else {
      return { status: 'NotRegistered' }
    }
  }
}
```

It doesn't do anything complex, just registers the command from extension.js, and runs it by executeCommand.

Let's change it for Copilot Labs. Its command accepts a brush name and changes current selection.
So, let's redefine executeCommand so it'll accept text from an external source!

```javascript
vscode.commands.executeCommand = async (name, ourParams, ...args) => {
  let command = { name, args }
  if (vscode._registeredCommands[name]) {
    return new Promise((resolve, reject) => {
      vscode.window.activeTextEditor = {
        ...vscode.window.activeTextEditor,
        ...{
          document: {
            getText: (currentSelection) => {
              // we already return content, so don't need to use currentSelection
              return ourParams.fileContent;
            },
            languageId: ourParams.languageId,
          },
          async edit(callback) {
            let toChange = {
              replace: (selection, newContent) => {
                // we'll return whole content, so don't need to use selection
                resolve(newContent)
              }
            }
            callback(toChange)
          }
        }
      }
      vscode._registeredCommands[name](...args)
    });
  } else {
    return { status: 'NotRegistered' }
  }
}
```

What's happening here:
1. We redefine the `window.activeTextEditor.document.getText` function so it'll return our code.
2. We redefine the `window.activeTextEditor.edit` function, which will be called after the extension completes the command and tries to change current selection.
3. We run `vscode._registeredCommands[name](...args)`, which will run command inside extension.js and start the whole process.
4. We wrap all this in a Promise, so we can get the result of the execution.

And now we could execute the command like this

```javascript
let fileContent = 'def hello():\n  print("Hello, world!")\n\nhello()'
let languageId = 'python';

vscode.commands.executeCommand('copilot-labs.use-brush', { fileContent, languageId }, 'debug')
    .then((result) => {
      console.log("RESULT", result);
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
```

Good! To integrate it with an IDE, we need some interface to run it, e.g. a jsonrpc server. IDE plugin will start it and send commands to it.
It's not so interesting, so I'll just link the implementations: [IDE plugin's side](https://github.com/haukot/copilot_labs_plugin_base/blob/main/index.js) and [jsonrpc-server](https://github.com/haukot/copilot_labs_plugin_base/blob/main/agent.js). (Sorry for many comments,  for now I don't have to clean all this up :')

This is a simple example with a simple extension, but it may pave the way for integrating more complex extensions too.

An example of a similar approach I found in in the [LSP wrapper for typescript extension of vscode](https://github.com/yioneko/vtsls/).
It goes much farther and uses vscode itself(see files [1](https://github.com/yioneko/vtsls/blob/d79cb577a277437cda9fe6b2ad30e20377f85f44/packages/service/src/shims/workspace.ts), [2](https://github.com/yioneko/vtsls/blob/d79cb577a2/packages/service/scripts/build.js#L50), [3](https://github.com/yioneko/vtsls/blob/d79cb577a277437cda9fe6b2ad30e20377f85f44/packages/service/vitest.config.ts#L21C1-L21C1)).

It seems like overkill for an extension like Copilot Labs, but maybe it could be more useful for wrapping some complex extensions.

Goodbye, and happy hacking!
