import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

export const goerliclient = createPublicClient({
  chain: goerli,
  transport: http(
    "https://eth-goerli.g.alchemy.com/v2/db-FH5BVUG8oRJ_iE5EjCEQsBRWuXU2X",
  ),
});
