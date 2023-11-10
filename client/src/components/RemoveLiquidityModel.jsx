import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

function RemoveLiquidityModel({ isOpen, setIsOpen, handleRemoveLiquidity }) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("input", amount);
    handleRemoveLiquidity(amount);
  };

  return (
    <>
      <div className="w-full h-screen fixed top-0 left-0 flex justify-center items-center bg-white bg-opacity-20 z-30">
        <div
          className="w-[24%] bg-white p-6 text-white dark:bg-gray-900 rounded-2xl shadow-lg"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        >
          <form className="space-y-5 p-4" action="#" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Liquidity Amount
              </label>
              <input
                type="text"
                name="amount"
                id="email"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Liquidity Amount"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Address
              </label>
              <input
                type="text"
                name="password"
                id="password"
                value={address}
                placeholder="••••••••"
                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                readOnly
              />
            </div>
            <div className="flex justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                    required
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Liquidity Remove Confirmation
                </label>
              </div>
              <Link
                to="/pool"
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm text-blue-700 hover:underline dark:text-blue-500"
              >
                Add Liquidity?
              </Link>
            </div>
            <div>
              <button
                type="submit"
                className="w-full text-white bg-[#FF3FA4] hover:bg-[#FF3FA4] focus:ring-4 focus:outline-none focus:ring-[#FF3FA4] font-medium rounded-lg text-md px-5 py-3 text-center dark:bg-[#FF3FA4] dark:hover:bg-[#FF3FA4] dark:focus:ring-[#FF3FA4]"
              >
                Remove Liquidity from your account
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Cancel Liquidity
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RemoveLiquidityModel;
