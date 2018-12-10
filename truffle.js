var PrivateKeyProvider = require("truffle-privatekey-provider");
var privateKey = "private-key";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new PrivateKeyProvider(privateKey, "infura-api-link"),
      port: 8545,
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },
    live: {
      provider: new PrivateKeyProvider(privateKey, "infura-api-link"),
      network_id: 1,
      gas: 7500000 // Gas limit used for deploys
    }
  }
};
