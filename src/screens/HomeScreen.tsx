import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import { formatIDR, formatDate, formatTime } from "../lib/format";
import type { Transaction } from "../lib/types";
import type { IconKey } from "../lib/types";

interface HomeScreenProps {
  transactions: Transaction[];
  onInput: () => void;
  onViewAll: () => void;
}

const iconColor: Record<IconKey, string> = {
  salary: "text-mint-300",
  gift: "text-mint-300",
  wallet: "text-gold-300",
  coffee: "text-rose-300",
  cart: "text-rose-300",
  food: "text-rose-300",
  transport: "text-rose-300",
  entertainment: "text-rose-300",
  scan: "text-gold-300",
  plus: "text-gold-300",
};

const iconBg: Record<IconKey, string> = {
  salary: "bg-mint-500/15",
  gift: "bg-mint-500/15",
  wallet: "bg-gold-500/15",
  coffee: "bg-rose-500/15",
  cart: "bg-rose-500/15",
  food: "bg-rose-500/15",
  transport: "bg-rose-500/15",
  entertainment: "bg-rose-500/15",
  scan: "bg-gold-500/15",
  plus: "bg-gold-500/15",
};
export default function HomeScreen({ transactions, onInput, onViewAll }: HomeScreenProps) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // group by date label
  const groups = groupByDate(transactions);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pt-14 pb-32">
      <header className="sticky top-0 z-10 -mx-5 mb-4 flex items-center justify-between bg-forest-950/80 px-5 py-3 backdrop-blur-md">
        <div>
          <p className="text-sm text-white/50">Selamat datang</p>
          <h1 className="text-xl font-bold text-white">Halo, Hanafi 👋</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onInput}
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-gold-300 backdrop-blur-sm hover:bg-white/15 active:scale-95 transition-all"
            aria-label="Input transaksi"
          >
            <motion.div whileTap={{ scale: 0.85 }}>
              <Icon name="plus" className="size-5" />
            </motion.div>
          </button>
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-forest-950">
            H
          </div>
        </div>
      </header>

      {/* balance card */}
      <GlassCard
        variant="strong"
        className="mb-5 overflow-hidden rounded-3xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          {/* shimmer accent */}
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gold-400/20 blur-2xl" />
          <p className="text-xs text-white/50">Total Saldo</p>
          <motion.p
            key={balance}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-3xl font-bold tracking-tight text-white"
          >
            {formatIDR(balance)}
          </motion.p>

          {/* income / expense mini-stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-mint-500/10 p-3">
              <div className="flex items-center gap-1.5 text-mint-300">
                <Icon name="salary" className="size-4" />
                <span className="text-[11px] font-medium">Pemasukan</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white">
                {formatIDR(income)}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-500/10 p-3">
              <div className="flex items-center gap-1.5 text-rose-300">
                <Icon name="cart" className="size-4" />
                <span className="text-[11px] font-medium">Pengeluaran</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white">
                {formatIDR(expense)}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* transaction list */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Transaksi Terbaru</h2>
        <button onClick={onViewAll} className="text-xs text-gold-300/80 hover:text-gold-300">
          Lihat semua
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {groups.map(([day, items]) => (
          <div key={day}>
            <p className="mb-2 text-xs font-medium text-white/40">{day}</p>
            <div className="flex flex-col gap-2">
              {items.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <TxnRow txn={t} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function TxnRow({ txn }: { txn: Transaction }) {
  const isIncome = txn.type === "income";
  return (
    <GlassCard className="flex items-center gap-3 rounded-2xl p-3">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg[txn.icon]} ${iconColor[txn.icon]}`}
      >
        <Icon name={txn.icon} className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{txn.category}</p>
        <p className="truncate text-xs text-white/40">
          {txn.note} · {formatTime(txn.date)}
        </p>
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

function groupByDate(items: Transaction[]): [string, Transaction[]][] {
  const map = new Map<string, Transaction[]>();
  for (const t of items) {
    const label = formatDate(t.date);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(t);
  }
  return Array.from(map.entries());
}
