import type { IconKey } from "../lib/types";

const paths: Record<IconKey, React.ReactNode> = {
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-11A2.5 2.5 0 0 1 3 16.5v-9Z" />
      <path d="M16 11.5h.01" />
      <path d="M3 9h16" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 8h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M16 9h2.5a2 2 0 0 1 0 4H16" />
      <path d="M7 4.5c-.5.5-.5 1.5 0 2M10 4c-.5.5-.5 1.5 0 2M13 4.5c-.5.5-.5 1.5 0 2" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2 11h10l1.5-7H6" />
      <circle cx="9" cy="19" r="1.2" />
      <circle cx="17" cy="19" r="1.2" />
    </>
  ),
  food: (
    <>
      <path d="M5 10h14l-.5 7a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2L5 10Z" />
      <path d="M8 10V6.5C8 5.7 8.7 5 9.5 5h5c.8 0 1.5.7 1.5 1.5V10" />
      <path d="M12 5V3" />
    </>
  ),
  salary: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 10a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.7-2.5 1.75s1.1 1.5 2.5 1.5 2.5.45 2.5 1.5-1.1 1.75-2.5 1.75A2.5 2 0 0 1 9.5 14" />
      <path d="M12 7v.5M12 16.5V17" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11h16v6.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5V11Z" />
      <path d="M3.5 8h17v3h-17zM12 8v11" />
      <path d="M12 8S10.5 4.5 8.5 5 9 8 12 8ZM12 8s1.5-3.5 3.5-3S15 8 12 8Z" />
    </>
  ),
  transport: (
    <>
      <path d="M5 7l.8-2.2A2 2 0 0 1 7.7 3.4h8.6a2 2 0 0 1 1.9 1.4L19 7v9a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7Z" />
      <path d="M5 11h14" />
      <circle cx="8" cy="13.5" r="1" />
      <circle cx="16" cy="13.5" r="1" />
    </>
  ),
  entertainment: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M9 9.5l5 2.5-5 2.5v-5Z" />
    </>
  ),
  scan: (
    <>
      <path d="M4 8V6.5A2.5 2.5 0 0 1 6.5 4H8M16 4h1.5A2.5 2.5 0 0 1 20 6.5V8M20 16v1.5a2.5 2.5 0 0 1-2.5 2.5H16M8 20H6.5A2.5 2.5 0 0 1 4 17.5V16" />
      <path d="M4 12h16" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3" />
      <path d="M12 13v4M9 21h6M10 21v-2h4v2" />
    </>
  ),
  flame: (
    <>
      <path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1.5-3.5C10 9 11 6 12 3Z" />
      <path d="M12 17a1.5 1.5 0 0 0 1.5-1.5c0-1-.5-1.5-1.5-2-1 .5-1.5 1-1.5 2A1.5 1.5 0 0 0 12 17Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" />
    </>
  ),
  piggy: (
    <>
      <path d="M4 12a6 6 0 0 1 6-6h3a6 6 0 0 1 6 6c0 1.5-.5 2.5-1 3v3h-2v-2H9v2H7v-3c-1.5-.5-3-2-3-3Z" />
      <path d="M16 11h.01M5 11l-2-1.5" />
      <path d="M9 6c0-1.5 1-2.5 2-2.5s2 1 2 2.5" />
    </>
  ),
  trending: (
    <>
      <path d="M4 16l5-5 3 3 7-7" />
      <path d="M16 7h4v4" />
    </>
  ),
};

interface IconProps {
  name: IconKey;
  className?: string;
}

export default function Icon({ name, className = "size-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
