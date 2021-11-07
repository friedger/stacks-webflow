import {
  AppConfig,
  openContractCall,
  showConnect,
  UserSession,
} from "@stacks/connect";
import { AnchorMode } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import React, { useState } from "react";

import ReactDOM from "react-dom";
import { PandaMintContract } from "./artifacts/contracts.ts";

const userSession = new UserSession();
const network = new StacksMainnet();

const functions = [
  PandaMintContract.Functions.Mint,
  PandaMintContract.Functions.MintTwo,
  PandaMintContract.Functions.MintThree,
  PandaMintContract.Functions.MintFour,
  PandaMintContract.Functions.MintFive,
];
export function App() {
  const [user, setUser] = useState();
  const [count, setCount] = useState(1);
  if (user || userSession.isUserSignedIn()) {
    return (
      <div className="mint-container">
        <button
          onClick={() => {
            setCount(count - 1 < 1 ? 1 : count - 1);
          }}
        >
          -
        </button>
        <div className="count">{count}</div>
        <button
          onClick={() => {
            setCount(count + 1 > 5 ? 5 : count + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            const fn = functions[count - 1];
            openContractCall({
              contractAddress: PandaMintContract.address,
              contractName: PandaMintContract.name,
              functionName: fn.name,
              functionArgs: [],
              anchorMode: AnchorMode.ANY,
              userSession,
              network,
            });
          }}
        >
          Mint
        </button>
        <button
          onClick={() => {
            userSession.signUserOut();
            setUser(undefined);
          }}
        >
          Disconnect
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() =>
            showConnect({
              appDetails: {
                name: "Webflow",
                icon: "https://webpack.js.org/site-logo.1fcab817090e78435061.svg",
              },
              onFinish: () => {
                setUser(userSession.loadUserData());
              },
            })
          }
        >
          Connect with Stacks Wallet
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById("react-target")
);
