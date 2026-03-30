"use client";

import { useState, useMemo, useEffect } from "react";
import { Club } from "@/lib/clubs";
import { ClubCard } from "@/components/club-card";
import { ClubDetailModal } from "@/components/club-detail-modal";
import { FilterBar, Filters, SortKey, DEFAULT_FILTERS } from "@/components/filter-bar";
import { Search, Zap, CloudLightning } from "lucide-react";

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

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }

    // Filters
    if (filters.sfwFriendly !== null) result = result.filter((c) => c.sfwFriendly === filters.sfwFriendly);
    if (filters.sfwActive !== null) result = result.filter((c) => c.sfwActive === filters.sfwActive);
    if (filters.flashType !== null) result = result.filter((c) => c.flashType === filters.flashType);
    result = result.filter((c) => c.avgRating >= filters.ratingMin);

    // Sort
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-[#00d4ff] to-[#b366ff]" />
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">
              <span className="text-[#f0f4ff]">STORM</span>
              <span className="text-[#00d4ff]">STRIKE</span>
            </h1>
            <div className="h-1 w-8 bg-gradient-to-l from-[#00d4ff] to-[#b366ff]" />
          </div>
          <p className="text-[#8a96b4] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            The definitive club directory. Filter by type, rating, speed, and more.
          </p>
          <div className="storm-divider max-w-xs mx-auto" />
        </header>

        {/* Search */}
        <div className="mb-6 relative">
          <label htmlFor="search" className="sr-only">Search clubs</label>
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7793] pointer-events-none"
          />
          <input
            id="search"
            type="search"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="storm-input w-full pl-10 pr-4 py-3 text-base"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-8"
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            resultCount={filtered.length}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <main className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-[#00d4ff]/20 border-t-[#00d4ff] rounded-full animate-spin" />
            <p className="text-[#8a96b4] text-sm">Loading clubs...</p>
          </main>
        ) : error ? (
          <main className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <Zap size={40} className="text-[#ff3366]/30" />
            <p className="text-[#ff3366] text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-[#00d4ff] hover:text-[#4dffff] transition-colors"
            >
              Try again
            </button>
          </main>
        ) : filtered.length > 0 ? (
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((club) => (
                <ClubCard key={club.id} club={club} onSelect={setSelected} />
              ))}
            </div>
          </main>
        ) : (
          <main className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <Zap size={40} className="text-[#6b7793]/30" />
            <p className="text-[#8a96b4] text-sm">No clubs match your filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setFilters(DEFAULT_FILTERS);
              }}
              className="text-xs text-[#00d4ff] hover:text-[#4dffff] transition-colors"
            >
              Clear search &amp; filters
            </button>
          </main>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="storm-divider max-w-xs mx-auto mb-4" />
          <p className="text-xs text-[#6b7793]">
            {clubs.length} clubs in the directory
          </p>
        </footer>
      </div>

      {/* Detail Modal */}
      <ClubDetailModal club={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
