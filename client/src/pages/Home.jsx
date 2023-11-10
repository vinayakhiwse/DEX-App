import React, { useEffect, useState } from "react";
import {
  BsFillArrowDownSquareFill,
  BsFillArrowUpSquareFill,
} from "react-icons/bs";
import { FcSettings } from "react-icons/fc";
import Modal from "../components/Modal";
import { IoIosArrowDown } from "react-icons/io";
import { useAccount } from "wagmi";
import {
  SwapTokenToEth,
  hasValidAllowance,
  increaseAllowances,
  swapEthToToken,
  swapTokenToToken,
} from "../utils/queries";
import { Toast } from "../toast/toast";
import TransactionStatus from "../toast/TransactionStatus";
import TokenBalance from "../components/TokenBalance";

export default function Home() {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const { address } = useAccount();
  const [srcToken, setSrcToken] = useState("Eth");
  const [destToken, setDestToken] = useState("Select a token");
  const [txPending, setTxPending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [swapBtnText, setSwapBtnText] = useState("ENTER_AMOUNT");
  const [tokenBalComp, setTokenBalComp] = useState();
  const [reverse, setReverse] = useState(false);

  const handleModal = () => {
    setModal(true);
  };
  const handleModal1 = () => {
    setModal1(true);
  };

  useEffect(() => {
    // Handling the text of the submit button
    if (!address) setSwapBtnText("CONNECT_WALLET");
    else if (!inputValue) setSwapBtnText("ENTER_AMOUNT");
    else setSwapBtnText("SWAP");
  }, [inputValue, outputValue, address]);

  async function performSwap() {
    setTxPending(true);
    let receipt;
    if (srcToken === "Eth" && destToken !== "Eth") {
      receipt = await swapEthToToken(destToken, inputValue);
    } else if (srcToken !== "Eth" && destToken === "Eth") {
      receipt = await SwapTokenToEth(srcToken, inputValue);
    } else {
      receipt = await swapTokenToToken(srcToken, destToken, inputValue);
    }
    setTxPending(false);
    if (receipt && !receipt.hasOwnProperty("transactionHash")) {
      Toast.error(receipt);
      return;
    } else {
      Toast.success("Transaction completed.");
      setInputValue("");
      setOutputValue("");
    }
  }

  async function handleSwap() {
    if (srcToken === "Eth" && destToken !== "Eth") {
      performSwap();
    } else {
      // Check whether there is allowance when the swap deals with tokenToEth/tokenToToken
      setTxPending(true);
      const result = await hasValidAllowance(address, srcToken, inputValue);
      setTxPending(false);
      if (result) {
        performSwap();
      } else {
        handleInsufficientAllowance();
      }
    }
  }

  async function handleIncreaseAllowance() {
    // Increase the allowance
    setTxPending(true);
    await increaseAllowances(srcToken, inputValue);
    setTxPending(false);
    Toast.success("Approve Allowance.");
    setSwapBtnText("SWAP");
  }

  function handleInsufficientAllowance() {
    setSwapBtnText("INCREASE_ALLOWANCE");
    Toast.error("Insufficient Allowance.");
    return;
  }

  useEffect(() => {
    setTokenBalComp(
      <>
        <TokenBalance name={"CoinA"} walletAddress={address} />
        <TokenBalance name={"CoinB"} walletAddress={address} />
        <TokenBalance name={"CoinC"} walletAddress={address} />
      </>
    );

    if (!address) {
      Toast.warning("Please Connect Wallet.");
      return;
    }
  }, [address]);

  const handleChangeSwap = () => {
    setReverse(!reverse);
    setInputValue(outputValue);
    setOutputValue(inputValue);
    setSrcToken(destToken);
    setDestToken(srcToken);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-700">
        <div className="w-[50%] pt-8 m-auto bg-white dark:bg-gray-700">
          <div className="flex flex-wrap items-center justify-around">
            {tokenBalComp}
          </div>
        </div>
        <div className="flex justify-center items-center bg-white dark:bg-gray-700 pb-32">
          <div
            className="bg-white dark:bg-gray-800 relative flex flex-col gap-2 justify-center w-[25%] mt-32 px-4 pt-16 pb-10 rounded-3xl"
            style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
          >
            <div className="absolute w-11/12 flex justify-between items-center top-3 px-2">
              <p className="text-2xl text-white">Swap</p>
              <FcSettings className="text-3xl" />
            </div>
            <div className="relative w-full">
              <input
                value={inputValue}
                placeholder={"0.0"}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                type="text"
                className="w-full border-none text-white bg-white dark:bg-gray-700 text-3xl border-2 border-grey-500 py-8 px-4 rounded-2xl focus:outline-none"
              />
              <p className="absolute top-2 left-3 text-white text-sm">
                You pay
              </p>

              {reverse ? (
                <BsFillArrowUpSquareFill
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  onClick={handleChangeSwap}
                  className="absolute z-10 dark:text-gray-400 rounded-lg cursor-pointer top-[88%] left-[45%] text-4xl"
                />
              ) : (
                <BsFillArrowDownSquareFill
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                  onClick={handleChangeSwap}
                  className="absolute z-10 dark:text-gray-400 rounded-lg cursor-pointer top-[88%] left-[45%] text-4xl"
                />
              )}

              <button
                onClick={handleModal1}
                className="flex justify-center items-center gap-1 absolute text-white top-[30%] right-6  bg-white dark:bg-gray-800 font-medium rounded-xl text-lg px-2 py-1 text-center mr-3 md:mr-0"
              >
                {srcToken === destToken ? "Eth" : srcToken} <IoIosArrowDown />
              </button>
            </div>

            <div className="relative">
              <input
                value={
                  destToken !== "Select a token" && srcToken === "Eth"
                    ? inputValue * 10000
                    : destToken === "Eth" && srcToken !== "Eth"
                    ? inputValue / 10000
                    : destToken === "CoinB" && srcToken !== "Eth"
                    ? inputValue * 2
                    : destToken !== "Eth" && srcToken === "CoinB"
                    ? inputValue / 2
                    : inputValue
                }
                placeholder={"0.0"}
                onChange={(e) => {
                  setOutputValue(e.target.value);
                }}
                type="text"
                className="w-full border-none text-white bg-white dark:bg-gray-700 text-3xl border-2 border-grey-500 py-8 px-4 rounded-2xl focus:outline-none"
              />
              <p className="absolute top-2 left-3 text-white text-sm">
                You receive
              </p>
              <button
                onClick={handleModal}
                className="flex justify-center items-center gap-1 absolute text-white top-[25%] right-4  bg-white dark:bg-gray-800 font-medium rounded-3xl text-lg px-4 py-2 text-center mr-3 md:mr-0"
              >
                {destToken === srcToken ? "Select a token" : destToken}{" "}
                <IoIosArrowDown />
              </button>
            </div>
            {destToken !== "Select a token" && inputValue && (
              <div className="flex items-center w-full border-none text-white bg-white dark:bg-gray-700 text-3xl border-2 border-grey-500 py-2 px-4 rounded-2xl focus:outline-none">
                <p className="text-sm">
                  {destToken !== "Select a token" && srcToken === "Eth"
                    ? `1 Eth = 10,000 (${inputValue * 10000}) ${destToken}`
                    : destToken === "Eth" && srcToken !== "Eth"
                    ? `1000 ${srcToken}  = 0.1 Eth (${inputValue / 10000})`
                    : destToken === "CoinB" && srcToken !== "Eth"
                    ? `10 ${srcToken} = 20 CoinB (${
                        inputValue * 2
                      } ${srcToken})`
                    : destToken !== "Eth" && srcToken === "CoinB"
                    ? `10 CoinB = 5 ${destToken} (${
                        inputValue / 2
                      } ${destToken})`
                    : `10 ${srcToken} = 10 ${destToken}`}
                </p>
                <IoIosArrowDown className="ml-auto text-sm" />
              </div>
            )}
            <button
              type="button"
              style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              disabled={!address}
              onClick={() => {
                if (swapBtnText === "INCREASE_ALLOWANCE")
                  handleIncreaseAllowance();
                else if (swapBtnText === "SWAP") handleSwap();
              }}
              className="text-white bg-[#2172e5] !important hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xl px-4 py-3 text-center mr-3 md:mr-0 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {swapBtnText}
            </button>
          </div>
        </div>

        {txPending && <TransactionStatus />}

        {modal && (
          <Modal
            setModal={setModal}
            setDestToken={setDestToken}
            setSrcToken={setSrcToken}
            modal={modal}
          />
        )}
        {modal1 && (
          <Modal
            setModal={setModal1}
            setSrcToken={setSrcToken}
            setDestToken={setDestToken}
            modal={modal}
          />
        )}
      </div>
    </>
  );
}
