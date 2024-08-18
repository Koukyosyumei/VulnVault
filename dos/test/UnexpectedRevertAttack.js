const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dos Attack (Unexpected Revert)", function () {
  let user1;
  let user2;
  let hacker;
  let dos;
  let attack;

  before(async function () {
    [user1, user2, hacker] = await ethers.getSigners();

    // Deploy the Dos contract
    const Dos = await ethers.getContractFactory("Dos");
    dos = await Dos.deploy();
    await dos.waitForDeployment();

    // Deploy the Attack contract
    const Attack = await ethers.getContractFactory("Attack");
    attack = await Attack.deploy(dos.getAddress());
    await attack.waitForDeployment();
  });

  it("dos attack to cause the unexpected revert", async function () {
    let addr_user1 = await user1.getAddress();
    let addr_user2 = await user2.getAddress();
    let addr_attack = await attack.getAddress();
    console.log("Addr of User 1: ", addr_user1);
    console.log("Addr of User 2: ", addr_user2);
    console.log("Addr of Attack: ", addr_attack);
    console.log("")

    console.log("User 1 calls `deposit` (value=1)")
    await dos.connect(user1).deposit({ value: ethers.parseEther("1") });;
    let winner = await dos.winner();
    let balance = await dos.balance();
    console.log("Winner: ", winner);
    console.log("Balance: ", ethers.formatEther(balance));
    console.log("")

    console.log("User 2 calls `deposit` (value=2)")
    await dos.connect(user2).deposit({ value: ethers.parseEther("2") });;
    winner = await dos.winner();
    balance = await dos.balance();
    console.log("Winner: ", winner);
    console.log("Balance: ", ethers.formatEther(balance));
    console.log("")

    console.log("Hacker calls `deposit` (value=3)")
    await attack.connect(hacker).attack({ value: ethers.parseEther("3") });;
    winner = await dos.winner();
    balance = await dos.balance();
    console.log("Winner: ", winner);
    console.log("Balance: ", ethers.formatEther(balance));
    console.log("")

    console.log("User 1 calls `deposit` (value=4)")
    await dos.connect(user1).deposit({ value: ethers.parseEther("4") });;
    winner = await dos.winner();
    balance = await dos.balance();
    console.log("Winner: ", winner);
    console.log("Balance: ", ethers.formatEther(balance));
    console.log("")
  });
});
