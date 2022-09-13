import React, { useState, useEffect } from 'react';
import "./Manager.css";

const Manager = ({ state }) => {
    const [account, setAccount] = useState("");
    const [cbalance, setCbalance] = useState(0);
    const [lwinner, setLwinner] = useState("No winner yet.");

    const setAccountListener = (provider) => {
        provider.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
        });
    }
    useEffect(() => {
        const getAccount = async () => {
            const { web3 } = state;
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            setAccountListener(web3.givenProvider);
            setAccount(accounts[0]);
        }
        state.web3 && getAccount();
    }, [state, state.web3])

    const contractBalance = async () => {
        const { contract } = state;

        try {
            const balance = await contract.methods.getBalance().call({ from: account });
            console.log("Currnet Contract Balance " + balance);
            setCbalance(balance);
        } catch (e) {
            setCbalance("Only manager can access this functionality.");
        }

    }

    const winner = async () => {
        const { contract } = state;
        try {
            await contract.methods.pickWinner().send({ from: account });
            const winner = await contract.methods.winner().call();
            console.log("Winner : " + winner);
            setLwinner(winner);
        } catch (e) {
            if (e.message.includes("Only manager can access this functionality.")) {
                setLwinner("Only manager can access this functionality.");
            } else if (e.message.includes("Players are less than three.")) {
                setLwinner("Players are less than three.");
            }
            else {
                setLwinner("No winner yet.");
            }
        }
    }
    return (
        <ul className='list-group' id='list'>
            <div className='center'>
                <li className='list-group-item' aria-disabled="true">
                    <b>Connected account : </b> {account}
                </li>
                <li className='list-group-item'>
                    <b>Winner : </b> {lwinner}
                    <button className='button1' onClick={winner}>
                        Click for winner
                    </button>
                </li>
                <li className='list-group-item'>
                    <b>Balance: </b> {cbalance} ETH
                    <button className='button1' onClick={contractBalance}>
                        Click for balance
                    </button>
                </li>
            </div>

        </ul>
    );
}

export default Manager;