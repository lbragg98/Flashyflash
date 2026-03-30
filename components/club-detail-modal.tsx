"use client";

import { Club } from "@/lib/clubs";
import { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  Star,
  Hash,
  Clock,
  Zap,
  MessageSquare,
  Gauge,
  Wind,
  Package,
  Calendar,
  Timer,
} from "lucide-react";

interface ClubDetailModalProps {
  club: Club | null;
  onClose: () => void;
}

function StatBar({ value, max = 10, color = "primary" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const colorClass =
    color === "accent"
      ? "bg-accent"
      : color === "yellow"
      ? "bg-yellow-400"
      : color === "teal"
      ? "bg-teal-400"
      : "bg-primary";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-6 text-right">{value}</span>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5 font-medium">
          {label}
        </div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

const FLASH_TYPE_COLORS: Record<string, string> = {
  Dog: "text-primary border-primary/40 bg-primary/10",
  Cat: "text-accent border-accent/40 bg-accent/10",
  Invites: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  Hybrid: "text-teal-400 border-teal-400/40 bg-teal-400/10",
};

export function ClubDetailModal({ club, onClose }: ClubDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (club?.quickLink) {
      await navigator.clipboard.writeText(club.quickLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  useEffect(() => {
    if (!club) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [club, onClose]);

  if (!club) return null;

  const flashColor = FLASH_TYPE_COLORS[club.flashType] ?? "text-foreground border-border bg-secondary";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${club.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85dvh] flex flex-col glass-panel sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-[0_0_60px_oklch(0.55_0.28_285/0.25)]">
        {/* Lightning accent top border */}
        <div className="lightning-divider" />

        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-border/50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-primary shrink-0" fill="currentColor" />
              <h2 className="text-base font-bold text-foreground leading-tight">{club.name}</h2>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${flashColor}`}>
                {club.flashType}
              </span>
              <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                <Star size={11} fill="currentColor" />
                {club.avgRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                <Hash size={11} />
                {club.avgPrice} avg
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {/* Quick Link */}
          {club.quickLink && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-accent/10 border border-accent/30">
              <span className="flex-1 text-sm font-medium text-foreground truncate">{club.quickLink}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-semibold hover:bg-accent/30 transition-all duration-150 shrink-0"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          {/* Details section */}
          <div className="mb-4">
            <DetailRow icon={<Calendar size={14} />} label="Club Age">
              {club.clubAge}
            </DetailRow>
            <DetailRow icon={<Timer size={14} />} label="Avg Flash Length">
              {club.avgFlashLength}
            </DetailRow>
            <DetailRow icon={<Hash size={14} />} label="Avg Price">
              {club.avgPrice}
            </DetailRow>
            <DetailRow icon={<Clock size={14} />} label="SFW Status">
              <div className="flex items-center gap-2 flex-wrap">
                {club.sfwFriendly ? (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    SFW Friendly
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-muted text-muted-foreground border border-border">
                    Not SFW Friendly
                  </span>
                )}
                {club.sfwActive ? (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-teal-500/15 text-teal-400 border border-teal-500/30">
                    SFW Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-muted text-muted-foreground border border-border">
                    Not SFW Active
                  </span>
                )}
              </div>
            </DetailRow>
          </div>

          {/* Performance stats */}
          <div className="glass-panel rounded-xl px-4 py-3 mb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Performance Stats
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Wind size={12} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Inv Speed</span>
                </div>
                <StatBar value={club.invSpeed} color="primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Gauge size={12} className="text-accent" />
                  <span className="text-xs text-muted-foreground">Yeet Speed</span>
                </div>
                <StatBar value={club.yeetSpeed} color="accent" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Package size={12} className="text-teal-400" />
                  <span className="text-xs text-muted-foreground">Preparedness</span>
                </div>
                <StatBar value={club.preparedness} color="teal" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Star size={12} className="text-yellow-400" />
                  <span className="text-xs text-muted-foreground">Avg Rating</span>
                </div>
                <StatBar value={club.avgRating} max={5} color="yellow" />
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="glass-panel rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare size={13} className="text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Comments
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{club.comments || "No comments available."}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/50 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
