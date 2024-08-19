const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Extcodesize Attack", function () {
  let user1;
  let codesize;
  let extcodesizeAttack;

  before(async function () {
    [user1] = await ethers.getSigners();

    // Deploy the Codesize contract
    const Codesize = await ethers.getContractFactory("Codesize");
    codesize = await Codesize.deploy();
    await codesize.waitForDeployment();
  });

  it("should allow extcodesize attack", async function () {
    codesize.connect(user1).checkAddress();

    // Deploy the ExtcodesizeAttack contract
    const ExtcodesizeAttack = await ethers.getContractFactory("ExtcodesizeAttack");
    extcodesizeAttack = await ExtcodesizeAttack.deploy(codesize);
    await extcodesizeAttack.waitForDeployment();
  });
});
