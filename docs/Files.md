# List of tracked files and their functions

`.github/` - This folder contains CI settings, which is a service that performs checks on the source code automatically.

`public/` - This folder stores resources files that are directly sent to client (e.g. icons and base html)

`src/server/` - Server side code in Node.js

`src/client/` - Client side code in React

`.babelrc` - Settings for Babel, a JavaScript compiler that converts next generation JavaScript features into more compatible syntaxes

`.editorconfig` - Common settings for your code editor (line ending, tab width, etc.)

`.eslintrc.json` - Settings for ESLint, the code formatter and linter

`.gitattributes` - Settings for git, specify how different types of files are handled by git

`.gitignore` - Specify files and folders that are not pushed to github (e.g. node_modules, .env)

`API.rest` - A list of requests for testing the backend server. Install the VS Code extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to easily test the backend server using this file.

`nodemon.json` - Settings for nodemon, which is a tool that restarts the local server automatically when you change server side code

`package.json` - Project info and a list of packages that are used

`README.md` - The info page

`webpack.config.js` - Settings for webpack, which bundles all client side code to files that can be delivered to client directly

`yarn.lock` - A record of the exact versions of the packages that we are using, managed by yarn automatically
