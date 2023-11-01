import { EthTipIntent } from "@district-labs/intentify-deployments"

export const ethTip = {
  name: "EthTip",
  deployed: EthTipIntent,
  abi: [
    {
      name: "amount",
      type: "uint256",
    },
  ],
}

export default ethTip
