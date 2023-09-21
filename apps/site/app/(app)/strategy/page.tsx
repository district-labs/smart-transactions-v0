import Balancer from "react-wrap-balancer"

interface StrategiesPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default function StrategiesPage({ searchParams }: StrategiesPageProps) {
  const { page, per_page, sort, category, assets_range } = searchParams

  // Strategies transaction
  // const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  // const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0
  // const categories = typeof category === "string" ? category : null

  // const strategiesTransaction = await getStrategiesAction({
  //   limit,
  //   offset,
  //   categories,
  //   sort: typeof sort === "string" ? sort : null,
  //   assets_range: typeof assets_range === "string" ? assets_range : null,
  // })

  // const pageCount = Math.ceil(strategiesTransaction.count / limit)

  return (
    <>
      <div className="my-4 space-y-2">
        <h2 className="text-2xl tracking-tight sm:text-3xl">
          Investment Strategies
        </h2>
        <Balancer>
          Discover pre-built strategies you can invest in right away.
        </Balancer>
      </div>
      {/* <StrategiesTableShell
        data={strategiesTransaction.items}
        pageCount={pageCount}
        managerId={2}
      /> */}
    </>
  )
}
