import { EthTipIntent } from '@district-labs/intentify-deployments' 

export const ethTip =  {
    name: 'EthTip',
    target: '0x000000000000000000000000000000000000dEaD',
    deployed: EthTipIntent,
    args: [
        {
            name: 'amount',
            type: 'uint256',
        }
    ]
}

export default ethTip;