import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

//WORKFLOW
//component renders
//comonentDidMount called: Way to load data after rendering
//'Call' methods on contract
//set data on 'state'

class App extends Component {
//define our state. And yes, this is 100% the same as setting up the constructor
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call(); //do not need to put "from" with metamask
    const players = await lottery.methods.getPlayers().call(); //get get players
    const balance = await web3.eth.getBalance(lottery.options.address); //ALL of these functions are in your previous lottery.sol file!
    //this.setState({ manager: manager });
    this.setState({ manager, players, balance }); //syntactic sugar
  }

  onSubmit = async (event) => {
    event.preventDefault(); //to make sure form does not submit itself

    const accounts = await web3.eth.getAccounts(); //we use await since we're in an async function

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({ //enters us into contract! this will take some time (15 seconds approx)
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' })


  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
        This contract is managed by {this.state.manager}.
        There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input
            value = {this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;

/*
review:

React is pretty reppetitive. Looks mostly the same

Recap:
only one component inside of our application. It manages 5 different values of state:
manager, players, balance, value, and message

some are properties utilized by contract, others are being produced by the component itselt
(such as value and message)

when our component renders for the first time, the componentDidMount() method gets called automatically
we then pull off some properties from the contract (manager, players, balance) and set them to the contract's state
this way, we can utilize these properties inside the render method

Things get more complicated at the even handlers (onSubmit and onClick)
They essentially call functions on the contract

The render method then read some properties from the state, and displayed them on screen

fromWei was also used to convert wei to ether

That's it!

However, there was a lot of corner cutting here. For example, we can pick a winner if the person choosing isn't the creator of contract
We also didn't do error handling

Our next project will be a production style application to deploy in the public and in the wild

*/
