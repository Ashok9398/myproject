
const hre = require("hardhat");

async function main() {
  

  const Charity = await hre.ethers.getContractFactory("Charity");
  const charity = await Charity.deploy();

  await charity.deployed();

 
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
