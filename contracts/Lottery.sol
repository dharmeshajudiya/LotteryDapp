//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

// For this contract we receive 1 ether from each participant and we do random pick winner and who wins this game take all ehter home.
// We require atlest 3 players to play this game
// Manager cannot swith his responsiblity to other person
// Manager can also take participant in this game as player
contract Lottery {
    // Players is able to pay and receive ether in this contract, players is payable in nature so we sotre address of all players
    address payable[] public players;
    
    // Only one manager allow in this contract
    address manager;

    // We need to store winner to send ehter as winning prize.
    address payable public winner;

    // Who deploy this contract is become manager for this game.
    constructor() {
        manager=msg.sender;
    }

    // Players can participant to transfer 1 ether to the contract
    receive() external payable {
        require(msg.value == 1 ether, "For participant in the game, Please pay atleast 1 ether.");
        players.push(payable(msg.sender));
    }

    // This function return current balance in smart contract, only manager can access this function.
    function getBalance() public view returns(uint) {
        require(msg.sender == manager, "Only manager can access this functionality.");
        return address(this).balance;
    }

    function random() internal view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }

    // In this function we choose winnder with help of random function and transfer winning prize to winner account
    function pickWinner() public {
        require(msg.sender == manager, "Only manager can access this functionality.");
        require(players.length >= 3, "Players are less than three.");

        uint index = random() % players.length;
        winner = players[index];
        winner.transfer(getBalance());

        players = new address payable[](0);
    }

    // List all current player who participant in this game
    function allPlayer() public view returns(address payable[] memory) {
         require(msg.sender == manager, "Only manager can access this functionality.");
         return players;
    }
}