import { StaticImageData } from "next/image"

import { ArbitrumElement } from "./assets/arbitrum"
import { BaseElement } from "./assets/base"
import { EthereumElement } from "./assets/ethereum"
import { OptimismElement } from "./assets/optimism"
import { PolygonElement } from "./assets/polygon"
import { StarknetElement } from "./assets/starknet"
import { ZKSyncElement } from "./assets/zk-sync"

export type Assets =
  | "Arbitrum"
  | "Base"
  | "Ethereum"
  | "Optimism"
  | "Polygon"
  | "Starknet"
  | "ZK Sync"

export type Element = {
  designElement: {
    icon: StaticImageData
    label: string
  }
  designComponent: React.FC
  strategyComponent: React.FC
}

type ElementsType = {
  [key in Assets]: Element
}

export const AssetElements: ElementsType = {
  Ethereum: EthereumElement,
  Arbitrum: ArbitrumElement,
  Base: BaseElement,
  Optimism: OptimismElement,
  Polygon: PolygonElement,
  Starknet: StarknetElement,
  "ZK Sync": ZKSyncElement,
}
