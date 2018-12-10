"use strict";
var WalletCoordinator = artifacts.require("WalletCoordinator");

contract("Ownable", function(accounts) {
  let contract;

  let deployerAccount = accounts[0];
  let adminAccount = accounts[3];
  let ownerAccount = accounts[1];

  describe("Transfer contract ownership and administration", async function() {
    before("initializes WalletCoordinator contract", async function() {
      contract = await WalletCoordinator.new({
        from: deployerAccount,
        gas: 4500000
      });
    });

    it("should not transfer ownership", async function() {
      try {
        await contract.transferOwenership(ownerAccount, {
          from: ownerAccount,
          gas: 4500000
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });

    it("should transfer ownership", async function() {
      await contract.transferOwnership(ownerAccount, {
        from: deployerAccount,
        gas: 4500000
      });

      var newOwner = await contract.owner();
      assert.equal(ownerAccount, newOwner);
    });

    it("should not transfer administration", async function() {
      try {
        await contract.transferAdministration(adminAccount, {
          from: deployerAccount,
          gas: 4500000
        });
      } catch (error) {
        assert(true, `Expected throw, but got ${error} instead`);
        return;
      }

      assert(false, "Did not throw as expected");
    });

    it("should transfer administration", async function() {
      await contract.transferAdministration(adminAccount, {
        from: ownerAccount,
        gas: 4500000
      });

      var newAdmin = await contract.admin();
      assert.equal(adminAccount, newAdmin);
    });
  });

  describe("Address Checkers", async function() {
    before(
      "initializes WalletCoordinator contract and set admin",
      async function() {
        contract = await WalletCoordinator.new({
          from: deployerAccount,
          gas: 4500000
        });

        await contract.transferOwnership(ownerAccount, {
          from: deployerAccount,
          gas: 4500000
        });

        await contract.transferAdministration(adminAccount, {
          from: ownerAccount,
          gas: 4500000
        });
      }
    );

    it("should get owner address", async function() {
      let result = await contract.isOwner({ from: ownerAccount });
      assert(result);
      result = await contract.isOwner({ from: adminAccount });
      assert.isFalse(result);
    });

    it("should get admin addres", async function() {
      let result = await contract.isAdmin({ from: adminAccount });
      assert(result);
      result = await contract.isAdmin({ from: ownerAccount });
      assert.isFalse(result);
    });
  });
});
