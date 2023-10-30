"use client"

import { type HTMLAttributes } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface LinkComponentProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  isExternal?: boolean
  linkStyle?: boolean
  target?: string
}

export function LinkComponent({
  href,
  children,
  isExternal,
  className,
  target = "_blank",
  linkStyle,
  ...props
}: LinkComponentProps) {
  const pathname = usePathname()
  const classes = cn(className, {
    active: pathname === href,
    "text-blue-500 hover:text-blue-600": linkStyle,
  })
  const isExternalEnabled =
    href.match(/^([a-z0-9]*:|.{0})\/\/.*$/) || isExternal

  if (isExternalEnabled) {
    return (
      <a
        className={classes}
        href={href}
        rel="noopener noreferrer"
        target={target}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link className={classes} href={href} {...props}>
      {children}
    </Link>
  )
}
