"use client";

import { Club } from "@/lib/clubs";
import { useEffect, useState } from "react";
import { X, Copy, Check, Star, MessageSquare } from "lucide-react";

interface ClubDetailModalProps {
  club: Club | null;
  onClose: () => void;
}

const FLASH_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Dog: { bg: "bg-[#00d4ff]/15", text: "text-[#4dffff]" },
  Cat: { bg: "bg-[#b366ff]/15", text: "text-[#d699ff]" },
  Invites: { bg: "bg-[#00d4ff]/15", text: "text-[#00d4ff]" },
  Hybrid: { bg: "bg-[#b366ff]/15", text: "text-[#b366ff]" },
};

function StatBar({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#8a96b4] w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#0a0f1f] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#b366ff] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-bold text-[#f0f4ff] w-10 text-right">{value}/{max}</span>
    </div>
  );
}

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
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!club) return null;

  const flashColor = FLASH_TYPE_COLORS[club.flashType] ?? { bg: "bg-[#151d35]", text: "text-[#8a96b4]" };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#0d1424] to-[#080c18] border border-[#1a2744] rounded-t-2xl sm:rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0d1424] to-[#0d1424]/95 px-5 pt-5 pb-4 border-b border-[#1a2744]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#1a2744] text-[#6b7793] hover:text-[#f0f4ff] transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-[#f0f4ff] leading-tight">{club.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[#ffd700]" fill="currentColor" />
                  <span className="text-sm font-bold text-[#f0f4ff]">{club.avgRating.toFixed(1)}/5</span>
                </div>
                <span className="text-[#3a4563]">|</span>
                <span className="text-xs text-[#8a96b4]">{club.clubAge} old</span>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${flashColor.bg} ${flashColor.text}`}>
              {club.flashType}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-5">
          {/* Quick Link */}
          {club.quickLink && (
            <div className="p-3 rounded-xl bg-[#0a0f1f] border border-[#1a2744]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-mono text-[#8a96b4] truncate">{club.quickLink}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#00d4ff]/15 text-[#4dffff] text-xs font-semibold hover:bg-[#00d4ff]/25 transition-colors shrink-0"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* Key Info Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0a0f1f] border border-[#1a2744] text-center">
              <p className="text-[10px] uppercase tracking-wide text-[#6b7793] mb-1">Price</p>
              <p className="text-sm font-bold text-[#00d4ff]">{club.avgPrice} bentos</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0f1f] border border-[#1a2744] text-center">
              <p className="text-[10px] uppercase tracking-wide text-[#6b7793] mb-1">Flash</p>
              <p className="text-sm font-bold text-[#f0f4ff]">{club.avgFlashLength} min</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0f1f] border border-[#1a2744] text-center">
              <p className="text-[10px] uppercase tracking-wide text-[#6b7793] mb-1">Age</p>
              <p className="text-sm font-bold text-[#f0f4ff]">{club.clubAge}</p>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="p-4 rounded-xl bg-[#0a0f1f] border border-[#1a2744] space-y-3">
            <p className="text-[10px] uppercase tracking-wide text-[#6b7793] font-semibold mb-2">Performance</p>
            <StatBar value={club.invSpeed} max={10} label="Inv Speed" />
            <StatBar value={club.yeetSpeed} max={10} label="Yeet Speed" />
            <StatBar value={club.preparedness} max={10} label="Preparedness" />
          </div>

          {/* SFW Status */}
          <div className="flex items-center gap-2 flex-wrap">
            {club.sfwFriendly ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                SFW Friendly
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1a2744] text-[#6b7793] border border-[#1a2744]">
                Not SFW Friendly
              </span>
            )}
            {club.sfwActive ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#00d4ff]/15 text-[#4dffff] border border-[#00d4ff]/30">
                SFW Active
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1a2744] text-[#6b7793] border border-[#1a2744]">
                Not SFW Active
              </span>
            )}
          </div>

          {/* Comments */}
          {club.comments && (
            <div className="p-4 rounded-xl bg-[#0a0f1f] border border-[#1a2744]">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageSquare size={12} className="text-[#6b7793]" />
                <span className="text-[10px] uppercase tracking-wide text-[#6b7793] font-semibold">Comments</span>
              </div>
              <p className="text-sm text-[#c8d0e8] leading-relaxed whitespace-pre-wrap">{club.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
