// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const tokenA = await hre.ethers.getContractFactory("ERC20Token");
  const tokenAContract = await tokenA.deploy("1000000000", "USDc", "USDc");
  console.log(
    `cotract deployed at this contract tokenA address ${tokenAContract.target}`
  );

  const tokenB = await hre.ethers.getContractFactory("ERC20Token");
  const tokenBContract = await tokenB.deploy("1000000000", "USDt", "USDt");
  console.log(
    `cotract deployed at this contract tokenB address ${tokenBContract.target}`
  );

  const uniswap = await hre.ethers.getContractFactory("LiquidityPool");
  const contract = await uniswap.deploy("vh", "vh");
  console.log(`cotract deployed at this contract address ${contract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//tokenA =0xEab9AC1c3267fA08B917573408a9C21E0554c10d
//tokenB =0xbBf0C058a4947Ca7467e0855cC2aa22625e1C52d
//liquidity pool =0xA6e809a1b41dDb640609f6C265F7B83265cbA82F
