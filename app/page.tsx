"use client";

import { useState, useMemo, useEffect } from "react";
import { Club } from "@/lib/clubs";
import { ClubCard } from "@/components/club-card";
import { ClubDetailModal } from "@/components/club-detail-modal";
import {
  FilterBar,
  Filters,
  SortKey,
  DEFAULT_FILTERS,
} from "@/components/filter-bar";
import { Search, Zap } from "lucide-react";

export default function Home() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("rating-desc");
  const [selected, setSelected] = useState<Club | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/clubs");
        if (!response.ok) throw new Error("Failed to fetch clubs");
        const data = await response.json();
        setClubs(data);
        setError(null);
      } catch (err) {
        console.error("[v0] Error fetching clubs:", err);
        setError("Failed to load clubs from Google Sheets");
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filtered = useMemo(() => {
    let result = clubs;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (filters.sfwFriendly !== null) {
      result = result.filter((c) => c.sfwFriendly === filters.sfwFriendly);
    }

    if (filters.sfwActive !== null) {
      result = result.filter((c) => c.sfwActive === filters.sfwActive);
    }

    if (filters.flashType !== null) {
      result = result.filter((c) => c.flashType === filters.flashType);
    }

    result = result.filter((c) => c.avgRating >= filters.ratingMin);

    const sorted = [...result];

    switch (sort) {
      case "rating-desc":
        sorted.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "rating-asc":
        sorted.sort((a, b) => a.avgRating - b.avgRating);
        break;
      case "price-asc":
        sorted.sort((a, b) => a.avgPrice - b.avgPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.avgPrice - a.avgPrice);
        break;
      case "invSpeed-desc":
        sorted.sort((a, b) => b.invSpeed - a.invSpeed);
        break;
      case "yeetSpeed-desc":
        sorted.sort((a, b) => b.yeetSpeed - a.yeetSpeed);
        break;
      case "preparedness-desc":
        sorted.sort((a, b) => b.preparedness - a.preparedness);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return sorted;
  }, [clubs, search, filters, sort]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center justify-center gap-3">
            <div className="h-px w-10 storm-divider" />
            <h1 className="storm-text-glow text-4xl font-black tracking-tight sm:text-5xl flex items-center gap-2">
              <Zap size={28} className="text-[#71c7ff] drop-shadow-[0_0_8px_#71c7ff]" fill="currentColor" />
              <span className="text-white">Flash</span>
              <span className="text-[#71c7ff]">Hub</span>
              <Zap size={28} className="text-[#71c7ff] drop-shadow-[0_0_8px_#71c7ff]" fill="currentColor" />
            </h1>
            <div className="h-px w-10 storm-divider" />
          </div>

          <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-[#9ea9c5] sm:text-base">
            Discover. Compare. Flash.
          </p>

          <div className="mx-auto h-px max-w-xs storm-divider" />
        </header>

        <div className="mb-6">
          <label htmlFor="search" className="sr-only">
            Search clubs
          </label>
          <div className="storm-panel-soft relative rounded-2xl p-2">
            <Search
              size={16}
              className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[#7f8cac]"
            />
            <input
              id="search"
              type="search"
              placeholder="Search clubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="storm-input w-full rounded-xl py-3 pl-10 pr-4 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="mb-8">
          <FilterBar
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            resultCount={filtered.length}
          />
        </div>

        {loading ? (
          <main className="flex flex-col items-center justify-center gap-4 py-28 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#71c7ff]/20 border-t-[#71c7ff]" />
            <p className="text-sm text-[#9ea9c5]">Loading clubs...</p>
          </main>
        ) : error ? (
          <main className="storm-panel flex flex-col items-center justify-center gap-4 rounded-3xl px-6 py-20 text-center">
            <Zap size={40} className="text-rose-400/40" />
            <p className="text-sm text-rose-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-[#71c7ff] transition hover:text-[#a7dcff]"
            >
              Try again
            </button>
          </main>
        ) : filtered.length > 0 ? (
          <main>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((club) => (
                <ClubCard key={club.id} club={club} onSelect={setSelected} />
              ))}
            </div>
          </main>
        ) : (
          <main className="storm-panel flex flex-col items-center justify-center gap-4 rounded-3xl px-6 py-20 text-center">
            <Zap size={40} className="text-[#7f8cac]/40" />
            <p className="text-sm text-[#9ea9c5]">
              No clubs match your current filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setFilters(DEFAULT_FILTERS);
              }}
              className="text-sm font-medium text-[#71c7ff] transition hover:text-[#a7dcff]"
            >
              Clear search &amp; filters
            </button>
          </main>
        )}

        <footer className="mt-16 text-center">
          <div className="mx-auto mb-4 h-px max-w-xs storm-divider" />
          <p className="text-xs text-[#7f8cac]">
            {clubs.length} clubs in the directory
          </p>
        </footer>
      </div>

      <ClubDetailModal club={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
