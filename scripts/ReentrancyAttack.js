const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy the Bank contract
  console.log("Deploying Bank contract...");
  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.waitForDeployment();
  console.log("Bank deployed to:", bank.getAddress());

  // Deploy the ReentrancyAttack contract
  console.log("Deploying ReentrancyAttack contract...");
  const ReentrancyAttack = await ethers.getContractFactory("ReentrancyAttack");
  const reentrancyAttack = await ReentrancyAttack.deploy(bank.getAddress());
  await reentrancyAttack.waitForDeployment();
  console.log("ReentrancyAttack deployed to:", reentrancyAttack.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
