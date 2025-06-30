require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    lineaSepolia: {
      url: "https://rpc.sepolia.linea.build",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
