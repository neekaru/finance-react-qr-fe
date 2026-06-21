import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import { formatIDR } from "../lib/format";
import type { Transaction, TxnType, IconKey } from "../lib/types";

interface InputScreenProps {
  onSubmit: (t: Transaction) => void;
  onBack: () => void;
}

const categories: Record<
  TxnType,
  { label: string; icon: IconKey }[]
> = {
  income: [
    { label: "Gaji", icon: "salary" },
    { label: "Hadiah", icon: "gift" },
    { label: "Bonus", icon: "trending" },
    { label: "Lainnya", icon: "wallet" },
  ],
  expense: [
    { label: "Kopi", icon: "coffee" },
    { label: "Belanja", icon: "cart" },
    { label: "Makan", icon: "food" },
    { label: "Transport", icon: "transport" },
    { label: "Hiburan", icon: "entertainment" },
    { label: "Lainnya", icon: "wallet" },
  ],
};

const quickAmounts = [10000, 20000, 50000, 100000];

export default function InputScreen({ onSubmit, onBack }: InputScreenProps) {
  const [type, setType] = useState<TxnType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState<IconKey>("coffee");

  const amt = parseInt(amount.replace(/\D/g, ""), 10) || 0;
  const valid = amt > 0 && category.length > 0;

  const pickCategory = (label: string, ic: IconKey) => {
    setCategory(label);
    setIcon(ic);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    onSubmit({
      id: `t${Date.now()}`,
      type,
      category,
      note: note || category,
      amount: amt,
      date: new Date().toISOString(),
      icon,
    });
    onBack();
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-5 pt-14 pb-32">
      <header className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
          aria-label="Kembali"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">Input Transaksi</h1>
          <p className="text-sm text-white/50">Catat pemasukan/pengeluaran</p>
        </div>
      </header>

      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* type toggle */}
        <div className="glass relative grid grid-cols-2 gap-1 rounded-2xl p-1">
          <motion.div
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl"
            animate={{ x: type === "income" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            style={
              type === "income"
                ? { backgroundColor: "rgb(110 231 168 / 0.25)" }
                : { backgroundColor: "rgb(240 164 164 / 0.25)" }
            }
          />
          {(["income", "expense"] as TxnType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setCategory("");
              }}
              className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors ${
                type === t
                  ? t === "income"
                    ? "text-mint-300"
                    : "text-rose-300"
                  : "text-white/40"
              }`}
            >
              <Icon
                name={t === "income" ? "salary" : "cart"}
                className="size-4"
              />
              {t === "income" ? "Pemasukan" : "Pengeluaran"}
            </button>
          ))}
        </div>

        {/* amount display */}
        <GlassCard
          variant="strong"
          className="rounded-3xl p-5 text-center"
        >
          <p className="text-xs text-white/50">Jumlah</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={amt}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1 text-4xl font-bold tracking-tight ${
                type === "income" ? "text-mint-300" : "text-rose-300"
              }`}
            >
              {amt > 0 ? formatIDR(amt) : "Rp0"}
            </motion.p>
          </AnimatePresence>
        </GlassCard>

        {/* numeric keypad */}
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <KeypadBtn
              key={n}
              onClick={() => setAmount((a) => (a + n).slice(0, 12))}
            >
              {n}
            </KeypadBtn>
          ))}
          <KeypadBtn onClick={() => setAmount((a) => a.slice(0, -1))}>
            ⌫
          </KeypadBtn>
          <KeypadBtn onClick={() => setAmount((a) => (a + "0").slice(0, 12))}>
            0
          </KeypadBtn>
          <KeypadBtn
            onClick={() => setAmount("")}
            className="text-rose-300/80"
          >
            C
          </KeypadBtn>
        </div>

        {/* quick amounts */}
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount((a) => String((parseInt(a, 10) || 0) + q).slice(0, 12))}
              className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-white/70"
            >
              +{formatIDR(q)}
            </button>
          ))}
        </div>

        {/* category picker */}
        <div>
          <p className="mb-2 text-xs font-medium text-white/60">Kategori</p>
          <div className="grid grid-cols-3 gap-2">
            <AnimatePresence mode="popLayout">
              {categories[type].map((c) => {
                const active = category === c.label;
                return (
                  <motion.button
                    key={c.label}
                    type="button"
                    onClick={() => pickCategory(c.label, c.icon)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 transition-colors ${
                      active
                        ? "bg-gold-500/25 ring-1 ring-gold-400/50"
                        : "bg-white/5"
                    }`}
                  >
                    <Icon
                      name={c.icon}
                      className={`size-6 ${
                        active ? "text-gold-300" : "text-white/50"
                      }`}
                    />
                    <span
                      className={`text-[11px] ${
                        active ? "text-gold-300" : "text-white/50"
                      }`}
                    >
                      {c.label}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* note */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">
            Catatan (opsional)
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="cth: Kopi pagi"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold-400/50"
          />
        </label>

        {/* submit */}
        <motion.button
          type="submit"
          disabled={!valid}
          whileTap={valid ? { scale: 0.98 } : undefined}
          className={`rounded-2xl py-3.5 text-sm font-semibold shadow-lg transition-all ${
            valid
              ? type === "income"
                ? "bg-gradient-to-r from-mint-400 to-mint-500 text-forest-950 shadow-mint-500/25"
                : "bg-gradient-to-r from-gold-400 to-gold-600 text-forest-950 shadow-gold-500/25"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          Simpan Transaksi
        </motion.button>
      </form>
    </div>
  );
}

function KeypadBtn({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className={`glass flex items-center justify-center rounded-2xl py-4 text-xl font-semibold text-white ${className}`}
    >
      {children}
    </motion.button>
  );
}
