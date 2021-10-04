import { AppConfig, UserSession } from "@stacks/connect";
import React, { Component } from "react";

import ReactDOM from "react-dom";

const userSession = new UserSession()
class App extends Component {

  render() {
    if (userSession.isUserSignedIn()) {
      return <div><button>Mint</button></div>;
    } else {
      return <div><button>Connect with Stacks Wallet</button></div>
    }
  }
}

ReactDOM.render(
  React.createElement(App, {}, null),
  document.getElementById("react-target")
);
