import { type Address } from "viem";
import { goerliPublicClient } from "../../blockchain-clients";
import { poolABI, quoterV2ABI } from "./abis";
import { sqrtPriceX96ToPrice } from "./utils";
import { Univ3AdjustPriceSchema } from "./validation";

const TX_STEP_USDC = BigInt(500) * (BigInt(10) ** BigInt(6));
const TX_STEP_ETH = BigInt(3) * (BigInt(10) ** BigInt(17));

export async function POST(req: Request) {
    try {
        const { poolFee, token0, token1, targetPrice: targetInversePrice } = Univ3AdjustPriceSchema.parse(await req.json());

        if(targetInversePrice <= 0) {
            return new Response("Target price must be greater than 0", { status: 400 });
        }
        const slot0 = await goerliPublicClient.readContract({
            address: "0x5c33044BdBbE55dAb3d526CE70F908aAF6990373",
            abi: poolABI,
            functionName: "slot0"
        });

        const currentSqrtPriceX96 = slot0[0];
        const currentInversePrice = BigInt(1e12) / sqrtPriceX96ToPrice(currentSqrtPriceX96.toString());

        if (currentInversePrice === BigInt(targetInversePrice)) {
            return new Response(JSON.stringify({
                message: "Operation not needed",
                currentInversePrice: currentInversePrice.toString(),
                targetInversePrice: targetInversePrice.toString()
            }), { status: 200 });
        }

        const operation = currentInversePrice < BigInt(targetInversePrice) ? "gt" : "lt";
        const tokens = operation === "gt" ? [token0, token1] : [token1, token0];
        const TX_STEP = operation === "gt" ? TX_STEP_USDC : TX_STEP_ETH;

        let inversePrice = currentInversePrice;
        let step = BigInt(1);
        let sqrtPriceX96After: bigint = BigInt(1);
let difference = BigInt(Math.abs(Number(currentInversePrice - BigInt(targetInversePrice))));

while ((operation === "gt" && inversePrice < targetInversePrice) || (operation === "lt" && inversePrice > targetInversePrice)) {
    // Adjust step size dynamically
    const dynamicStepSize = TX_STEP * (difference / BigInt(1e12)); // The 1e12 divisor is arbitrary, you may need to adjust

    // Ensure the step size isn't too small or too large
    const adjustedStepSize = Math.min(Math.max(Number(dynamicStepSize), Number(TX_STEP_ETH)), Number(TX_STEP_USDC)); 

    const data = await goerliPublicClient.simulateContract({
        address: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        abi: quoterV2ABI,
        args: [{
            tokenIn: tokens[0] as Address,
            tokenOut: tokens[1] as Address,
            fee: poolFee,
            amountIn: BigInt(adjustedStepSize) * step,
            sqrtPriceLimitX96: BigInt(0),
        }],
        functionName: 'quoteExactInputSingle'
    });

    sqrtPriceX96After = data.result[1];
    inversePrice = BigInt(1e12) / sqrtPriceX96ToPrice(sqrtPriceX96After.toString());
    difference = BigInt(Math.abs(Number(inversePrice - BigInt(targetInversePrice))));

    step += BigInt(1);
}

        return new Response(JSON.stringify({
            steps: step.toString(),
            initialInversePrice: (BigInt(1e12) / sqrtPriceX96ToPrice(currentSqrtPriceX96.toString())).toString(),
            targetInversePrice: targetInversePrice.toString(),
            inversePriceAfter: (BigInt(1e12) / sqrtPriceX96ToPrice(sqrtPriceX96After.toString())).toString(),
        }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response("Something went wrong", { status: 500 });
    }
}
