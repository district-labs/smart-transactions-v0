export default function HowItWorksPage() {
  return (
    <>
      <div className="content container max-w-screen-md pb-32 pt-10 lg:pt-20">
        <h3 className="text-3xl font-bold">🏰 The District Lore</h3>
        <p className="">
          Think of District Finance like a game. And blockchains are the game
          worlds.
        </p>
        <p className="">
          Players can interact with other players.{" "}
          <span className="font-bold">
            And players can interact with the game world.
          </span>
        </p>
        <h3 className="mt-6 text-2xl font-bold">Player vs Player</h3>
        <p className="">
          District Finance enables players to interact with each other in a more
          sophisticated way.
        </p>
        <img
          src="/images/pvp.png"
          alt="Player vs Game"
          className="my-5 w-full rounded-xl border-2 border-white shadow-md"
        />
        <p className="">
          Players can express complex trading intents. And other players can
          take the other side of the trade. All without the need for a
          centralized exchange or onchain order book.
        </p>
        <h3 className="mt-6 text-2xl font-bold">Player vs Game</h3>
        <p className="">
          District Finance is unique because it allows players to interact with
          the game world in a more sophisticated way - while also reducing the
          complexity of the interaction.
        </p>
        <img
          src="/images/pve.png"
          alt="Player vs Game"
          className="my-5 w-full rounded-xl border-2 border-white shadow-md"
        />
        <p className="">
          Players can create smart transaction that respond to the game world
          state.
        </p>
        <p className="">
          For example a player can create a smart transaction that is only valid
          if the price of ETH is above $2,500. Or if the average price of ETH
          over the last 30 days is below $2,500 using zero knowledge proofs.
        </p>
        <h3 className="mt-6 text-2xl font-bold">Block Builders</h3>
        <p className="">The game world is built by block builders.</p>
        <p className="">
          Block builders execute smart transaction ands find optimal solutions
          to complex problems.
        </p>
        <img
          src="/images/block-builder.png"
          alt="Block Builders"
          className="my-5 w-full rounded-xl border-2 border-white shadow-md"
        />
      </div>
    </>
  )
}
