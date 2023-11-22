require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const { GOERLI_API_KEY }= process.env;
// @type import('hardhat/config').HardhatUserConfig
module.exports = {
    solidity: "0.8.20",
    networks: {
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [process.env.GOERLI_PRIVATE_KEY1, process.env.GOERLI_PRIVATE_KEY2], // TODO: fill the private key
            gas: 30000000,
            // It worked with only 420000000 gasPrice (0.42 gwei) but lucky as current price is 42gwei!
            gasPrice: 420000000
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    }
};
