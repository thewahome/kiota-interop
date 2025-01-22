# kiota-interop

This is a sample project that demonstrates how to use the [Kiota Interop](https://github.com/microsoft/kiota/blob/7237b3beca63a46a0b04ac5818d1c4ae3d0a6ea5/vscode/microsoft-kiota/src/kiotaInterop/index.ts#L12) functionality available in Kiota VS Code as it's own standalone feature while exposing the Kiota Builder methods to allow a user to depend on this project  

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

## Getting Started


1. Install the Node.js dependencies:
    ```sh
    npm install
    npm install -g ts-node
    ```

3. Try out the search function by running:
    ```sh
    npx ts-node src/index.ts -s
    ```

## Usage

The very first time is a bit slower than the subsequent runs because of the installation of the kiota.exe in the background.
Eventually the application installs  and prints the result of a search to the console.
