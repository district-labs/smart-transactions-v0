import Link from "next/link"
import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: any) => <h1 className="mt-6 text-3xl font-bold" {...props} />,
    h2: (props: any) => <h2 className="mt-4 text-2xl font-bold" {...props} />,
    h3: (props: any) => <h3 className="mt-3 text-xl font-bold" {...props} />,
    p: (props: any) => <p className="mt-3" {...props} />,
    a: ({ children, ...props }: any) => (
      <Link className=" text-blue-600 hover:underline" {...props}>
        {children}
      </Link>
    ),
    ...components,
  }
}
