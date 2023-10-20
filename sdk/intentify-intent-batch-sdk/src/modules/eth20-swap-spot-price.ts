import { Erc20SwapSpotPriceIntent } from '@district-labs/intentify-deployments' 

export const erc20SwapSpotPrice =  {
    name: 'Erc20SwapSpotPrice',
    target: '0x000000000000000000000000000000000000dEaD',
    deployed: Erc20SwapSpotPriceIntent,
    args: [
        {
            name: 'tokenOut',
            type: 'address',
        },
        {
            name: 'tokenIn',
            type: 'address',
        },
        {
            name: 'tokenOutPriceFeed',
            type: 'address',
        },
        {
            name: 'tokenInPriceFeed',
            type: 'address',
        },
        {
            name: 'tokenAmountExpected',
            type: 'uint256',
        },
        {
            name: 'thresholdSeconds',
            type: 'uint256',
        },
        {
            name: 'isBuy',
            type: 'bool',
        },
    ]
}

export default erc20SwapSpotPrice;