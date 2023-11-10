import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TransactionRecord } from "../utils/transactionRecord";
import { Loading } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { ClipboardIcon, ClipboardCheckIcon } from "@heroicons/react/outline";

export default function Token() {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copyIcon, setCopyIcon] = useState({ icon: ClipboardIcon });

  useEffect(() => {
    const fetchToken = async () => {
      if (address) {
        setLoading(true);
        const data = await TransactionRecord();
        const currentAddressData = data?.filter(
          (el) => el._receiver === address
        );
        setLoading(false);
        setState(currentAddressData);
      }
    };
    fetchToken();
  }, [address]);

  return (
    <>
      <div className="w-full dark:bg-gray-700 pt-20 pb-96">
        <p className="text-white text-4xl hover:text-gray-900 text-center cursor-pointer font-bold mb-20">
          Transaction Records
        </p>
        <table className="table-fixed border border-slate-600 w-9/12 m-auto pb-20">
          <thead className="dark:bg-gray-900">
            <tr className="border border-slate-600">
              <th className="text-[#ffffff] text-xl p-4">Receiver Address</th>
              <th className="text-[#ffffff] text-xl p-4">Received Token</th>
              <th className="text-[#ffffff] text-xl p-4">Token Amount</th>
              <th className="text-[#ffffff] text-xl p-4">Time</th>
            </tr>
          </thead>
          {!isConnected ? (
            <tbody>
              <tr className="text-white">
                <td
                  colSpan="4"
                  className="text-center text-[#ffffff] text-xl p-4"
                >
                  Please Connect Wallet....
                </td>
              </tr>
            </tbody>
          ) : loading && isConnected ? (
            <tbody className="text-white">
              <tr>
                <td colSpan="4" className="text-center p-4">
                  <div className="text-white px-4 py-4 items-center justify-center sm:px-6 sm:flex sm:flex-row-reverse">
                    <Loading>
                      <p className="text-white">
                        Fetching Transaction Please Wait....
                      </p>
                    </Loading>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : state && state.length > 0 ? (
            state?.map((el, i) => (
              <tbody
                key={i}
                className="hover:dark:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white cursor-pointer"
              >
                <tr>
                  <td className="ext-center text-[#ffffff] text-md p-4">
                    <Link
                      to={`https://sepolia.etherscan.io/address/${el._receiver}`}
                      target="_"
                    >
                      {el._receiver}
                    </Link>
                    <copyIcon.icon
                      className="h-6 cursor-pointer text-white"
                      onClick={(event) => {
                        event.stopPropagation(); // Stop the propagation to prevent the row click
                        navigator.clipboard.writeText(el._receiver);
                        setCopyIcon({ icon: ClipboardCheckIcon });
                      }}
                    />
                  </td>
                  <td className="text-center text-[#ffffff] text-md p-4">
                    {el.token}
                  </td>
                  <td className="text-center text-[#ffffff] text-md p-4">
                    {el.Amount}
                  </td>
                  <td className="text-center text-[#ffffff] text-md p-4">
                    {el.timestamp}
                  </td>
                </tr>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr className="text-white">
                <td
                  colSpan="4"
                  className="text-center text-[#ffffff] text-xl p-4"
                >
                  Transaction Records not found....
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}
