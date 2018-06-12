import Web3 from 'web3'; //this file is necessary for interacting with web3!!!!

const web3 = new Web3(window.web3.currentProvider); //injecting our version of web3 to the rinkeby network

export default web3;
