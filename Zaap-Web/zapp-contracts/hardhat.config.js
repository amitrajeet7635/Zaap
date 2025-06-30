require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/91e8c9454d844124bd7c5e0e6ce51fe2", 
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};