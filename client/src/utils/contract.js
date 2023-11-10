import { ethers } from "ethers";
import CustomTokenAbi from "../abi/CustomToken.json";
import UniswapAbi from "../abi/Uniswap.json";
//here pool import..
import LiquidityPool from "../abi/LiquidityPool.json";
import tokenAbi from "../abi/ERC20Token.json";

export const tokenContract = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      address,
      CustomTokenAbi.abi,
      signer
    );
    return contractReader;
  }
};

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      `0x8dA78e6D47870911bE47A711d24c7946d055b8Cc`,
      UniswapAbi.abi,
      signer
    );
    return contractReader;
  }
};

//pool code here...
export const poolcontract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const sepoliaChainId = 11155111; // Replace with the actual chain ID for Sepolia testnet
    await ethereum.request({ method: "eth_requestAccounts" });
    if (ethereum.chainId.toString(16) !== `0x${sepoliaChainId.toString(16)}`) {
      throw new Error("Please connect to Sepolia testnet");
    }
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      `0x51990114D7C44540706326A4BFa5D4C6cf67Ea5d`,
      LiquidityPool.abi,
      signer
    );
    return contractReader;
  }
};

//here token contract instance..
export const tokenPoolContract = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(address, tokenAbi.abi, signer);
    return contractReader;
  }
};
