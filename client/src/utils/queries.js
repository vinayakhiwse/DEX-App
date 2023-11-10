import { contract, tokenContract } from "./contract";
import { toEth, toWei } from "./ether-utils";
import { BigNumber } from "ethers";

//here we swapping the Ether into Token.
export const swapEthToToken = async (tokenName, amount) => {
  try {
    const tx = { value: toWei(amount) };
    const contractObj = await contract();
    const data = await contractObj.swapEthtoToken(tokenName, tx);
    const receipt = await data.wait();
    return receipt;
  } catch (error) {
    console.log("error", error);
  }
};

//here we swapping the token into ether.
export const SwapTokenToEth = async (tokenName, amount) => {
  try {
    const contractObj = await contract();
    const data = await contractObj.swapTokentoEth(tokenName, toWei(amount));
    const receipt = await data.wait();
    return receipt;
  } catch (error) {
    console.log("error", error);
  }
};

//we need to approve tokens approve to be transferred from our account to the contract.
export const increaseAllowances = async (tokenName, amount) => {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    const tokenContractObj = await tokenContract(address);
    const data = await tokenContractObj.approve(
      `0x8dA78e6D47870911bE47A711d24c7946d055b8Cc`,
      toWei(amount)
    );
    const receipt = await data.wait();
    return receipt;
  } catch (error) {
    console.log("error", error);
  }
};

//here we checking valid allowances..
export const hasValidAllowance = async (owner, tokenName, amount) => {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    const tokenContractObj = await tokenContract(address);
    const data = await tokenContractObj.allowance(
      owner,
      `0x8dA78e6D47870911bE47A711d24c7946d055b8Cc`
    );

    const result = BigNumber.from(data.toString()).gte(
      BigNumber.from(toWei(amount))
    );

    return result;
  } catch (error) {
    console.log("error", error);
  }
};

//here we swapping the token to token.
export async function swapTokenToToken(srcToken, destToken, amount) {
  try {
    const contractObj = await contract();
    const data = await contractObj.swapTokenToToken(
      srcToken,
      destToken,
      toWei(amount)
    );

    const receipt = await data.wait();
    return receipt;
  } catch (error) {
    console.log("error", error);
  }
}

//here we getting token balance by using address of token and tokenName.
export const getTokenBalance = async (tokenName, address) => {
  const contractObj = await contract();
  const balance = contractObj.getBalance(tokenName, address);
  return balance;
};

//here we getting token address by using tokenName.
export async function getTokenAddress(tokenName) {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    return address;
  } catch (e) {
    return e;
  }
}

//here we getting the balance of smart contract here...

export async function getEthBalnce() {
  try {
    const contractObj = await contract();
    const balance = await contractObj.getEthBalance();
    const newBalance = toEth(balance.toString());
    return newBalance;
  } catch (error) {
    console.log(error);
  }
}
