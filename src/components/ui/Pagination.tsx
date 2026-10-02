"use client";

import Button from "@/components/ui/Button";
import { PaginationProps } from "@/types/components";

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) {
  if (total <= 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);
  const isFirstPage = page <= 1;
  const isLastPage = page * limit >= total;

  return (
    <div className="px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 text-xs">
      <div className="text-slate-500 font-medium">
        Showing <span className="font-semibold text-slate-900">{startItem}</span> to{" "}
        <span className="font-semibold text-slate-900">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-900">{total}</span> {itemLabel}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirstPage}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
