# Reentrancy Attack

## Overview

The example consists of two Solidity contracts: `Bank` and `ReentrancyAttack`, along with a test script written in JavaScript using Hardhat to simulate the attack.

### `Bank`

The `Bank` contract is a simple Ethereum smart contract that allows users to deposit and withdraw Ether. The contract maintains a balance for each user and allows them to withdraw their entire balance. However, the contract is vulnerable to a reentrancy attack due to the way it handles Ether transfers.

Key Functions:

- `deposit()`: Allows a user to deposit Ether into the contract.
- `withdraw()`: Allows a user to withdraw their entire balance. This function is vulnerable to reentrancy attacks.
- `getBalance()`: Returns the total balance of the contract.

### `ReentrancyAttack`

The `ReentrancyAttack` contract exploits the reentrancy vulnerability in the `Bank` contract. It repeatedly calls the `withdraw()` function of the Bank contract before the balance is updated, effectively draining all the Ether from the Bank contract.

Key Functions:

- `attack()`: Initiates the reentrancy attack by depositing and then immediately withdrawing Ether from the Bank contract.
- `receive()`: This special function is triggered when the contract receives Ether, and it immediately tries to withdraw more Ether from the Bank contract, continuing the attack.
- `getBalance()`: Returns the balance of Ether held by the attacking contract.
- `getCountWithdraw()`: Returns the number of times the withdraw() function has been called during the attack.

## Script

```bash
$ cd reentrancy
$ npx hardhat compile
$ npx hardhat run scripts/ReentrancyAttack.js --network localhost
$ npx hardhat test test/ReentrancyAttack.js

  Reentrancy Attack
Bank balance before attack: 10.0
Attacker balance before attack: 10000.0
-------------------------------
Number of times `withdraw` has been called: 11n
Bank balance after attack: 0.0
Attacker balance after attack: 10009.999707416496813617
    ✔ should allow reentrancy attack to drain funds from the bank


  1 passing (540ms)
```