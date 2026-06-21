import { useState, useCallback } from "react";
import {
  motion,
  type PanInfo,
  type AnimationPlaybackControls,
} from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import { formatIDR } from "../lib/format";
import { galleryItems } from "../lib/data";
import type { GalleryItem } from "../lib/types";

type SwipeDir = "left" | "right";

/**
 * Tinder-style stacked card deck.
 * One `exitOffset` state drives the card-off-screen animation.
 * `onAnimationComplete` advances the index — no overlapping state updates.
 */
export default function GalleryScreen() {
  const [index, setIndex] = useState(0);
  const [exitOffset, setExitOffset] = useState<number | null>(null);
  const [hint, setHint] = useState<SwipeDir | null>(null);

  const finished = index >= galleryItems.length;

  const advance = useCallback(() => {
    setIndex((i) => i + 1);
    setExitOffset(null);
    setHint(null);
  }, []);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x > 100 || info.velocity.x > 500) {
        setHint("right");
        setExitOffset(400);
      } else if (info.offset.x < -100 || info.velocity.x < -500) {
        setHint("left");
        setExitOffset(-400);
      }
    },
    [],
  );

  const onDrag = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x > 80) setHint("right");
      else if (info.offset.x < -80) setHint("left");
      else setHint(null);
    },
    [],
  );

  const skip = () => {
    setHint("left");
    setExitOffset(-400);
  };
  const keep = () => {
    setHint("right");
    setExitOffset(400);
  };
  const reset = () => setIndex(0);

  const current = galleryItems[index];
  const next = galleryItems[index + 1];
  const third = galleryItems[index + 2];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-14 pb-32">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-white">Galeri</h1>
        <p className="text-sm text-white/50">Geser kartu → simpan, ← lewati</p>
      </header>

      {/* progress dots */}
      <div className="mb-6 flex justify-center gap-1.5">
        {galleryItems.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < index
                ? "w-6 bg-gold-300"
                : i === index
                  ? "w-6 bg-white/40"
                  : "w-1.5 bg-white/15"
            }`}
          />
        ))}
      </div>

      {/* card deck */}
      <div
        className="relative flex-1"
        style={{ perspective: "1200px" }}
      >
        {finished ? (
          <EmptyState onReset={reset} />
        ) : (
          <>
            {/* 3rd — deepest back */}
            {third && (
              <DeckCard
                key={third.id}
                item={third}
                depth={2}
                className="pointer-events-none"
              />
            )}
            {/* 2nd — middle */}
            {next && (
              <DeckCard
                key={next.id}
                item={next}
                depth={1}
                className="pointer-events-none"
              />
            )}
            {/* 1st — front, draggable */}
            {current && (
              <DeckCard
                key={current.id}
                item={current}
                depth={0}
                draggable={exitOffset === null}
                exitOffset={exitOffset}
                hint={hint}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onExitComplete={advance}
                isFront
              />
            )}
          </>
        )}
      </div>

      {/* action buttons */}
      {!finished && current && (
        <div className="mt-6 flex items-center justify-center gap-6">
          <ActionButton onClick={skip} label="Lewati" variant="skip" />
          <ActionButton onClick={keep} label="Simpan" variant="keep" />
        </div>
      )}
    </div>
  );
}

interface DeckCardProps {
  item: GalleryItem;
  depth: 0 | 1 | 2;
  className?: string;
  draggable?: boolean;
  exitOffset?: number | null;
  hint?: SwipeDir | null;
  onDrag?: (_: unknown, info: PanInfo) => void;
  onDragEnd?: (_: unknown, info: PanInfo) => void;
  onExitComplete?: () => void;
  isFront?: boolean;
}

function DeckCard({
  item,
  depth,
  className = "",
  draggable = false,
  exitOffset = null,
  hint = null,
  onDrag,
  onDragEnd,
  onExitComplete,
  isFront = false,
}: DeckCardProps) {
  const scale = depth === 0 ? 1 : depth === 1 ? 0.94 : 0.88;
  const y = depth === 0 ? 0 : depth === 1 ? 14 : 28;
  const isExiting = exitOffset !== null;

  return (
    <motion.div
      drag={draggable ? "x" : false}
      dragSnapToOrigin
      dragConstraints={isExiting ? undefined : { left: 0, right: 0 }}
      dragElastic={isExiting ? 1 : 0.6}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      animate={
        isExiting
          ? { x: exitOffset, opacity: 0, rotate: exitOffset > 0 ? 24 : -24 }
          : { scale, opacity: 1, y, x: 0 }
      }
      onAnimationComplete={
        isExiting ? () => onExitComplete?.() : undefined
      }
      initial={{ scale: 0.9, opacity: 0.6, y: y + 20, x: 0 }}
      transition={
        isExiting
          ? { type: "spring", stiffness: 260, damping: 28 }
          : { type: "spring", stiffness: 300, damping: 28 }
      }
      whileTap={isFront && !isExiting ? { cursor: "grabbing" } : undefined}
      className={`absolute inset-0 ${className}`}
    >
      <GlassCard
        variant="strong"
        className={`flex h-full min-h-[24rem] flex-col justify-between bg-gradient-to-br ${item.gradient} rounded-[2rem] p-6`}
      >
        {/* swipe hints */}
        {isFront && (
          <>
            <SwipeHint side="right" active={hint === "right"} />
            <SwipeHint side="left" active={hint === "left"} />
          </>
        )}

        {/* header */}
        <div className="flex items-start justify-between">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
            <Icon name={item.icon} className="size-7" />
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-medium ${
              item.type === "income"
                ? "bg-mint-500/25 text-mint-300"
                : "bg-rose-500/25 text-rose-300"
            }`}
          >
            {item.type === "income" ? "Pemasukan" : "Pengeluaran"}
          </span>
        </div>

        {/* body */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-white/70">{item.subtitle}</p>
          <p className="text-2xl font-bold text-white">{item.title}</p>
        </div>

        {/* amount */}
        <div>
          <p className="text-xs text-white/50">Jumlah</p>
          <p
            className={`mt-1 text-3xl font-bold ${
              item.type === "income" ? "text-mint-300" : "text-rose-300"
            }`}
          >
            {item.type === "income" ? "+" : "−"}
            {formatIDR(item.amount)}
          </p>
        </div>

        {/* drag hint footer */}
        {isFront && !isExiting && (
          <p className="text-center text-[11px] text-white/40">
            ← Lewati · Simpan →
          </p>
        )}
      </GlassCard>
    </motion.div>
  );
}

function SwipeHint({
  side,
  active,
}: {
  side: "left" | "right";
  active: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
      className={`absolute top-6 ${
        side === "right"
          ? "right-6 rotate-12 border-mint-400 text-mint-300"
          : "left-6 -rotate-12 border-rose-400 text-rose-300"
      } rounded-xl border-2 px-3 py-1 text-sm font-bold`}
    >
      {side === "right" ? "SIMPAN" : "LEWATI"}
    </motion.div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col items-center justify-center gap-4 text-center"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300">
        <Icon name="trophy" className="size-8" />
      </div>
      <div>
        <p className="text-base font-semibold text-white">
          Semua kartu selesai
        </p>
        <p className="text-sm text-white/40">Mau lihat lagi?</p>
      </div>
      <motion.button
        onClick={onReset}
        whileTap={{ scale: 0.95 }}
        className="rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-2.5 text-sm font-semibold text-forest-950"
      >
        Mulai Ulang
      </motion.button>
    </motion.div>
  );
}

function ActionButton({
  onClick,
  label,
  variant,
}: {
  onClick: () => void;
  label: string;
  variant: "skip" | "keep";
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${
        variant === "skip"
          ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/40"
          : "bg-mint-500/20 text-mint-300 ring-1 ring-mint-400/40"
      }`}
    >
      {variant === "skip" ? "←" : "→"} {label}
    </motion.button>
  );
}