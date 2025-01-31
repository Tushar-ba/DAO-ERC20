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

// DAO Contract address: 0xa9d663860157B2bACB6849aed2f4b71329410D10
// Voter Contract address: 0xd1D03955dCAD963078f4FDcB31185348d93f8326
// Proposal Contract address: 0x033EABe381dCD56e81C273bD9bb25f8B8913BD52
// Setting the Token Accounts
// Setting successfull 😊😊😊



//0x8FFAcd29448979f4E1530726e5F4a01aAD8618E9