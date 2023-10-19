import { BlockNumberIntent } from '@district-labs/intentify-deployments' 

export const blockNumberRange =  {
    name: 'BlockNumberRange',
    target: '0x000000000000000000000000000000000000dEaD',
    deployed: BlockNumberIntent,
    args: [
        {
            name: 'start',
            type: 'uint128',
        },
        {
            name: 'end',
            type: 'uint128',
        }
    ]
}

export default blockNumberRange;