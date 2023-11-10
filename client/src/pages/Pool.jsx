import React, { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { FiInbox } from "react-icons/fi";
import { CgPlayListRemove } from "react-icons/cg";
import AddLiquidityModel from "../components/AddLiquidityModel";
import RemoveLiquidityModel from "../components/RemoveLiquidityModel";
import {
  RemoveLiquidity,
  ReserveTokenA,
  ReserveTokenB,
  TokenAName,
  TokenBName,
} from "../utils/pool";

function Pool() {
  const [openModel, SetOpenModel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reserveA, setReserveA] = useState("");
  const [reserveB, setReserveB] = useState("");
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");

  const getReserveToken = async () => {
    const tokenA = await ReserveTokenA();

    setReserveA(tokenA);
    const tokenB = await ReserveTokenB();

    setReserveB(tokenB);
  };

  const getReserveTokenName = async () => {
    const tokenAName = await TokenAName(
      "0x56C8f91DC165118ce7614b848BE416c610cE4d96"
    );
    setTokenA(tokenAName);
    const tokenBName = await TokenBName(
      "0x1dcA2bb244A61815ECa60E49f93DB87A7D976cb2"
    );
    setTokenB(tokenBName);
  };

  useEffect(() => {
    getReserveToken();
    getReserveTokenName();
  }, []);

  const handleRemoveLiquidity = async (amount) => {
    const res = await RemoveLiquidity(amount);
    console.log("removeliquidty......", res);
  };

  return (
    <>
      <div className="w-full h-full dark:bg-gray-700 py-32">
        <div className="w-1/2 m-auto">
          <div className="flex justify-between p-4 items-center">
            <p className="text-3xl text-[#ffffff]">Pools</p>{" "}
            <button
              onClick={() => SetOpenModel(!openModel)}
              className="flex items-center gap-1 bg-[#FF3FA4] px-4 py-2 text-lg hover:dark:bg-[#FF3FA4] rounded-md text-[#FFFFFF] font-medium"
            >
              <BsPlus className="text-2xl text-white" /> New Position
            </button>
          </div>
          <div className="w-[95%] h-80 m-auto mt-8 p-4  rounded-2xl border border-gray-600">
            {reserveA && reserveB && tokenA && tokenB ? (
              <>
                <div className="w-[98%] p-4 m-auto mt-5 flex justify-between text-center bg-gray-600 rounded-2xl hover:bg-gray-800 cursor-pointer">
                  <p className="text-[#ffffff] text-3xl">
                    {tokenA + "/" + tokenB}
                  </p>{" "}
                  <p className="text-[#ffffff] text-3xl">
                    {reserveA + "/" + reserveB}
                  </p>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 bg-[#FF3FA4] px-4 py-2 text-lg hover:dark:bg-[#FF3FA4] rounded-md text-[#FFFFFF] font-medium"
                  >
                    <CgPlayListRemove className="text-3xl text-white" /> Remove
                    Liquidity
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center">
                <p className="w-[40%] text-[#ffffff] grid place-items-center text-lg text-center">
                  <FiInbox className="text-5xl mb-2" />
                  Your active V3 liquidity positions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {openModel && (
        <AddLiquidityModel
          SetOpenModel={SetOpenModel}
          openModel={openModel}
          setReserveA={setReserveA}
          setReserveB={setReserveB}
        />
      )}

      {isOpen && (
        <RemoveLiquidityModel
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleRemoveLiquidity={handleRemoveLiquidity}
        />
      )}
    </>
  );
}

export default Pool;
