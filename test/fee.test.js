"use strict";
const BigNumber = require("bignumber.js");
const DECIMALSFACTOR = new BigNumber("10").pow("8");
var Fee = artifacts.require("Fee");

contract("Fee", function(accounts) {
  let contract;
  let baseFee = new BigNumber("10").multipliedBy(DECIMALSFACTOR);
  let deployerAccount = accounts[0];

  describe("Get fee amount", async function() {
    before("initializes contract", async function() {
      contract = await Fee.new({
        from: deployerAccount,
        gas: 4500000
      });
    });

    it("should return double base fee", async function() {
      var result = await contract.getFee(baseFee.toNumber(), 100);
      var expectedResult = baseFee.multipliedBy(2).toNumber();
      assert.equal(expectedResult, result.toNumber());

      expectedResult = baseFee.multipliedBy(4).toNumber();
      result = await contract.getFee(baseFee.multipliedBy(2).toNumber(), 2000);
      assert.equal(expectedResult, result.toNumber());
    });
  });
});
