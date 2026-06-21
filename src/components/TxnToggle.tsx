import { motion } from "framer-motion";
import type { TxnType } from "../lib/types";
import Icon from "./Icon";

interface TxnToggleProps {
  value: TxnType;
  onChange: (v: TxnType) => void;
}

/** Segmented control that slides a glass pill between income / expense. */
export default function TxnToggle({ value, onChange }: TxnToggleProps) {
  return (
    <div className="glass relative grid grid-cols-2 gap-1 rounded-2xl p-1">
      <motion.div
        className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl"
        animate={{ x: value === "income" ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        style={
          value === "income"
            ? { backgroundColor: "rgb(110 231 168 / 0.25)" }
            : { backgroundColor: "rgb(240 164 164 / 0.25)" }
        }
      />
      {(["income", "expense"] as TxnType[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative z-10 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${
            value === t
              ? t === "income"
                ? "text-mint-300"
                : "text-rose-300"
              : "text-white/50"
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
  );
}
