# POC: Github Copilot Labs Plugin Base

# What's inside

Concept is similar with agent.js in Github Copilot VIM plugin, but it works directly with extension.js file from VS Code extension.
So it should provide more up to date versions.

In a similar way it uses jsonrpc protocol upon runned process.

* `index.js` is the code that should be implemented by plugin(VIM, Emacs, etc). It contains jsonrpc client code. It spawns `agent.js` as process, and sends jsonrpc commands to it.
* `agent.js` is a middleware code between client and extension. It contains jsonrpc server, and converts jsonrpc commands to extension commands.
* `vscode_extension.js` is a wrapper upon extension. It imitates the extension activation and call commands.
* `vscode` directory - is a stub on VS Code. It stubs VS Code functions in the way the extension uses them.

This example has many logs and uses jsonrpc upon stdin/stdout, which combination not really works great. So for real plugin we need to remove console.log statements, or use jsonrpc upon network or socket, so logs will not return by jsonrpc channel.

# Preparations

Firstly get github token for extension.
Tokens from Github Copilot plugins are working(you could use output from this code https://github.com/haukot/copilot_auth_example).
My [personal Github token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) didn't work.

Copy token without quotes to the file `SecretGithubToken`

Download extension from https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-labs&ssr=false#overview

and extract it to the `extension` folder.

```
npm i
unzip -o ~/Downloads/GitHub.copilot-labs-0.14.884.vsix -d extension
npx js-beautify -r ./extension/extension/dist/extension.js
```

(beautify is not required, but in this way you can easier read errors)

# Run

Then run

```
node index.js
```

It'll run `debug` brush on the code.


# Notes

I found an example of similar approach in [LSP wrapper for typescript extension of vscode](https://github.com/yioneko/vtsls/). It goes much farther and uses vscode itself(files [1](https://github.com/yioneko/vtsls/blob/d79cb577a277437cda9fe6b2ad30e20377f85f44/packages/service/src/shims/workspace.ts), [2](https://github.com/yioneko/vtsls/blob/d79cb577a2/packages/service/scripts/build.js#L50), [3](https://github.com/yioneko/vtsls/blob/d79cb577a277437cda9fe6b2ad30e20377f85f44/packages/service/vitest.config.ts#L21C1-L21C1)).

It's seems like a overkill for extension like Copilot Labs, but maybe it could be more useful for wrapping some complex extensions.
