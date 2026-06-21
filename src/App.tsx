import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedBackground from "./components/AnimatedBackground";
import BottomNav, { type TabKey } from "./components/BottomNav";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import ScanScreen from "./screens/ScanScreen";
import WeeklyRecapScreen from "./screens/WeeklyRecapScreen";
import AchievementScreen from "./screens/AchievementScreen";
import GalleryScreen from "./screens/GalleryScreen";
import InputScreen from "./screens/InputScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import { initialTransactions } from "./lib/data";
import type { Transaction } from "./lib/types";

type Screen = "auth" | "app" | "input" | "transactions";

export default function App() {
  const [screen, setScreen] = useState<Screen>("auth");
  const [tab, setTab] = useState<TabKey>("home");
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const addTransaction = (t: Transaction) =>
    setTransactions((prev) => [t, ...prev]);

  if (screen === "auth") {
    return (
      <>
        <AnimatedBackground />
        <AuthScreen onAuth={() => setScreen("app")} />
      </>
    );
  }

  if (screen === "input") {
    return (
      <>
        <AnimatedBackground />
        <InputScreen
          onSubmit={addTransaction}
          onBack={() => setScreen("app")}
        />
      </>
    );
  }

  if (screen === "transactions") {
    return (
      <>
        <AnimatedBackground />
        <TransactionsScreen
          transactions={transactions}
          onBack={() => setScreen("app")}
        />
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "home" && (
            <HomeScreen
              transactions={transactions}
              onInput={() => setScreen("input")}
              onViewAll={() => setScreen("transactions")}
            />
          )}
          {tab === "scan" && <ScanScreen onAdd={addTransaction} />}
          {tab === "rekap" && (
            <WeeklyRecapScreen transactions={transactions} />
          )}
          {tab === "achievement" && <AchievementScreen />}
          {tab === "gallery" && <GalleryScreen />}
        </motion.main>
      </AnimatePresence>

      <BottomNav active={tab} onChange={setTab} />
    </>
  );
}