import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";
import BottomSheet from "../components/BottomSheet";
import { formatIDR } from "../lib/format";
import { productCatalog } from "../lib/data";
import type { ScannedProduct, Transaction, IconKey } from "../lib/types";

interface ScanScreenProps {
  onAdd: (txn: Transaction) => void;
}

type SheetContent = null | { kind: "result"; product: ScannedProduct } | {
  kind: "manual";
};

export default function ScanScreen({ onAdd }: ScanScreenProps) {
  const [scanning, setScanning] = useState(false);
  const [sheet, setSheet] = useState<SheetContent>(null);

  // simulate a scan: show active scanning for 1.6s then pop result
  useEffect(() => {
    if (!scanning) return;
    const id = setTimeout(() => {
      const product =
        productCatalog[Math.floor(Math.random() * productCatalog.length)];
      setSheet({ kind: "result", product });
      setScanning(false);
    }, 1600);
    return () => clearTimeout(id);
  }, [scanning]);

  const startScan = () => setScanning(true);

  const confirmResult = (product: ScannedProduct) => {
    onAdd({
      id: `t${Date.now()}`,
      type: "expense",
      category: product.category,
      note: product.name,
      amount: product.price,
      date: new Date().toISOString(),
      icon: product.icon,
    });
    setSheet(null);
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pt-14 pb-32">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-white">Pindai Barcode</h1>
        <p className="text-sm text-white/50">
          Arahkan kamera ke barcode produk
        </p>
      </header>

      {/* viewfinder */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-forest-950/60">
        {/* faux camera feed tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/40 via-forest-950/60 to-forest-950" />

        {/* corner brackets */}
        <Bracket className="left-5 top-5 border-l-2 border-t-2 rounded-tl-2xl" />
        <Bracket className="right-5 top-5 border-r-2 border-t-2 rounded-tr-2xl" />
        <Bracket className="left-5 bottom-5 border-l-2 border-b-2 rounded-bl-2xl" />
        <Bracket className="right-5 bottom-5 border-r-2 border-b-2 rounded-br-2xl" />

        {/* animated scan line */}
        {scanning && (
          <motion.div
            className="absolute inset-x-8 top-8 h-0.5 rounded-full bg-gold-300 shadow-[0_0_12px_2px] shadow-gold-400/60"
            style={{ animation: "scanline 1.4s ease-in-out infinite" }}
          />
        )}

        {/* idle hint */}
        {!scanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/50">
            <Icon name="scan" className="size-12 text-gold-300/60" />
            <p className="text-sm">Tekan tombol untuk mulai memindai</p>
          </div>
        )}

        {/* scanning label */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-forest-950/70 px-4 py-1.5 text-xs font-medium text-gold-300 backdrop-blur-sm"
            >
              Memindai…
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* actions */}
      <div className="mt-6 flex flex-col gap-3">
        <motion.button
          onClick={startScan}
          disabled={scanning}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-sm font-semibold text-forest-950 shadow-lg shadow-gold-500/25 disabled:opacity-60"
        >
          {scanning ? "Memindai…" : "Mulai Scan"}
        </motion.button>
        <button
          onClick={() => setSheet({ kind: "manual" })}
          className="glass rounded-2xl py-3.5 text-sm font-medium text-white"
        >
          Isi Manual
        </button>
      </div>

      {/* recent scans hint */}
      <GlassCard className="mt-6 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
            <Icon name="scan" className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Scan Cepat</p>
            <p className="text-xs text-white/40">
              Pindai barcode untuk tambah pengeluaran otomatis
            </p>
          </div>
        </div>
      </GlassCard>

      {/* bottom sheet — scan result or manual form */}
      <BottomSheet
        open={sheet !== null}
        onClose={() => setSheet(null)}
        title={sheet?.kind === "result" ? "Hasil Scan" : "Isi Manual"}
      >
        {sheet?.kind === "result" && (
          <ScanResult
            product={sheet.product}
            onConfirm={() => confirmResult(sheet.product)}
          />
        )}
        {sheet?.kind === "manual" && (
          <ManualForm
            onSubmit={(t) => {
              onAdd(t);
              setSheet(null);
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function Bracket({ className }: { className: string }) {
  return <div className={`absolute size-8 border-gold-300/70 ${className}`} />;
}

function ScanResult({
  product,
  onConfirm,
}: {
  product: ScannedProduct;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <GlassCard variant="strong" className="flex items-center gap-4 rounded-2xl p-4">
        <div className="flex size-14 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
          <Icon name={product.icon} className="size-7" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{product.name}</p>
          <p className="text-xs text-white/40">{product.category}</p>
        </div>
        <p className="text-lg font-bold text-gold-300">
          {formatIDR(product.price)}
        </p>
      </GlassCard>

      <p className="text-center text-xs text-white/40">
        Cocok? Tambahkan sebagai pengeluaran.
      </p>

      <motion.button
        onClick={onConfirm}
        whileTap={{ scale: 0.98 }}
        className="rounded-2xl bg-gradient-to-r from-mint-400 to-mint-500 py-3.5 text-sm font-semibold text-forest-950 shadow-lg shadow-mint-500/25"
      >
        Tambahkan Pengeluaran
      </motion.button>
      <button
        onClick={onConfirm}
        className="text-center text-xs text-white/40 hover:text-white/60"
      >
        Lewati & scan lagi
      </button>
    </motion.div>
  );
}

const manualIcons: IconKey[] = ["coffee", "cart", "food", "transport", "salary", "gift"];

function ManualForm({ onSubmit }: { onSubmit: (t: Transaction) => void }) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState<IconKey>("coffee");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(amount.replace(/\D/g, ""), 10);
    if (!amt || !category) return;
    onSubmit({
      id: `t${Date.now()}`,
      type,
      category,
      note: note || category,
      amount: amt,
      date: new Date().toISOString(),
      icon,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {/* type toggle */}
      <div className="glass relative grid grid-cols-2 gap-1 rounded-2xl p-1">
        <motion.div
          className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl"
          animate={{ x: type === "expense" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          style={
            type === "income"
              ? { backgroundColor: "rgb(110 231 168 / 0.25)" }
              : { backgroundColor: "rgb(240 164 164 / 0.25)" }
          }
        />
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`relative z-10 py-2 text-sm font-medium ${
              type === t
                ? t === "income"
                  ? "text-mint-300"
                  : "text-rose-300"
                : "text-white/40"
            }`}
          >
            {t === "income" ? "Pemasukan" : "Pengeluaran"}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-white/60">Jumlah</span>
        <input
          inputMode="numeric"
          value={amount ? formatIDR(parseInt(amount.replace(/\D/g, ""), 10)) : ""}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          placeholder="Rp0"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg font-semibold text-white placeholder:text-white/30 outline-none focus:border-gold-400/50"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-white/60">Kategori</span>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="cth: Kopi"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold-400/50"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-white/60">Catatan</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="cth: Kopi pagi"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-gold-400/50"
        />
      </label>

      {/* icon picker */}
      <div>
        <span className="mb-2 block text-xs font-medium text-white/60">
          Ikon
        </span>
        <div className="flex flex-wrap gap-2">
          {manualIcons.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcon(ic)}
              className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                icon === ic
                  ? "bg-gold-500/30 text-gold-300 ring-1 ring-gold-400/50"
                  : "bg-white/5 text-white/40"
              }`}
            >
              <Icon name={ic} className="size-5" />
            </button>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        className="rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-sm font-semibold text-forest-950 shadow-lg shadow-gold-500/25"
      >
        Simpan Transaksi
      </motion.button>
    </form>
  );
}
