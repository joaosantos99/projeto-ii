'use client'

import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export const PER_PAGE = 10

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set()
  pages.add(1)
  pages.add(totalPages)
  pages.add(currentPage)
  if (currentPage > 1) pages.add(currentPage - 1)
  if (currentPage < totalPages) pages.add(currentPage + 1)

  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...")
    }
    result.push(sorted[i])
  }
  return result
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages
  const items = getVisiblePages(currentPage, totalPages)

  return (
    <nav className="flex items-center gap-1" aria-label="Paginação">
      <Button
        variant="ghost"
        size="sm"
        disabled={!canPrev}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <CaretLeft />
        Anterior
      </Button>
      {items.map((item, index) =>
        item === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === currentPage ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
          >
            {item}
          </Button>
        )
      )}
      <Button
        variant="ghost"
        size="sm"
        disabled={!canNext}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        Seguinte
        <CaretRight />
      </Button>
    </nav>
  )
}
