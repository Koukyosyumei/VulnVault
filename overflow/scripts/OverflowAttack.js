const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy the Bank contract
  console.log("Deploying TimeBank contract...");
  const TimeBank = await ethers.getContractFactory("TimeBank");
  const timebank = await TimeBank.deploy();
  await timebank.waitForDeployment();
  console.log("Bank deployed to:", timebank.getAddress());

  // Deploy the OverflowAttack contract
  console.log("Deploying OverflowAttack contract...");
  const OverflowAttack = await ethers.getContractFactory("OverflowAttack");
  const overflowAttack = await OverflowAttack.deploy(timebank.getAddress());
  await overflowAttack.waitForDeployment();
  console.log("overflowAttack deployed to:", overflowAttack.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
