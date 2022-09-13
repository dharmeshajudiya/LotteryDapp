import React, {useState, useEffect} from 'react';
import "./Players.css"

const Players = ({state, address}) => {
  const [account, setAccount] = useState("No account connected.");
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [reload, setReload] = useState(false);

  const reloadEffect = () => {
      setReload(!reload);
  }

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
    });
  }

  useEffect(()=>{
      const getAccounts = async() => {
          const {web3} = state;
          const accounts = await web3.eth.getAccounts();
          console.log(accounts);
          setAccountListener(web3.givenProvider);
          setAccount(accounts[0]);
      }
      state.web3 && getAccounts();
  }, [state, state.web3]);

  useEffect(() => {
      const getPlayers = async() => {
          const { contract } = state;
          const players = await contract.methods.allPlayer().call();
          console.log(players);
          const registeredPlayers = await Promise.all(
            players.map((player) => {
              return player;
            })
          );
          console.log(registeredPlayers);
          setRegisteredPlayers(registeredPlayers);
          reloadEffect();
      }
      state.contract && getPlayers();
  }, [state, state.contract, reload]);
  return (
      <>
        <ul className="list-group" id="list">
          <div className="center">
            <li className="list-group-item" aria-disabled="true">
              <b>Connected account :</b> {account}
            </li>
            <li className="list-group-item">
              <b>Please pay 0.1 ether on this contract address : </b> {address}
            </li>
            <li className="list-group-item">
              <b>Registerd Players </b>:
              <br />
              <br />
              {registeredPlayers.length !== 0 &&
                registeredPlayers.map((name) => <p key={name}>{name}</p>)}
            </li>
          </div>
        </ul>
      </>
    );
}
export default Players