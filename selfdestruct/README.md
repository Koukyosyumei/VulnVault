# SelfDestruct Attack

## Overview

The example includes three Solidity contracts: `WinBank`, `SelfDestructAttack1`, and `SelfDestructAttack2`, as well as a deployment script using Hardhat.

### `WinBank`

The `WinBank` contract is a simple game where participants can deposit exactly 1 Ether at a time. The first participant to reach a total balance of 5 Ether in the contract is declared the winner and can claim the total balance as a reward.

Key Functions:

- `deposit()`: Allows users to deposit exactly 1 Ether into the contract. The game ends when the total balance reaches 5 Ether, and the last depositor becomes the winner.
- `claimReward()`: The winner can claim the total balance of the contract.
- `getBalance()`: Returns the current balance of the contract.

### `SelfDestructAttack1`

The `SelfDestructAttack1` contract demonstrates how the selfdestruct function can be used to forcefully send Ether to the `WinBank` contract, bypassing the `deposit()` function's checks. This can interfere with the game's logic, potentially leading to an unintended winner.

Key Function:

- `attack()`: Calls selfdestruct to send the entire balance of `SelfDestructAttack1` to the WinBank contract.

### `SelfDestructAttack2`

The `SelfDestructAttack2` contract takes the manipulation a step further. After forcefully sending Ether to the WinBank contract using selfdestruct, it then attempts to claim the reward.

Key Functions:

- `attack()`: Deposits Ether into the `WinBank` contract, calls `claimReward()`, and transfers the winnings to the attacker.

## Script

```bash
$ cd overflow
$ npx hardhat compile
$ npx hardhat run scripts/SelfDestructAttack.js --network localhost
$ npx hardhat test test/SelfDestructAttack.js

  SelfDestruct Attack
Bank balance before attack: 2.0
Attacker balance before attack: 10000.0
-------------------------------
Bank balance after attack-2: 0.0
Attacker balance after attack: 10001.999854172729825825
    ✔ should allow self-destruct attack to drain funds from the bank


  1 passing (582ms)
```