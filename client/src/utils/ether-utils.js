import { ethers } from "ethers";

// Convert ETH to Wei.
export function toWei(amount, decimals = 18) {
  const toWei = ethers.utils.parseUnits(amount, decimals);
  return toWei.toString();
}

// Convert Wei to ETH.
export function toEth(amount, decimals = 18) {
  const toEth = ethers.utils.formatUnits(amount, decimals);
  return toEth.toString();
}
