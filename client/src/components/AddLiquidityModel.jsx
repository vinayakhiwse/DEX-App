import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { BsArrowLeft } from "react-icons/bs";
import { useAccount } from "wagmi";
import TokenModel from "./TokenModel";
import {
  AddLiquidityAmount,
  CreateLiquidityPool,
  TokenAAllowances,
  TokenBAllowances,
} from "../utils/pool";

function AddLiquidityModel({
  SetOpenModel,
  openModel,
}) {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const { address } = useAccount();
  const [srcToken, setSrcToken] = useState("Eth");
  const [destToken, setDestToken] = useState("Select a token");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const handleModal1 = () => {
    setModal1(true);
  };

  const handleModal = () => {
    setModal(true);
  };

  const handleSubmit = async () => {
    console.log("called");
    try {
      // const created = await CreateLiquidityPool(
      //   srcToken,
      //   destToken,
      //   "0x56C8f91DC165118ce7614b848BE416c610cE4d96",
      //   "0x1dcA2bb244A61815ECa60E49f93DB87A7D976cb2"
      // );
      // console.log("created liquidity pool", created);
      // console.log("form data", inputValue, outputValue);
      // if (created) {
      const tokenApprove = await TokenAAllowances(inputValue);
      const tokenBApprove = await TokenBAllowances(outputValue);
      if (tokenApprove && tokenBApprove) {
        const addLiquidityAmount = await AddLiquidityAmount(
          inputValue,
          outputValue,
          "0x56C8f91DC165118ce7614b848BE416c610cE4d96",
          "0x1dcA2bb244A61815ECa60E49f93DB87A7D976cb2"
        );
        console.log("liquidity provider res..", addLiquidityAmount);
        if (addLiquidityAmount) {
          SetOpenModel(false);
        }
      }
      // }
    } catch (error) {
      console.log("error in liquidity form submission", error);
    }
  };

  return (
    <>
      <div className="fixed left-0 top-0 w-full h-screen flex items-center justify-center bg-white bg-opacity-20 z-20">
        <div
          className="bg-white p-6 text-white dark:bg-gray-900 rounded-2xl shadow-lg w-[30%]"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        >
          <div className="flex gap-[30%] items-center py-1">
            <BsArrowLeft
              className="text-3xl cursor-pointer ml-1"
              onClick={() => SetOpenModel(!openModel)}
            />
            <p className="text-center text-xl"> Add Liquidity</p>
          </div>

          <div className="border-t mt-5 border-gray-800">
            <p className="mt-6 text-lg">Select Pair</p>
            <div className="w-full flex gap-2 mt-3">
              <button
                onClick={handleModal1}
                className="w-1/2 flex justify-between items-center text-white  bg-white dark:bg-gray-800 font-medium rounded-3xl text-lg px-4 py-2 text-center mr-3 md:mr-0"
              >
                {srcToken === destToken ? "Eth" : srcToken}
                <IoIosArrowDown />
              </button>{" "}
              <button
                onClick={handleModal}
                className="w-1/2 bg-[#FF3FA4] flex justify-between items-center text-white dark:bg-[#FF3FA4] font-medium rounded-3xl text-lg px-4 py-2 text-center mr-3 md:mr-0"
              >
                {destToken === srcToken ? "Select a token" : destToken}{" "}
                <IoIosArrowDown />
              </button>
            </div>

            <div className="w-full relative flex flex-col gap-4 justify-center mt-8 px-2 pb-5 rounded-3xl">
              <p className="text-lg text-white mt-4">Deposit Amounts</p>

              <div className="relative w-full mt-1">
                <input
                  value={inputValue}
                  placeholder={"0.0"}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  type="text"
                  className="w-full border-none text-white bg-white dark:bg-gray-800 text-3xl border-2 border-grey-500 py-8 px-4 rounded-2xl focus:outline-none"
                />

                <button className="flex justify-center items-center gap-1 absolute text-white top-[30%] right-6  bg-white dark:bg-gray-700 font-medium rounded-xl text-lg px-2 py-1 text-center mr-3 md:mr-0">
                  {srcToken}
                  <IoIosArrowDown />
                </button>
              </div>

              <div className="relative">
                <input
                  value={outputValue}
                  placeholder={"0.0"}
                  onChange={(e) => {
                    setOutputValue(e.target.value);
                  }}
                  type="text"
                  className="w-full border-none text-white bg-white dark:bg-gray-800 text-3xl border-2 border-grey-500 py-8 px-4 rounded-2xl focus:outline-none"
                />

                <button className="flex bg-[#FF3FA4] justify-center items-center gap-1 absolute text-white top-[28%] right-4 dark:bg-[#FF3FA4] font-medium rounded-3xl text-lg px-4 py-2 text-center mr-3 md:mr-0">
                  {destToken}
                  <IoIosArrowDown />
                </button>
              </div>
              <button
                type="button"
                disabled={!address}
                onClick={handleSubmit}
                className="text-white mt-2 bg-[#FF3FA4] !important hover:bg-[#FF3FA4] focus:ring-4 focus:outline-none focus:ring-[#FF3FA4] font-medium rounded-lg text-xl px-2 py-3 text-center mr-3 md:mr-0 dark:hover:bg-[#FF3FA4] dark:focus:ring-[#FF3FA4]"
              >
                Add Liquidity
              </button>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <TokenModel
          setModal={setModal}
          setDestToken={setDestToken}
          setSrcToken={setSrcToken}
          modal={modal}
        />
      )}
      {modal1 && (
        <TokenModel
          setModal={setModal1}
          setDestToken={setDestToken}
          setSrcToken={setSrcToken}
          modal={modal}
        />
      )}
    </>
  );
}

export default AddLiquidityModel;
