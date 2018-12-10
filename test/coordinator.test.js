"use strict";
const BigNumber = require("bignumber.js");
const DECIMALSFACTOR = new BigNumber("10").pow("8");

var WalletCoordinator = artifacts.require("WalletCoordinator");
var J8TToken = artifacts.require("J8TToken");
var Fee = artifacts.require("Fee");

contract("Coordinator", function(accounts) {
  let contract;
  let token;
  let fee;
  let baseFee = new BigNumber("10.456");
  let baseFeeInLuckys = new BigNumber(baseFee.multipliedBy(DECIMALSFACTOR));

  let deployerAccount = accounts[0];
  let adminAccount = accounts[3];
  let accountA = accounts[1];
  let accountB = accounts[2];
  let custodian = accounts[5];
  let amount = new BigNumber("100.11335579");
  let amountInLuckys = new BigNumber(amount.multipliedBy(DECIMALSFACTOR));
  let allowance = new BigNumber("300").multipliedBy(DECIMALSFACTOR);

  describe("Approve and transfer", async function() {
    before("initializes WalletCoordinator contract", async function() {
      token = await J8TToken.new({
        from: deployerAccount,
        gas: 4500000
      });

      contract = await WalletCoordinator.new({
        from: deployerAccount,
        gas: 4500000
      });

      fee = await Fee.new({
        from: deployerAccount,
        gas: 4500000
      });

      await contract.transferAdministration(adminAccount, {
        from: deployerAccount,
        gas: 4500000
      });

      await contract.pause({ from: deployerAccount });

      await contract.setTokenInterfaceAddress(token.address, {
        from: deployerAccount,
        gas: 4500000
      });

      await contract.setFeeContractAddress(fee.address, {
        from: deployerAccount,
        gas: 4500000
      });

      await contract.setCustodianAddress(custodian, {
        from: deployerAccount,
        gas: 4500000
      });

      await contract.unpause({ from: deployerAccount });
    });

    it("should not trasfer tokens from account A to B when not approve", async function() {
      try {
        await contract.transfer(accountA, accountB, amountInLuckys.toNumber(), {
          from: adminAccount
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }
      assert(false, "Did not throw as expected");
    });

    it("should not trasfer tokens from account A to B when contract is paused", async function() {
      await contract.pause({ from: deployerAccount });

      try {
        await contract.transfer(accountA, accountB, amountInLuckys.toNumber(), {
          from: adminAccount
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });

    it("should transfer tokens from account A to B", async function() {
      await contract.unpause({ from: deployerAccount });

      await token.transfer(accountA, allowance.toNumber(), {
        from: deployerAccount
      });

      await token.approve(contract.address, allowance.toNumber(), {
        from: accountA
      });

      let allowanceApproved = await token.allowance(accountA, contract.address);
      assert.equal(
        allowance.toNumber(),
        allowanceApproved.toNumber(),
        "The amount allowed is not equal!"
      );

      let balanceA = await token.balanceOf(accountA);

      await contract.transfer(
        accountA,
        accountB,
        amountInLuckys.toNumber(),
        baseFeeInLuckys.toNumber(),
        {
          from: adminAccount
        }
      );

      let f = await contract.getFee(
        baseFeeInLuckys.toNumber(),
        amountInLuckys.toNumber()
      );
      let fee = new BigNumber(f);

      let afterBalanceA = await token.balanceOf(accountA);
      let balanceB = await token.balanceOf(accountB);
      let totalReceived = amountInLuckys.minus(fee);

      assert.equal(balanceB.toNumber(), totalReceived.toNumber());
      let result = balanceA.sub(amountInLuckys);
      assert.equal(afterBalanceA.toNumber(), result.toNumber());

      let balanceCustodian = await token.balanceOf(custodian);
      assert.equal(fee.toNumber(), balanceCustodian.toNumber());
    });

    it("should not trasfer tokens from account A to B if balance not sufficient", async function() {
      try {
        await contract.transfer(accountA, accountB, amount.toNumber(), {
          from: adminAccount
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });
  });
});
