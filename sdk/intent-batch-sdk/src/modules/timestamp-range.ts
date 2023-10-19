import { TimestampRangeIntent } from '@district-labs/intentify-deployments' 

export const timestampRange = {
    name: 'TimestampRange',
    target: '0x000000000000000000000000000000000000dEaD',
    deployed: TimestampRangeIntent,
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

export default timestampRange   