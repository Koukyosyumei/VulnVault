# Overflow Attack

## Overview

### `TimeBank`

The `TimeBank` contract allows users to deposit Ether, which is then locked for a specified period (one week by default). Users can withdraw their funds only after the lock time has passed. However, the contract contains an integer overflow vulnerability in the `increaseLockTime` function, which can be exploited by an attacker to manipulate the lock time and withdraw funds prematurely.

Key Functions:

- `deposit()`: Allows a user to deposit Ether into the contract, setting a lock time of one week.
- `increaseLockTime(address _user, uint _time)`: Increases the lock time for a specified user by a given amount of time. This function is vulnerable to integer overflow, allowing an attacker to set the lock time to a very small value.
- `withdraw(address user)`: Allows a user to withdraw their Ether if the current time is greater than the lock time.
- `getBalance()`: Returns the total balance of the contract.

### `OverflowAttack`

The `OverflowAttack` contract exploits the integer overflow vulnerability in the `TimeBank` contract. By manipulating the lock time, the attacker can withdraw funds before the lock period ends, effectively draining the Ether stored in the `TimeBank` contract.

Key Functions:

- `attack()`: Initiates the overflow attack by manipulating the lock time and then withdrawing Ether from the `TimeBank` contract.
- `getBalance()`: Returns the balance of Ether held by the attacking contract.

## Script

```bash
$ cd overflow
$ npx hardhat compile
$ npx hardhat run scripts/OverflowAttack.js --network localhost
$ npx hardhat test test/OverflowAttack.js

  Overflow Attack
Bank balance before attack: 10.0
Attacker balance before attack: 9989.998708259262918561
-------------------------------
Bank balance after attack: 0.0
Attacker balance after attack: 9999.998604234268539613
    ✔ should allow overflow attack to drain funds from the bank


  1 passing (480ms)
```