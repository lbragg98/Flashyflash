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
    <div className="min-h-screen bg-background">
      {/* Subtle storm radial gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.55 0.28 285 / 0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 30% at 20% 100%, oklch(0.65 0.22 265 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CloudLightning
              size={28}
              className="text-primary animate-lightning"
              fill="oklch(0.65 0.22 265 / 0.15)"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-balance tracking-tight bg-clip-text">
              <span className="text-foreground">Storm</span>
              <span
                style={{
                  color: "oklch(0.72 0.22 265)",
                  textShadow: "0 0 20px oklch(0.65 0.22 265 / 0.5)",
                }}
              >
                Strike
              </span>
            </h1>
            <CloudLightning
              size={28}
              className="text-accent animate-lightning"
              fill="oklch(0.55 0.28 285 / 0.15)"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto text-balance leading-relaxed">
            The definitive directory for tracking clubs — ratings, flash type, pricing, and more.
          </p>
          <div className="lightning-divider max-w-xs mx-auto mt-4" />
        </header>

        {/* Search */}
        <div className="mb-4 relative">
          <label htmlFor="search" className="sr-only">Search clubs</label>
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            id="search"
            type="search"
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-6">
          <FilterBar
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            resultCount={filtered.length}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <main className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading clubs...</p>
          </main>
        ) : error ? (
          <main className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Zap size={36} className="text-destructive/30" />
            <p className="text-destructive text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-primary hover:underline"
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
          <main className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Zap size={36} className="text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">No clubs match your current filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setFilters(DEFAULT_FILTERS);
              }}
              className="text-xs text-primary hover:underline"
            >
              Clear search &amp; filters
            </button>
          </main>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="lightning-divider max-w-xs mx-auto mb-4" />
          <p className="text-[11px] text-muted-foreground">
            {clubs.length} clubs in the directory
          </p>
        </footer>
      </div>

      {/* Detail Modal */}
      <ClubDetailModal club={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
