import { AaveLeverageLongIntent } from "@district-labs/intentify-deployments"

export const aaveLeverageLong = {
  name: "AaveLeverageLong",
  deployed: AaveLeverageLongIntent,
  args: [
    {
      name: "supplyAsset",
      type: "address",
    },
    {
      name: "borrowAsset",
      type: "address",
    },
    {
      name: "interestRateMode",
      type: "uint256",
    },
    {
      name: "minHealthFactor",
      type: "uint256",
    },
    {
      name: "fee",
      type: "uint32",
    },
  ],
}

export default aaveLeverageLong
