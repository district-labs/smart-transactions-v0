import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { allPosts } from "contentlayer/generated"
import { ChevronLeft } from "lucide-react"

import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Mdx } from "@/components/shared/mdx-components"

interface PostPageProps {
  params: {
    slug: string[]
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
async function getPostFromParams(slug: string[]) {
  const post = allPosts.find((post) => post.slugAsParams === slug[0])

  if (!post) {
    null
  }

  return post
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Sell all posts
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}
        <h1 className="font-heading mt-2 inline-block text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={4500}
          height={1500}
          className="my-8 rounded-md border bg-muted object-cover transition-colors"
          priority
        />
      )}
      <Mdx code={post.body.code} />
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  )
}
