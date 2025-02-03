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


// Hello
// DAO Contract address: 0x983dcC44cCF7eC35537d7097E791cCC52cbfc9a0
// Voter Contract address: 0xe293aC44eb68699588b8f88C5475952E17E72A77
// Proposal Contract address: 0x982C539A4e02594848F734eC62Bbd88DAeba0f43
// Setting the Token Accounts
// Setting successfull 😊😊😊


/**Hello currently using 
DAO Contract address: 0x2bf1645B5d681BFcCf3A43577264858Ed4394Fdd
Voter Contract address: 0x39EBed3C3B4029BC52D2A4c5eE13c15B22D1f421
Proposal Contract address: 0xdD11cA8d322646B0A70B679bb18F4af6Fdf6dD7b
Setting the Token Accounts
Setting successfull 😊😊😊 */




//0x8FFAcd29448979f4E1530726e5F4a01aAD8618E9