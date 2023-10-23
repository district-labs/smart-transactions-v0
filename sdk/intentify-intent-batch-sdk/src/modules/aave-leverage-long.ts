import { AaveLeverageLongIntent } from '@district-labs/intentify-deployments' 

export const aaveLeverageLong =  {
    name: 'AaveLeverageLong',
    target: '0x000000000000000000000000000000000000dEaD',
    deployed: AaveLeverageLongIntent,
    args: [
        {
            name: 'supplyAsset',
            type: 'address',
        },
        {
            name: 'borrowAsset',
            type: 'address',
        },
        {
            name: 'interestRateMode',
            type: 'uint256',
        },
        {
            name: 'minHealthFactor',
            type: 'uint256',
        },
        {
            name: 'fee',
            type: 'uint32',
        }
    ]
}

export default aaveLeverageLong;