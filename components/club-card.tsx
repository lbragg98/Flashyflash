"use client";

import { Club } from "@/lib/clubs";
import { Copy, Star, Clock, Check, Link2 } from "lucide-react";
import { useState } from "react";

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
}

const FLASH_TYPE_STYLES: Record<string, string> = {
  Dog: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  Cat: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  Invites: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Hybrid: "border-teal-400/30 bg-teal-400/10 text-teal-200",
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating);

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < full
              ? "fill-[#71c7ff] text-[#71c7ff]"
              : "text-white/20"
          }
        />
      ))}
    </div>
  );
}

export function ClubCard({ club, onSelect }: ClubCardProps) {
  const [copied, setCopied] = useState(false);

  const flashTypeClass =
    FLASH_TYPE_STYLES[club.flashType] ??
    "border-white/10 bg-white/5 text-white";

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!club.quickLink) return;

    await navigator.clipboard.writeText(club.quickLink);
    setCopied(true);

    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      onClick={() => onSelect(club)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(club);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${club.name}`}
      className="storm-panel group rounded-3xl p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#71c7ff]/35 hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-white">
            {club.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${flashTypeClass}`}
            >
              {club.flashType}
            </span>
          </div>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-[#d7e8ff]">
          {club.avgRating.toFixed(1)}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="storm-panel-soft rounded-2xl p-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-[#8f9bbb]">
            Rating
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {club.avgRating.toFixed(1)}
          </p>
        </div>

        <div className="storm-panel-soft rounded-2xl p-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-[#8f9bbb]">
            Avg Price
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {club.avgPrice}
          </p>
        </div>

        <div className="storm-panel-soft rounded-2xl p-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-[#8f9bbb]">
            Age
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {club.clubAge}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <StarRating rating={club.avgRating} />
        <div className="flex items-center gap-2 text-xs text-[#9ea9c5]">
          <Clock size={12} />
          <span>{club.clubAge} old</span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {club.sfwFriendly && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
            <Check size={12} />
            SFW Friendly
          </span>
        )}

        {club.sfwActive && (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-200">
            <Check size={12} />
            SFW Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(club);
          }}
          className="flex-1 rounded-xl border border-[#71c7ff]/20 bg-[#71c7ff]/10 px-3 py-2 text-sm font-medium text-[#cfeaff] transition hover:border-[#71c7ff]/40 hover:bg-[#71c7ff]/14"
        >
          View Details
        </button>

        {club.quickLink && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-[#dce9ff] transition hover:bg-white/10"
            aria-label={copied ? "Copied quick link" : "Copy quick link"}
          >
            {copied ? <Check size={15} /> : <Link2 size={15} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
