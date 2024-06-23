const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Attack", function () {
  let bank;
  let reentrancyAttack;
  let deployer;
  let attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    // Deploy the Bank contract
    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();

    // Deploy the ReentrancyAttack contract
    const ReentrancyAttack = await ethers.getContractFactory("ReentrancyAttack");
    reentrancyAttack = await ReentrancyAttack.deploy(bank.getAddress());
    await reentrancyAttack.waitForDeployment();
  });

  it("should allow reentrancy attack to drain funds from the bank", async function () {
    // Deployer deposits 10 ethers to the bank
    await bank.connect(deployer).deposit({ value: ethers.parseEther("10") });

    // Check initial balance of bank and attacker
    let bankBalance = await bank.getBalance();
    // let attackerInitialBalance = await reentrancyAttack.getBalance();
    let attackerInitialBalance = await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance before attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance before attack:", ethers.formatEther(attackerInitialBalance));
    console.log("-------------------------------")

    // Attacker performs the attack
    await reentrancyAttack.connect(attacker).attack({ value: ethers.parseEther("1") });

    // Check final balance of bank and attacker
    bankBalance = await bank.getBalance();
    let countWithdraw = await reentrancyAttack.connect(attacker).getCountWithdraw();
    // let attackerFinalBalance = await reentrancyAttack.getBalance();
    let attackerFinalBalance = await ethers.provider.getBalance(attacker.getAddress());
    console.log("Number of times `withdraw` has been called:", countWithdraw);
    console.log("Bank balance after attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance after attack:", ethers.formatEther(attackerFinalBalance));
    
    // Verify that the bank's balance has been drained
    expect(bankBalance).to.equal(0);
    expect(attackerFinalBalance).to.be.above(attackerInitialBalance);
  });
});
