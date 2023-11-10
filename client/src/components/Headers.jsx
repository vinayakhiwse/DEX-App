import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";
import TokenBalance from "./TokenBalance";
import { ethers } from "ethers";
import { Toast, ToastComponent } from "../toast/toast";

export default function Headers() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("");
  const {
    activeChain,
    chains,
    error,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  useEffect(() => {
    if (isConnected) {
      const network = "sepolia";
      const provider = ethers.getDefaultProvider(network);
      provider.getBalance(address).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance);
        setBalance(balanceInEth);
      });
    }
  }, [address, isConnected]);

  return (
    <>
      <nav className="bg-white border-b-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to={"/"} className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png"
              className="h-12 mr-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Swap
            </span>
          </Link>
          <div className="flex md:order-2">
            <button
              type="button"
              onClick={() => (address ? open({ view: "Account" }) : open())}
              className="text-white bg-[#2172e5] !important hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isConnected
                ? address.slice(0, 4) + "...." + address.slice(38)
                : "Connect"}
            </button>
            {balance && (
              <button
                type="button"
                className="text-white ml-2 bg-[#2172e5] !important hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {Number(balance).toFixed(4)}ETH
              </button>
            )}
            {/* network */}
            {/* {chains.map((x) => (
              <button
                className="text-white ml-3 bg-[#c94820] !important hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-md px-5 py-2 text-center mr-3 md:mr-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                disabled={!switchNetwork || x.id === activeChain?.id}
                key={x.id}
                onClick={() => switchNetwork?.(x.id)}
              >
                {x.name}
                {isLoading && pendingChainId === x.id && " (switching)"}
              </button>
            ))} */}

            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-cta"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to="/"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tokens"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Tokens
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  NFTs
                </Link>
              </li>
              <li>
                <Link
                  to="/pool"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Pool
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <ToastComponent />
    </>
  );
}
