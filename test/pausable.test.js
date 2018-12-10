"use strict";
var WalletCoordinator = artifacts.require("WalletCoordinator");

contract("Pausable", function(accounts) {
  let contract;

  let deployerAccount = accounts[0];
  let ownerAccount = accounts[1];

  describe("Pause and unpause contract", async function() {
    before("initializes contract", async function() {
      contract = await WalletCoordinator.new({
        from: deployerAccount,
        gas: 4500000
      });

      await contract.transferOwnership(ownerAccount, {
        from: deployerAccount,
        gas: 4500000
      });
    });

    it("should not pause contract when sender is not owner", async function() {
      try {
        await contract.pause({
          from: deployerAccount,
          gas: 4500000
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });

    it("should pause contract", async function() {
      await contract.pause({
        from: ownerAccount,
        gas: 4500000
      });
    });

    it("should not pause contract when contract already paused", async function() {
      try {
        await contract.pause({
          from: ownerAccount,
          gas: 4500000
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });

    it("should not unpause contract when sender is not owner", async function() {
      try {
        await contract.unpause({
          from: deployerAccount,
          gas: 4500000
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });

    it("should unpause contract", async function() {
      await contract.unpause({
        from: ownerAccount,
        gas: 4500000
      });
    });

    it("should not unpause contract when contract already unpaused", async function() {
      try {
        await contract.unpause({
          from: ownerAccount,
          gas: 4500000
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });
  });
});
