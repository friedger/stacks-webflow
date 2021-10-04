import {
  AppConfig,
  openContractCall,
  showConnect,
  UserSession,
} from "@stacks/connect";
import { AnchorMode, uintCV } from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import React, { useState } from "react";

import ReactDOM from "react-dom";

const userSession = new UserSession();
const network = new StacksMainnet();

export function App() {
  const [user, setUser] = useState();

  if (user || userSession.isUserSignedIn()) {
    return (
      <div>
        <button
          onClick={() =>
            openContractCall({
              contractAddress: "SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ",
              contractName: "free-punks-v0",
              functionName: "mint",
              functionArgs: [uintCV(0)],
              anchorMode: AnchorMode.ANY,
              userSession,
              network,
            })
          }
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
