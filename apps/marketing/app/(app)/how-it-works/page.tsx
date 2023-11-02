export default function HowItWorksPage() {
  return (
    <>
      <div className="content container max-w-screen-md pb-32 pt-10 lg:pt-20">
        <h3 className="text-4xl font-extrabold">How It Works</h3>
        <p className="font-bold">What is District Finance?</p>
        <p>
          District Finance is a{" "}
          <span className="font-bold">DeFi centric application</span> and{" "}
          <span className="font-bold">smart transaction protocol</span>.
        </p>
        <p>
          The application enables users to sign and broadcast DeFi based trading
          intents.
        </p>
        <p>
          The protocol is a set of smart contracts that allow users to express
          complex intent conditions. Instead of crafting a transaction with
          explicit function calls, the user can craft a transaction intent,
          which contain conditions and rules that must be met for the
          transaction to be executed.
        </p>
        <hr className="my-10" />
        <h3 className="text-3xl font-bold">📜 Smart Transactions</h3>
        <p>
          <span className="font-bold">Smart transactions</span> are distinct
          from <span className="italic">normal transactions</span>.
        </p>
        <p>Normal transactions are signed payloads broadcast in real-time.</p>
        <p>
          Smart transactions are signed intents that can be broadcast now or in
          the future.
        </p>
        <p>
          <span className="font-bold">
            A smart transaction can read current and historic state of a
            blockchain before being executed.
          </span>{" "}
          Greatly expanding the rules and conditions governing for when a
          transaction becomes valid i.e. executable.
        </p>
        <p>
          <p className="">
            For example a user can sign a transaction that is conditional on the
            price of ETH being above $2,500. Or if the average price of ETH over
            the last 30 days is below $2,500 using zero knowledge proofs.
          </p>
        </p>
        <p>
          Smart transaction have conditions and rules. Written directly in the
          data structure.
        </p>
        <hr className="my-10" />
        <h3 className="text-3xl font-bold">🔐 Intent Modules</h3>
        <p className="">
          At the heart of Smart Transactions are{" "}
          <span className="font-bold">intent modules</span>.
        </p>
        <p className="">
          Intent modules are smart contracts that constrain a smart transaction.
        </p>
        <h3 className="mt-6 text-lg font-bold">Intent Module Examples</h3>
        <ul className="list list-disc pl-8">
          <li>Aave Leverage Long</li>
          <li>Block Number Range</li>
          <li>Chainlink Data Feed</li>
          <li>ERC20 Limit Order</li>
          <li>ERC20 Rebalance</li>
          <li>ERC20 Swap Spot Price (Buy/Sell)</li>
          <li>ERC20 Tip</li>
          <li>ETH Tip</li>
          <li>Timestamp Range</li>
          <li>Uniswap3 Time-Weighted Average Balance</li>
          <li>Uniswap3 Historical Time-Weighted Average Balance</li>
        </ul>
        <p className="">
          Each intent module limits a specific set of rules and conditions. And
          can be combined with other intent modules to create complex smart
          transactions.
        </p>
        <p className="">
          For example the{" "}
          <span className="font-medium">TimestampRangeIntent</span> and{" "}
          <span className="font-medium">ERC20LimitOrderIntent</span> intent
          modules can be combined to create a limit order that is only valid
          between a specific time range.
        </p>
        <p className="">
          Or{" "}
          <span className="font-medium">
            UniswapV3HistoricalTwapPercentageChange
          </span>{" "}
          and{" "}
          <span className="font-medium">ERC20SwapSpotPriceExactTokenOut</span>{" "}
          intent modules used to implement an automatic Mean Reversion trading
          strategy.
          <div className="my-5 text-center">
            <img
              src="/images/preview-code.png"
              alt="Player vs Game"
              className="w-full rounded-xl border-2 border-white shadow-md"
            />
            <span className="text-light mt-1 text-xs">
              TimestampRangeIntent.sol Example Code
            </span>
          </div>
        </p>
        <hr className="my-10" />
        <h3 className="text-3xl font-bold">💳 Smart Wallet</h3>
        <p className="">
          District Finance extends the Safe Multisig Wallet with the Intentify
          module.
        </p>
        <div className="bg-neutral my-3 rounded-md bg-red-200 dark:bg-red-800 p-4">
          <span className="">
            Do NOT install the Intentify module on existing Safe Multisig
            Wallet.{" "}
            <span className="font-bold">
              The smart contracts are an ALPHA release
            </span>
            . And should not be used with funds you&apos;re not willing to lose.
          </span>
        </div>
        <p className="">
          The Intentify allows an owner of a Safe Multisig Wallet to sign and
          broadcast smart transactions. While using the Safe Multisig Wallet to
          store funds and manage owners.
        </p>
      </div>
    </>
  )
}
