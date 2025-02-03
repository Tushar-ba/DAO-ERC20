require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
          evmVersion: "london"
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.API_KEY
  }
};
sourcify: {
  enabled: true
}

// DAO Contract address: 0x23D4e264eB314B19f310FC2e9bdFDa10de68F43a
// Voter Contract address: 0x2891Da924653BEdd078D867AD7067491E5FE71d1
// Proposal Contract address: 0xf468e3E33bb691BBFD5821732cF022350940B342
// Setting the Token Accounts
// Setting successfull 😊😊😊



//0x8FFAcd29448979f4E1530726e5F4a01aAD8618E9