const hre = require("hardhat");

async function main() {
  // USDC testnet address for Linea Sepolia (replace with actual if available)
  const usdcAddress = "0xf2Fb8F37F4FA8c3044c1Ec6D4E486EfAe0a7cbbA"; // Example: Linea Sepolia USDC

  const Contract = await hre.ethers.getContractFactory("CircleWalletManager");
  const contract = await Contract.deploy(usdcAddress);

  await contract.waitForDeployment();

  console.log("CircleWalletManager deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
