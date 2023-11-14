import { type Address } from "viem"
import { TEST_DIS, TEST_RIZZ, TEST_USDC, TEST_WETH } from "./test-tokens"

export const CHAINLINK_FEEDS: Record<Address | string, string> = {
    [TEST_WETH[5]]: "0x0E7F29dAEc47Ec5f74fe7381692C9eb4392A4BB1",
    [TEST_USDC[5]]: "0x9d038Bdb6CefaD60451c9F816aa94eFfa9452E93",
    [TEST_DIS[5]]: "0xbA8B29723E1123CC5F48F0F933BE1D4C98e0D78E",
    [TEST_RIZZ[5]]: "0xED099B095F77A9bC3c8a418028817E69448De544"
}
