# POC: Github Copilot Labs Plugin Base

# Preparations

Go to dist repo

```
cd dist
```

Firstly get github token for extension. You could use output from this code
https://github.com/haukot/copilot_auth_example

Copy token without quotes to the file `SecretGithubToken`

Download extension from https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-labs&ssr=false#overview

and extract it to the folder you like(e.g. ~/extracted_extension_path)

```
npm i
cp -r ~/extracted_extension_path/* extension
npx js-beautify -r ./extension/extension/dist/extension.js
```

(beautify is not required, but in this way you can easier read errors)

Then run

```
node index.js
```

It'll run `document` brush on the code.

# Development

If the code gets recursion, its probably because it got wrong properties answer from Github servers. Check that extension properties are correct
