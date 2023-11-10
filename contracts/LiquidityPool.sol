// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC20Token.sol";

contract LiquidityPool is ERC20Token {
    // Public variables of the Liquidity Pool
    address public addressTokenA;
    address public addressTokenB;
    address public owner;
    uint256 public reserveTokenA;
    uint256 public reserveTokenB;
    uint32 private blockTimestampLast;
    uint256 public priceTokenA;
    uint256 public priceTokenB;

    // State variables for liquidity shares
    uint256 public totalLiquidity;
    mapping(address => uint256) public userLiquidity;

    //getting the reserve token detail here.
    event Sync(uint256 reserveTokenA, uint256 reserveTokenB);

    //new code here...
    mapping(address => mapping(address => address)) public getLiquidityPool;
    address[] public allLiquidityPools;

    event MintLPToken(
        address indexed from,
        uint256 amountTokenA,
        uint256 amountTokenB
    );

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20Token(0, _name, _symbol) {
        owner = msg.sender;
    }

    //here addliquidity function
    function createLiquidityPool(
        string memory _name,
        string memory _symbol,
        address _tokenA,
        address _tokenB
    ) external returns (address) {
        require(_tokenA != _tokenB, "Invalid tokens addresses");
        require(_tokenA != address(0), "Invalid address");
        require(_tokenB != address(0), "Invalid address");
        require(
            getLiquidityPool[_tokenA][_tokenB] == address(0),
            "Liquidity Pool already exists"
        );
        require(
            getLiquidityPool[_tokenB][_tokenA] == address(0),
            "Liquidity Pool already exists"
        );

        address liquidityPool = address(new ERC20Token(0, _name, _symbol));
        addressTokenA = _tokenA;
        addressTokenB = _tokenB;
        getLiquidityPool[_tokenA][_tokenB] = liquidityPool;
        getLiquidityPool[_tokenB][_tokenA] = liquidityPool;
        allLiquidityPools.push(liquidityPool);

        // emit LiquidityPoolCreated(_tokenA, _tokenB, liquidityPool, _symbol);
        return liquidityPool;
    }

    //helper function here.
    function _mintNew(address _to, uint256 _amount) private {
        userLiquidity[_to] += _amount;
        totalLiquidity += _amount;
    }

    //here we defined the own sqrt function.
    function customSqrt(uint256 x) internal pure returns (uint256) {
        require(x > 0, "Cannot calculate square root of a negative number");
        // If the input is 0, the square root is 0
        if (x == 0) {
            return 0;
        }
        // Initial guess for the square root
        uint256 guess = x / 2;
        for (uint256 i = 0; i < 10; i++) {
            guess = (guess + x / guess) / 2;
        }
        return guess;
    }

    //this is the function for the min values.
    function min1(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // Internal function to burn liquidity shares
    function _burn(address _from, uint256 _amount) private {
        userLiquidity[_from] -= _amount;
        totalLiquidity -= _amount;
    }

    function addLiquidity(
        uint256 _amountTokenA,
        uint256 _amountTokenB,
        address _tokenA,
        address _tokenB
    ) public returns (bool success) {
        require(
            getLiquidityPool[_tokenA][_tokenB] != address(0),
            "Liquidity Pool not found exists"
        );

        require(
            getLiquidityPool[_tokenB][_tokenA] != address(0),
            "Liquidity Pool not found exists"
        );

        ERC20Token tokenA = ERC20Token(addressTokenA);
        require(
            tokenA.transferFrom(msg.sender, address(this), _amountTokenA),
            "Tranfer of token failed"
        );
        ERC20Token tokenB = ERC20Token(addressTokenB);
        require(
            tokenB.transferFrom(msg.sender, address(this), _amountTokenB),
            "Tranfer of token failed"
        );

        mint(msg.sender); // mint new LP tokens
        return true;
    }

    function mint(address to) internal returns (uint256 liquidity) {
        uint256 _balanceTokenA = ERC20Token(addressTokenA).balanceOf(
            address(this)
        );
        uint256 _balanceTokenB = ERC20Token(addressTokenB).balanceOf(
            address(this)
        );

        uint256 _reserveTokenA = reserveTokenA;
        uint256 _reserveTokenB = reserveTokenB;

        uint256 _amountTokenA = _balanceTokenA - _reserveTokenA;
        uint256 _amountTokenB = _balanceTokenB - _reserveTokenB;

        uint256 _totalSupply = totalSupply;

        if (_totalSupply == 0) {
            liquidity = customSqrt(_amountTokenA * _amountTokenA);
        } else {
            uint256 value1 = ((_amountTokenA * _totalSupply) / _reserveTokenA);
            uint256 value2 = ((_amountTokenB * _totalSupply) / _reserveTokenB);
            liquidity = min1(value1, value2);
        }
        require(liquidity > 0, "No Liquidity Shares Minted");
        _mint(to, liquidity);
        _mintNew(to, liquidity);
        _update(_balanceTokenA, _balanceTokenB, _reserveTokenA, _reserveTokenB);
        emit MintLPToken(msg.sender, _amountTokenA, _amountTokenB);
    }

    function _update(
        uint256 _balanceTokenA,
        uint256 _balanceTokenB,
        uint256 _reserveTokenA,
        uint256 _reserveTokenB
    ) private {
        require(_balanceTokenA >= 0 && _balanceTokenB >= 0, "Invalid balances");
        if (_reserveTokenA > 0 && _reserveTokenB > 0) {
            priceTokenA += _reserveTokenA / _reserveTokenB;
            priceTokenB += _reserveTokenB / _reserveTokenA;
        }

        reserveTokenA = _balanceTokenA;
        reserveTokenB = _balanceTokenB;

        emit Sync(reserveTokenA, reserveTokenA);
    }

    function sync() external {
        _update(
            ERC20Token(addressTokenA).balanceOf(address(this)),
            ERC20Token(addressTokenB).balanceOf(address(this)),
            reserveTokenA,
            reserveTokenB
        );
    }

    function removeLiquidity(
        uint256 _liquidityShares
    ) external returns (uint256 _amountTokenA, uint256 _amountTokenB) {
        require(
            userLiquidity[msg.sender] >= _liquidityShares,
            "Insufficient liquidity shares"
        );
        // Get balance of both tokens
        uint256 token1Balance = ERC20Token(addressTokenA).balanceOf(
            address(this)
        );
        uint256 token2Balance = ERC20Token(addressTokenB).balanceOf(
            address(this)
        );

        uint256 _totalLiquidity = totalLiquidity;

        _amountTokenA = (_liquidityShares * token1Balance) / _totalLiquidity;
        _amountTokenB = (_liquidityShares * token2Balance) / _totalLiquidity;

        require(
            _amountTokenA > 0 && _amountTokenB > 0,
            "Insufficient transfer amounts"
        );

        burn(_liquidityShares);
        _burn(msg.sender, _liquidityShares);
        // Update reserves
        _update(token1Balance, token2Balance, _amountTokenA, _amountTokenB);
        // Transfer tokens to user
        ERC20Token(addressTokenA).transfer(msg.sender, _amountTokenA);
        ERC20Token(addressTokenB).transfer(msg.sender, _amountTokenB);
    }

    function getAmountToken(
        address _tokenAddress,
        uint256 amountToken
    ) public view returns (uint256 actualPriceofToken) {
        require(
            reserveTokenA > 0 && reserveTokenB > 0,
            "Invalid liquidity pool pair."
        );

        uint256 newValue;
        uint256 newTokenPrice;

        if (_tokenAddress == addressTokenA) {
            newValue = reserveTokenA + amountToken;
            if (newValue > 0) {
                newTokenPrice = totalSupply / newValue;
                actualPriceofToken = (reserveTokenB > newTokenPrice)
                    ? reserveTokenB - newTokenPrice
                    : newTokenPrice - reserveTokenB;
            }
        } else if (_tokenAddress == addressTokenB) {
            newValue = reserveTokenB + amountToken;
            if (newValue > 0) {
                newTokenPrice = totalSupply / newValue;
                actualPriceofToken = (reserveTokenA > newTokenPrice)
                    ? reserveTokenA - newTokenPrice
                    : newTokenPrice - reserveTokenA;
            }
        }

        // Ensure that actualPriceofToken is always positive
        actualPriceofToken = abs(int256(actualPriceofToken));
        return actualPriceofToken;
    }

    // Absolute value function
    function abs(int256 x) internal pure returns (uint256) {
        return x >= 0 ? uint256(x) : uint256(-x);
    }
}
