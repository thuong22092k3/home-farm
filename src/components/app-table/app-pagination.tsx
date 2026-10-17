"use client";

import Pagination from "@/components/smoothui/pagination";
import { cn } from "@/lib/utils";

type AppPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  className?: string;
};

/**
 * Animated pagination with spring-based active page indicator.
 * Uses SmoothUI pagination component.
 */
function AppPagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  className,
}: AppPaginationProps) {
  if (pageCount < 1) return null;

  return (
    <Pagination
      page={page}
      totalPages={pageCount}
      onPageChange={onPageChange}
      siblings={siblings}
      className={cn("w-auto", className)}
    />
  );
}

export { AppPagination, type AppPaginationProps };
