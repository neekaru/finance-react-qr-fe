import { motion } from "framer-motion";
import Icon from "./Icon";
import type { IconKey } from "../lib/types";

export type TabKey = "home" | "rekap" | "scan" | "achievement" | "gallery";

interface BottomNavProps {
  active: TabKey;
  onChange: (t: TabKey) => void;
}

/** Only the 4 plain tabs — scan button floats separately above the bar. */
const tabs: { key: TabKey; label: string; icon: IconKey }[] = [
  { key: "home", label: "Beranda", icon: "wallet" },
  { key: "rekap", label: "Rekap", icon: "trending" },
  { key: "achievement", label: "Reward", icon: "trophy" },
  { key: "gallery", label: "Galeri", icon: "gift" },
];

/**
 * Floating glass nav bar with a raised scan button centered above it.
 * The scan button is absolutely positioned over the bar — fully outside the
 * overflow context — so it can never be clipped regardless of scroll width.
 */
export default function BottomNav({ active, onChange }: BottomNavProps) {
  const scanActive = active === "scan";
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(env(safe-area-inset-bottom)+14px)]">
      <div className="relative w-full max-w-md">
        {/* Raised scan button — sits above the bar, centered. */}
        <motion.button
          onClick={() => onChange("scan")}
          whileTap={{ scale: 0.9 }}
          className="pointer-events-auto absolute left-1/2 -top-7 z-10 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-forest-950 shadow-lg shadow-gold-500/30 ring-4 ring-forest-950/40"
          aria-label="Scan barcode"
        >
          <Icon name="scan" className="size-7" />
        </motion.button>

        <nav className="glass-strong pointer-events-auto flex items-end justify-around gap-0.5 overflow-x-auto rounded-3xl px-2 py-2.5 no-scrollbar">
          {/* left tabs */}
          {tabs.slice(0, 2).map((tab) => (
            <NavTab key={tab.key} tab={tab} active={active} onChange={onChange} />
          ))}
          {/* center gap reserved for the raised scan button */}
          <span className="w-14 shrink-0" aria-hidden="true" />
          {/* right tabs */}
          {tabs.slice(2).map((tab) => (
            <NavTab key={tab.key} tab={tab} active={active} onChange={onChange} />
          ))}
        </nav>

        {/* "Scan" label under the raised button */}
        <span
          className={`pointer-events-none absolute left-1/2 top-9 z-10 -translate-x-1/2 text-[9px] font-medium ${
            scanActive ? "text-gold-300" : "text-white/40"
          }`}
        >
          Scan
        </span>
      </div>
    </div>
  );
}

/** Floating + button — launches the Input screen (item 7). */
export function InputFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="fixed right-5 top-14 z-30 flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-forest-950 shadow-lg shadow-gold-500/30"
      aria-label="Input transaksi"
    >
      <Icon name="plus" className="size-6" />
    </motion.button>
  );
}

interface NavTabProps {
  tab: { key: TabKey; label: string; icon: IconKey };
  active: TabKey;
  onChange: (t: TabKey) => void;
}

function NavTab({ tab, active, onChange }: NavTabProps) {
  const isActive = active === tab.key;
  return (
    <button
      onClick={() => onChange(tab.key)}
      className="relative flex shrink-0 flex-col items-center gap-1 px-3 py-1"
    >
      <Icon
        name={tab.icon}
        className={`size-[22px] transition-colors ${
          isActive ? "text-gold-300" : "text-white/40"
        }`}
      />
      <span
        className={`text-[9px] font-medium ${
          isActive ? "text-gold-300" : "text-white/40"
        }`}
      >
        {tab.label}
      </span>
      {isActive && (
        <motion.div
          layoutId="nav-dot"
          className="absolute -bottom-0.5 size-1 rounded-full bg-gold-300"
        />
      )}
    </button>
  );
}
