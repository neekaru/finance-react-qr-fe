export const formatIDR = (n: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/** Compact IDR: Rp1,2 jt / Rp850 rb */
export const formatIDRShort = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000)
    return `Rp${(n / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (abs >= 1_000)
    return `Rp${(n / 1_000).toFixed(0)} rb`;
  return `Rp${n}`;
};

const WD = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MO = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${WD[d.getDay()]}, ${d.getDate()} ${MO[d.getMonth()]}`;
};

export const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}.${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
};
