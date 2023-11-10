// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100000 * 10 ** 18); //here we setting 1000 token to address deployed msg.sender;
    }
}

contract Uniswap {
    string[] public tokens = ["CoinA", "CoinB", "CoinC"];
    mapping(string => ERC20) public tokenInstanceMap;
    uint256 ethValue = 100000000000000; //0.0001 eth value in wei.

    //here we writing transaction list event function.
    uint256 public transactionCount;
    event TransactionAdded(
        address indexed _receiver,
        string indexed token,
        uint256 Amount,
        uint256 timestamp
    );
    struct Transaction {
        address _receiver;
        string token;
        uint256 Amount;
        uint256 timestamp;
    }
    Transaction[] public transaction;

    //end here....

    constructor() {
        for (uint256 i = 0; i < tokens.length; i++) {
            CustomToken token = new CustomToken(tokens[i], tokens[i]);
            tokenInstanceMap[tokens[i]] = token;
        }
    }

    //here we getting balance of each coin....
    //here we passing of coin name and address of wallet  for checking the balance of that coin it have or not.
    function getBalance(
        string memory tokenName,
        address _address
    ) public view returns (uint256) {
        return tokenInstanceMap[tokenName].balanceOf(_address);
    }

    //here we passing the token name and getting the token name;
    function getName(
        string memory tokenName
    ) public view returns (string memory) {
        return tokenInstanceMap[tokenName].name();
    }

    function getTokenAddress(
        string memory tokenName
    ) public view returns (address) {
        return address(tokenInstanceMap[tokenName]);
    }

    //here we checking the eth balance....

    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //here we swapping eth to costom coin....
    function swapEthtoToken(
        string memory tokenName
    ) public payable returns (uint256) {
        uint256 inputValue = msg.value;
        uint256 outputValue = (inputValue / ethValue) * 10 ** 18; //converting to 18 decimal places;
        require(tokenInstanceMap[tokenName].transfer(msg.sender, outputValue));

        //here we adding transaction history..
        Transaction memory newTransaction = Transaction({
            _receiver: msg.sender,
            token: tokenName,
            Amount: outputValue,
            timestamp: block.timestamp
        });
        transaction.push(newTransaction);
        transactionCount++;
        emit TransactionAdded(
            msg.sender,
            tokenName,
            outputValue,
            block.timestamp
        );
        //end here..

        return outputValue;
    }

    //here we swaping the token to Eth for that i am getting the tokeName and amount.
    function swapTokentoEth(
        string memory tokenName,
        uint256 _amount
    ) public payable returns (uint256) {
        uint256 exactAmount = _amount / 10 ** 18; //here we converting value into wei.
        uint256 ethToBeTransfered = exactAmount * ethValue;
        require(
            address(this).balance >= ethToBeTransfered,
            "Dex running low on balance."
        );

        payable(msg.sender).transfer(ethToBeTransfered);
        require(
            tokenInstanceMap[tokenName].transferFrom(
                msg.sender,
                address(this),
                _amount
            )
        );

        //here we adding transaction history..
        Transaction memory newTransaction = Transaction({
            _receiver: msg.sender,
            token: tokenName,
            Amount: ethToBeTransfered,
            timestamp: block.timestamp
        });
        transaction.push(newTransaction);
        transactionCount++;
        emit TransactionAdded(
            msg.sender,
            tokenName,
            ethToBeTransfered,
            block.timestamp
        );
        //end here..

        return ethToBeTransfered;
    }

    //here i am swaping token to token.

    function swapTokenToToken(
        string memory srcTokenName,
        string memory dstTokenName,
        uint256 _amount
    ) public {
        require(
            tokenInstanceMap[srcTokenName].transferFrom(
                msg.sender,
                address(this),
                _amount
            )
        );

        //here we added new token amount..
        // Check if the destination token is "CoinB" and double the amount accordingly
        if (keccak256(bytes(dstTokenName)) == keccak256(bytes("CoinB"))) {
            _amount = _amount * 2; // Double the amount for "CoinB"
        } else if (
            keccak256(bytes(srcTokenName)) == keccak256(bytes("CoinB"))
        ) {
            _amount = _amount / 2; // Halve the amount for CoinB to CoinA or CoinC
        } else {
            _amount = _amount; // Keep the same amount for other tokens
        }

        //here we adding transaction history..
        Transaction memory newTransaction = Transaction({
            _receiver: msg.sender,
            token: dstTokenName,
            Amount: _amount,
            timestamp: block.timestamp
        });
        transaction.push(newTransaction);
        transactionCount++;
        emit TransactionAdded(
            msg.sender,
            dstTokenName,
            _amount,
            block.timestamp
        );

        //end here..
        require(tokenInstanceMap[dstTokenName].transfer(msg.sender, _amount));
    }
}
