const fs = require('fs');

let vscode = {}

class EnhancedHash {
  constructor(initialObject = {}) {
    this.hash = {...initialObject};
    // so config[] and config.get() will both work
    return new Proxy(this, {
      get: function(target, name) {
        if (name in target) {
          return target[name];
        }
        if (name in target.hash) {
          return target.hash[name];
        }
      }
    });
  }

  get(key) {
    return this.hash[key];
  }
}

function disposableFunction(fn) {
  return function(...args) {
    const result = fn(...args);

    result.dispose = function() {
      console.log('Resources cleaned up.');
    };

    return result;
  };
}

vscode.workspace = {}
vscode.workspace.getConfiguration = (e) => {
  let config = {
    telemetry: {
      enableTelemetry: false,
    },
    "github.copilot-labs": {
      advanced: {},
      showBrushesLenses: false,
      showTestGenerationLenses: false,
    }
  }
  return new EnhancedHash(config[e]);
}
vscode.workspace.onDidChangeConfiguration = disposableFunction((e) => {
  return {}
})
vscode.workspace.onDidChangeTextDocument = disposableFunction((e) => {
  return {}
})

// TODO: make Logger(29899)

vscode.window = {}
vscode.window.createOutputChannel = disposableFunction((e) => {
  return {
    appendLine: () => {
      // TODO: do we need logs here?
      // console.log(arguments)
      console.log(arguments[0])
    },
  }
})
vscode.window.onDidChangeTextEditorSelection = disposableFunction((e) => {
  return {}
})
vscode.window.registerWebviewViewProvider = disposableFunction((e, t) => {
  return {}
})
vscode.window.createTextEditorDecorationType = (e) => {
  return {}
}
vscode.window.showWarningMessage = (e) => {
  console.warn("[WINDOW WARN]", e)
  return {}
}
vscode.window.showInformationMessage = (e) => {
  console.log("[WINDOW LOG]", e)
  return {}
}
vscode.window.showErrorMessage = (e) => {
  console.error("[WINDOW ERROR]", e)
  return {}
}

vscode.window.showInputBox = (e) => {
  // {
  //   prompt: "Enter a custom brush",
  //   placeHolder: "e.g. 🎨"
  // }
  return {}
}

vscode.window.showTextDocument = (e) => {
  console.log("WINDOW SHOW TEXT DOCUMENT", e)
  return {}
}

let fileContent = 'def hello():\n  print("Hello, world!")\n\nhello()'
vscode.window.activeTextEditor = {
  selection: {
    start: {
      line: 0,
      character: 0,
      translate: (l, c) => {
        console.log('TRANSLATE start', l, c)
      }
    },
    end: {
      line: 0,
      character: 0,
      translate: (l, c) => {
        console.log('TRANSLATE end', l, c)
      }
    },
  },
  setDecorations: (d, d2) => {
    console.log('SET DECORATIONS', d, d2)
  },
  document: {
    uri: {
      fsPath: '',
    },
    getText: (t) => {
      // t - selection, could be null
      return fileContent
    },
    languageId: 'python',
  },
  async edit(callback) {
    let toChange = {
      replace: (oldC, newC) => console.log('REPLACE', oldC, newC),
    }
    // callback(fileContent)
    callback(toChange)
  }
}

vscode.ExtensionMode = {
  Test: 'test'
}

vscode.MarkdownString = class {
  constructor(e) {
  }
}

vscode.Selection = class {
  constructor(e, t) {
  }
}

vscode.Range = class {
  constructor(e, t) {
  }
}

vscode.Position = class {
  constructor(e, t) {
  }
}

vscode.CancellationTokenSource = class {
  constructor() {
  }
}

vscode.Uri = {
  parse: (e) => {
    return {}
  }
}

// could be avoided with
// process.env.GITHUB_TOKEN
// process.env.GITHUB_USER

// Or we could make our own auth. Examples
// https://github.com/microsoft/vscode/blob/cf5fe4dd348fe21b5ffcdef12bd87565265fe8bd/extensions/github-authentication/src/github.ts
// https://github.com/microsoft/vscode/tree/cf5fe4dd348fe21b5ffcdef12bd87565265fe8bd/extensions/github-authentication
// And here keys and url https://github.com/microsoft/vscode/blob/cf5fe4dd348fe21b5ffcdef12bd87565265fe8bd/extensions/github-authentication/src/githubServer.ts#L17

// But it seems token from Github Copilot plugin is working. And personal Github token is not
vscode.authentication = {
  getSession: (e, t, z) => {
    // github [ 'read:user' ] false
    console.log(e, t, z)
    let token = fs.readFileSync('SecretGithubToken', 'utf8');
    return {
      accessToken: token,
      account: {
        label: 'haukot'
      }
    }
  }
}

let commands = {}
vscode.commands = {
  registerCommand: (e, t) => {
    let command = { name: e, callback: t }
    console.log('#registerCommand', command)
    commands[e] = t
    return command
  },
  executeCommand: (e, ...z) => {
    let command = { name: e, args: z }
    console.log('#executeCommand', command)
    if (commands[e]) {
      commands[e](...z)
    } else {
      console.log('command not registered', command)
    }
    return command
  }
}

vscode.ThemeColor = class ThemeColor {
  constructor(color) {
  }
}

vscode.EventEmitter = class EventEmitter {
  constructor() {
  }
}

vscode.languages = {
  registerCodeLensProvider: (e, t) => {
    return {}
  }
}

// TODO: could use from auth example
vscode.env = {
  sessionId: 'sessionId',
  machineId: 'machineId',
}

vscode.version = '1.60.0'




module.exports = vscode;
