"use client";

import { Club } from "@/lib/clubs";
import { useEffect, useState } from "react";
import {
  X,
  Copy,
  Check,
  Star,
  MessageSquare,
  Gauge,
  Wind,
  Package,
  Calendar,
  Timer,
  Link2,
} from "lucide-react";

interface ClubDetailModalProps {
  club: Club | null;
  onClose: () => void;
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
    <div className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3">
      <div className="mt-0.5 text-[#8fcfff]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-[#8f9bbb]">
          {label}
        </p>
        <div className="mt-1 text-sm text-white">{children}</div>
      </div>
    </div>
  );
}

const FLASH_TYPE_STYLES: Record<string, string> = {
  Dog: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  Cat: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  Invites: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  Hybrid: "border-teal-400/30 bg-teal-400/10 text-teal-200",
};

export function ClubDetailModal({
  club,
  onClose,
}: ClubDetailModalProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    if (!club?.quickLink) return;

    await navigator.clipboard.writeText(club.quickLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (!club) return null;

  const flashTypeClass =
    FLASH_TYPE_STYLES[club.flashType] ??
    "border-white/10 bg-white/5 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-[#050814]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="storm-panel relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] outline outline-1 outline-[#71c7ff]/30 shadow-[0_0_0_1px_rgba(113,199,255,0.15),0_32px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(113,199,255,0.12)]">
        <div className="h-1 w-full bg-gradient-to-r from-[#71c7ff] via-[#c6ebff] to-[#a977ff]" />

        <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-white">
              {club.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${flashTypeClass}`}
              >
                {club.flashType}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#dce9ff]">
                <Star size={12} className="fill-[#71c7ff] text-[#71c7ff]" />
                {club.avgRating.toFixed(1)}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#dce9ff]">
                {club.avgPrice} avg
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#dce9ff] transition hover:bg-white/10"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          {club.quickLink && (
            <div className="storm-panel-soft mb-4 rounded-2xl p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8f9bbb]">
                    Quick Link
                  </p>
                  <p className="mt-1 truncate text-sm text-[#dce9ff]">
                    {club.quickLink}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#71c7ff]/20 bg-[#71c7ff]/10 px-3 py-2 text-sm font-medium text-[#d8eeff] transition hover:border-[#71c7ff]/35 hover:bg-[#71c7ff]/14"
                >
                  {copied ? <Check size={15} /> : <Link2 size={15} />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="storm-panel-soft rounded-2xl p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#cfe3ff]">
                Core Stats
              </h3>

              <div className="space-y-3">
                <DetailRow icon={<Timer size={16} />} label="Avg Flash Length">
                  {club.avgFlashLength}
                </DetailRow>

                <DetailRow icon={<Calendar size={16} />} label="Club Age">
                  {club.clubAge}
                </DetailRow>

                <DetailRow icon={<Package size={16} />} label="Preparedness">
                  {club.preparedness}
                </DetailRow>

                <DetailRow icon={<Gauge size={16} />} label="Inv Speed">
                  {club.invSpeed}
                </DetailRow>

                <DetailRow icon={<Wind size={16} />} label="Yeet Speed">
                  {club.yeetSpeed}
                </DetailRow>
              </div>
            </div>

            <div className="storm-panel-soft rounded-2xl p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#cfe3ff]">
                Details
              </h3>

              <div className="space-y-3">
                <DetailRow icon={<Star size={16} />} label="Avg Rating">
                  {club.avgRating.toFixed(1)}
                </DetailRow>

                <DetailRow icon={<Package size={16} />} label="Avg Price">
                  {club.avgPrice}
                </DetailRow>

                <DetailRow icon={<Check size={16} />} label="SFW Friendly">
                  {club.sfwFriendly ? "Yes" : "No"}
                </DetailRow>

                <DetailRow icon={<Check size={16} />} label="SFW Active">
                  {club.sfwActive ? "Yes" : "No"}
                </DetailRow>

                <DetailRow icon={<MessageSquare size={16} />} label="Comments">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#dce9ff]">
                    {club.comments || "No comments available."}
                  </p>
                </DetailRow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
