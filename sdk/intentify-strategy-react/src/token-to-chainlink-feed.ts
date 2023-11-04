import { Address } from 'viem' 
import { ADDRESS_ZERO } from "@district-labs/intentify-core"
import { CHAINLINK_FEEDS } from "@district-labs/intentify-intent-batch"


export function tokenToChainLinkFeed(token: Address | string) {
  return CHAINLINK_FEEDS[token] || ADDRESS_ZERO
}
