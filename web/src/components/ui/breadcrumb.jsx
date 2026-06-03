'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '#/lib/utils'
import { CaretRight, DotsThree } from '@phosphor-icons/react'

export const Breadcrumb = React.forwardRef(function Breadcrumb(props, ref) {
  return <nav ref={ref} aria-label="breadcrumb" {...props} />
})
Breadcrumb.displayName = 'Breadcrumb'

export const BreadcrumbList = React.forwardRef(function BreadcrumbList({ className, ...props }, ref) {
  return (
    <ol
      ref={ref}
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
        className,
      )}
      {...props}
    />
  )
})
BreadcrumbList.displayName = 'BreadcrumbList'

export const BreadcrumbItem = React.forwardRef(function BreadcrumbItem({ className, ...props }, ref) {
  return (
    <li
      ref={ref}
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  )
})
BreadcrumbItem.displayName = 'BreadcrumbItem'

export const BreadcrumbLink = React.forwardRef(function BreadcrumbLink({ asChild, className, ...props }, ref) {
  const Comp = asChild ? Slot : 'a'
  return (
    <Comp
      ref={ref}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

export const BreadcrumbPage = React.forwardRef(function BreadcrumbPage({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  )
})
BreadcrumbPage.displayName = 'BreadcrumbPage'

export function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <CaretRight className="size-3.5" />}
    </li>
  )
}

export function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <DotsThree className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}
