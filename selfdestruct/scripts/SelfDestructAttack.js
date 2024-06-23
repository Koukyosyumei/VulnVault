const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy the Bank contract
  console.log("Deploying WinBank contract...");
  const WinBank = await ethers.getContractFactory("WinBank");
  const winbank = await WinBank.deploy();
  await winbank.waitForDeployment();
  console.log("WinBank deployed to:", winbank.getAddress());

  // Deploy the SelfDestructAttack1 contract
  console.log("Deploying SelfDestructAttack1 contract...");
  const SelfDestructAttack1 = await ethers.getContractFactory("SelfDestructAttack1");
  const selfDestructAttack1 = await SelfDestructAttack1.deploy(winbank);
  await selfDestructAttack1.waitForDeployment();
  console.log("SelfDestructAttack1 deployed to:", selfDestructAttack1.getAddress());

  // Deploy the SelfDestructAttack2 contract
  console.log("Deploying SelfDestructAttack2 contract...");
  const SelfDestructAttack2 = await ethers.getContractFactory("SelfDestructAttack2");
  const selfDestructAttack2 = await SelfDestructAttack2.deploy(winbank.getAddress());
  await selfDestructAttack2.waitForDeployment();
  console.log("SelfDestructAttack1 deployed to:", selfDestructAttack2.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
