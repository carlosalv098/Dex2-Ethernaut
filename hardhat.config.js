require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const RINKEBY_API_KEY = process.env.RINKEBY_API_KEY;
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_API_KEY,
      accounts: {
        mnemonic: MNEMONIC
      }, 
      saveDeployments: true
    }
  },
  solidity: {
    version: '0.8.0'
  }
};
