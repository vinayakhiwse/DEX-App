import { contract } from "./contract";
import { toEth, toWei } from "./ether-utils";

export const TransactionRecord = async () => {
  try {
    const TransactionObj = await contract();
    const count = await TransactionObj.transactionCount();
    const newCount = Number(toWei(count.toString())) / 1000000000000000000;
    let transactionArray = [];
    for (let i = 0; i < newCount; i++) {
      const data = await TransactionObj.transaction(i);
      const newDate = formatTimestamp(data.timestamp);
      const newAmount = toEth(data.Amount);
      transactionArray.push({ ...data, timestamp: newDate, Amount: newAmount });
    }
    return transactionArray;
  } catch (error) {
    console.log(error);
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  return date.toLocaleString(); // Use toLocaleString for a localized date and time format
};
