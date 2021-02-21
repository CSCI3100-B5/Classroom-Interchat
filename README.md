# Classroom Interchat

Boilerplate code obtained from [crsandeep/simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack).

## Quick Start

### Environment Setup

Install [nvm for Windows](https://github.com/coreybutler/nvm-windows) or [nvm](https://github.com/nvm-sh/nvm) for macOS and Linux.

```bash
# Install Node.js 14.15.5 LTS
nvm install 14.15.5

# Use the newly installed version
nvm use 14.15.5

# Install the yarn package manager
npm install -g yarn
```

### Project Setup

```bash
# Clone the repository
git clone https://github.com/CSCI3100-B5/Classroom-Interchat

# Go inside the directory
cd Classroom-Interchat

# Install dependencies
yarn

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

The preferred editor is VSCode with ESLint and Prettier. See [Preferred Editor](#preferred-editor) for installation guide.

## Project Structure

This is a full stack web application using React, Node.js, Express and Webpack. It is also configured with webpack-dev-server, eslint, babel and react-scoped-css. [Airbnb's ESLint rules](https://github.com/airbnb/javascript) are applied.

### Development mode

In the development mode, we will have 2 servers running. The front end code will be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code will be served by a node server using [nodemon](https://nodemon.io/) which helps in automatically restarting the server whenever server side code changes.

### Production mode

In the production mode, we will have only 1 server running. All the client side code will be bundled into static files using webpack and it will be served by the Node.js/Express application.

### Folder Structure

All the source code will be inside **src** directory. Inside src, there is client and server directory. All the frontend code (react, css, js and any other assets) will be in client directory. Backend Node.js/Express code will be in the server directory.

## Documentation

For detailed boilerplate documentation, refers to its [README](https://github.com/crsandeep/simple-react-full-stack/blob/master/README.md)

## Preferred Editor

[VSCode](https://code.visualstudio.com/) is a lightweight but powerful source code editor. [ESLint](https://eslint.org/) takes care of the code-quality and code formatting.

### Installation guide

1. Install [VSCode](https://code.visualstudio.com/)
2. Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
4. Modify the VSCode user settings to add below configuration

   ```javascript
   "editor.defaultFormatter": "dbaeumer.vscode-eslint",
   "editor.formatOnSave": true,
   "eslint.format.enable": true,
   "eslint.alwaysShowStatus": true,
   "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
   }
   ```
