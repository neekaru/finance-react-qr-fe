import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import { formatIDR, formatIDRShort } from "../lib/format";
import type { Transaction } from "../lib/types";

interface WeeklyRecapScreenProps {
  transactions: Transaction[];
}

const WD = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

/** Returns this week's transactions (Mon-Sun) + per-day totals. */
function thisWeek(transactions: Transaction[]) {
  const now = new Date("2026-06-21T12:00:00+07:00");
  const day = (now.getDay() + 6) % 7; // Mon=0..Sun=6
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  monday.setHours(0, 0, 0, 0);

  const days = WD.map((label) => ({
    label,
    expense: 0,
    income: 0,
    count: 0,
  }));

  const weekTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= monday;
  });

  for (const t of weekTxns) {
    const idx = (new Date(t.date).getDay() + 6) % 7;
    if (t.type === "expense") days[idx].expense += t.amount;
    else days[idx].income += t.amount;
    days[idx].count++;
  }

  const maxExpense = Math.max(...days.map((d) => d.expense), 1);
  return { days, weekTxns, maxExpense };
}

export default function WeeklyRecapScreen({
  transactions,
}: WeeklyRecapScreenProps) {
  const { days, weekTxns, maxExpense } = thisWeek(transactions);
  const totalExpense = days.reduce((s, d) => s + d.expense, 0);
  const totalIncome = days.reduce((s, d) => s + d.income, 0);
  const topCategory = topCat(weekTxns);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pt-14 pb-32">
      <header className="sticky top-0 z-10 -mx-5 mb-4 bg-forest-950/80 px-5 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">Rekap Minggu Ini</h1>
        <p className="text-sm text-white/50">15 - 21 Juni 2026</p>
      </header>

      {/* summary card */}
      <GlassCard
        variant="strong"
        className="mb-5 rounded-3xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-mint-500/10 p-3">
            <div className="flex items-center gap-1.5 text-mint-300">
              <Icon name="salary" className="size-4" />
              <span className="text-[11px] font-medium">Masuk</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white">
              {formatIDR(totalIncome)}
            </p>
          </div>
          <div className="rounded-2xl bg-rose-500/10 p-3">
            <div className="flex items-center gap-1.5 text-rose-300">
              <Icon name="cart" className="size-4" />
              <span className="text-[11px] font-medium">Keluar</span>
            </div>
            <p className="mt-1 text-lg font-bold text-white">
              {formatIDR(totalExpense)}
            </p>
          </div>
        </div>
        {topCategory && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5">
            <span className="text-xs text-white/50">Pengeluaran terbanyak</span>
            <span className="text-xs font-medium text-gold-300">
              {topCategory.category} · {formatIDR(topCategory.total)}
            </span>
          </div>
        )}
      </GlassCard>

      {/* bar chart */}
      <h2 className="mb-3 text-base font-semibold text-white">
        Pengeluaran per Hari
      </h2>
      <GlassCard className="mb-6 rounded-3xl p-5">
        <div className="flex h-40 items-end justify-between gap-2">
          {days.map((d, i) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end justify-center">
                <motion.div
                  className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-gold-600 to-gold-400"
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(d.expense / maxExpense) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                />
              </div>
              <span className="text-[10px] text-white/40">{d.label}</span>
              <span className="text-[9px] text-white/30">
                {d.expense > 0 ? formatIDRShort(d.expense) : "-"}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* this week's transactions */}
      <h2 className="mb-3 text-base font-semibold text-white">
        Transaksi Minggu Ini
      </h2>
      <div className="flex flex-col gap-2">
        {weekTxns.length === 0 && (
          <p className="rounded-2xl bg-white/5 p-4 text-center text-sm text-white/40">
            Belum ada transaksi minggu ini
          </p>
        )}
        {weekTxns.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <WeekRow txn={t} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WeekRow({ txn }: { txn: Transaction }) {
  const isIncome = txn.type === "income";
  return (
    <GlassCard className="flex items-center gap-3 rounded-2xl p-3">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
          isIncome ? "bg-mint-500/15 text-mint-300" : "bg-rose-500/15 text-rose-300"
        }`}
      >
        <Icon name={txn.icon} className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{txn.category}</p>
        <p className="truncate text-xs text-white/40">{txn.note}</p>
      </div>
      <p
        className={`shrink-0 text-sm font-semibold ${
          isIncome ? "text-mint-300" : "text-rose-300"
        }`}
      >
        {isIncome ? "+" : "−"}
        {formatIDR(txn.amount)}
      </p>
    </GlassCard>
  );
}

function topCat(txns: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of txns) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  let best: { category: string; total: number } | null = null;
  for (const [category, total] of map) {
    if (!best || total > best.total) best = { category, total };
  }
  return best;
}
