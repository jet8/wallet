var WalletCoordinator = artifacts.require("WalletCoordinator");
var Token = artifacts.require("J8TToken");
var Fee = artifacts.require("Fee");

var environment = "PROD";

module.exports = function(deployer, network, accounts) {
  var coordinator = null;
  var fee = null;
  var adminAddress = "address";
  var custordianAddress = "address";
  var tokenAddress = "address";

  if (environment == "TEST") {
    return deployer
      .deploy(Token, { from: accounts[0], gas: 4700000 })
      .then(() => {
        return Token.deployed().then(instance => {
          token = instance;
        });
      })
      .then(() => {
        return deployer
          .deploy(WalletCoordinator, { from: accounts[0], gas: 4700000 })
          .then(() => {
            return WalletCoordinator.deployed().then(instance => {
              coordinator = instance;
            });
          })
          .then(() => {
            return deployer
              .deploy(Fee, { from: accounts[0], gas: 4700000 })
              .then(() => {
                return Fee.deployed().then(instance => {
                  fee = instance;
                });
              })
              .then(() => {
                return coordinator.pause({
                  from: accounts[0],
                  gas: 4700000
                });
              })
              .then(() => {
                return coordinator.setFeeContractAddress(fee.address, {
                  from: accounts[0],
                  gas: 4700000
                });
              })
              .then(() => {
                return coordinator.setCustodianAddress(custordianAddress, {
                  from: accounts[0],
                  gas: 4700000
                });
              })
              .then(() => {
                return coordinator.transferAdministration(adminAddress, {
                  from: accounts[0]
                });
              })
              .then(() => {
                return coordinator.unpause({
                  from: accounts[0],
                  gas: 4700000
                });
              });
          });
      });
  } else {
    return deployer
      .deploy(WalletCoordinator, { from: accounts[0], gas: 4700000 })
      .then(() => {
        return WalletCoordinator.deployed().then(instance => {
          coordinator = instance;
        });
      })
      .then(() => {
        return deployer
          .deploy(Fee, { from: accounts[0], gas: 4700000 })
          .then(() => {
            return Fee.deployed().then(instance => {
              fee = instance;
            });
          })
          .then(() => {
            return coordinator.pause({
              from: accounts[0],
              gas: 4700000
            });
          })
          .then(() => {
            return coordinator.setFeeContractAddress(fee.address, {
              from: accounts[0],
              gas: 4700000
            });
          })
          .then(() => {
            return coordinator.transferAdministration(adminAddress, {
              from: accounts[0]
            });
          })
          .then(() => {
            return coordinator.setCustodianAddress(custordianAddress, {
              from: accounts[0],
              gas: 4700000
            });
          })
          .then(() => {
            return coordinator.setTokenInterfaceAddress(tokenAddress, {
              from: accounts[0],
              gas: 4700000
            });
          })
          .then(() => {
            return coordinator.unpause({
              from: accounts[0],
              gas: 4700000
            });
          });
      });
  }
};
