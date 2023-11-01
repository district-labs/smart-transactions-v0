import { AaveLeverageLongIntent } from "@district-labs/intentify-deployments"
import {validateAaveLeverageLong} from '@district-labs/intentify-intent-batch-validate' 

export const aaveLeverageLong = {
  name: "AaveLeverageLong",
  deployed: AaveLeverageLongIntent,
  validate: validateAaveLeverageLong,
  abi: [
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
