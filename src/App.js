import React, { useState, useEffect } from "react";
import Web3 from "web3"; // Import web3 library
import './App.css';

// Define the contract ABI and address
const CONTRACT_ABI = [
  0x994F5CB0E9771580dD65e349C6A9DCB09F94257D
];
const CONTRACT_ADDRESS = "0x59bac01e0118b90Cde43C39Bcef326185577ffCD";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Detect Metamask and connect
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } else {
          setError("Metamask not detected");
          return;
        }

        // Get selected account
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Load contract
        const contractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setContract(contractInstance);

        // Get token name
        const name = await contractInstance.methods.name().call();
        setTokenName(name);

        // Get total supply
        const supply = await contractInstance.methods.totalSupply().call();
        setTotalSupply(supply);

        // Get balance of current account
        const balance = await contractInstance.methods.balanceOf(accounts[0]).call();
        setBalance(balance);
      } catch (error) {
        setError(error.message || "Failed to load blockchain data");
      }
    };

    loadBlockchainData();
  }, []);

  const handleTransfer = async () => {
    try {
      await contract.methods.transfer(transferTo, transferAmount).send({ from: account });
      // Update balance after transfer
      const balance = await contract.methods.balanceOf(account).call();
      setBalance(balance);
    } catch (error) {
      setError(error.message || "Failed to transfer tokens");
    }
  };

  const connectMetaMask = async () => {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setError("MetaMask connection request was cancelled");
      }
    } catch (error) {
      setError(error.message || "Failed to connect to MetaMask");
    }
  };
  

  const logout = () => {
    setAccount("");
  };

  return (
    <div>
      <h1>Token Interface</h1>
      {account ? (
        <div>
          <p>Account: {account}</p>
          <p>Balance: {balance}</p>
          <p>Total Supply: {totalSupply}</p>
          <p>Token Name: {tokenName}</p>
          <div>
            <h2>Transfer Tokens</h2>
            <input
              type="text"
              placeholder="Recipient Address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <button onClick={handleTransfer}>Transfer</button>
          </div>
          <button onClick={logout}>Logout</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <button onClick={connectMetaMask}>Connect with MetaMask</button>
      )}
    </div>
  );
};

export default App;
