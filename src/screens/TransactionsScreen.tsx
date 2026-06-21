import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import { formatIDR, formatDate, formatTime } from "../lib/format";
import type { Transaction, IconKey } from "../lib/types";

interface TransactionsScreenProps {
  transactions: Transaction[];
  onBack: () => void;
}

const iconColor: Record<IconKey, string> = {
  salary: "text-mint-300", gift: "text-mint-300", wallet: "text-gold-300",
  coffee: "text-rose-300", cart: "text-rose-300", food: "text-rose-300",
  transport: "text-rose-300", entertainment: "text-rose-300",
  scan: "text-gold-300", plus: "text-gold-300",
  trophy: "text-gold-300", flame: "text-rose-300", target: "text-mint-300",
  piggy: "text-gold-300", trending: "text-mint-300",
};

const iconBg: Record<IconKey, string> = {
  salary: "bg-mint-500/15", gift: "bg-mint-500/15", wallet: "bg-gold-500/15",
  coffee: "bg-rose-500/15", cart: "bg-rose-500/15", food: "bg-rose-500/15",
  transport: "bg-rose-500/15", entertainment: "bg-rose-500/15",
  scan: "bg-gold-500/15", plus: "bg-gold-500/15",
  trophy: "bg-gold-500/15", flame: "bg-rose-500/15", target: "bg-mint-500/15",
  piggy: "bg-gold-500/15", trending: "bg-mint-500/15",
};

export default function TransactionsScreen({ transactions, onBack }: TransactionsScreenProps) {
  const groups = groupByDate(transactions);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pt-14 pb-10">
      <header className="sticky top-0 z-10 -mx-5 mb-4 flex items-center gap-3 bg-forest-950/80 px-5 py-3 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
          aria-label="Kembali"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Transaksi</h1>
          <p className="text-sm text-white/50">{transactions.length} transaksi</p>
        </div>
      </header>

      {/* full list — scrollable, no bottom padding needed for nav */}
      <div className="flex flex-col gap-5">
        {groups.length === 0 && (
          <p className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/40">
            Belum ada transaksi
          </p>
        )}
        {groups.map(([day, items]) => (
          <div key={day}>
            <p className="mb-2 text-xs font-medium text-white/40">{day}</p>
            <div className="flex flex-col gap-2">
              {items.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
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
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg[txn.icon]} ${iconColor[txn.icon]}`}>
        <Icon name={txn.icon} className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{txn.category}</p>
        <p className="truncate text-xs text-white/40">
          {txn.note} · {formatTime(txn.date)}
        </p>
      </div>
      <p className={`shrink-0 text-sm font-semibold ${isIncome ? "text-mint-300" : "text-rose-300"}`}>
        {isIncome ? "+" : "−"}{formatIDR(txn.amount)}
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