"use client";

import { FlashType } from "@/lib/clubs";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export type SortKey =
  | "rating-desc"
  | "rating-asc"
  | "price-asc"
  | "price-desc"
  | "invSpeed-desc"
  | "yeetSpeed-desc"
  | "preparedness-desc"
  | "name-asc";

export interface Filters {
  sfwFriendly: boolean | null;
  sfwActive: boolean | null;
  flashType: FlashType | null;
  ratingMin: number;
}

export const DEFAULT_FILTERS: Filters = {
  sfwFriendly: null,
  sfwActive: null,
  flashType: null,
  ratingMin: 0,
};

const FLASH_TYPES: FlashType[] = ["Dog", "Cat", "Invites", "Hybrid"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "invSpeed-desc", label: "Inv Speed: Fastest" },
  { value: "yeetSpeed-desc", label: "Yeet Speed: Fastest" },
  { value: "preparedness-desc", label: "Preparedness: Highest" },
  { value: "name-asc", label: "Name: A to Z" },
];

interface FilterBarProps {
  filters: Filters;
  sort: SortKey;
  onFiltersChange: (f: Filters) => void;
  onSortChange: (s: SortKey) => void;
  resultCount: number;
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
        active
          ? "bg-[#00d4ff]/25 text-[#4dffff] border-[#00d4ff]/50"
          : "bg-[#1a2447]/50 text-[#8a96b4] border-[#00d4ff]/10 hover:border-[#00d4ff]/30"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterBar({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters =
    filters.sfwFriendly !== null ||
    filters.sfwActive !== null ||
    filters.flashType !== null ||
    filters.ratingMin > 0;

  return (
    <div className="space-y-3">
      {/* Top bar: Sort and Expand */}
      <div className="storm-panel flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <SlidersHorizontal size={16} className="text-[#00d4ff] shrink-0" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="storm-input text-xs py-1.5 px-2"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#8a96b4] font-medium">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              expanded || hasActiveFilters
                ? "bg-[#00d4ff]/20 text-[#4dffff] border border-[#00d4ff]/40"
                : "text-[#6b7793] hover:text-[#00d4ff]"
            }`}
          >
            <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded filters panel */}
      {expanded && (
        <div className="storm-panel-dark p-4 space-y-4">
          {/* Flash Type */}
          <div>
            <div className="text-xs uppercase tracking-wide font-bold text-[#4dffff] mb-2">
              Flash Type
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {FLASH_TYPES.map((type) => (
                <ToggleChip
                  key={type}
                  active={filters.flashType === type}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      flashType: filters.flashType === type ? null : type,
                    })
                  }
                >
                  {type}
                </ToggleChip>
              ))}
            </div>
          </div>

          <div className="storm-divider" />

          {/* SFW Filters */}
          <div>
            <div className="text-xs uppercase tracking-wide font-bold text-[#4dffff] mb-2">
              SFW Options
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sfwFriendly === true}
                  onChange={() =>
                    onFiltersChange({
                      ...filters,
                      sfwFriendly: filters.sfwFriendly === true ? null : true,
                    })
                  }
                  className="w-4 h-4 rounded bg-[#1a2447] border border-[#00d4ff]/30 cursor-pointer"
                />
                <span className="text-sm text-[#f0f4ff]">SFW Friendly</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sfwActive === true}
                  onChange={() =>
                    onFiltersChange({
                      ...filters,
                      sfwActive: filters.sfwActive === true ? null : true,
                    })
                  }
                  className="w-4 h-4 rounded bg-[#1a2447] border border-[#00d4ff]/30 cursor-pointer"
                />
                <span className="text-sm text-[#f0f4ff]">SFW Active</span>
              </label>
            </div>
          </div>

          <div className="storm-divider" />

          {/* Min Rating */}
          <div>
            <div className="text-xs uppercase tracking-wide font-bold text-[#4dffff] mb-2">
              Min Rating
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <ToggleChip
                  key={r}
                  active={filters.ratingMin === r}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      ratingMin: filters.ratingMin === r ? 0 : r,
                    })
                  }
                >
                  {r === 0 ? "Any" : `${r}+`}
                </ToggleChip>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <>
              <div className="storm-divider" />
              <button
                onClick={() => onFiltersChange(DEFAULT_FILTERS)}
                className="w-full py-2 rounded-lg text-xs font-semibold text-[#ff3366] border border-[#ff3366]/30 hover:bg-[#ff3366]/10 transition-all duration-200"
              >
                Clear All Filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
