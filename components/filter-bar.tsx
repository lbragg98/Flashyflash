"use client";

import { FlashType } from "@/lib/clubs";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export type SortKey =
  | "rating-desc"
  | "price-asc"
  | "price-desc"
  | "age-desc"
  | "name-asc";

export interface Filters {
  sfwFriendly: boolean | null;
  sfwActive: boolean | null;
  flashType: FlashType | null;
  priceMin: number;
  priceMax: number;
  ratingMin: number;
  ageMin: number;
  ageMax: number;
}

export const DEFAULT_FILTERS: Filters = {
  sfwFriendly: null,
  sfwActive: null,
  flashType: null,
  priceMin: 0,
  priceMax: 999,
  ratingMin: 0,
  ageMin: 0,
  ageMax: 99,
};

const FLASH_TYPES: FlashType[] = ["Sheet", "Custom", "Guest", "Hybrid", "Walk-In"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "age-desc", label: "Club Age: Oldest First" },
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
      className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${
        active
          ? "bg-primary text-primary-foreground border-primary glow-primary"
          : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
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
    filters.priceMax < 999 ||
    filters.priceMin > 0 ||
    filters.ratingMin > 0 ||
    filters.ageMin > 0 ||
    filters.ageMax < 99;

  const reset = () => onFiltersChange(DEFAULT_FILTERS);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={expanded}
        >
          <SlidersHorizontal size={15} className="text-primary" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              ON
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground hidden sm:block">
          {resultCount} club{resultCount !== 1 ? "s" : ""}
        </span>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="appearance-none text-xs bg-secondary text-foreground border border-border rounded-lg pl-3 pr-7 py-1.5 cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Sort clubs"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Clear all filters"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filter panel */}
      {expanded && (
        <div className="border-t border-border/50 px-4 py-4 flex flex-col gap-4">
          {/* Flash Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Flash Type</span>
            <div className="flex flex-wrap gap-1.5">
              {FLASH_TYPES.map((ft) => (
                <ToggleChip
                  key={ft}
                  active={filters.flashType === ft}
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      flashType: filters.flashType === ft ? null : ft,
                    })
                  }
                >
                  {ft}
                </ToggleChip>
              ))}
            </div>
          </div>

          {/* SFW */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground w-24 shrink-0">SFW</span>
            <div className="flex flex-wrap gap-1.5">
              <ToggleChip
                active={filters.sfwFriendly === true}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    sfwFriendly: filters.sfwFriendly === true ? null : true,
                  })
                }
              >
                SFW Friendly
              </ToggleChip>
              <ToggleChip
                active={filters.sfwActive === true}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    sfwActive: filters.sfwActive === true ? null : true,
                  })
                }
              >
                SFW Active
              </ToggleChip>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Price Range</span>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="price-min">Min price</label>
              <input
                id="price-min"
                type="number"
                min={0}
                max={999}
                value={filters.priceMin}
                onChange={(e) =>
                  onFiltersChange({ ...filters, priceMin: Number(e.target.value) })
                }
                className="w-20 text-xs bg-secondary border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="$0"
              />
              <span className="text-muted-foreground text-xs">—</span>
              <label className="sr-only" htmlFor="price-max">Max price</label>
              <input
                id="price-max"
                type="number"
                min={0}
                max={999}
                value={filters.priceMax}
                onChange={(e) =>
                  onFiltersChange({ ...filters, priceMax: Number(e.target.value) })
                }
                className="w-20 text-xs bg-secondary border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="$999"
              />
            </div>
          </div>

          {/* Rating Min */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Min Rating</span>
            <div className="flex gap-1.5">
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

          {/* Club Age */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Club Age</span>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: "Any", min: 0, max: 99 },
                { label: "< 2 yrs", min: 0, max: 2 },
                { label: "2–5 yrs", min: 2, max: 5 },
                { label: "5–10 yrs", min: 5, max: 10 },
                { label: "10+ yrs", min: 10, max: 99 },
              ].map((a) => (
                <ToggleChip
                  key={a.label}
                  active={filters.ageMin === a.min && filters.ageMax === a.max}
                  onClick={() =>
                    onFiltersChange(
                      filters.ageMin === a.min && filters.ageMax === a.max
                        ? { ...filters, ageMin: 0, ageMax: 99 }
                        : { ...filters, ageMin: a.min, ageMax: a.max }
                    )
                  }
                >
                  {a.label}
                </ToggleChip>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
