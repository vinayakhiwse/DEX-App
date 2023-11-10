import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { getTokenAddress, getTokenBalance } from "../utils/queries";
import {
  ClipboardIcon,
  ClipboardCheckIcon,
} from "@heroicons/react/outline";
export default function TokenBalance({ name, walletAddress }) {
  const [balance, setBalance] = useState("-");
  const [tokenAddress, setTokenAddress] = useState();

  const [copyIcon, setCopyIcon] = useState({ icon: ClipboardIcon });

  const [txPending, setTxPending] = useState(false);

  useEffect(() => {
    if (name && walletAddress) {
      fetchTokenBalance();
      fetchTokenAddress();
    } else setBalance("-");
  }, [name, walletAddress]);

  async function fetchTokenBalance() {
    const bal = await getTokenBalance(name, walletAddress);

    const fBal = ethers.utils.formatUnits(bal.toString(), 18);
    setBalance(fBal.toString());
  }

  async function fetchTokenAddress() {
    const address = await getTokenAddress(name);
    setTokenAddress(address);
  }
  return (
    <div className="flex mx-2">
      <div className="flex items-center bg-zinc-900 text-zinc-300 w-fit p-2 px-3 rounded-l-lg">
        <p className="text-sm">{name}</p>
        <p className="bg-zinc-800 p-0.5 px-3 ml-3 rounded-lg text-zinc-100">
          {balance}
        </p>
      </div>

      <div className="flex items-center p-2 px-2 bg-[#2172e5] rounded-r-lg">
        <copyIcon.icon
          className="h-6 cursor-pointer text-white"
          onClick={() => {
            navigator.clipboard.writeText(tokenAddress);
            setCopyIcon({ icon: ClipboardCheckIcon });
          }}
        />
      </div>
    </div>
  );
}
