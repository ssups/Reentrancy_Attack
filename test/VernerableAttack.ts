import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Deploy contracts', function () {
  async function deployContractsFixture() {
    const [deployer, user, attacker, burner] = await ethers.getSigners();
    // make attacker's balance to 50 ether
    await attacker.sendTransaction({ to: burner.address, value: ethers.utils.parseEther('9900') });

    const BankFactory = await ethers.getContractFactory('VernerableBank', deployer);
    const bankContract = await BankFactory.deploy();

    await bankContract.deposit({ value: ethers.utils.parseEther('1000') });
    await bankContract.connect(user).deposit({ value: ethers.utils.parseEther('500') });

    const AttackerFactory = await ethers.getContractFactory('Attacker', attacker);
    const attackerContract = await AttackerFactory.deploy(bankContract.address);

    return { deployer, user, attacker, bankContract, attackerContract };
  }

  describe('Test deposit and withdraw of Bank contract', function () {
    it('Should accept deposits', async function () {
      const { deployer, user, bankContract } = await loadFixture(deployContractsFixture);
      const deployerBalance = await bankContract.balanceOf(deployer.address);
      expect(deployerBalance).to.eq(ethers.utils.parseEther('1000'));

      const userBalance = await bankContract.balanceOf(user.address);
      expect(userBalance).to.eq(ethers.utils.parseEther('500'));
    });

    it('Should accept withdrawals', async function () {
      const { deployer, user, bankContract } = await loadFixture(deployContractsFixture);
      await bankContract.withdraw();

      const deployerBalance = await bankContract.balanceOf(deployer.address);
      const userBalance = await bankContract.balanceOf(user.address);

      expect(deployerBalance).to.eq(0);
      expect(userBalance).to.eq(ethers.utils.parseEther('500'));
    });

    it('Perform Attack', async function () {
      const { attacker, bankContract, attackerContract } = await loadFixture(
        deployContractsFixture
      );
      console.log('');
      console.log('*** Before ***');
      console.log(
        `Bank's balance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(bankContract.address))
          .toString()}`
      );
      console.log(
        `Attacker's balance: ${Number(
          ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))
        ).toFixed(2)}`
      );

      await attackerContract.attack({ value: ethers.utils.parseEther('50') });

      console.log('');
      console.log('*** After ***');
      console.log(
        `Bank's balance: ${ethers.utils
          .formatEther(await ethers.provider.getBalance(bankContract.address))
          .toString()}`
      );
      console.log(
        `Attackers's balance: ${Number(
          ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))
        ).toFixed(2)}`
      );
      console.log('');

      expect(await ethers.provider.getBalance(bankContract.address)).to.eq(0);
    });
  });
});
