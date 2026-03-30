"use client";

import { Club } from "@/lib/clubs";
import { ExternalLink, Star, Zap, Clock, DollarSign, Shield, ShieldOff } from "lucide-react";

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
}

const FLASH_TYPE_COLORS: Record<string, string> = {
  Sheet: "text-primary bg-primary/10 border-primary/30",
  Custom: "text-accent bg-accent/10 border-accent/30",
  Guest: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Hybrid: "text-teal-400 bg-teal-400/10 border-teal-400/30",
  "Walk-In": "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="relative inline-block">
          <Star
            size={12}
            className="text-muted-foreground/30"
            fill="currentColor"
          />
          {i < full && (
            <Star
              size={12}
              className="absolute inset-0 text-yellow-400"
              fill="currentColor"
            />
          )}
          {i === full && partial > 0 && (
            <span
              className="absolute inset-0 overflow-hidden text-yellow-400"
              style={{ width: `${partial * 100}%` }}
            >
              <Star size={12} fill="currentColor" />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

export function ClubCard({ club, onSelect }: ClubCardProps) {
  const flashColorClass = FLASH_TYPE_COLORS[club.flashType] ?? "text-foreground bg-secondary border-border";

  return (
    <article
      className="glass-panel rounded-xl p-4 flex flex-col gap-3 cursor-pointer group transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_oklch(0.65_0.22_265/0.25)] active:scale-[0.99]"
      onClick={() => onSelect(club)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${club.name}`}
      onKeyDown={(e) => e.key === "Enter" && onSelect(club)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Zap
            size={14}
            className="shrink-0 text-primary opacity-70 group-hover:opacity-100 transition-opacity"
            fill="currentColor"
          />
          <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
            {club.name}
          </h3>
        </div>
        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${flashColorClass}`}
        >
          {club.flashType}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Star size={11} className="text-yellow-400 shrink-0" fill="currentColor" />
          <span className="text-foreground font-medium">{club.avgRating.toFixed(1)}</span>
          <StarRating rating={club.avgRating} />
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign size={11} className="text-primary shrink-0" />
          <span className="text-foreground font-medium">${club.avgPrice}</span>
          <span className="text-muted-foreground">avg</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-muted-foreground shrink-0" />
          <span>{club.clubAge}yr old</span>
        </div>
        <div className="flex items-center gap-1.5">
          {club.sfwActive ? (
            <Shield size={11} className="text-emerald-400 shrink-0" />
          ) : (
            <ShieldOff size={11} className="text-muted-foreground/50 shrink-0" />
          )}
          <span className={club.sfwActive ? "text-emerald-400" : "text-muted-foreground"}>
            SFW {club.sfwActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border/50">
        <button
          className="flex-1 text-xs font-medium text-center py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:glow-primary transition-all duration-150"
          onClick={(e) => { e.stopPropagation(); onSelect(club); }}
        >
          View Details
        </button>
        {club.quickLink && (
          <a
            href={club.quickLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Quick link for ${club.name}`}
            className="flex items-center justify-center p-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all duration-150 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}
