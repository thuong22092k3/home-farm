"use client";

import { cn } from "@/lib/utils";
import Pagination from "@/components/smoothui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TablePaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange: (pageSize: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  /** Show item count info */
  showItemCount?: boolean;
  /** Label for page size selector */
  pageSizeLabel?: string;
}

function TablePagination({
  page,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  pageSizeLabel = "items/page",
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  // Don't show pagination if only one page and no page size selector
  if (totalPages <= 1 && !showPageSizeSelector && !showItemCount) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {/* Item count info */}
      {showItemCount && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span> to{" "}
          <span className="font-medium text-foreground">{endItem}</span> of{" "}
          <span className="font-medium text-foreground">
            {totalItems.toLocaleString()}
          </span>{" "}
          results
        </p>
      )}

      {/* Pagination controls */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            siblings={1}
          />
        )}

        {/* Page size selector */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger
                className="h-8 w-[70px]"
                aria-label="Select page size"
              >
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {pageSizeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { TablePagination };
