"use client";

import { Club } from "@/lib/clubs";
import { useEffect, useState } from "react";
import { X, Copy, Check, Star, Gauge, Wind, Package, Calendar, Timer, MessageSquare } from "lucide-react";

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

function StatBar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const percentage = (value / max) * 100;
  const colorClasses: Record<string, string> = {
    cyan: "bg-[#00d4ff]",
    violet: "bg-[#b366ff]",
    yellow: "bg-[#ffd700]",
    emerald: "bg-emerald-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#8a96b4] font-medium">{label}</span>
        <span className="text-xs text-[#f0f4ff] font-bold">{value.toFixed(1)} / {max}</span>
      </div>
      <div className="h-1.5 bg-[#0f1425] rounded-full overflow-hidden border border-[#1a2447]">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="py-2 flex items-start gap-3">
      <div className="text-[#00d4ff] mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wide text-[#6b7793] font-semibold mb-0.5">
          {label}
        </div>
        <div className="text-sm text-[#f0f4ff]">{children}</div>
      </div>
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="storm-panel-dark relative w-full sm:w-96 max-h-[90vh] overflow-y-auto pointer-events-auto rounded-t-2xl sm:rounded-2xl p-6 shadow-storm-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#00d4ff]/10 text-[#8a96b4] hover:text-[#4dffff] transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#f0f4ff]">{club.name}</h2>
              <p className="text-xs text-[#6b7793] mt-1">{club.clubAge} years old</p>
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-bold ${flashColor.bg} ${flashColor.text}`}>
              {club.flashType}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-[#ffd700]" fill="currentColor" />
            <span className="text-lg font-bold text-[#f0f4ff]">{club.avgRating.toFixed(1)}</span>
            <span className="text-xs text-[#8a96b4]">/ 5.0</span>
          </div>
        </div>

        {/* Quick Link */}
        {club.quickLink && (
          <div className="mb-4 p-3 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#8a96b4] font-semibold uppercase tracking-wide">Quick Link</span>
            </div>
            <div className="flex items-center gap-2 gap-y-2 flex-wrap">
              <span className="text-sm font-mono text-[#4dffff] break-all flex-1">{club.quickLink}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d4ff]/25 text-[#4dffff] text-xs font-semibold hover:bg-[#00d4ff]/35 transition-all duration-200 shrink-0"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div className="storm-divider mb-4" />

        {/* Key Stats */}
        <div className="mb-6 space-y-3">
          <DetailRow icon={<Star size={16} />} label="Avg Rating">
            {club.avgRating.toFixed(1)} / 5.0
          </DetailRow>
          <DetailRow icon={<MessageSquare size={16} />} label="Avg Price">
            {club.avgPrice}
          </DetailRow>
          <DetailRow icon={<Timer size={16} />} label="Avg Flash Length">
            {club.avgFlashLength} min
          </DetailRow>
        </div>

        <div className="storm-divider mb-4" />

        {/* Performance Bars */}
        <div className="mb-6 space-y-4">
          <StatBar value={club.invSpeed} max={10} label="Inv Speed" color="cyan" />
          <StatBar value={club.yeetSpeed} max={10} label="Yeet Speed" color="violet" />
          <StatBar value={club.preparedness} max={10} label="Preparedness" color="yellow" />
        </div>

        <div className="storm-divider mb-4" />

        {/* SFW Status */}
        <div className="mb-6 space-y-2">
          <div className="text-xs uppercase tracking-wide font-bold text-[#4dffff] mb-3">SFW Status</div>
          <div className="flex items-center gap-2 flex-wrap">
            {club.sfwFriendly ? (
              <span className="storm-badge">SFW Friendly</span>
            ) : (
              <span className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[#1a2447] text-[#8a96b4] border border-[#1a2447]">
                Not SFW Friendly
              </span>
            )}
            {club.sfwActive ? (
              <span className="storm-badge-accent">SFW Active</span>
            ) : (
              <span className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-[#1a2447] text-[#8a96b4] border border-[#1a2447]">
                Not SFW Active
              </span>
            )}
          </div>
        </div>

        <div className="storm-divider mb-4" />

        {/* Comments */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <MessageSquare size={14} className="text-[#00d4ff]" />
            <span className="text-xs uppercase tracking-widest text-[#4dffff] font-bold">Comments</span>
          </div>
          <p className="text-sm text-[#f0f4ff] leading-relaxed whitespace-pre-wrap">
            {club.comments || "No comments available."}
          </p>
        </div>
      </div>
    </div>
  );
}
