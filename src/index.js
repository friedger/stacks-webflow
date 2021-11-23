import { openContractCall, showConnect, UserSession } from "@stacks/connect";
import {
  AnchorMode,
  stringAsciiCV,
  PostConditionMode,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from "@stacks/transactions";
import { StacksMainnet } from "@stacks/network";
import React, { useState } from "react";

import ReactDOM from "react-dom";
import { PandaMintContract, PandaNftContract } from "./artifacts/contracts.ts";

const userSession = new UserSession();
const network = new StacksMainnet();

const functions = [
  PandaMintContract.Functions.Mint,
  PandaMintContract.Functions.MintTwo,
  PandaMintContract.Functions.MintThree,
  PandaMintContract.Functions.MintFour,
  PandaMintContract.Functions.MintFive,
];
const baseUri = "ipfs://QmXxAG3j9JDsXNWMeKsca6djYsi9hhtWCZT9JjoA81SsZu/{id}.json";

export function App() {
  const [user, setUser] = useState();
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState();

  if (user || userSession.isUserSignedIn()) {
    const profile = userSession.loadUserData()?.profile;
    const isContractOwner =
      profile?.stxAddress?.mainnet ===
      "SP1T4Y4WK9DGZ2EDWSNHRE5HRRBPVG7S46JAHW552";
    return (
      <div className="mint-container">
        <button
          onClick={() => {
            setStatus(undefined);
            setCount(count - 1 < 1 ? 1 : count - 1);
          }}
        >
          -
        </button>
        <div className="count">{count}</div>
        <button
          onClick={() => {
            setStatus(undefined);
            setCount(count + 1 > 5 ? 5 : count + 1);
          }}
        >
          +
        </button>
        <button
          disabled={!profile}
          onClick={() => {
            setStatus(undefined);
            const fn = functions[count - 1];
            openContractCall({
              contractAddress: PandaMintContract.address,
              contractName: PandaMintContract.name,
              functionName: fn.name,
              functionArgs: [],
              anchorMode: AnchorMode.ANY,
              postConditionMode: PostConditionMode.Deny,
              postConditions: [
                makeStandardSTXPostCondition(
                  profile.stxAddress.mainnet,
                  FungibleConditionCode.Equal,
                  count * 25_000_000
                ),
              ],
              userSession,
              network,
              onFinish: () => {
                setStatus(fn.name + " transaction sent");
              },
              onCancel: () => {
                setStatus(fn.name + " transaction canceled");
              },
            });
          }}
        >
          Mint
        </button>
        <button
          onClick={() => {
            try {
              userSession.signUserOut();
              setUser(undefined);
              // call isUserSignIn to update the UI
              userSession.isUserSignedIn();
            } catch (e) {
              console.log(e);
            }
          }}
        >
          Disconnect
        </button>
        {status && <div className="status">{status}</div>}

        {isContractOwner && (
          <div>
            <br />
            <button
              onClick={() => {
                setStatus(undefined);
                openContractCall({
                  contractAddress: PandaMintContract.address,
                  contractName: PandaMintContract.name,
                  functionName:
                    PandaMintContract.Functions.FlipMintpassSale.name,
                  functionArgs: [],
                  anchorMode: AnchorMode.ANY,
                  userSession,
                  network,
                  onFinish: () => {
                    setStatus(
                      PandaNftContract.Functions.FlipMintpassSale.name +
                        " transaction sent"
                    );
                  },
                });
              }}
            >
              Start Premint Sale
            </button>

            <br />
            <button
              onClick={() => {
                setStatus(undefined);
                openContractCall({
                  contractAddress: PandaMintContract.address,
                  contractName: PandaMintContract.name,
                  functionName: PandaMintContract.Functions.FlipSale.name,
                  functionArgs: [],
                  anchorMode: AnchorMode.ANY,
                  userSession,
                  network,
                  onFinish: () => {
                    setStatus(
                      PandaNftContract.Functions.FlipSale.name + " transaction sent"
                    );
                  },
                });
              }}
            >
              Start Public Sale
            </button>
            <br />
            <button
              onClick={() => {
                setStatus(undefined);
                openContractCall({
                  contractAddress: PandaNftContract.address,
                  contractName: PandaNftContract.name,
                  functionName: PandaNftContract.Functions.SetBaseUri.name,
                  functionArgs: [stringAsciiCV(baseUri)],
                  anchorMode: AnchorMode.ANY,
                  userSession,
                  network,
                  onFinish: () => {
                    setStatus(
                      PandaNftContract.Functions.SetBaseUri.name + " transaction sent"
                    );
                  },
                });
              }}
            >
              Reveal Pandas ({baseUri})
            </button>
            <br />
            <button
              onClick={() => {
                setStatus(undefined);
                openContractCall({
                  contractAddress: PandaNftContract.address,
                  contractName: PandaNftContract.name,
                  functionName: PandaNftContract.Functions.FreezeMetadata.name,
                  functionArgs: [],
                  anchorMode: AnchorMode.ANY,
                  userSession,
                  network,
                  onFinish: () => {
                    setStatus(
                      PandaNftContract.Functions.FreezeMetadata.name +
                        " transaction sent"
                    );
                  },
                });
              }}
            >
              Freeze Metadata (can be called only once)
            </button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="mint-container">
        <button
          onClick={() =>
            showConnect({
              appDetails: {
                name: "Stacks Panda",
                icon: "https://youthful-wing-084af9.netlify.app/stackschina.png",
              },
              onFinish: () => {
                setUser(userSession.loadUserData());
              },
            })
          }
        >
          Mint a Stacks Panda
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById("react-target")
);
