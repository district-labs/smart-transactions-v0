import { Erc20LimitOrderIntent } from "@district-labs/intentify-deployments"
import { validateErc20LimitOrder } from '@district-labs/intentify-intent-batch-validate' 
export const erc20LimitOrder = {
  name: "Erc20LimitOrder",
  deployed: Erc20LimitOrderIntent,
  validate: validateErc20LimitOrder,
  abi: [
    {
      name: "tokenOut",
      type: "address",
    },
    {
      name: "tokenIn",
      type: "address",
    },
    {
      name: "amountOutMax",
      type: "uint256",
    },
    {
      name: "amountInMin",
      type: "uint256",
    },
  ],
}

export default erc20LimitOrder
