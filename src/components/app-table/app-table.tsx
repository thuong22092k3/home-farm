'use client';

import { AppEmpty } from '@/components/app-empty/app-empty';
import { SkeletonTable } from '@/components/app-skeleton';
import Checkbox from '@/components/smoothui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type Row,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import React, { type ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSelect } from '../app-select';
import { AppPagination } from './app-pagination';

type AppTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isLoading?: boolean;
  /**
   * Cell content line clamp.
   * - 0: wrap content
   * - >=1: clamp to N lines with ellipsis
   */
  clampLine?: number;
  /**
   * Set to true when `data` already contains the current page from the server.
   * AppTable will keep the pagination UI but will not slice the data again.
   */
  manualPagination?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number, pageSize: number) => void;
    pageSizeOptions?: number[];
  };
  onRowClick?: (row: T) => void;
  getRowClassName?: (row: T) => string | undefined;
  getRowProps?: (row: T) => React.HTMLAttributes<HTMLTableRowElement>;
  emptyState?: { title: string; description: string };
  enableSorting?: boolean;
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Called with the selected row objects whenever selection changes */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Disable selection for individual rows while keeping them visible. */
  isRowSelectable?: (row: T) => boolean;
  /** Restrict selection to one row. */
  selectionMode?: 'multiple' | 'single';
  /** Render expandable content below a row. Receives row data, returns ReactNode. */
  renderExpandedRow?: (row: T) => ReactNode;
  /** Expand/collapse rows when clicking the whole row. Keep false when using an explicit expand action column. */
  expandOnRowClick?: boolean;
  /** Array of row IDs to expand by default on initial render */
  initialExpandedRowIds?: string[];
  className?: string;
  /**
   * Stick the header row when scrolling.
   * - Works with page scroll by default (sticky relative to viewport)
   * - If scrollContainerMaxHeight is set, works within that scroll container
   */
  stickyHeader?: boolean;
  /**
   * Number of leading columns (from left) to keep sticky when scrolling horizontally.
   * When > 0, wraps table in overflow-auto container for horizontal scroll.
   */
  stickyColumnsLeft?: number;
  /**
   * Number of trailing columns (from right) to keep sticky when scrolling horizontally.
   * When > 0, wraps table in overflow-auto container for horizontal scroll.
   */
  stickyColumnsRight?: number;
  /**
   * @deprecated Use stickyColumnsLeft instead
   */
  stickyColumns?: number;
  /**
   * Max height for the table scroll container (e.g., '400px', '50vh').
   * When set, enables vertical scroll within the table container instead of page scroll.
   * Useful for stickyHeader + stickyColumns combo where you want both to work together.
   */
  scrollContainerMaxHeight?: string;
  /**
   * Force a horizontal scroll container and preserve the table min-width even when
   * sticky columns are disabled on mobile.
   */
  horizontalScroll?: boolean;
};

type ColumnWidthConstraint = {
  size?: number;
  maxSize?: number;
  constrained: boolean;
};

type AppTableColumnMeta = {
  disableContentClamp?: boolean;
  headerClassName?: string;
  cellClassName?: string;
};

const cardCellBase = 'border-y border-border/50 bg-card transition-colors group-hover:bg-muted/30';
const cardCellFirst = 'border-l rounded-l-md';
const cardCellLast = 'border-r rounded-r-md';

function getNumericSize(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function hasOwnWidthConstraint(columnDef: ColumnDef<unknown, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(columnDef, 'size') || Object.prototype.hasOwnProperty.call(columnDef, 'maxSize');
}

function getExplicitWidthConstraint(columnDef: ColumnDef<unknown, unknown>): ColumnWidthConstraint {
  const constrained = hasOwnWidthConstraint(columnDef);
  if (!constrained) {
    return { constrained: false };
  }

  const size = Object.prototype.hasOwnProperty.call(columnDef, 'size') ? getNumericSize(columnDef.size) : undefined;
  const maxSize = Object.prototype.hasOwnProperty.call(columnDef, 'maxSize') ? getNumericSize(columnDef.maxSize) : undefined;
  return { size, maxSize, constrained: true };
}

function getColumnIdFromColumnDef(columnDef: ColumnDef<unknown, unknown>): string | undefined {
  if (typeof columnDef.id === 'string' && columnDef.id.length > 0) {
    return columnDef.id;
  }

  const accessorKey = (columnDef as { accessorKey?: unknown }).accessorKey;
  if (typeof accessorKey === 'string' || typeof accessorKey === 'number') {
    return String(accessorKey);
  }

  return undefined;
}

function collectExplicitWidthConstraintsByColumnId(
  columnDefs: ColumnDef<unknown, unknown>[],
  acc: Map<string, ColumnWidthConstraint> = new Map(),
): Map<string, ColumnWidthConstraint> {
  for (const columnDef of columnDefs) {
    const nestedColumns = (columnDef as { columns?: ColumnDef<unknown, unknown>[] }).columns;
    if (Array.isArray(nestedColumns) && nestedColumns.length > 0) {
      collectExplicitWidthConstraintsByColumnId(nestedColumns, acc);
      continue;
    }

    const columnId = getColumnIdFromColumnDef(columnDef);
    if (!columnId) continue;

    acc.set(columnId, getExplicitWidthConstraint(columnDef));
  }

  return acc;
}

function getColumnWidthStyle(opts: { size?: number; maxSize?: number; fallbackSize: number; sticky: boolean }): React.CSSProperties {
  const size = getNumericSize(opts.size);
  const maxSize = getNumericSize(opts.maxSize);

  if (opts.sticky) {
    const width = size ?? opts.fallbackSize;
    return {
      width,
      minWidth: width,
      maxWidth: maxSize ?? width,
    };
  }

  if (size !== undefined || maxSize !== undefined) {
    const clamp = size ?? maxSize;
    return {
      maxWidth: clamp,
    };
  }

  return {};
}

function shouldClampColumnContent(opts: { constrained: boolean }): boolean {
  return opts.constrained;
}

/** Returns the extra class when the row is visually expanded (open or mid-close animation). */
function expandedCellClass(isVisuallyExpanded: boolean, isFirst: boolean, isLast: boolean): string {
  if (!isVisuallyExpanded) return '';
  if (isFirst) return 'rounded-bl-none border-b-0';
  if (isLast) return 'rounded-br-none border-b-0';
  return 'border-b-0';
}

function normalizeClampLine(clampLine: number): number {
  if (!Number.isFinite(clampLine)) return 0;
  if (clampLine < 1) return 0;
  return Math.floor(clampLine);
}

function AppTable<T extends object>({
  columns,
  data,
  isLoading,
  clampLine = 0,
  manualPagination = false,
  pagination,
  onRowClick,
  getRowClassName,
  getRowProps,
  emptyState,
  enableSorting = false,
  selectable = false,
  onSelectionChange,
  isRowSelectable,
  selectionMode = 'multiple',
  renderExpandedRow,
  expandOnRowClick = true,
  initialExpandedRowIds,
  className,
  stickyHeader = false,
  stickyColumnsLeft = 0,
  stickyColumnsRight = 0,
  stickyColumns,
  scrollContainerMaxHeight,
  horizontalScroll = false,
}: AppTableProps<T>) {
  const { t: tCommon } = useTranslation('common');
  const resolvedEmptyState = emptyState ?? {
    title: tCommon('label.no_data'),
    description: tCommon('label.no_records_found'),
  };
  const isMobile = useIsMobile();
  const normalizedClampLine = normalizeClampLine(clampLine);
  const shouldLineClampContent = normalizedClampLine >= 1;
  const cellContentClampStyle = shouldLineClampContent
    ? ({ ['--app-table-clamp-line' as string]: normalizedClampLine } as React.CSSProperties)
    : undefined;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>(initialExpandedRowIds?.reduce((acc, id) => ({ ...acc, [id]: true }), {}) ?? {});
  const [scrollContainerWidth, setScrollContainerWidth] = useState<number>();

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const selectionColumn = React.useMemo<ColumnDef<T, unknown>>(
    () => ({
      id: '_select',
      header:
        selectionMode === 'multiple'
          ? ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                className='[&>button]:size-4 [&>button]:rounded-[3px]'
              />
            )
          : undefined,
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(checked) => {
              if (selectionMode === 'single' && checked) {
                setRowSelection({ [row.id]: true });
                return;
              }
              row.toggleSelected(checked);
            }}
            className='[&>button]:size-4 [&>button]:rounded-[3px]'
          />
        </div>
      ),
      enableSorting: false,
      size: 50,
    }),
    [selectionMode],
  );
  const canSelectRow = React.useCallback((row: Row<T>) => (isRowSelectable ? isRowSelectable(row.original) : true), [isRowSelectable]);

  const resolvedColumns = React.useMemo(() => (selectable ? [selectionColumn, ...columns] : columns), [columns, selectable, selectionColumn]);
  const explicitWidthConstraintsByColumnId = React.useMemo(
    () => collectExplicitWidthConstraintsByColumnId(resolvedColumns as ColumnDef<unknown, unknown>[]),
    [resolvedColumns],
  );

  // Disable sticky columns on mobile for better horizontal scroll experience
  const leftStickyIdx = isMobile ? 0 : (stickyColumns ?? stickyColumnsLeft ?? 0);
  const rightStickyIdx = isMobile ? 0 : (stickyColumnsRight ?? 0);

  /**
   * Row IDs currently playing their exit animation. Kept separate from tanstack's
   * `expanded` so the main row's "open" cell styles stay active for the full close
   * animation duration, preventing a visual snap-back.
   */
  const [closingRowIds, setClosingRowIds] = useState<Set<string>>(new Set());

  const handleExitComplete = useCallback((rowId: string) => {
    setClosingRowIds((prev) => {
      const next = new Set(prev);
      next.delete(rowId);
      return next;
    });
  }, []);

  const pageCount = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;
  const pageSizeOptions = pagination?.pageSizeOptions || [10, 20, 50, 100];

  // Slice data for client-side pagination when pagination is enabled.
  // When `manualPagination` is true, the caller has already provided the current page.
  const paginatedData = React.useMemo(() => {
    if (!pagination || manualPagination) return data;
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, manualPagination, pagination]);

  const handlePageChange = (newPage: number) => {
    if (pagination) {
      pagination.onPageChange(newPage, pagination.pageSize);
    }
  };

  const handlePageSizeChange = (value: string) => {
    if (pagination) {
      pagination.onPageChange(1, Number(value));
    }
  };
  // Only wrap in overflow container when:
  // - leftStickyIdx > 0 or rightStickyIdx > 0 (need horizontal scroll for column pinning)
  // - scrollContainerMaxHeight is set (explicit vertical scroll container)
  // Otherwise, let stickyHeader work with page scroll
  const needsScrollContainer = horizontalScroll || leftStickyIdx > 0 || rightStickyIdx > 0 || !!scrollContainerMaxHeight;

  const tableState: Record<string, unknown> = {};
  if (enableSorting) tableState.sorting = sorting;
  if (selectable) tableState.rowSelection = rowSelection;
  if (renderExpandedRow) tableState.expanded = expanded;

  const table = useReactTable({
    data: paginatedData,
    columns: resolvedColumns,
    getCoreRowModel: getCoreRowModel(),
    state: tableState,
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
    }),
    ...(selectable && {
      enableRowSelection: canSelectRow,
      enableMultiRowSelection: selectionMode === 'multiple',
      onRowSelectionChange: setRowSelection,
    }),
    ...(renderExpandedRow && {
      getExpandedRowModel: getExpandedRowModel(),
      onExpandedChange: setExpanded,
      getRowCanExpand: () => true,
    }),
  });

  // Cumulative left offsets (px) for each sticky column, derived from column sizes.
  // Column defs should set `size` for accurate offsets; defaults to TanStack's 150px otherwise.
  const { stickyLeftOffsets, stickyRightOffsets, totalWidth } = React.useMemo(() => {
    const headers = table.getHeaderGroups()[0]?.headers ?? [];
    const leftOffsets: number[] = [];
    const rightOffsets: number[] = [];
    let acc = 0;

    // Calculate left offsets
    headers.forEach((h) => {
      leftOffsets.push(acc);
      acc += h.getSize();
    });

    const tableWidth = acc;

    // Calculate right offsets (from right edge, working backwards)
    let rightAcc = 0;
    for (let i = headers.length - 1; i >= 0; i--) {
      rightOffsets[i] = rightAcc;
      rightAcc += headers[i].getSize();
    }

    return { stickyLeftOffsets: leftOffsets, stickyRightOffsets: rightOffsets, totalWidth: tableWidth };
  }, [table]);

  const totalColCount = resolvedColumns.length;

  /**
   * Returns inline style for a sticky column cell.
   * - Left sticky: left offset + subtle right border
   * - Right sticky: right offset + subtle left border
   */
  const getStickyStyle = (colIdx: number): React.CSSProperties | undefined => {
    const isLeftSticky = leftStickyIdx > 0 && colIdx < leftStickyIdx;
    const isRightSticky = rightStickyIdx > 0 && colIdx >= totalColCount - rightStickyIdx;

    if (!isLeftSticky && !isRightSticky) return undefined;

    if (isLeftSticky) {
      return {
        left: stickyLeftOffsets[colIdx] ?? 0,
      };
    }

    if (isRightSticky) {
      return {
        right: stickyRightOffsets[colIdx] ?? 0,
      };
    }

    return undefined;
  };

  /**
   * Check if a column index is a sticky column (left or right)
   */
  const isStickyColumn = (colIdx: number): { isLeft: boolean; isRight: boolean; isFirstLeft: boolean; isLastRight: boolean } => {
    const isLeft = leftStickyIdx > 0 && colIdx < leftStickyIdx;
    const isRight = rightStickyIdx > 0 && colIdx >= totalColCount - rightStickyIdx;
    return {
      isLeft,
      isRight,
      isFirstLeft: isLeft && colIdx === leftStickyIdx - 1,
      isLastRight: isRight && colIdx === totalColCount - rightStickyIdx,
    };
  };

  useEffect(() => {
    if (!selectable || !onSelectionChange) return;
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    onSelectionChange(selected);
  }, [rowSelection, selectable, onSelectionChange, table]);

  const rows = table.getRowModel().rows;

  useEffect(() => {
    if (!renderExpandedRow) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const updateWidth = () => setScrollContainerWidth(container.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => observer.disconnect();
  }, [renderExpandedRow]);

  const pageSizeSelectOptions = pageSizeOptions.map((option) => ({
    label: option.toString(),
    value: option.toString(),
  }));

  return (
    <div className={cn('space-y-4', className)}>
      {/*
       * border-spacing-y-0: no automatic row gap — gaps are provided by explicit
       * spacer <tr> rows so we can suppress them precisely around expanded panels,
       * eliminating the phantom layout space that caused the close-animhation flicker.
       */}
      <div
        ref={scrollContainerRef}
        className={cn(needsScrollContainer && 'app-scrollbar overflow-auto')}
        style={scrollContainerMaxHeight ? { maxHeight: scrollContainerMaxHeight } : undefined}
      >
        <Table
          className='border-separate border-spacing-y-0'
          noContainer={stickyHeader || needsScrollContainer}
          style={{ minWidth: needsScrollContainer ? `${totalWidth}px` : undefined }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-0 hover:bg-transparent'>
                {headerGroup.headers.map((header, hIdx) => {
                  const columnMeta = header.column.columnDef.meta as AppTableColumnMeta | undefined;
                  const { isLeft, isRight, isFirstLeft, isLastRight } = isStickyColumn(hIdx);
                  const widthConstraint = explicitWidthConstraintsByColumnId.get(header.column.id) ?? { constrained: false };
                  const shouldClamp = shouldClampColumnContent({
                    constrained: widthConstraint.constrained,
                  });
                  const widthStyle = getColumnWidthStyle({
                    size: widthConstraint.size,
                    maxSize: widthConstraint.maxSize,
                    fallbackSize: header.getSize(),
                    sticky: isLeft || isRight,
                  });
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getStickyStyle(hIdx),
                        ...widthStyle,
                      }}
                      className={cn(
                        'h-9 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70',
                        stickyHeader && 'sticky top-0 bg-background z-20',
                        // Sticky column styles
                        (isLeft || isRight) && 'sticky z-30 bg-background',
                        // Border indicators for sticky boundaries
                        isFirstLeft &&
                          "after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-1 after:translate-x-full after:pointer-events-none after:bg-linear-to-r after:from-primary/5 after:to-transparent z-30",
                        isLastRight &&
                          "before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1 before:-translate-x-full before:pointer-events-none before:bg-linear-to-l before:from-primary/5 before:to-transparent z-30",
                        // Z-index layering
                        stickyHeader && (isLeft || isRight) ? 'z-40' : undefined,
                        columnMeta?.headerClassName,
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div className={cn('[&_svg]:shrink-0 min-w-0 max-w-full', shouldClamp && 'min-w-0 max-w-full')}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                {/* Top spacer to match the gap that sits above the first data row */}
                <TableRow className='border-0 pointer-events-none'>
                  <TableCell colSpan={resolvedColumns.length} className='p-0 h-2 border-0' />
                </TableRow>
                <TableRow className='hover:bg-transparent border-0'>
                  <TableCell colSpan={resolvedColumns.length} className='p-0'>
                    <SkeletonTable rows={5} columns={resolvedColumns.length} className='border-0 rounded-none' />
                  </TableCell>
                </TableRow>
              </>
            ) : rows.length ? (
              rows.map((row, rowIdx) => {
                const isExpanded = row.getIsExpanded();
                // True during open AND during exit animation — drives cell style & spacer visibility
                const isVisuallyExpanded = isExpanded || closingRowIds.has(row.id);
                const isClickable = !!onRowClick || (!!renderExpandedRow && expandOnRowClick);
                const isLastRow = rowIdx === rows.length - 1;
                const rowProps = getRowProps?.(row.original);

                return (
                  <React.Fragment key={row.id}>
                    {/* Gap row above each data row (replaces border-spacing-y) */}
                    <TableRow className='border-0 pointer-events-none'>
                      <TableCell colSpan={resolvedColumns.length} className='p-0 h-2 border-0' />
                    </TableRow>

                    {/* Main data row */}
                    <TableRow
                      {...rowProps}
                      className={cn(
                        'group border-0 rounded-md',
                        isClickable && 'cursor-pointer',
                        isVisuallyExpanded ? 'bg-primary/4 ' : 'bg-transparent',
                        getRowClassName?.(row.original),
                        rowProps?.className,
                      )}
                      onClick={(event) => {
                        rowProps?.onClick?.(event);
                        if (renderExpandedRow && expandOnRowClick) {
                          if (isExpanded) setClosingRowIds((prev) => new Set([...prev, row.id]));
                          row.toggleExpanded();
                        }
                        onRowClick?.(row.original);
                      }}
                    >
                      {row.getVisibleCells().map((cell, idx, arr) => {
                        const isFirst = idx === 0;
                        const isLast = idx === arr.length - 1;
                        const { isLeft, isRight, isFirstLeft, isLastRight } = isStickyColumn(idx);
                        const widthConstraint = explicitWidthConstraintsByColumnId.get(cell.column.id) ?? { constrained: false };
                        const shouldClamp = shouldClampColumnContent({
                          constrained: widthConstraint.constrained,
                        });
                        const disableContentClamp = Boolean((cell.column.columnDef.meta as AppTableColumnMeta | undefined)?.disableContentClamp);
                        const cellClassName = (cell.column.columnDef.meta as AppTableColumnMeta | undefined)?.cellClassName;
                        const widthStyle = getColumnWidthStyle({
                          size: widthConstraint.size,
                          maxSize: widthConstraint.maxSize,
                          fallbackSize: cell.column.getSize(),
                          sticky: isLeft || isRight,
                        });
                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              ...getStickyStyle(idx),
                              ...widthStyle,
                            }}
                            className={cn(
                              'relative px-4 py-3.5 text-sm',
                              cardCellBase,
                              isVisuallyExpanded && 'bg-primary/4 border-primary/20',
                              isFirst && cardCellFirst,
                              isLast && cardCellLast,
                              expandedCellClass(isVisuallyExpanded, isFirst, isLast),
                              // Sticky column: solid bg to prevent bleed-through
                              (isLeft || isRight) && 'sticky z-10 bg-card group-hover:bg-muted',
                              isVisuallyExpanded &&
                                // Expanded state override
                                (isLeft || isRight) &&
                                'bg-white!',
                              // Border indicators for sticky boundaries
                              isFirstLeft &&
                                "after:content-[''] after:absolute after:top-0 after:right-0 after:bottom-0 after:w-1 after:translate-x-full after:pointer-events-none after:bg-linear-to-r after:from-primary/10 after:to-transparent",
                              isLastRight &&
                                "before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:w-1 before:-translate-x-full before:pointer-events-none before:bg-linear-to-l before:from-primary/10 before:to-transparent",
                              cellClassName,
                            )}
                          >
                            <div
                              className={cn(
                                '[&_svg]:shrink-0 min-w-0 max-w-full',
                                shouldClamp && 'min-w-0 max-w-full',
                                disableContentClamp && 'min-w-max max-w-none whitespace-nowrap',
                                shouldLineClampContent &&
                                  !disableContentClamp &&
                                  '[&>.flex]:min-w-0 [&>.flex]:max-w-full [&>.flex]:grid [&>.flex]:grid-cols-[auto_minmax(0,1fr)] [&>.flex]:items-start [&>.flex]:gap-x-2 [&>.flex>:first-child]:shrink-0 [&>.flex>:first-child]:self-start [&>.flex>:last-child]:min-w-0 [&>.flex>:last-child]:overflow-hidden [&>.flex>:last-child]:[display:-webkit-box] [&>.flex>:last-child]:[-webkit-box-orient:vertical] [&>.flex>:last-child]:[-webkit-line-clamp:var(--app-table-clamp-line)] [&>.flex>:last-child]:[overflow-wrap:anywhere] [&>.flex>:last-child]:[word-break:break-word] [&>*:not(.flex)]:overflow-hidden [&>*:not(.flex)]:[display:-webkit-box] [&>*:not(.flex)]:[-webkit-box-orient:vertical] [&>*:not(.flex)]:[-webkit-line-clamp:var(--app-table-clamp-line)] [&>*:not(.flex)]:[overflow-wrap:anywhere] [&>*:not(.flex)]:[word-break:break-word]',
                                !shouldLineClampContent &&
                                  !disableContentClamp &&
                                  'whitespace-normal break-words [overflow-wrap:anywhere] [&>.flex]:min-w-0 [&>.flex]:max-w-full [&>.flex]:flex-wrap [&>.flex>*]:min-w-0 [&>.flex>*]:max-w-full [&>.flex>*]:whitespace-normal [&>.flex>*]:break-words',
                              )}
                              style={cellContentClampStyle}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    {/* Animated expanded content panel */}
                    <AnimatePresence initial={false} onExitComplete={() => handleExitComplete(row.id)}>
                      {isExpanded && renderExpandedRow && (
                        <TableRow className='relative z-[4] border-0'>
                          <TableCell
                            colSpan={resolvedColumns.length}
                            className='relative z-[4] border-x border-b border-border/50 bg-card rounded-b-md p-0'
                          >
                            <motion.div
                              key={`exp-${row.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                height: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                                // Fade out before height fully collapses to hide any residual gap
                                opacity: { duration: 0.1 },
                              }}
                            >
                              <div
                                className='sticky left-0 px-4 pb-4 pt-2'
                                style={scrollContainerWidth ? { width: scrollContainerWidth } : undefined}
                              >
                                {renderExpandedRow(row.original)}
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>

                    {/*
                     * Bottom spacer — only rendered when the row is NOT visually expanded.
                     * Suppressed during the close animation (isVisuallyExpanded=true) so
                     * there is no extra layout space below the panel while it's shrinking.
                     * Reappears only after onExitComplete fires and the DOM node is gone.
                     */}
                    {!isLastRow && !isVisuallyExpanded && (
                      <TableRow className='border-0 pointer-events-none'>
                        <TableCell colSpan={resolvedColumns.length} className='p-0 h-0 border-0' />
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow className='hover:bg-transparent border-0'>
                <TableCell colSpan={resolvedColumns.length} className='py-16'>
                  <AppEmpty title={resolvedEmptyState.title} description={resolvedEmptyState.description} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-1'>
          <div className='flex items-center gap-3 text-sm text-muted-foreground'>
            <span className='whitespace-nowrap font-medium'>{tCommon('label.rows_per_page')}</span>

            <AppSelect
              options={pageSizeSelectOptions}
              value={String(pagination.pageSize ?? 10)}
              onChange={handlePageSizeChange}
              clearable={false}
              className='h-8 w-20 bg-card border-border/50 text-xs  focus:ring-1 flex items-center'
            />

            <span className='hidden md:inline-block opacity-60 italic'> {tCommon('label.total_records', { count: pagination.total })}</span>
          </div>

          {pageCount > 0 && (
            <div className='flex justify-center'>
              <AppPagination page={pagination.page} pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { AppTable, type AppTableProps };
