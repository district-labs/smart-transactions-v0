export default function TermsOfServicePage() {
  return (
    <>
      <div className="content container max-w-screen-md pt-10 lg:pt-20">
        <h3 className="text-3xl font-extrabold">Terms of Service</h3>
        <p className="">
          The District Finance application is provided as-is, without any
          warranty or guarantee of any kind.
        </p>
        <p className="">
          The application is not audited, and not intended to be used in
          production. <span className="font-bold">Use at your own risk.</span>
        </p>
        <p className="">
          The District Finance application is not responsible for any losses
          incurred by the use of this application. The application is
          non-custodial and does not hold any funds. At no point does the
          application have access to your funds or private keys.
        </p>
        <p className="">
          The District Finance helps you sign transactions that can be executed
          by third-party services or the District Labs team. It&apos;s your
          responsibility to verify the transactions before signing them.
        </p>
      </div>
    </>
  )
}
