import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import { achievements } from "../lib/data";
import type { Achievement } from "../lib/types";

const statusStyle: Record<
  Achievement["status"],
  { ring: string; text: string; bg: string; label: string }
> = {
  unlocked: {
    ring: "ring-gold-400/50",
    text: "text-gold-300",
    bg: "bg-gold-500/15",
    label: "Terbuka",
  },
  progress: {
    ring: "ring-mint-400/40",
    text: "text-mint-300",
    bg: "bg-mint-500/15",
    label: "Progres",
  },
  locked: {
    ring: "ring-white/10",
    text: "text-white/30",
    bg: "bg-white/5",
    label: "Terkunci",
  },
};

export default function AchievementScreen() {
  const unlocked = achievements.filter((a) => a.status === "unlocked").length;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pt-14 pb-32">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-white">Achievement</h1>
        <p className="text-sm text-white/50">
          {unlocked} dari {achievements.length} lencana terbuka
        </p>
      </header>

      {/* progress summary */}
      <GlassCard
        variant="strong"
        className="mb-6 overflow-hidden rounded-3xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <div className="absolute -right-6 -top-6 size-24 rounded-full bg-gold-400/20 blur-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50">Level Finansial</p>
              <p className="text-2xl font-bold text-white">Penyimpan Rajin</p>
            </div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-forest-950 shadow-lg shadow-gold-500/30">
              <Icon name="trophy" className="size-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs text-white/50">
              <span>XP minggu ini</span>
              <span>{Math.round((unlocked / achievements.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
                initial={{ width: 0 }}
                animate={{
                  width: `${(unlocked / achievements.length) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* badge grid */}
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <BadgeCard achievement={a} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BadgeCard({ achievement: a }: { achievement: Achievement }) {
  const s = statusStyle[a.status];
  const locked = a.status === "locked";
  return (
    <GlassCard className="flex flex-col items-center gap-2 rounded-2xl p-4 text-center">
      <div
        className={`flex size-14 items-center justify-center rounded-2xl ${s.bg} ${s.text} ring-1 ${s.ring} ${
          locked ? "opacity-40" : ""
        }`}
      >
        <Icon name={a.icon} className="size-7" />
      </div>
      <div>
        <p className={`text-sm font-semibold ${locked ? "text-white/40" : "text-white"}`}>
          {a.title}
        </p>
        <p className="mt-0.5 text-[11px] leading-tight text-white/40">
          {a.desc}
        </p>
      </div>
      {a.status === "progress" ? (
        <div className="w-full">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-mint-400"
              initial={{ width: 0 }}
              animate={{ width: `${a.progress * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <p className="mt-1 text-[10px] text-mint-300">
            {Math.round(a.progress * 100)}%
          </p>
        </div>
      ) : (
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}
        >
          {s.label}
        </span>
      )}
    </GlassCard>
  );
}
