'use client'

import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { Button } from "#/components/ui/button"

export function SpacesPagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

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
      {pages.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === currentPage ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === currentPage ? "page" : undefined}
        >
          {pageNumber}
        </Button>
      ))}
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