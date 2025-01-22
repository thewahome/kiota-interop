import * as rpc from "vscode-jsonrpc/node";

import { connectToKiota } from "./kiota";
import { KiotaSearchResultItem, KiotaSearchResult } from "./kiota/types";

export function generateClient(): void {
  console.log("Client generated");
}

export function generatePlugin(): void {
  console.log("Plugin generated");
}

export function searchDescription(): Promise<Record<string, KiotaSearchResultItem> | undefined> {
  let searchTerm = "petstore";
  return connectToKiota<Record<string, KiotaSearchResultItem>>(async (connection) => {
    const request = new rpc.RequestType2<string, boolean, KiotaSearchResult, void>(
      "Search"
    );
    const result = await connection.sendRequest(
      request,
      searchTerm,
      false,
    );
    if (result) {
      console.log(result.results);
      return result.results;
    }
    return undefined;
  });
};

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "-c":
    generateClient();
    break;
  case "-p":
    generatePlugin();
    break;
  case "-s":
    searchDescription();
    break;
  default:
    console.log("Unknown command");
    break;
}