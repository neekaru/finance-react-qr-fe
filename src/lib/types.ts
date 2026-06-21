export type TxnType = "income" | "expense";

export type IconKey =
  | "wallet"
  | "coffee"
  | "cart"
  | "food"
  | "salary"
  | "gift"
  | "transport"
  | "entertainment"
  | "scan"
  | "plus"
  | "trophy"
  | "flame"
  | "target"
  | "piggy"
  | "trending";

export interface Transaction {
  id: string;
  type: TxnType;
  category: string;
  note: string;
  amount: number;
  date: string; // ISO
  icon: IconKey;
}

export interface ScannedProduct {
  name: string;
  price: number;
  category: string;
  icon: IconKey;
}

export type AchievementStatus = "unlocked" | "locked" | "progress";

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: IconKey;
  status: AchievementStatus;
  /** 0..1 for progress; 1 for unlocked */
  progress: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxnType;
  icon: IconKey;
  /** tailwind gradient classes for the card */
  gradient: string;
}
