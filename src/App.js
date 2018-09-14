import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({
      message:
        "Waiting on transaction seccess. Hold on!!, it takes about 15-20 seconds"
    });

    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });
      this.setState({ message: "You have been entered!" });
    } catch (e) {
      this.setState({
        message:
          "Urgh didnt work. add more ether, must be more than  0.01 ether (just Numbers!)"
      });
    }
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ players, balance });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({
      message:
        "Waiting on transaction seccess. Hold on!!, it takes about 15-20 seconds"
    });
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });

      this.setState({ message: "A Winner Has Been Picked" });
    } catch (e) {
      this.setState({
        message: "Naah mate, only Dan can do that, Try giving me more ether"
      });
    }
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); // dont have to specify from when you use metamask
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  render() {
    return (
      <div class="page">
        <h1>Dans 100% totaly not dodgy Ether Lottery</h1>
        <p>
          This contract is managed by {this.state.manager}
          <br />
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          Ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>
            <del>Give Dan your ether</del> Want to try your luck?
          </h4>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick Winner</button>

        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
