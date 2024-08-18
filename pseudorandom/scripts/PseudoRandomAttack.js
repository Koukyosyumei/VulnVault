const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy the Bank contract
  console.log("Deploying Bank contract...");
  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.waitForDeployment();
  console.log("Bank deployed to:", bank.getAddress());

  // Deploy the Attack contract
  console.log("Deploying Attack contract...");
  const Attack = await ethers.getContractFactory("Attack");
  const attack = await Attack.deploy(bank);
  await attack.waitForDeployment();
  console.log("Attack deployed to:", attack.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
