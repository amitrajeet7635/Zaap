const hre = require("hardhat");

async function main() {
  const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; 

  const Contract = await hre.ethers.getContractFactory("CircleWalletManager");
  const contract = await Contract.deploy(usdcAddress);

  await contract.waitForDeployment();

  console.log("CircleWalletManager deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
