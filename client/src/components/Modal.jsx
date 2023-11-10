import React, { useEffect, useState } from "react";
import { coins } from "../utils/supportedCoins";
function Modal({ setModal, setDestToken, setSrcToken, modal }) {
  const [selectedCoin, setSelectedCoin] = useState("");
  const [search, setSearch] = useState("");
  const [newData, setNewData] = useState([]);

  const handleItemClick = (coin) => {
    if (modal) {
      setSelectedCoin(coin);
      setDestToken(coin);
    } else {
      setSelectedCoin(coin);
      setSrcToken(coin);
    }
  };

  useEffect(() => {
    if (search === "") {
      setNewData(coins);
    } else {
      const filteredData = coins.filter(
        (el) =>
          el.Address === search ||
          el.coin.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredData.length > 0) {
        setNewData(filteredData);
      } else {
        // If no data is found, you might want to handle it accordingly
        setNewData([]);
      }
    }
  }, [search]);

  return (
    <>
      <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
        {/* Modal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[20%]">
          {/* modal header */}
          <div className="border-b border-gray-700 px-4 py-4 text-center text-white">
            <h3 className="text-xl font-bold mb-3">Select A Token</h3>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              className="px-5 py-2 text-black text-lg rounded-3xl outline-none"
              placeholder="Enter Address Of Token"
            />
          </div>
          {/* modal body */}
          <div className="p-5">
            {/* List of items */}
            {newData.length === 0 && (
              <p className="text-lg text-white items-center">
                No results found.
              </p>
            )}
            {newData.length !== 0 &&
              newData.map((coin) => (
                <div
                  key={coin.coin}
                  onClick={() => handleItemClick(coin.coin)}
                  className={`flex items-center cursor-pointer p-1 mb-3 rounded-2xl ${
                    selectedCoin === coin.coin
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <img
                    src={coin.img}
                    className="w-12 h-12 rounded-full mr-4"
                    alt="token-logo"
                  />{" "}
                  <p className="text-lg">{coin.coin}</p>
                </div>
              ))}
          </div>
          <div className="flex justify-end items-center w-100 border-t border-gray-700 p-4">
            <button
              onClick={() => setModal(false)}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-lg text-white mr-3"
            >
              cancel
            </button>
            <button
              onClick={() => setModal(false)}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 text-lg rounded-xl text-white mr-1"
            >
              okay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
