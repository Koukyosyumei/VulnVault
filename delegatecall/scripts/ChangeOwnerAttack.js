const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying User contract...");
    const User = await ethers.getContractFactory("User");
    const user = await User.deploy();
    await user.waitForDeployment();
    console.log("User deployed to:", user.getAddress());

    console.log("Deploying Count contract...");
    const Count = await ethers.getContractFactory("Count");
    const count = await Count.deploy(user);
    await count.waitForDeployment();
    console.log("Count deployed to:", count.getAddress());

    console.log("Deploying Count contract...");
    const Attack = await ethers.getContractFactory("Attack");
    const attack = await Attack.deploy(count);
    await attack.waitForDeployment();
    console.log("Attack deployed to:", attack.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
