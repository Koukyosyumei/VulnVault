const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Pseudo Random Attack", function () {
  let bank;
  let pseudoRandomAttack;
  let attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    // Deploy the Bank contract
    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();

    // Deploy the PseudoRandomAttack contract
    const Attack = await ethers.getContractFactory("Attack");
    pseudoRandomAttack = await Attack.deploy(bank);
    await pseudoRandomAttack.waitForDeployment();
  });

  it("should allow pseudo-random attack to drain funds from the bank", async function () {
    // Deployer deposits 10 ethers to the bank
    await bank.connect(deployer).deposit({ value: ethers.parseEther("10") });

    // Check initial balance of bank and attacker
    let bankBalance = await bank.getBalance();
    let attackerInitialBalance = await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance before attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance before attack:", ethers.formatEther(attackerInitialBalance));
    console.log("-------------------------------")

    // Attacker performs the attack
    await pseudoRandomAttack.connect(attacker).attack();

    // Check final balance of bank and attacker
    bankBalance = await bank.getBalance();
    let attackerFinalBalance = await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance after attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance after attack:", ethers.formatEther(attackerFinalBalance));
    
    // Verify that the bank's balance has been drained
    expect(attackerFinalBalance).to.be.above(attackerInitialBalance);
  });
});
