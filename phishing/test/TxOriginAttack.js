const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank and TxOriginAttack Contracts", function () {
    let bank, txOriginAttack;
    let owner, attacker, user;

    before(async function () {
        [owner, attacker, user] = await ethers.getSigners();

        // Deploy the Bank contract with initial funds
        const Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.connect(owner).deploy({ value: ethers.utils.parseEther("10") });
        await bank.deployed();

        // Deploy the TxOriginAttack contract with a reference to the Bank contract
        const TxOriginAttack = await ethers.getContractFactory("TxOriginAttack");
        txOriginAttack = await TxOriginAttack.connect(attacker).deploy(bank.address);
        await txOriginAttack.deployed();
    });

    it("should allow the owner to deposit Ether", async function () {
        // Owner deposits 5 ETH to the bank
        await bank.connect(owner).deposit({ value: ethers.utils.parseEther("5") });

        // Check that the bank's balance is 15 ETH
        expect(await bank.getBalance()).to.equal(ethers.utils.parseEther("15"));
    });

    it("should allow the attacker to draw all Ether from the bank", async function () {
        let bankBalance = await bank.getBalance();
        let attackerInitialBalance = await ethers.provider.getBalance(attacker.getAddress());
        console.log("Bank balance before attack:", ethers.utils.formatEther(bankBalance));
        console.log("Attacker balance before attack:", ethers.utils.formatEther(attackerInitialBalance));
        console.log("-------------------------------")

        // Owner wants to transfer 1 Ether
        await bank.connect(owner).withdraw(txOriginAttack.address, ethers.utils.parseEther("1"))

        bankBalance = await bank.getBalance();
        let attackerFinalBalance = await ethers.provider.getBalance(attacker.getAddress());
        console.log("Bank balance after attack:", ethers.utils.formatEther(bankBalance));
        console.log("Attacker balance after attack:", ethers.utils.formatEther(attackerFinalBalance));

        expect(await bank.getBalance()).to.equal(ethers.utils.parseEther("0"));
    });
});

