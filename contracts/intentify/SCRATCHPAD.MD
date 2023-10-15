
## LimitOrder Intent

TokenA Balance = 1000
TokenB Balance = 0

intent:release

TokenA Release = 500


## Alpha V1

```js
const IntentBatch = {
    nonce: {
        queue: 'uint128',
        accumulator: 'uint128'
    }
    intents: [
        {
            exec: {
                root: 'address'
                target: 'address'
                data: 'bytes'
            }
            sig: {
                r: 'bytes32'
                s: 'bytes32'
                v: 'uint8'
            }
        }
    ]
}
```

```js
const IntentBatchExecution = {
    batch: IntentBatch
    signature: {
        r: 'bytes32'
        s: 'bytes32'
        v: 'uint8'
    }
    hooks: [
        {
            target: 'address'
            data: 'address'
        }
    ]
}
```

------------------------------------------


## Alpha V0

```js
const IntentBatch = {
    root: 'address'
    nonce: {
        queue: 'uint128',
        accumulator: 'uint128'
    }
    intents: [
        {
            hooking: 'boolean' // prevent running hooks on this intent. critical for enforcing final intent outcomes.
            target: 'address'
            terms: 'bytes'
        }
    ]
}
```

```js
const IntentBatchExecution = {
    batch: IntentBatch
    map: ['boolean'] // executes hooks for an intent. if TRUE the intent `hooking` must also be TRUE.
    hooks: [
        {
            pre: ['bytes']
            post: ['bytes']
        }
    ]
}
```

### Execute Aave Supply/Borrow

```
    IUniswapV3Factory factory = IUniswapV3Factory(swapRouter);
    address poolAddress = factory.getPool(tokenIn, tokenOut, 3000);
    IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);
    // IERC20(tokenOut).approve(address(swapRouter), usdcAmountOut);
    bytes memory approveData = abi.encodeWithSignature("approve(address,uint256)", swapRouter, usdcAmountOut);
    executeFromRoot(tokenOut, 0, approveData);

    (uint160 sqrt,,,,,,) = pool.slot0();

    bytes memory swapData = abi.encodeWithSignature("exactOutputSingle((address,address,uint24,address,uint256,uint256,uint160))", ISwapRouter.ExactOutputSingleParams({
            tokenIn: address(tokenIn),
            tokenOut: address(tokenOut),
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp + 300,
            amountOut: usdcAmountOut,
            amountInMaximum: exactAmountIn,
            sqrtPriceLimitX96: sqrt
        }));
    executeFromRoot(swapRouter, 0, swapData);
    uint256 amountIn = swapRouter.exactOutputSingle(
        ISwapRouter.ExactOutputSingleParams({
            tokenIn: address(tokenIn),
            tokenOut: address(tokenOut),
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp + 300,
            amountOut: usdcAmountOut,
            amountInMaximum: exactAmountIn,
            sqrtPriceLimitX96: 0
        })
    );
```


### Token Prices

```
function _calculateUSDCForETH(int priceWith8Decimals, uint256 ethAmountInWei) internal pure returns (uint256) {
    
    // Calculate the raw amount
    uint256 rawAmount = ethAmountInWei * uint256(priceWith8Decimals);

    // Adjust for decimals to get final USDC amount
    uint256 usdcAmount = rawAmount / 1e12;

    return usdcAmount;
}

function _calculateAmountOut(
    int price, 
    uint256 amountIn, 
    uint256 tokenADecimals, 
    uint256 tokenBDecimals, 
    uint256 priceDecimals
) 
    internal pure returns (uint256) 
{
    // Determine the effective decimals difference
    uint256 decimalsDifference;
    if (tokenADecimals + priceDecimals > tokenBDecimals) {
        decimalsDifference = tokenADecimals + priceDecimals - tokenBDecimals;
        amountIn /= uint256(10**decimalsDifference);
    } else if (tokenBDecimals > tokenADecimals + priceDecimals) {
        decimalsDifference = tokenBDecimals - (tokenADecimals + priceDecimals);
        amountIn *= uint256(10**decimalsDifference);
    }

    uint256 rawAmount = amountIn * uint256(price);
    return rawAmount;
}
```



```
/**
  * How It Works
  * 1. ENFORCE: read root's current balance of the lending asset.
  * 2. ENFORCE: root current health factor from the Aave pool.
  * 3. HOOK: Add funds to root account via a flash loan i.e. ETH
  * 4. EXECUTE: Supply the lending asset to the Aave pool i.e. ETH
  * 5. EXECUTE: Borrow the borrowing asset from the Aave pool i.e. USDC
  * 6. EXECUTE: Repay the flash loan i.e. ETH by selling the borrowed asset i.e. USDC
  * 7. ENFORCE: root current health factor from the Aave pool.
*/
// console2.log("Supply Amount With Fee: %s", supplyAmountWithFee);
// console2.log("Supply Amount: %s", supplyAmount);
// console2.log("Borrow Amount: %s", borrowAmount);
// console2.log("Amount Repay: %s", amountRepay);
```