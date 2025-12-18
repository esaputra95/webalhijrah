"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HiChevronUp, HiChevronDown, HiSelector } from "react-icons/hi";
import { cn } from "@/utils/cn";
import TextInput from "@/components/ui/inputs/TextInput";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T, index?: number) => React.ReactNode;
  filterable?: boolean;
  filterType?: "text" | "select" | "date";
  filterOptions?: { label: string; value: string | number }[];
  sortable?: boolean;
  sticky?: "left" | "right";
  className?: string;
  headerClassName?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const baseBtn =
    "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 transition disabled:text-gray-400 disabled:cursor-not-allowed";
  const maxVisible = 10;

  const getPaginationRangeWithDots = (): (number | "...")[] => {
    const range: (number | "...")[] = [];
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const left = Math.max(1, currentPage - 2);
    const right = Math.min(totalPages, currentPage + 2);
    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 1;

    range.push(1);
    if (showLeftDots) range.push("...");

    for (let i = left; i <= right; i++) {
      // Avoid duplication of 1 or totalPages if already pushed explicitly
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    if (showRightDots) range.push("...");
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="inline-flex rounded overflow-hidden mt-4">
      <button
        className="flex text-sm items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 rounded-s-lg"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </button>
      <button
        className="flex text-sm items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {getPaginationRangeWithDots().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className={baseBtn}>
            ...
          </span>
        ) : (
          <button
            key={idx}
            className={cn(
              baseBtn,
              page === currentPage &&
                "bg-blue-700 border-blue-700 text-white font-semibold"
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-3 h-8 text-sm flex items-center justify-center leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
      <button
        className="px-3 h-8 text-sm border rounded-e-lg flex items-center justify-center leading-tight text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalPages: number;
  filterDelay?: number;
  isLoading?: boolean;
  skeletonRows?: number;
  renderDetail?: (row: T, index?: number) => React.ReactNode;
  detailColumnWidth?: string;
}

/** Versi stabil: guard router.replace, dependency effect rapi */
export function Table<T extends { id?: string | number }>({
  data,
  columns,
  totalPages,
  filterDelay = 500,
  isLoading,
  skeletonRows = 4,
  renderDetail,
  detailColumnWidth = "40px",
}: TableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // read-only

  const [expanded, setExpanded] = useState<Set<string | number>>(new Set());

  const rowKey = (row: T, index: number) => {
    return row.id ?? index;
  };

  const toggleExpand = (key: string | number) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // daftar key kolom (stabil untuk dependency)
  const columnKeys = useMemo(
    () => columns.map((c) => String(c.accessor)),
    [columns]
  );

  // helper: build query baru & navigate — hanya jika berubah
  const setQuery = useCallback(
    (mutator: (sp: URLSearchParams) => void) => {
      const curr = searchParams?.toString() || "";
      const sp = new URLSearchParams(curr);
      mutator(sp);
      const next = sp.toString();
      if (next === curr) return; // guard: hindari replace jika sama
      router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );

  const currentLimit = useMemo(
    () => parseInt(searchParams.get("limit") || "10", 10),
    [searchParams]
  );

  const sortBy = searchParams.get("sortby") || "";
  const sortDir = searchParams.get("sort") || "";

  const [lastFocusedFilter, setLastFocusedFilter] = useState<string | null>(
    null
  );

  // init filter dari URL
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    columns.forEach((col) => {
      const k = String(col.accessor);
      const val = searchParams.get(k);
      if (val) initial[k] = val;
    });
    return initial;
  });

  // ⬇️ Tambahkan effect ini setelah state filters
  useEffect(() => {
    const next: Record<string, string> = {};
    for (const key of columnKeys) {
      const val = searchParams.get(key);
      if (val) next[key] = val;
    }
    // update hanya jika berbeda agar tidak bikin loop
    const same =
      Object.keys(next).length === Object.keys(filters).length &&
      Object.keys(next).every((k) => next[k] === filters[k]);

    if (!same) setFilters(next);
  }, [searchParams, columnKeys]);

  const handlePageChange = (page: number) => {
    setQuery((sp) => {
      sp.set("page", String(page));
    });
  };

  const handleLimitChange = (limit: number) => {
    setQuery((sp) => {
      sp.set("limit", String(limit));
      sp.set("page", "1"); // reset to page 1 when limit changes
    });
  };

  const toggleSort = (field: string) => {
    setQuery((sp) => {
      const currentSortBy = sp.get("sortby");
      const currentSortDir = sp.get("sort") || "asc";
      if (currentSortBy === field) {
        sp.set("sort", currentSortDir === "asc" ? "desc" : "asc");
      } else {
        sp.set("sortby", field);
        sp.set("sort", "asc");
      }
      sp.set("page", "1"); // reset halaman saat sort berubah
    });
  };

  // sinkron filters -> querystring (debounce) — reset page hanya jika filter berubah
  useEffect(() => {
    const handler = setTimeout(() => {
      const current = new URLSearchParams(searchParams?.toString() || "");
      let changed = false;

      for (const key of columnKeys) {
        const prevVal = current.get(key) ?? "";
        const nextVal = filters[key] ?? "";
        if (prevVal !== nextVal) {
          changed = true;
          break;
        }
      }
      if (!changed) return; // tidak ada perubahan filter -> jangan reset page

      setQuery((sp) => {
        columnKeys.forEach((key) => {
          const val = filters[key];
          if (val) sp.set(key, val);
          else sp.delete(key);
        });
        sp.set("page", "1"); // reset page hanya ketika filter berubah
      });
    }, filterDelay);

    return () => clearTimeout(handler);
  }, [filters, filterDelay, setQuery, columnKeys, searchParams]);

  const getStickyClass = (sticky?: "left" | "right", isHeader?: boolean) => {
    if (sticky === "left") {
      return cn(
        "sticky left-0 bg-white",
        isHeader ? "z-[3]" : "z-[2]",
        "after:absolute after:inset-y-0 after:-right-[1px] after:w-[1px] after:bg-gray-200"
      );
    }
    if (sticky === "right") {
      return cn(
        "sticky right-0 bg-white",
        isHeader ? "z-[3]" : "z-[2]",
        "before:pointer-events-none before:absolute before:inset-y-0 before:-left-2 before:w-2 before:bg-gradient-to-l before:from-gray-200/60 before:to-transparent"
      );
    }
    return "";
  };

  return (
    <div className="relative overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      <table className="w-full min-w-full text-sm text-left text-gray-500 table-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {renderDetail && (
              <th
                className={cn(
                  "px-2 py-3 whitespace-wrap"
                  // no sticky for detail column
                )}
                style={{ width: detailColumnWidth }}
              />
            )}
            {columns.map((col, index) => {
              const isAsc = sortBy === col.accessor && sortDir === "asc";
              const isDesc = sortBy === col.accessor && sortDir === "desc";
              return (
                <th
                  key={index}
                  className={cn(
                    "px-2 py-3 cursor-pointer select-none whitespace-wrap",
                    getStickyClass(col.sticky, true),
                    col.headerClassName
                  )}
                  onClick={() =>
                    col.sortable && toggleSort(col.accessor as string)
                  }
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable &&
                      (isAsc ? (
                        <HiChevronUp className="w-4 h-4" />
                      ) : isDesc ? (
                        <HiChevronDown className="w-4 h-4" />
                      ) : (
                        <HiSelector className="w-4 h-4 text-gray-300" />
                      ))}
                  </span>
                </th>
              );
            })}
          </tr>

          <tr>
            {renderDetail && (
              <th
                className={cn(
                  "px-2 py-2 whitespace-wrap"
                  // no sticky for detail column
                )}
                style={{ width: detailColumnWidth }}
              >
                <div className="h-8" />
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={index}
                className={cn(
                  "px-2 py-2 cursor-pointer select-none whitespace-wrap",
                  getStickyClass(col.sticky, true),
                  col.headerClassName
                )}
              >
                {!col.filterable ? (
                  <div className="h-8" />
                ) : col.filterType === "select" ? (
                  <select
                    onFocus={() => setLastFocusedFilter(col.accessor as string)}
                    className="block h-9 w-full px-2 rounded-md border-0 py-2 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
                    value={filters[col.accessor as string] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [col.accessor as string]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Semua</option>
                    {col?.filterOptions?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : col.filterType === "date" ? (
                  <TextInput
                    type="date"
                    onFocus={() => setLastFocusedFilter(col.accessor as string)}
                    value={filters[col.accessor as string] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [col.accessor as string]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <TextInput
                    value={filters[col.accessor as string] || ""}
                    onFocus={() => setLastFocusedFilter(col.accessor as string)}
                    autoFocus={lastFocusedFilter === col.accessor}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [col.accessor as string]: e.target.value,
                      }))
                    }
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonRows }).map((_, rIdx) => (
              <tr
                key={`sk-${rIdx}`}
                className="bg-white border-b border-gray-200"
              >
                {renderDetail && (
                  <td
                    className="px-2 py-3"
                    style={{ width: detailColumnWidth }}
                  >
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </td>
                )}
                {columns.map((col, cIdx) => (
                  <td
                    key={`skc-${rIdx}-${cIdx}`}
                    className={cn(
                      "px-2 py-3",
                      getStickyClass(col.sticky, false),
                      col.className
                    )}
                  >
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderDetail ? 1 : 0)}
                className="text-center py-4 text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const k = rowKey(row, rowIndex);
              const isOpen = expanded.has(k);
              return (
                <React.Fragment key={k}>
                  <tr className="bg-white border-b border-gray-200">
                    {renderDetail && (
                      <td
                        className="px-1 py-2"
                        style={{ width: detailColumnWidth }}
                      >
                        <button
                          type="button"
                          aria-label={
                            isOpen
                              ? "Collapse row details"
                              : "Expand row details"
                          }
                          aria-expanded={isOpen}
                          onClick={() => toggleExpand(k)}
                          className="rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          <HiChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                      </td>
                    )}
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={cn(
                          "px-2 py-2 whitespace-wrap align-top",
                          getStickyClass(col.sticky, false),
                          col.className
                        )}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : (row[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                  {renderDetail && isOpen && (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="bg-gray-50 border-b border-gray-200"
                      >
                        <div className="p-4">{renderDetail(row, rowIndex)}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>

      <div className="mt-2 flex flex-wrap gap-4 justify-between px-2 items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setFilters({});
              setQuery((sp) => {
                sp.set("page", "1");
                sp.set("limit", "10");
                columnKeys.forEach((k) => sp.delete(k)); // bersihkan semua filter terdaftar
                sp.delete("sortby");
                sp.delete("sort");
              });
            }}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
          >
            Reset Filter
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={currentLimit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none h-8"
            >
              {[10, 20, 50, 100].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
