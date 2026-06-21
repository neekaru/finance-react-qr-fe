import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../components/GlassCard";
import Icon from "../components/Icon";

interface AuthScreenProps {
  onAuth: () => void;
}

type Mode = "login" | "register";

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock auth — any input logs in
    onAuth();
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10">
      {/* brand mark */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col items-center gap-3"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-forest-950 shadow-lg shadow-gold-500/30">
          <Icon name="wallet" className="size-9" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            FinKeep
          </h1>
          <p className="text-sm text-white/50">
            Simpan, pindai, atur uangmu
          </p>
        </div>
      </motion.div>

      <GlassCard
        variant="strong"
        className="w-full max-w-md rounded-3xl p-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* mode toggle */}
        <div className="glass relative mb-6 grid grid-cols-2 gap-1 rounded-2xl p-1">
          <motion.div
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl bg-white/15"
            animate={{ x: isLogin ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative z-10 py-2 text-sm font-medium transition-colors ${
                mode === m ? "text-white" : "text-white/40"
              }`}
            >
              {m === "login" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Field
                  label="Nama Lengkap"
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="Nama kamu"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="kamu@email.com"
            required
          />
          <Field
            label="Kata Sandi"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          {isLogin && (
            <button
              type="button"
              className="self-end text-xs text-gold-300/80 hover:text-gold-300"
            >
              Lupa kata sandi?
            </button>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="mt-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 py-3.5 text-sm font-semibold text-forest-950 shadow-lg shadow-gold-500/25"
          >
            {isLogin ? "Masuk" : "Buat Akun"}
          </motion.button>
        </form>

        <p className="mt-5 text-center text-xs text-white/40">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <button
            onClick={() => setMode(isLogin ? "register" : "login")}
            className="font-medium text-gold-300 hover:underline"
          >
            {isLogin ? "Daftar di sini" : "Masuk saja"}
          </button>
        </p>
      </GlassCard>
    </div>
  );
}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

function Field({ label, type, value, onChange, placeholder, required }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-white/60">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-gold-400/50 focus:bg-white/10"
      />
    </label>
  );
}
