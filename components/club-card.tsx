"use client";

import { Club } from "@/lib/clubs";
import { Copy, Check, Star } from "lucide-react";
import { useState } from "react";

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
}

const FLASH_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Dog: { bg: "bg-[#00d4ff]/10", text: "text-[#4dffff]" },
  Cat: { bg: "bg-[#b366ff]/10", text: "text-[#d699ff]" },
  Invites: { bg: "bg-[#00d4ff]/10", text: "text-[#00d4ff]" },
  Hybrid: { bg: "bg-[#b366ff]/10", text: "text-[#b366ff]" },
};

export function ClubCard({ club, onSelect }: ClubCardProps) {
  const [copied, setCopied] = useState(false);
  const flashColor = FLASH_TYPE_COLORS[club.flashType] ?? { bg: "bg-[#151d35]", text: "text-[#8a96b4]" };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (club.quickLink) {
      await navigator.clipboard.writeText(club.quickLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(club)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(club)}
      className="storm-panel w-full text-left transition-all duration-300 hover:shadow-storm-lg hover:border-[#00d4ff]/40 active:scale-[0.98] group cursor-pointer"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#f0f4ff] text-base leading-tight group-hover:text-[#4dffff] transition-colors truncate">
            {club.name}
          </h3>
          <p className="text-[#6b7793] text-xs mt-1">
            {club.avgFlashLength} min • {club.clubAge}y old
          </p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${flashColor.bg} ${flashColor.text}`}>
          {club.flashType}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 py-3 border-y border-[#00d4ff]/10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-[#ffd700]" fill="currentColor" />
            <span className="text-xs text-[#8a96b4]">Rating</span>
          </div>
          <p className="text-sm font-bold text-[#f0f4ff]">{club.avgRating.toFixed(1)}/5</p>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#8a96b4]">Avg Price</div>
          <p className="text-sm font-bold text-[#00d4ff]">{club.avgPrice} bentos</p>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#8a96b4]">Inv Speed</div>
          <p className="text-sm font-bold text-[#f0f4ff]">{club.invSpeed}/10</p>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#8a96b4]">Yeet Speed</div>
          <p className="text-sm font-bold text-[#f0f4ff]">{club.yeetSpeed}/10</p>
        </div>
      </div>

      {/* SFW Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {club.sfwFriendly && (
          <span className="storm-badge">SFW Friendly</span>
        )}
        {club.sfwActive && (
          <span className="storm-badge-accent">SFW Active</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[#6b7793]">{club.preparedness}/10 prep</p>
        {club.quickLink && (
          <div
            role="button"
            tabIndex={0}
            onClick={handleCopy}
            onKeyDown={(e) => e.key === "Enter" && handleCopy(e as any)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00d4ff]/15 text-[#4dffff] text-xs font-semibold hover:bg-[#00d4ff]/25 transition-all duration-200 border border-[#00d4ff]/30 cursor-pointer"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
