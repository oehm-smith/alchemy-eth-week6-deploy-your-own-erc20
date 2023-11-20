require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY1, process.env.GOERLI_PRIVATE_KEY2], // TODO: fill the private key
    },
  },
};
