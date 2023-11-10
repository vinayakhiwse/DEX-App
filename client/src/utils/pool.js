import { poolcontract, tokenBContract, tokenPoolContract } from "./contract";
import { tokenAContract } from "./contract";
import { toWei } from "./ether-utils";

export const CreateLiquidityPool = async (
  name,
  symbol,
  tokenAddressA,
  tokenAddressB
) => {
  try {
    const contractPoolObj = await poolcontract();
    const data = await contractPoolObj.createLiquidityPool(
      name,
      symbol,
      tokenAddressA,
      tokenAddressB
    );
    const receipt = await data.wait();
    return receipt;
  } catch (error) {
    console.log("error in createliquidityPool..", error);
  }
};

export const AddLiquidityAmount = async (
  amountTokenA,
  amountTokenB,
  tokenA,
  tokenB
) => {
  try {
    const contractPoolObj = await poolcontract();
    const tokenContractObj = await contractPoolObj.addLiquidity(
      amountTokenA,
      amountTokenB,
      tokenA,
      tokenB,
      { gasLimit: 600000 }
    );
    console.log("input contract data", tokenContractObj);
    const tokenContractData = await tokenContractObj.wait();
    console.log("liquidity provider Amount added..", tokenContractData);
    return tokenContractData;
  } catch (error) {
    console.log("error in Adding liquidity provider amount..", error);
  }
};

//we need to approve tokens approve to be transferred from our account to the contract.
export const TokenAAllowances = async (amount) => {
  try {
    const contractObj = await poolcontract();
    const address = await contractObj.addressTokenA();
    console.log("TokenAAllowances..", address);
    const tokenContractObj = await tokenPoolContract(address);
    const data = await tokenContractObj.approve(
      `0x51990114D7C44540706326A4BFa5D4C6cf67Ea5d`,
      toWei(amount)
    );
    const receipt = await data.wait();
    console.log("TokenAAllowances", receipt);
    return receipt;
  } catch (error) {
    console.log("error", error);
  }
};

export const TokenBAllowances = async (amount) => {
  try {
    const contractObj = await poolcontract();
    const address = await contractObj.addressTokenB();
    console.log("TokenBAllowances..", address);
    const tokenContractObj = await tokenPoolContract(address);
    const data = await tokenContractObj.approve(
      `0x51990114D7C44540706326A4BFa5D4C6cf67Ea5d`,
      toWei(amount)
    );
    const receipt = await data.wait();
    console.log("TokenBAllowances", receipt);
    return receipt;
  } catch (error) {
    console.log("error", error);
  }
};

//here we getting the reserve token.
export const ReserveTokenA = async () => {
  try {
    const contractPoolObj = await poolcontract();
    const reserveTokenA = await contractPoolObj.reserveTokenA();

    console.log("liquidity provider Amount added..", reserveTokenA);
    return Number(reserveTokenA);
  } catch (error) {
    console.log("error in getting the reserve tokenA..", error);
  }
};

//here we getting the reserve token.
export const ReserveTokenB = async () => {
  try {
    const contractPoolObj = await poolcontract();
    const reserveTokenB = await contractPoolObj.reserveTokenB();

    console.log("liquidity provider Amount added..", reserveTokenB);
    return Number(reserveTokenB);
  } catch (error) {
    console.log("error in getting the reserve tokenA..", error);
  }
};

export const TokenAName = async (address) => {
  try {
    const tokenObj = await tokenPoolContract(address);
    const tokenAName = await tokenObj.name();
    console.log("liquidity getting the reserve tokenA name..", tokenAName);
    return tokenAName;
  } catch (error) {
    console.log("error in getting the reserve tokenA name..", error);
  }
};

export const TokenBName = async (address) => {
  try {
    const tokenObj = await tokenPoolContract(address);
    const tokenBName = await tokenObj.name();
    console.log("liquidity getting the reserve tokenB name..", tokenBName);
    return tokenBName;
  } catch (error) {
    console.log("error in getting the reserve tokenA name..", error);
  }
};

//here we adding the remove liquidity function..
export const RemoveLiquidity = async (amount) => {
  try {
    const contractPoolObj = await poolcontract();
    const tokenContractObj = await contractPoolObj.removeLiquidity(amount);
    console.log("input contract data", tokenContractObj);
    const tokenContractData = await tokenContractObj.wait();
    console.log("liquidity provider Amount added..", tokenContractData);
    return tokenContractData;
  } catch (error) {
    console.log("error in removing the liquidity shares..", error);
  }
};
