import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ReactDOM from "react-dom/client";

/* ============================== ICONS ============================== */

const ICONS = {
  home: <>
    <path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>
  </>,
  wallet: <>
    <rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 12h4"/><path d="M2 10h20"/>
  </>,
  checkSquare: <>
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l3 3 5-6"/>
  </>,
  gamepad: <>
    <rect x="2" y="7" width="20" height="10" rx="4"/><path d="M8 10v4M6 12h4"/><circle cx="16" cy="10.5" r="1" fill="currentColor"/><circle cx="18.5" cy="13" r="1" fill="currentColor"/>
  </>,
  more: <>
    <circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>
  </>,
  plus: <path d="M12 5v14M5 12h14"/>,
  x: <path d="M18 6L6 18M6 6l12 12"/>,
  check: <path d="M20 6L9 17l-5-5"/>,
  trendUp: <>
    <path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
  </>,
  trendDown: <>
    <path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/>
  </>,
  target: <>
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
  </>,
  bag: <>
    <path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>
  </>,
  trophy: <>
    <path d="M8 4h8v4a4 4 0 01-8 0V4z"/><path d="M6 5H4a2 2 0 002 4"/><path d="M18 5h2a2 2 0 01-2 4"/><path d="M10 15h4v3h-4z"/><path d="M8 21h8"/>
  </>,
  car: <>
    <path d="M3 13l2-6h14l2 6"/><rect x="2" y="13" width="20" height="6" rx="2"/><circle cx="7" cy="19" r="1.5" fill="currentColor"/><circle cx="17" cy="19" r="1.5" fill="currentColor"/>
  </>,
  package: <>
    <path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/>
  </>,
  note: <>
    <path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>
  </>,
  settings: <>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>
  </>,
  download: <>
    <path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>
  </>,
  upload: <>
    <path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 3h14"/>
  </>,
  chevronRight: <path d="M9 6l6 6-6 6"/>,
  chevronLeft: <path d="M15 6l-6 6 6 6"/>,
  alert: <>
    <path d="M12 3l10 18H2L12 3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>
  </>,
  trash: <>
    <path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 14h10l1-14"/>
  </>,
  sparkles: <>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
    <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/>
  </>,
  rotate: <>
    <path d="M20 12a8 8 0 10-3 6.3"/><path d="M20 6v6h-6"/>
  </>,
  card: <>
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </>,
  fuel: <>
    <path d="M4 21V6a2 2 0 012-2h5a2 2 0 012 2v15"/><path d="M4 11h9"/><path d="M15 8l3 2v7a2 2 0 002 2"/><circle cx="18" cy="8" r="1" fill="currentColor"/>
  </>,
  arrowUpRight: <>
    <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
  </>,
  arrowDownRight: <>
    <path d="M7 7l10 10"/><path d="M17 8v9H8"/>
  </>,
  loader: <>
    <circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M21 12a9 9 0 00-9-9"/>
  </>,
  zap: <path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z"/>,
};

function Icon({ name, size = 18, color = "currentColor", style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      {ICONS[name]}
    </svg>
  );
}

/* ============================== CONSTANTS ============================== */

const CURRENCIES = { RUB: "₽", USD: "$", EUR: "€", PLN: "zł", GBP: "£" };

const EXPENSE_CATEGORIES = [
  { id: "food", label: "Еда", emoji: "🍔" },
  { id: "car", label: "Автомобиль", emoji: "🚗" },
  { id: "home", label: "Дом", emoji: "🏠" },
  { id: "credit", label: "Кредиты", emoji: "💳" },
  { id: "games", label: "Игры", emoji: "🎮" },
  { id: "shopping", label: "Покупки", emoji: "🛒" },
  { id: "fun", label: "Развлечения", emoji: "🎬" },
  { id: "clothes", label: "Одежда", emoji: "👕" },
  { id: "subs", label: "Подписки", emoji: "📱" },
  { id: "other", label: "Другое", emoji: "💊" },
];

const INCOME_CATEGORIES = [
  { id: "salary", label: "Зарплата", emoji: "💼" },
  { id: "extra", label: "Доп. доход", emoji: "✨" },
  { id: "gift", label: "Подарок", emoji: "🎁" },
  { id: "refund", label: "Возврат", emoji: "↩️" },
  { id: "other", label: "Другое", emoji: "💰" },
];

const PRIORITIES = [
  { id: "high", label: "ВЫСОКИЙ", emoji: "🔥", color: "#FB7185" },
  { id: "medium", label: "СРЕДНИЙ", emoji: "🟡", color: "#FBBF24" },
  { id: "low", label: "НИЗКИЙ", emoji: "🟢", color: "#34D399" },
];

const GAME_STATUSES = ["ИГРАЮ", "ОТЛОЖЕНО", "ПРОЙДЕНО", "ПЛАТИНА", "БРОШЕНО"];
const GOAL_STATUSES = ["АКТИВНА", "ВЫПОЛНЕНА", "НА ПАУЗЕ", "ОТМЕНЕНА"];

const ACCENT = "#4C6FFF";
const ACCENT_SOFT = "rgba(76,111,255,0.14)";
const GOLD = "#E8B44D";

const STORAGE_KEY = "vault-state-v1";

/* ============================== HELPERS ============================== */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function fmtMoney(amount, currency = "RUB") {
  const sym = CURRENCIES[currency] || "";
  const n = Math.round(amount || 0);
  return `${n.toLocaleString("ru-RU")} ${sym}`;
}

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const A = new Date(a); A.setHours(0, 0, 0, 0);
  const B = new Date(b); B.setHours(0, 0, 0, 0);
  return Math.round((B - A) / 86400000);
}

function nextOccurrence(day) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const clampDay = Math.min(Math.max(parseInt(day) || 1, 1), 28);
  let candidate = new Date(today.getFullYear(), today.getMonth(), clampDay);
  if (candidate < today) candidate = new Date(today.getFullYear(), today.getMonth() + 1, clampDay);
  return { date: candidate, daysUntil: daysBetween(today, candidate) };
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "СПОКОЙНОЙ НОЧИ";
  if (h < 12) return "ДОБРОЕ УТРО";
  if (h < 18) return "ДОБРЫЙ ДЕНЬ";
  return "ДОБРЫЙ ВЕЧЕР";
}

function formatDateHeader() {
  const d = new Date();
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }).toUpperCase();
}

function catMeta(list, id) {
  return list.find((c) => c.id === id) || list[list.length - 1];
}

/* ============================== FINANCE ENGINE ============================== */

function getBalance(data) {
  return (data.transactions || []).reduce(
    (s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0
  );
}

function getMonthTotals(data) {
  const now = new Date();
  const m = now.getMonth(), y = now.getFullYear();
  let income = 0, expenses = 0;
  (data.transactions || []).forEach((t) => {
    const d = new Date(t.date);
    if (d.getMonth() === m && d.getFullYear() === y) {
      if (t.type === "income") income += t.amount; else expenses += t.amount;
    }
  });
  return { income, expenses, saved: income - expenses };
}

function getNextIncome(data) {
  const list = (data.recurring || []).filter((r) => r.type === "income" && r.active !== false);
  if (!list.length) return null;
  let best = null;
  list.forEach((r) => {
    const occ = nextOccurrence(r.day);
    if (!best || occ.daysUntil < best.daysUntil) best = { ...occ, amount: r.amount, name: r.name };
  });
  return best;
}

function getUpcomingPayments(data, horizonDays = 30) {
  const list = (data.payments || []).filter((p) => p.active !== false);
  return list
    .map((p) => {
      const occ = nextOccurrence(p.dueDay);
      return { ...p, ...occ };
    })
    .filter((p) => p.daysUntil <= horizonDays)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

function computeFinance(data) {
  const balance = getBalance(data);
  const nextIncome = getNextIncome(data);
  const horizon = nextIncome ? Math.max(nextIncome.daysUntil, 1) : 30;
  const upcoming = getUpcomingPayments(data, horizon);
  const mandatorySum = upcoming.reduce((s, p) => s + p.amount, 0);
  const available = balance - mandatorySum;
  const safeToSpend = Math.max(Math.floor(available / horizon), 0);
  const forecast = balance + (nextIncome ? nextIncome.amount : 0) - mandatorySum;
  const monthTotals = getMonthTotals(data);
  return { balance, nextIncome, upcoming, mandatorySum, safeToSpend, forecast, monthTotals, horizon };
}

function buildInsights(data, fin) {
  const insights = [];
  const overdue = (data.tasks || []).filter((t) => !t.done && t.dueDate && t.dueDate < todayISO());
  if (overdue.length) {
    insights.push({ icon: "alert", tone: "danger", text: `Просрочено задач: ${overdue.length}` });
  }
  if (fin.upcoming.length && fin.upcoming[0].daysUntil <= 3) {
    const p = fin.upcoming[0];
    insights.push({
      icon: "card", tone: "warn",
      text: `Платёж «${p.name}» через ${p.daysUntil === 0 ? "сегодня" : p.daysUntil + " дн."}`,
    });
  }
  if (fin.safeToSpend <= 0 || (fin.balance > 0 && fin.safeToSpend < fin.balance * 0.02)) {
    insights.push({ icon: "alert", tone: "danger", text: "Бюджет на исходе — трать осторожно" });
  }
  const activeGoals = (data.goals || []).filter((g) => g.status === "АКТИВНА" && g.target);
  activeGoals.forEach((g) => {
    const pct = Math.min(100, Math.round((g.current / g.target) * 100));
    if (pct >= 75 && pct < 100) {
      insights.push({ icon: "target", tone: "info", text: `До цели «${g.title}» осталось ${fmtMoney(g.target - g.current, data.settings.currency)}` });
    }
  });
  const playing = (data.games || []).find((g) => g.status === "ИГРАЮ");
  if (playing) {
    insights.push({ icon: "gamepad", tone: "info", text: `«${playing.title}»: пройдено ${playing.progress || 0}%` });
  }
  if (!insights.length) {
    insights.push({ icon: "sparkles", tone: "info", text: "Всё спокойно. Ничего срочного." });
  }
  return insights.slice(0, 4);
}

/* ============================== DEMO DATA ============================== */

function demoData() {
  const t = todayISO();
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
  const daysFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  return {
    settings: { name: "Василий", currency: "RUB", onboarded: true },
    vehicle: { name: "Skoda Octavia", year: 2021, mileage: 48200 },
    transactions: [
      { id: uid(), type: "income", amount: 45000, category: "salary", note: "Начальный баланс", date: daysAgo(20) },
      { id: uid(), type: "income", amount: 90000, category: "salary", note: "Зарплата", date: daysAgo(3) },
      { id: uid(), type: "expense", amount: 25000, category: "home", note: "Аренда", date: daysAgo(3) },
      { id: uid(), type: "expense", amount: 4820, category: "car", note: "Бензин", date: daysAgo(2) },
      { id: uid(), type: "expense", amount: 3200, category: "food", note: "Продукты", date: daysAgo(1) },
      { id: uid(), type: "expense", amount: 1990, category: "subs", note: "PS Plus", date: daysAgo(5) },
      { id: uid(), type: "expense", amount: 6500, category: "shopping", note: "Одежда", date: daysAgo(6) },
    ],
    recurring: [
      { id: uid(), type: "income", name: "Зарплата", amount: 90000, day: 5, active: true },
      { id: uid(), type: "income", name: "Подработка", amount: 20000, day: 20, active: true },
    ],
    payments: [
      { id: uid(), name: "Кредит", amount: 14500, dueDay: 12, category: "credit", balance: 210000, rate: 12.5, months: 18, active: true },
      { id: uid(), name: "Аренда", amount: 25000, dueDay: 1, category: "home", active: true },
      { id: uid(), name: "Интернет", amount: 600, dueDay: 15, category: "subs", active: true },
      { id: uid(), name: "Мобильная связь", amount: 450, dueDay: 18, category: "subs", active: true },
    ],
    tasks: [
      { id: uid(), title: "Оплатить кредит", done: false, dueDate: daysFromNow(2) },
      { id: uid(), title: "Заправить автомобиль", done: false, dueDate: t },
      { id: uid(), title: "Забрать посылку", done: false, dueDate: t },
      { id: uid(), title: "Купить подарок", done: false, dueDate: daysFromNow(4) },
    ],
    goals: [
      { id: uid(), title: "PS5 Pro", type: "financial", target: 65000, current: 38500, deadline: daysFromNow(40), status: "АКТИВНА", category: "Игры" },
      { id: uid(), title: "Пройти Elden Ring DLC", type: "other", target: 0, current: 0, deadline: null, status: "АКТИВНА", category: "Игры" },
    ],
    games: [
      { id: uid(), title: "Ghost of Yōtei", status: "ИГРАЮ", progress: 84, trophies: { total: 51, earned: 42, platinum: false }, hours: 38, rating: 9 },
      { id: uid(), title: "Elden Ring: Nightreign", status: "ОТЛОЖЕНО", progress: 0, trophies: { total: 40, earned: 0, platinum: false }, hours: 0, rating: 0 },
      { id: uid(), title: "Astro Bot", status: "ПЛАТИНА", progress: 100, trophies: { total: 34, earned: 34, platinum: true }, hours: 22, rating: 10 },
    ],
    wishlist: [
      { id: uid(), title: "DualSense Edge", price: 18500, priority: "high", link: "", note: "На распродаже" },
      { id: uid(), title: "Зимняя резина", price: 32000, priority: "medium", link: "", note: "" },
    ],
    notes: [
      { id: uid(), title: "Идея", body: "Проверить страховку на авто в сентябре", pinned: true, date: t },
    ],
    vehicleExpenses: [
      { id: uid(), type: "Бензин", amount: 4820, date: daysAgo(2), km: 612 },
    ],
    inventory: [
      { id: uid(), title: "MacBook Air M2", category: "Электроника", cost: 145000, date: daysAgo(200), warranty: "12 мес", note: "" },
    ],
  };
}

function emptyData() {
  return {
    settings: { name: "", currency: "RUB", onboarded: false },
    vehicle: null,
    transactions: [], recurring: [], payments: [], tasks: [], goals: [],
    games: [], wishlist: [], notes: [], vehicleExpenses: [], inventory: [],
  };
}

/* ============================== STORAGE (localStorage) ============================== */

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error("load failed", e); }
  return null;
}

function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error("save failed", e); }
}

/* ============================== UI PRIMITIVES ============================== */

function Card({ children, className = "", onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-neutral-900/80 border border-neutral-800 rounded-3xl p-5 ${onClick ? "active:scale-[0.98] transition-transform cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <span className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500">{children}</span>
      {right}
    </div>
  );
}

function ProgressBar({ pct, color = ACCENT, height = 8 }) {
  return (
    <div className="w-full bg-neutral-800 rounded-full overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color, boxShadow: `0 0 12px 0 ${color}66` }}
      />
    </div>
  );
}

function Pill({ children, tone = "default", small }) {
  const tones = {
    default: "bg-neutral-800 text-neutral-300",
    danger: "bg-rose-500/15 text-rose-400",
    warn: "bg-amber-500/15 text-amber-400",
    info: "bg-blue-500/15 text-blue-400",
    success: "bg-emerald-500/15 text-emerald-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${small ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"} ${tones[tone]}`}>
      {children}
    </span>
  );
}

function IconBtn({ icon, onClick, className = "", size = 18 }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800/80 active:scale-90 transition-transform text-neutral-300 ${className}`}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-14 h-14 rounded-2xl bg-neutral-800/70 flex items-center justify-center mb-4">
        <Icon name={icon} size={24} className="text-neutral-500" />
      </div>
      <div className="text-white font-semibold mb-1">{title}</div>
      <div className="text-neutral-500 text-sm mb-5 max-w-[240px]">{subtitle}</div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: ACCENT }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[100]" style={{ animation: "fadeIn 0.2s ease" }}>
      <div className="bg-neutral-800 text-white text-sm font-medium px-4 py-2.5 rounded-full border border-neutral-700 shadow-2xl flex items-center gap-2">
        <Icon name="check" size={14} style={{ color: ACCENT }} /> {toast}
      </div>
    </div>
  );
}

function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-950 border-t border-neutral-800 rounded-t-3xl pb-8 max-h-[86vh] overflow-y-auto" style={{ animation: "slideUp 0.25s ease" }}>
        <div className="sticky top-0 bg-neutral-950 pt-3 pb-2 px-5 flex items-center justify-between border-b border-neutral-900">
          <div className="w-10" />
          <div className="w-10 h-1 bg-neutral-700 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
          <div className="text-white font-semibold text-sm">{title}</div>
          <IconBtn icon="x" onClick={onClose} />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function TextField({ label, ...props }) {
  return (
    <label className="block mb-4">
      <div className="text-xs font-medium text-neutral-500 mb-1.5">{label}</div>
      <input
        {...props}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-[15px] outline-none focus:border-neutral-600 placeholder:text-neutral-600"
      />
    </label>
  );
}

function SelectChips({ options, value, onChange, labelKey = "label", emojiKey = "emoji" }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-1.5 ${
            value === o.id ? "border-transparent text-white" : "border-neutral-800 text-neutral-400 bg-neutral-900"
          }`}
          style={value === o.id ? { background: ACCENT_SOFT, borderColor: ACCENT, color: "#fff" } : {}}
        >
          {o[emojiKey] && <span>{o[emojiKey]}</span>} {o[labelKey]}
        </button>
      ))}
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] active:scale-[0.98] transition-transform disabled:opacity-40"
      style={{ background: ACCENT, boxShadow: `0 8px 24px -8px ${ACCENT}88` }}
    >
      {children}
    </button>
  );
}

/* ============================== APP ============================== */

function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const [morePage, setMorePage] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const stored = loadState();
    setData(stored || emptyData());
  }, []);

  const updateData = useCallback((fn) => {
    setData((prev) => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    saveState(next);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const addItem = useCallback((key, item) => {
    updateData((d) => ({ ...d, [key]: [{ id: uid(), ...item }, ...d[key]] }));
  }, [updateData]);

  const removeItem = useCallback((key, id) => {
    updateData((d) => ({ ...d, [key]: d[key].filter((i) => i.id !== id) }));
  }, [updateData]);

  const updateItem = useCallback((key, id, patch) => {
    updateData((d) => ({ ...d, [key]: d[key].map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  }, [updateData]);

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <Icon name="loader" size={28} className="text-neutral-600 animate-spin" />
      </div>
    );
  }

  if (!data.settings.onboarded) {
    return <Onboarding onComplete={(d) => persist(d)} onDemo={() => persist(demoData())} />;
  }

  const fin = computeFinance(data);
  const insights = buildInsights(data, fin);
  const currency = data.settings.currency;
  const closeSheet = () => setSheet(null);
  const ctx = { data, fin, insights, currency, addItem, removeItem, updateItem, updateData, showToast, setSheet, persist };

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md relative flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto pb-28 px-4 pt-6">
          {tab === "home" && <HomePage {...ctx} setTab={setTab} setMorePage={setMorePage} />}
          {tab === "money" && <MoneyPage {...ctx} />}
          {tab === "life" && <LifePage {...ctx} />}
          {tab === "games" && <GamesPage {...ctx} />}
          {tab === "more" && <MorePage {...ctx} page={morePage} setPage={setMorePage} />}
        </div>

        <BottomNav tab={tab} setTab={(t) => { setTab(t); setMorePage(null); }} onPlus={() => setSheet("actions")} />

        <QuickActionsSheet open={sheet === "actions"} onClose={closeSheet} onPick={(k) => setSheet(k)} />
        <AddExpenseSheet open={sheet === "expense"} onClose={closeSheet} {...ctx} />
        <AddIncomeSheet open={sheet === "income"} onClose={closeSheet} {...ctx} />
        <AddTaskSheet open={sheet === "task"} onClose={closeSheet} {...ctx} />
        <AddPurchaseSheet open={sheet === "purchase"} onClose={closeSheet} {...ctx} />
        <AddGoalSheet open={sheet === "goal"} onClose={closeSheet} {...ctx} />
        <AddNoteSheet open={sheet === "note"} onClose={closeSheet} {...ctx} />

        <Toast toast={toast} />
      </div>
    </div>
  );
}

/* ============================== ONBOARDING ============================== */

function Onboarding({ onComplete, onDemo }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [balance, setBalance] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDay, setIncomeDay] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDay, setPaymentDay] = useState("");

  const finish = (skip) => {
    const base = emptyData();
    base.settings = { name: name || "друг", currency, onboarded: true };
    if (!skip) {
      if (balance) base.transactions.push({ id: uid(), type: "income", amount: Number(balance), category: "other", note: "Начальный баланс", date: todayISO() });
      if (incomeAmount && incomeDay) base.recurring.push({ id: uid(), type: "income", name: "Зарплата", amount: Number(incomeAmount), day: Number(incomeDay), active: true });
      if (paymentName && paymentAmount && paymentDay) base.payments.push({ id: uid(), name: paymentName, amount: Number(paymentAmount), dueDay: Number(paymentDay), category: "other", active: true });
    }
    onComplete(base);
  };

  const steps = [
    { title: "ДОБРО ПОЖАЛОВАТЬ В VAULT" },
    { title: "Как тебя зовут?" },
    { title: "Валюта" },
    { title: "Текущий баланс" },
    { title: "Следующий доход" },
    { title: "Обязательный платёж" },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md flex flex-col justify-between px-6 py-10 min-h-screen">
        <div>
          <div className="flex items-center gap-2 mb-10">
            {steps.map((_, i) => (
              <div key={i} className="h-1 rounded-full flex-1" style={{ background: i <= step ? ACCENT : "#262626" }} />
            ))}
          </div>

          {step === 0 && (
            <div className="pt-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: ACCENT_SOFT }}>
                <Icon name="zap" style={{ color: ACCENT }} size={28} />
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">VAULT</h1>
              <p className="text-neutral-400 text-[15px]">Твоя личная операционная система.</p>
            </div>
          )}

          {step === 1 && (
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Как тебя зовут?</h2>
              <TextField label="Имя" placeholder="Василий" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
          )}

          {step === 2 && (
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Выбери валюту</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CURRENCIES).map(([k, sym]) => (
                  <button key={k} onClick={() => setCurrency(k)}
                    className="px-4 py-3 rounded-2xl border font-semibold"
                    style={currency === k ? { background: ACCENT_SOFT, borderColor: ACCENT, color: "#fff" } : { borderColor: "#262626", color: "#a3a3a3" }}>
                    {sym} {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Текущий баланс</h2>
              <TextField label={`Баланс, ${CURRENCIES[currency]}`} type="number" placeholder="47350" value={balance} onChange={(e) => setBalance(e.target.value)} autoFocus />
            </div>
          )}

          {step === 4 && (
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Следующий доход</h2>
              <TextField label={`Сумма, ${CURRENCIES[currency]}`} type="number" placeholder="90000" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} />
              <TextField label="День месяца" type="number" placeholder="5" value={incomeDay} onChange={(e) => setIncomeDay(e.target.value)} />
            </div>
          )}

          {step === 5 && (
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Обязательный платёж</h2>
              <TextField label="Название" placeholder="Кредит" value={paymentName} onChange={(e) => setPaymentName(e.target.value)} />
              <TextField label={`Сумма, ${CURRENCIES[currency]}`} type="number" placeholder="14500" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
              <TextField label="День месяца" type="number" placeholder="12" value={paymentDay} onChange={(e) => setPaymentDay(e.target.value)} />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {step < steps.length - 1 ? (
            <PrimaryButton onClick={() => setStep((s) => s + 1)}>Далее</PrimaryButton>
          ) : (
            <PrimaryButton onClick={() => finish(false)}>VAULT ГОТОВ К РАБОТЕ</PrimaryButton>
          )}
          {step === 0 ? (
            <button onClick={onDemo} className="w-full py-3 text-neutral-500 text-sm font-medium">Загрузить демо-данные</button>
          ) : (
            <button onClick={() => finish(true)} className="w-full py-3 text-neutral-500 text-sm font-medium">Пропустить настройку</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================== BOTTOM NAV ============================== */

function BottomNav({ tab, setTab, onPlus }) {
  const items = [
    { id: "home", icon: "home", label: "ГЛАВНАЯ" },
    { id: "money", icon: "wallet", label: "ФИНАНСЫ" },
    { id: "life", icon: "checkSquare", label: "ЖИЗНЬ" },
    { id: "games", icon: "gamepad", label: "ИГРЫ" },
    { id: "more", icon: "more", label: "ЕЩЁ" },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-[max(env(safe-area-inset-bottom),14px)] pt-2 bg-gradient-to-t from-black via-black/95 to-transparent">
      <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-3xl flex items-center justify-between px-2 py-2 relative">
        {items.slice(0, 2).map((it) => <NavBtn key={it.id} it={it} tab={tab} setTab={setTab} />)}
        <button
          onClick={onPlus}
          className="w-12 h-12 rounded-full flex items-center justify-center -mt-6 active:scale-90 transition-transform"
          style={{ background: ACCENT, boxShadow: `0 8px 20px -4px ${ACCENT}aa` }}
        >
          <Icon name="plus" size={22} className="text-white" />
        </button>
        {items.slice(2).map((it) => <NavBtn key={it.id} it={it} tab={tab} setTab={setTab} />)}
      </div>
    </div>
  );
}

function NavBtn({ it, tab, setTab }) {
  const active = tab === it.id;
  return (
    <button onClick={() => setTab(it.id)} className="flex flex-col items-center gap-1 w-14 py-1.5">
      <Icon name={it.icon} size={20} color={active ? ACCENT : "#6b7280"} />
      <span className="text-[9px] font-semibold tracking-wide" style={{ color: active ? ACCENT : "#6b7280" }}>{it.label}</span>
    </button>
  );
}

/* ============================== QUICK ACTIONS SHEET ============================== */

function QuickActionsSheet({ open, onClose, onPick }) {
  const actions = [
    { id: "expense", label: "Расход", icon: "arrowDownRight", color: "#FB7185" },
    { id: "income", label: "Доход", icon: "arrowUpRight", color: "#34D399" },
    { id: "task", label: "Задача", icon: "checkSquare", color: "#60A5FA" },
    { id: "purchase", label: "Покупка", icon: "bag", color: "#FBBF24" },
    { id: "goal", label: "Цель", icon: "target", color: "#A78BFA" },
    { id: "note", label: "Заметка", icon: "note", color: "#F472B6" },
  ];
  return (
    <BottomSheet open={open} onClose={onClose} title="БЫСТРЫЕ ДЕЙСТВИЯ">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((a) => (
          <button key={a.id} onClick={() => onPick(a.id)} className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 active:scale-95 transition-transform">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${a.color}22` }}>
              <Icon name={a.icon} size={18} style={{ color: a.color }} />
            </div>
            <span className="text-xs font-medium text-neutral-300">{a.label}</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

/* ============================== ADD SHEETS ============================== */

function AddExpenseSheet({ open, onClose, addItem, currency, showToast }) {
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("food");
  const [note, setNote] = useState("");
  useEffect(() => { if (open) { setAmount(""); setCat("food"); setNote(""); } }, [open]);
  const submit = () => {
    if (!amount) return;
    addItem("transactions", { type: "expense", amount: Number(amount), category: cat, note, date: todayISO() });
    showToast("Расход добавлен");
    onClose();
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="НОВЫЙ РАСХОД">
      <TextField label={`Сумма, ${CURRENCIES[currency]}`} type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
      <div className="text-xs font-medium text-neutral-500 mb-1.5">Категория</div>
      <SelectChips options={EXPENSE_CATEGORIES} value={cat} onChange={setCat} />
      <TextField label="Комментарий" placeholder="Необязательно" value={note} onChange={(e) => setNote(e.target.value)} />
      <PrimaryButton onClick={submit} disabled={!amount}>Добавить расход</PrimaryButton>
    </BottomSheet>
  );
}

function AddIncomeSheet({ open, onClose, addItem, currency, showToast }) {
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("salary");
  const [note, setNote] = useState("");
  useEffect(() => { if (open) { setAmount(""); setCat("salary"); setNote(""); } }, [open]);
  const submit = () => {
    if (!amount) return;
    addItem("transactions", { type: "income", amount: Number(amount), category: cat, note, date: todayISO() });
    showToast("Доход добавлен");
    onClose();
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="НОВЫЙ ДОХОД">
      <TextField label={`Сумма, ${CURRENCIES[currency]}`} type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
      <div className="text-xs font-medium text-neutral-500 mb-1.5">Категория</div>
      <SelectChips options={INCOME_CATEGORIES} value={cat} onChange={setCat} />
      <TextField label="Комментарий" placeholder="Необязательно" value={note} onChange={(e) => setNote(e.target.value)} />
      <PrimaryButton onClick={submit} disabled={!amount}>Добавить доход</PrimaryButton>
    </BottomSheet>
  );
}

function AddTaskSheet({ open, onClose, addItem, showToast }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState(todayISO());
  useEffect(() => { if (open) { setTitle(""); setDue(todayISO()); } }, [open]);
  const submit = () => {
    if (!title) return;
    addItem("tasks", { title, done: false, dueDate: due });
    showToast("Задача добавлена");
    onClose();
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="НОВАЯ ЗАДАЧА">
      <TextField label="Что нужно сделать" placeholder="Оплатить кредит" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <TextField label="Срок" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      <PrimaryButton onClick={submit} disabled={!title}>Добавить задачу</PrimaryButton>
    </BottomSheet>
  );
}

function AddPurchaseSheet({ open, onClose, addItem, currency, showToast }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState("medium");
  const [link, setLink] = useState("");
  useEffect(() => { if (open) { setTitle(""); setPrice(""); setPriority("medium"); setLink(""); } }, [open]);
  const submit = () => {
    if (!title) return;
    addItem("wishlist", { title, price: Number(price) || 0, priority, link, note: "" });
    showToast("Добавлено в список покупок");
    onClose();
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="ХОЧУ КУПИТЬ">
      <TextField label="Название" placeholder="DualSense Edge" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <TextField label={`Цена, ${CURRENCIES[currency]}`} type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div className="text-xs font-medium text-neutral-500 mb-1.5">Приоритет</div>
      <SelectChips options={PRIORITIES} value={priority} onChange={setPriority} />
      <TextField label="Ссылка" placeholder="Необязательно" value={link} onChange={(e) => setLink(e.target.value)} />
      <PrimaryButton onClick={submit} disabled={!title}>Добавить в список</PrimaryButton>
    </BottomSheet>
  );
}

function AddGoalSheet({ open, onClose, addItem, currency, showToast }) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [isFinancial, setIsFinancial] = useState(true);
  useEffect(() => { if (open) { setTitle(""); setTarget(""); setCurrent(""); setIsFinancial(true); } }, [open]);
  const submit = () => {
    if (!title) return;
    addItem("goals", {
      title, type: isFinancial ? "financial" : "other",
      target: isFinancial ? Number(target) || 0 : 0,
      current: isFinancial ? Number(current) || 0 : 0,
      deadline: null, status: "АКТИВНА", category: "",
    });
    showToast("Цель добавлена");
    onClose();
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="НОВАЯ ЦЕЛЬ">
      <TextField label="Название цели" placeholder="PS5 Pro" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <div className="flex gap-2 mb-4">
        <button onClick={() => setIsFinancial(true)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={isFinancial ? { background: ACCENT_SOFT, borderColor: ACCENT } : { borderColor: "#262626", color: "#a3a3a3" }}>Финансовая</button>
        <button onClick={() => setIsFinancial(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border" style={!isFinancial ? { background: ACCENT_SOFT, borderColor: ACCENT } : { borderColor: "#262626", color: "#a3a3a3" }}>Другая</button>
      </div>
      {isFinancial && (
        <>
          <TextField label={`Цель, ${CURRENCIES[currency]}`} type="number" placeholder="65000" value={target} onChange={(e) => setTarget(e.target.value)} />
          <TextField label={`Уже накоплено, ${CURRENCIES[currency]}`} type="number" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </>
      )}
      <PrimaryButton onClick={submit} disabled={!title}>Создать цель</PrimaryButton>
    </BottomSheet>
  );
}

function AddNoteSheet({ open, onClose, addItem, showToast }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  useEffect(() => { if (open) { setTitle(""); setBody(""); } }, [open]);
  const submit = () => {
    if (!title && !body) return;
    addItem("notes", { title: title || "Без названия", body, pinned: false, date: todayISO() });
    showToast("Заметка сохранена");
    onClose();
  };
  return (
    <BottomSheet open={open} onClose={onClose} title="НОВАЯ ЗАМЕТКА">
      <TextField label="Заголовок" placeholder="Идея" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      <label className="block mb-4">
        <div className="text-xs font-medium text-neutral-500 mb-1.5">Текст</div>
        <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-white text-[15px] outline-none focus:border-neutral-600 placeholder:text-neutral-600 resize-none"
          placeholder="Текст заметки" />
      </label>
      <PrimaryButton onClick={submit}>Сохранить</PrimaryButton>
    </BottomSheet>
  );
}

/* ============================== HOME PAGE ============================== */

function HomePage({ data, fin, insights, currency, setTab, setMorePage, setSheet }) {
  const activeGoals = (data.goals || []).filter((g) => g.status === "АКТИВНА").slice(0, 1);
  const playing = (data.games || []).find((g) => g.status === "ИГРАЮ");
  const todayTasks = (data.tasks || []).filter((t) => !t.done).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.2em] text-neutral-500 mb-1">{formatDateHeader()}</div>
        <h1 className="text-[26px] font-bold tracking-tight">{greeting()}, {data.settings.name || "друг"}</h1>
      </div>

      <Card onClick={() => setTab("money")} className="relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: `radial-gradient(circle, ${ACCENT}33, transparent 70%)` }} />
        <div className="relative">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500 mb-1">ДОСТУПНО</div>
          <div className="text-4xl font-bold tracking-tight mb-4">{fmtMoney(fin.balance, currency)}</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-neutral-500 mb-0.5">До следующего дохода</div>
              <div className="text-sm font-semibold text-neutral-200">{fin.nextIncome ? `${fin.nextIncome.daysUntil} дней` : "не задан"}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-neutral-500 mb-0.5">МОЖНО ПОТРАТИТЬ</div>
              <div className="text-sm font-semibold" style={{ color: ACCENT }}>{fmtMoney(fin.safeToSpend, currency)}/день</div>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <SectionLabel>БЫСТРЫЕ ДЕЙСТВИЯ</SectionLabel>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { id: "expense", label: "Расход", icon: "arrowDownRight" },
            { id: "income", label: "Доход", icon: "arrowUpRight" },
            { id: "task", label: "Задача", icon: "checkSquare" },
            { id: "purchase", label: "Покупка", icon: "bag" },
          ].map((a) => (
            <button key={a.id} onClick={() => setSheet(a.id)} className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 active:scale-95 transition-transform">
              <Icon name={a.icon} size={16} className="text-neutral-300" />
              <span className="text-[10px] font-medium text-neutral-400">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>ЧТО ДАЛЬШЕ?</SectionLabel>
        <Card className="!p-0 overflow-hidden">
          {insights.map((ins, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-4 ${i !== insights.length - 1 ? "border-b border-neutral-800/70" : ""}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
                background: ins.tone === "danger" ? "rgba(251,113,133,0.15)" : ins.tone === "warn" ? "rgba(251,191,36,0.15)" : ACCENT_SOFT,
              }}>
                <Icon name={ins.icon} size={15} style={{ color: ins.tone === "danger" ? "#FB7185" : ins.tone === "warn" ? "#FBBF24" : ACCENT }} />
              </div>
              <div className="text-[14px] text-neutral-200 font-medium">{ins.text}</div>
            </div>
          ))}
        </Card>
      </div>

      <div>
        <SectionLabel right={<button onClick={() => setTab("life")} className="text-[11px] font-semibold text-neutral-500 flex items-center gap-0.5">ВСЕ <Icon name="chevronRight" size={12} /></button>}>СЕГОДНЯ</SectionLabel>
        {todayTasks.length ? (
          <Card className="!p-0 overflow-hidden">
            {todayTasks.map((t, i) => (
              <TaskRow key={t.id} task={t} border={i !== todayTasks.length - 1} readonly />
            ))}
          </Card>
        ) : (
          <Card><div className="text-sm text-neutral-500 text-center py-2">Нет задач на сегодня</div></Card>
        )}
      </div>

      {activeGoals.length > 0 && (
        <div>
          <SectionLabel right={<button onClick={() => setTab("life")} className="text-[11px] font-semibold text-neutral-500 flex items-center gap-0.5">ВСЕ <Icon name="chevronRight" size={12} /></button>}>ЦЕЛИ</SectionLabel>
          {activeGoals.map((g) => <GoalMiniCard key={g.id} goal={g} currency={currency} onClick={() => setTab("life")} />)}
        </div>
      )}

      {playing && (
        <div>
          <SectionLabel right={<button onClick={() => setTab("games")} className="text-[11px] font-semibold text-neutral-500 flex items-center gap-0.5">ВСЕ <Icon name="chevronRight" size={12} /></button>}>СЕЙЧАС ИГРАЮ</SectionLabel>
          <Card onClick={() => setTab("games")}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-[15px]">{playing.title}</div>
              <div className="text-sm font-bold" style={{ color: ACCENT }}>{playing.progress}%</div>
            </div>
            <ProgressBar pct={playing.progress} />
          </Card>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}

function GoalMiniCard({ goal, currency, onClick }) {
  const pct = goal.target ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
  return (
    <Card onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-[15px]">{goal.title}</div>
        {goal.type === "financial" && <div className="text-sm font-bold" style={{ color: GOLD }}>{pct}%</div>}
      </div>
      {goal.type === "financial" ? (
        <>
          <ProgressBar pct={pct} color={GOLD} />
          <div className="flex justify-between mt-2 text-xs text-neutral-500">
            <span>{fmtMoney(goal.current, currency)}</span>
            <span>{fmtMoney(goal.target, currency)}</span>
          </div>
        </>
      ) : (
        <div className="text-xs text-neutral-500">В процессе</div>
      )}
    </Card>
  );
}

function TaskRow({ task, onToggle, onDelete, border, readonly }) {
  const overdue = !task.done && task.dueDate && task.dueDate < todayISO();
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 ${border ? "border-b border-neutral-800/70" : ""}`}>
      <button
        onClick={() => !readonly && onToggle && onToggle()}
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
        style={{ borderColor: task.done ? ACCENT : "#525252", background: task.done ? ACCENT : "transparent" }}
      >
        {task.done && <Icon name="check" size={13} className="text-white" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-[14px] font-medium truncate ${task.done ? "line-through text-neutral-600" : "text-neutral-100"}`}>{task.title}</div>
        {task.dueDate && (
          <div className={`text-[11px] ${overdue ? "text-rose-400" : "text-neutral-500"}`}>
            {overdue ? "Просрочено · " : ""}{task.dueDate}
          </div>
        )}
      </div>
      {!readonly && onDelete && (
        <button onClick={onDelete} className="text-neutral-600 p-1"><Icon name="trash" size={14} /></button>
      )}
    </div>
  );
}

/* ============================== MONEY PAGE ============================== */

function MoneyPage({ data, fin, currency, removeItem, updateData, showToast }) {
  const [view, setView] = useState("overview");
  const currencyList = data.transactions.slice(0, 30);

  const deleteTx = (id) => { removeItem("transactions", id); showToast("Удалено"); };

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-bold tracking-tight">Финансы</h1>

      <div className="flex gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
        {[["overview", "Обзор"], ["transactions", "Операции"], ["payments", "Платежи"], ["analytics", "Аналитика"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-colors"
            style={view === id ? { background: ACCENT, color: "#fff" } : { color: "#8a8a8a" }}>
            {label}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <>
          <Card>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500 mb-1">БАЛАНС</div>
            <div className="text-4xl font-bold tracking-tight">{fmtMoney(fin.balance, currency)}</div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Icon name="trendUp" size={16} className="text-emerald-400 mb-2" />
              <div className="text-[11px] text-neutral-500 mb-0.5">ДОХОД</div>
              <div className="text-lg font-bold">{fmtMoney(fin.monthTotals.income, currency)}</div>
            </Card>
            <Card>
              <Icon name="trendDown" size={16} className="text-rose-400 mb-2" />
              <div className="text-[11px] text-neutral-500 mb-0.5">РАСХОД</div>
              <div className="text-lg font-bold">{fmtMoney(fin.monthTotals.expenses, currency)}</div>
            </Card>
          </div>

          <Card>
            <div className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500 mb-3">ПРОГНОЗ</div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-center flex-1">
                <div className="font-bold">{fmtMoney(fin.balance, currency)}</div>
                <div className="text-[10px] text-neutral-500">Сегодня</div>
              </div>
              <div className="text-neutral-600 px-1">+</div>
              <div className="text-center flex-1">
                <div className="font-bold text-emerald-400">{fmtMoney(fin.nextIncome ? fin.nextIncome.amount : 0, currency)}</div>
                <div className="text-[10px] text-neutral-500">Доход</div>
              </div>
              <div className="text-neutral-600 px-1">−</div>
              <div className="text-center flex-1">
                <div className="font-bold text-rose-400">{fmtMoney(fin.mandatorySum, currency)}</div>
                <div className="text-[10px] text-neutral-500">Платежи</div>
              </div>
              <div className="text-neutral-600 px-1">=</div>
              <div className="text-center flex-1">
                <div className="font-bold" style={{ color: ACCENT }}>{fmtMoney(fin.forecast, currency)}</div>
                <div className="text-[10px] text-neutral-500">Итог</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-1">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500">МОЖНО ПОТРАТИТЬ</div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: ACCENT }}>{fmtMoney(fin.safeToSpend, currency)} <span className="text-sm text-neutral-500 font-medium">/ день</span></div>
            <div className="text-xs text-neutral-500">С учётом баланса, ближайших платежей и {fin.nextIncome ? `${fin.nextIncome.daysUntil} дней до дохода` : "горизонта в 30 дней"}</div>
          </Card>

          <div>
            <SectionLabel>ПОСЛЕДНИЕ ОПЕРАЦИИ</SectionLabel>
            {currencyList.length ? (
              <Card className="!p-0 overflow-hidden">
                {currencyList.slice(0, 6).map((t, i) => (
                  <TxRow key={t.id} tx={t} currency={currency} border={i !== Math.min(5, currencyList.length - 1)} onDelete={() => deleteTx(t.id)} />
                ))}
              </Card>
            ) : (
              <EmptyState icon="wallet" title="ПОКА ПУСТО" subtitle="Добавь первую операцию, чтобы начать отслеживать финансы." />
            )}
          </div>
        </>
      )}

      {view === "transactions" && (
        <div>
          {data.transactions.length ? (
            <Card className="!p-0 overflow-hidden">
              {data.transactions.map((t, i) => (
                <TxRow key={t.id} tx={t} currency={currency} border={i !== data.transactions.length - 1} onDelete={() => deleteTx(t.id)} />
              ))}
            </Card>
          ) : (
            <EmptyState icon="wallet" title="ПОКА ПУСТО" subtitle="Операций пока нет." />
          )}
        </div>
      )}

      {view === "payments" && <PaymentsView data={data} fin={fin} currency={currency} updateData={updateData} showToast={showToast} />}
      {view === "analytics" && <AnalyticsView data={data} fin={fin} currency={currency} />}
    </div>
  );
}

function TxRow({ tx, currency, border, onDelete }) {
  const cat = catMeta(tx.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES, tx.category);
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 ${border ? "border-b border-neutral-800/70" : ""}`}>
      <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-base shrink-0">{cat.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium truncate">{tx.note || cat.label}</div>
        <div className="text-[11px] text-neutral-500">{tx.date}</div>
      </div>
      <div className={`text-[14px] font-semibold ${tx.type === "income" ? "text-emerald-400" : "text-neutral-200"}`}>
        {tx.type === "income" ? "+" : "−"}{fmtMoney(tx.amount, currency)}
      </div>
      <button onClick={onDelete} className="text-neutral-600 p-1"><Icon name="trash" size={13} /></button>
    </div>
  );
}

function PaymentsView({ data, fin, currency, updateData, showToast }) {
  const [form, setForm] = useState(false);
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [day, setDay] = useState("");

  const addPayment = () => {
    if (!name || !amount || !day) return;
    updateData((d) => ({ ...d, payments: [{ id: uid(), name, amount: Number(amount), dueDay: Number(day), category: "other", active: true }, ...d.payments] }));
    setName(""); setAmount(""); setDay(""); setForm(false);
    showToast("Платёж добавлен");
  };
  const removePayment = (id) => updateData((d) => ({ ...d, payments: d.payments.filter((p) => p.id !== id) }));
  const removeRecurring = (id) => updateData((d) => ({ ...d, recurring: d.recurring.filter((r) => r.id !== id) }));

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>ПЕРИОДИЧЕСКИЕ ДОХОДЫ</SectionLabel>
        {data.recurring.length ? (
          <Card className="!p-0 overflow-hidden">
            {data.recurring.map((r, i) => (
              <div key={r.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== data.recurring.length - 1 ? "border-b border-neutral-800/70" : ""}`}>
                <div>
                  <div className="text-[14px] font-medium">{r.name}</div>
                  <div className="text-[11px] text-neutral-500">Каждое {r.day}-е число</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[14px] font-semibold text-emerald-400">+{fmtMoney(r.amount, currency)}</div>
                  <button onClick={() => removeRecurring(r.id)} className="text-neutral-600"><Icon name="trash" size={13} /></button>
                </div>
              </div>
            ))}
          </Card>
        ) : <Card><div className="text-sm text-neutral-500 text-center py-2">Нет регулярных доходов</div></Card>}
      </div>

      <div>
        <SectionLabel right={<button onClick={() => setForm((s) => !s)} className="text-[11px] font-semibold" style={{ color: ACCENT }}>{form ? "ОТМЕНА" : "+ ДОБАВИТЬ"}</button>}>ОБЯЗАТЕЛЬНЫЕ ПЛАТЕЖИ</SectionLabel>

        {form && (
          <Card className="mb-3">
            <TextField label="Название" placeholder="Кредит" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label={`Сумма, ${CURRENCIES[currency]}`} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <TextField label="День платежа" type="number" placeholder="12" value={day} onChange={(e) => setDay(e.target.value)} />
            <PrimaryButton onClick={addPayment}>Добавить платёж</PrimaryButton>
          </Card>
        )}

        {data.payments.length ? (
          <Card className="!p-0 overflow-hidden">
            {data.payments.map((p, i) => {
              const occ = nextOccurrence(p.dueDay);
              const soon = occ.daysUntil <= 3;
              return (
                <div key={p.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== data.payments.length - 1 ? "border-b border-neutral-800/70" : ""}`}>
                  <div>
                    <div className="text-[14px] font-medium">{p.name}</div>
                    <div className={`text-[11px] ${soon ? "text-amber-400" : "text-neutral-500"}`}>Через {occ.daysUntil} дн. · {p.dueDay}-е число</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[14px] font-semibold">{fmtMoney(p.amount, currency)}</div>
                    <button onClick={() => removePayment(p.id)} className="text-neutral-600"><Icon name="trash" size={13} /></button>
                  </div>
                </div>
              );
            })}
          </Card>
        ) : <Card><div className="text-sm text-neutral-500 text-center py-2">Нет обязательных платежей</div></Card>}
      </div>
    </div>
  );
}

function AnalyticsView({ data, fin, currency }) {
  const byCat = {};
  data.transactions.filter((t) => t.type === "expense").forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
  const totalExp = Object.values(byCat).reduce((a, b) => a + b, 0) || 1;
  const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const monthName = new Date().toLocaleDateString("ru-RU", { month: "long" }).toUpperCase();

  return (
    <div className="space-y-5">
      <Card>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-neutral-500 mb-3">{monthName}</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Доход</span><span className="font-semibold text-emerald-400">{fmtMoney(fin.monthTotals.income, currency)}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Расход</span><span className="font-semibold text-rose-400">{fmtMoney(fin.monthTotals.expenses, currency)}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Накоплено</span><span className="font-semibold" style={{ color: ACCENT }}>{fmtMoney(fin.monthTotals.saved, currency)}</span></div>
        </div>
      </Card>

      <div>
        <SectionLabel>РАСХОДЫ ПО КАТЕГОРИЯМ</SectionLabel>
        {rows.length ? (
          <Card className="space-y-3.5">
            {rows.map(([catId, amount]) => {
              const cat = catMeta(EXPENSE_CATEGORIES, catId);
              const pct = Math.round((amount / totalExp) * 100);
              return (
                <div key={catId}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-neutral-200">{cat.emoji} {cat.label}</span>
                    <span className="text-neutral-400">{fmtMoney(amount, currency)} · {pct}%</span>
                  </div>
                  <ProgressBar pct={pct} height={6} />
                </div>
              );
            })}
          </Card>
        ) : <Card><div className="text-sm text-neutral-500 text-center py-2">Пока нет расходов</div></Card>}
      </div>
    </div>
  );
}

/* ============================== LIFE PAGE ============================== */

function LifePage({ data, currency, addItem, removeItem, updateItem, showToast }) {
  const [view, setView] = useState("tasks");
  const pending = data.tasks.filter((t) => !t.done);
  const done = data.tasks.filter((t) => t.done);

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-bold tracking-tight">Жизнь</h1>

      <div className="flex gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
        {[["tasks", "Задачи"], ["goals", "Цели"], ["calendar", "Календарь"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-colors"
            style={view === id ? { background: ACCENT, color: "#fff" } : { color: "#8a8a8a" }}>
            {label}
          </button>
        ))}
      </div>

      {view === "tasks" && (
        <>
          {pending.length ? (
            <Card className="!p-0 overflow-hidden">
              {pending.map((t, i) => (
                <TaskRow key={t.id} task={t} border={i !== pending.length - 1}
                  onToggle={() => updateItem("tasks", t.id, { done: true })}
                  onDelete={() => removeItem("tasks", t.id)} />
              ))}
            </Card>
          ) : (
            <EmptyState icon="checkSquare" title="ПОКА ПУСТО" subtitle="Добавь первую задачу через кнопку внизу экрана." />
          )}
          {done.length > 0 && (
            <div>
              <SectionLabel>ВЫПОЛНЕНО</SectionLabel>
              <Card className="!p-0 overflow-hidden opacity-60">
                {done.slice(0, 5).map((t, i) => (
                  <TaskRow key={t.id} task={t} border={i !== Math.min(4, done.length - 1)}
                    onToggle={() => updateItem("tasks", t.id, { done: false })}
                    onDelete={() => removeItem("tasks", t.id)} />
                ))}
              </Card>
            </div>
          )}
        </>
      )}

      {view === "goals" && (
        <div className="space-y-3">
          {data.goals.length ? data.goals.map((g) => (
            <GoalCard key={g.id} goal={g} currency={currency}
              onUpdate={(patch) => updateItem("goals", g.id, patch)}
              onDelete={() => removeItem("goals", g.id)} />
          )) : (
            <EmptyState icon="target" title="ПОКА ПУСТО" subtitle="Добавь первую цель и начни отслеживать прогресс." />
          )}
        </div>
      )}

      {view === "calendar" && <CalendarView data={data} currency={currency} />}
    </div>
  );
}

function GoalCard({ goal, currency, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(goal.current);
  const pct = goal.type === "financial" && goal.target ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : (goal.status === "ВЫПОЛНЕНА" ? 100 : 0);

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold text-[15px] mb-1">{goal.title}</div>
          <Pill tone={goal.status === "ВЫПОЛНЕНА" ? "success" : goal.status === "АКТИВНА" ? "info" : "default"} small>{goal.status}</Pill>
        </div>
        <button onClick={onDelete} className="text-neutral-600 p-1"><Icon name="trash" size={14} /></button>
      </div>

      {goal.type === "financial" ? (
        <>
          <ProgressBar pct={pct} color={GOLD} />
          <div className="flex justify-between mt-2 text-xs text-neutral-500 mb-3">
            <span>{fmtMoney(goal.current, currency)}</span>
            <span>{pct}% · {fmtMoney(goal.target, currency)}</span>
          </div>
          {editing ? (
            <div className="flex gap-2">
              <input type="number" value={val} onChange={(e) => setVal(e.target.value)} className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none" />
              <button onClick={() => { onUpdate({ current: Number(val) }); setEditing(false); }} className="px-4 rounded-xl text-sm font-semibold text-white" style={{ background: ACCENT }}>OK</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="text-xs font-semibold" style={{ color: ACCENT }}>Обновить прогресс</button>
          )}
        </>
      ) : (
        <button onClick={() => onUpdate({ status: goal.status === "ВЫПОЛНЕНА" ? "АКТИВНА" : "ВЫПОЛНЕНА" })}
          className="text-xs font-semibold flex items-center gap-1.5" style={{ color: goal.status === "ВЫПОЛНЕНА" ? "#34D399" : ACCENT }}>
          <Icon name="check" size={13} /> {goal.status === "ВЫПОЛНЕНА" ? "Выполнено" : "Отметить выполненной"}
        </button>
      )}
    </Card>
  );
}

function CalendarView({ data, currency }) {
  const events = [];
  data.tasks.filter((t) => !t.done && t.dueDate).forEach((t) => events.push({ date: t.dueDate, label: t.title, icon: "checkSquare", tone: "info" }));
  data.payments.filter((p) => p.active !== false).forEach((p) => { const o = nextOccurrence(p.dueDay); events.push({ date: o.date.toISOString().slice(0, 10), label: `${p.name} · ${fmtMoney(p.amount, currency)}`, icon: "card", tone: "danger" }); });
  data.recurring.filter((r) => r.type === "income" && r.active !== false).forEach((r) => { const o = nextOccurrence(r.day); events.push({ date: o.date.toISOString().slice(0, 10), label: `${r.name} · +${fmtMoney(r.amount, currency)}`, icon: "trendUp", tone: "success" }); });
  events.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <SectionLabel>БЛИЖАЙШИЕ 30 ДНЕЙ</SectionLabel>
      {events.length ? (
        <Card className="!p-0 overflow-hidden">
          {events.map((e, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3.5 ${i !== events.length - 1 ? "border-b border-neutral-800/70" : ""}`}>
              <div className="w-9 h-9 rounded-xl bg-neutral-800 flex flex-col items-center justify-center shrink-0 text-[10px] font-bold leading-tight">
                {new Date(e.date).getDate()}<span className="text-[8px] text-neutral-500 font-medium">{new Date(e.date).toLocaleDateString("ru-RU", { month: "short" }).toUpperCase()}</span>
              </div>
              <div className="flex-1 text-[14px] font-medium">{e.label}</div>
              <Icon name={e.icon} size={14} style={{ color: e.tone === "danger" ? "#FB7185" : e.tone === "success" ? "#34D399" : ACCENT }} />
            </div>
          ))}
        </Card>
      ) : <EmptyState icon="package" title="ПОКА ПУСТО" subtitle="Ближайших событий пока нет." />}
    </div>
  );
}

/* ============================== GAMES PAGE ============================== */

function GamesPage({ data, updateItem, removeItem, addItem, showToast }) {
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState("");
  const playing = data.games.filter((g) => g.status === "ИГРАЮ");
  const rest = data.games.filter((g) => g.status !== "ИГРАЮ");

  const addGame = () => {
    if (!title) return;
    addItem("games", { title, status: "ОТЛОЖЕНО", progress: 0, trophies: { total: 0, earned: 0, platinum: false }, hours: 0, rating: 0 });
    setTitle(""); setForm(false);
    showToast("Игра добавлена");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold tracking-tight">Игры</h1>
        <IconBtn icon={form ? "x" : "plus"} onClick={() => setForm((s) => !s)} />
      </div>

      {form && (
        <Card>
          <TextField label="Название игры" placeholder="Ghost of Yōtei" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <PrimaryButton onClick={addGame}>Добавить в библиотеку</PrimaryButton>
        </Card>
      )}

      {playing.length > 0 && (
        <div>
          <SectionLabel>СЕЙЧАС ИГРАЮ</SectionLabel>
          <div className="space-y-3">
            {playing.map((g) => <GameCard key={g.id} game={g} onUpdate={(p) => updateItem("games", g.id, p)} onDelete={() => removeItem("games", g.id)} />)}
          </div>
        </div>
      )}

      <div>
        <SectionLabel>БИБЛИОТЕКА</SectionLabel>
        {rest.length ? (
          <div className="space-y-3">
            {rest.map((g) => <GameCard key={g.id} game={g} onUpdate={(p) => updateItem("games", g.id, p)} onDelete={() => removeItem("games", g.id)} />)}
          </div>
        ) : !playing.length && (
          <EmptyState icon="gamepad" title="ПОКА ПУСТО" subtitle="Добавь игру, чтобы начать отслеживать прогресс и трофеи." actionLabel="Добавить игру" onAction={() => setForm(true)} />
        )}
      </div>
    </div>
  );
}

function GameCard({ game, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const trophyPct = game.trophies.total ? Math.round((game.trophies.earned / game.trophies.total) * 100) : 0;

  return (
    <Card onClick={() => setExpanded((s) => !s)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-semibold text-[15px] mb-1.5">{game.title}</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Pill small tone={game.status === "ИГРАЮ" ? "info" : game.status === "ПЛАТИНА" || game.status === "ПРОЙДЕНО" ? "success" : "default"}>{game.status}</Pill>
            {game.trophies.platinum && <Icon name="trophy" size={12} style={{ color: GOLD }} />}
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-neutral-600 p-1"><Icon name="trash" size={14} /></button>
      </div>

      <ProgressBar pct={game.progress} />
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{game.progress}% пройдено</span>
        <span>{game.trophies.earned} / {game.trophies.total} 🏆</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="text-xs text-neutral-500 mb-1.5">Статус</div>
            <div className="flex flex-wrap gap-1.5">
              {GAME_STATUSES.map((s) => (
                <button key={s} onClick={() => onUpdate({ status: s })} className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
                  style={game.status === s ? { background: ACCENT, color: "#fff" } : { background: "#262626", color: "#a3a3a3" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-xs text-neutral-500 mb-1">Прогресс, %</div>
              <input type="number" min={0} max={100} value={game.progress} onChange={(e) => onUpdate({ progress: Math.min(100, Math.max(0, Number(e.target.value))) })} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none" />
            </label>
            <label className="block">
              <div className="text-xs text-neutral-500 mb-1">Трофеи получено</div>
              <input type="number" min={0} value={game.trophies.earned} onChange={(e) => onUpdate({ trophies: { ...game.trophies, earned: Number(e.target.value) } })} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm outline-none" />
            </label>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ============================== MORE PAGE ============================== */

function MorePage(props) {
  const { page, setPage } = props;
  if (page === "wishlist") return <WishlistPage {...props} onBack={() => setPage(null)} />;
  if (page === "notes") return <NotesPage {...props} onBack={() => setPage(null)} />;
  if (page === "garage") return <GaragePage {...props} onBack={() => setPage(null)} />;
  if (page === "inventory") return <InventoryPage {...props} onBack={() => setPage(null)} />;
  if (page === "settings") return <SettingsPage {...props} onBack={() => setPage(null)} />;
  return <MoreMenu {...props} />;
}

function MoreMenu({ setPage, data }) {
  const items = [
    { id: "wishlist", label: "Список покупок", icon: "bag", count: data.wishlist.length },
    { id: "garage", label: "Гараж", icon: "car", count: data.vehicleExpenses.length },
    { id: "inventory", label: "Мои вещи", icon: "package", count: data.inventory.length },
    { id: "notes", label: "Заметки", icon: "note", count: data.notes.length },
    { id: "settings", label: "Настройки", icon: "settings" },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-bold tracking-tight">Ещё</h1>
      <Card className="!p-0 overflow-hidden">
        {items.map((it, i) => (
          <button key={it.id} onClick={() => setPage(it.id)} className={`w-full flex items-center gap-3 px-5 py-4 ${i !== items.length - 1 ? "border-b border-neutral-800/70" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center"><Icon name={it.icon} size={16} className="text-neutral-300" /></div>
            <div className="flex-1 text-left text-[14px] font-medium">{it.label}</div>
            {typeof it.count === "number" && it.count > 0 && <Pill small>{it.count}</Pill>}
            <Icon name="chevronRight" size={16} className="text-neutral-600" />
          </button>
        ))}
      </Card>
    </div>
  );
}

function PageHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <IconBtn icon="chevronLeft" onClick={onBack} />
      <h1 className="text-[20px] font-bold tracking-tight">{title}</h1>
    </div>
  );
}

function WishlistPage({ data, currency, fin, removeItem, onBack }) {
  return (
    <div>
      <PageHeader title="Список покупок" onBack={onBack} />
      {data.wishlist.length ? (
        <div className="space-y-3">
          {[...data.wishlist].sort((a, b) => (a.priority === "high" ? -1 : 1)).map((w) => {
            const canBuy = fin.safeToSpend * 14 >= w.price || fin.balance - w.price - fin.mandatorySum > 0;
            const p = PRIORITIES.find((p) => p.id === w.priority);
            return (
              <Card key={w.id}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-[15px] mb-1">{w.title}</div>
                    <Pill small><span style={{ color: p.color }}>{p.emoji} {p.label}</span></Pill>
                  </div>
                  <button onClick={() => removeItem("wishlist", w.id)} className="text-neutral-600 p-1"><Icon name="trash" size={14} /></button>
                </div>
                <div className="text-xl font-bold mb-2">{fmtMoney(w.price, currency)}</div>
                <Pill tone={canBuy ? "success" : "warn"} small>{canBuy ? "МОЖНО КУПИТЬ" : "ПОДОЖДИ"}</Pill>
                <div className="text-[11px] text-neutral-500 mt-1.5">
                  {canBuy ? "Эта покупка не нарушает текущий финансовый план." : "После покупки остаток опустится ниже безопасного уровня."}
                </div>
              </Card>
            );
          })}
        </div>
      ) : <EmptyState icon="bag" title="ПОКА ПУСТО" subtitle="Добавь товар через кнопку «Покупка» на главном экране." />}
    </div>
  );
}

function NotesPage({ data, addItem, removeItem, updateItem, onBack }) {
  const [text, setText] = useState("");
  const sorted = [...data.notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const add = () => { if (!text.trim()) return; addItem("notes", { title: text.slice(0, 40), body: text, pinned: false, date: todayISO() }); setText(""); };
  return (
    <div>
      <PageHeader title="Заметки" onBack={onBack} />
      <Card className="mb-4">
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder="Быстрая заметка..."
          className="w-full bg-transparent text-[14px] outline-none resize-none placeholder:text-neutral-600 mb-2" />
        <button onClick={add} className="text-xs font-semibold" style={{ color: ACCENT }}>Сохранить</button>
      </Card>
      {sorted.length ? (
        <div className="space-y-3">
          {sorted.map((n) => (
            <Card key={n.id}>
              <div className="flex items-start justify-between mb-1">
                <div className="font-semibold text-[14px] flex items-center gap-1.5">{n.pinned && <Icon name="sparkles" size={12} style={{ color: GOLD }} />} {n.title}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateItem("notes", n.id, { pinned: !n.pinned })} className="text-neutral-600 text-[11px]">{n.pinned ? "Открепить" : "Закрепить"}</button>
                  <button onClick={() => removeItem("notes", n.id)} className="text-neutral-600"><Icon name="trash" size={13} /></button>
                </div>
              </div>
              <div className="text-[13px] text-neutral-400">{n.body}</div>
              <div className="text-[10px] text-neutral-600 mt-1.5">{n.date}</div>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon="note" title="ПОКА ПУСТО" subtitle="Запиши первую мысль." />}
    </div>
  );
}

function GaragePage({ data, currency, updateData, removeItem, showToast, onBack }) {
  const [editing, setEditing] = useState(!data.vehicle);
  const [name, setName] = useState(data.vehicle?.name || "");
  const [year, setYear] = useState(data.vehicle?.year || "");
  const [mileage, setMileage] = useState(data.vehicle?.mileage || "");
  const [expType, setExpType] = useState("Бензин");
  const [expAmount, setExpAmount] = useState("");
  const [expKm, setExpKm] = useState("");

  const saveVehicle = () => {
    updateData((d) => ({ ...d, vehicle: { name, year: Number(year), mileage: Number(mileage) } }));
    setEditing(false);
  };
  const addExpense = () => {
    if (!expAmount) return;
    updateData((d) => ({ ...d, vehicleExpenses: [{ id: uid(), type: expType, amount: Number(expAmount), km: Number(expKm) || 0, date: todayISO() }, ...d.vehicleExpenses] }));
    setExpAmount(""); setExpKm("");
    showToast("Расход добавлен");
  };

  const now = new Date();
  const monthExp = data.vehicleExpenses.filter((e) => new Date(e.date).getMonth() === now.getMonth());
  const fuelSum = monthExp.filter((e) => e.type === "Бензин").reduce((s, e) => s + e.amount, 0);
  const kmSum = monthExp.reduce((s, e) => s + (e.km || 0), 0);

  return (
    <div>
      <PageHeader title="Гараж" onBack={onBack} />
      {editing ? (
        <Card className="mb-4">
          <TextField label="Название" placeholder="Skoda Octavia" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Год" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          <TextField label="Пробег, км" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
          <PrimaryButton onClick={saveVehicle} disabled={!name}>Сохранить</PrimaryButton>
        </Card>
      ) : (
        <Card className="mb-4" onClick={() => setEditing(true)}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: ACCENT_SOFT }}><Icon name="car" size={18} style={{ color: ACCENT }} /></div>
            <div>
              <div className="font-semibold text-[15px]">{data.vehicle.name}</div>
              <div className="text-xs text-neutral-500">{data.vehicle.year} · {data.vehicle.mileage.toLocaleString("ru-RU")} км</div>
            </div>
          </div>
        </Card>
      )}

      {!editing && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Card><Icon name="fuel" size={15} className="text-amber-400 mb-2" /><div className="text-[11px] text-neutral-500">Топливо</div><div className="font-bold">{fmtMoney(fuelSum, currency)}</div></Card>
            <Card><Icon name="car" size={15} style={{ color: ACCENT }} className="mb-2" /><div className="text-[11px] text-neutral-500">Пробег</div><div className="font-bold">{kmSum} км</div></Card>
          </div>

          <Card className="mb-4">
            <div className="text-xs font-medium text-neutral-500 mb-2">Добавить расход</div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {["Бензин", "Масло", "Ремонт", "Мойка", "Страховка", "Шины", "Штраф"].map((t) => (
                <button key={t} onClick={() => setExpType(t)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium" style={expType === t ? { background: ACCENT_SOFT, color: "#fff", border: `1px solid ${ACCENT}` } : { background: "#262626", color: "#a3a3a3" }}>{t}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="Сумма" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm outline-none" />
              <button onClick={addExpense} className="px-4 rounded-xl text-sm font-semibold text-white" style={{ background: ACCENT }}><Icon name="plus" size={16} /></button>
            </div>
          </Card>

          {data.vehicleExpenses.length ? (
            <Card className="!p-0 overflow-hidden">
              {data.vehicleExpenses.slice(0, 10).map((e, i) => (
                <div key={e.id} className={`flex items-center justify-between px-5 py-3 ${i !== Math.min(9, data.vehicleExpenses.length - 1) ? "border-b border-neutral-800/70" : ""}`}>
                  <div>
                    <div className="text-[13px] font-medium">{e.type}</div>
                    <div className="text-[11px] text-neutral-500">{e.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[13px] font-semibold">{fmtMoney(e.amount, currency)}</div>
                    <button onClick={() => removeItem("vehicleExpenses", e.id)} className="text-neutral-600"><Icon name="trash" size={13} /></button>
                  </div>
                </div>
              ))}
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}

function InventoryPage({ data, currency, addItem, removeItem, showToast, onBack }) {
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("Электроника"); const [cost, setCost] = useState("");
  const cats = ["Электроника", "Одежда", "Документы", "Аксессуары", "Другое"];

  const add = () => {
    if (!title) return;
    addItem("inventory", { title, category, cost: Number(cost) || 0, date: todayISO(), warranty: "", note: "" });
    setTitle(""); setCost(""); setForm(false);
    showToast("Добавлено");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><IconBtn icon="chevronLeft" onClick={onBack} /><h1 className="text-[20px] font-bold">Мои вещи</h1></div>
        <IconBtn icon={form ? "x" : "plus"} onClick={() => setForm((s) => !s)} />
      </div>
      {form && (
        <Card className="mb-4">
          <TextField label="Название" placeholder="MacBook Air" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex flex-wrap gap-2 mb-4">
            {cats.map((c) => <button key={c} onClick={() => setCategory(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={category === c ? { background: ACCENT_SOFT, border: `1px solid ${ACCENT}`, color: "#fff" } : { background: "#262626", color: "#a3a3a3" }}>{c}</button>)}
          </div>
          <TextField label={`Стоимость, ${CURRENCIES[currency]}`} type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
          <PrimaryButton onClick={add} disabled={!title}>Добавить</PrimaryButton>
        </Card>
      )}
      {data.inventory.length ? (
        <Card className="!p-0 overflow-hidden">
          {data.inventory.map((it, i) => (
            <div key={it.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== data.inventory.length - 1 ? "border-b border-neutral-800/70" : ""}`}>
              <div>
                <div className="text-[14px] font-medium">{it.title}</div>
                <div className="text-[11px] text-neutral-500">{it.category} · {it.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[13px] font-semibold">{fmtMoney(it.cost, currency)}</div>
                <button onClick={() => removeItem("inventory", it.id)} className="text-neutral-600"><Icon name="trash" size={13} /></button>
              </div>
            </div>
          ))}
        </Card>
      ) : <EmptyState icon="package" title="ПОКА ПУСТО" subtitle="Добавь первую вещь в инвентарь." />}
    </div>
  );
}

function SettingsPage({ data, updateData, persist, showToast, onBack }) {
  const [name, setName] = useState(data.settings.name);
  const fileRef = useRef(null);

  const saveName = () => updateData((d) => ({ ...d, settings: { ...d.settings, name } }));
  const setCurrency = (c) => updateData((d) => ({ ...d, settings: { ...d.settings, currency: c } }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `vault-export-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast("Данные экспортированы");
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        persist(parsed);
        showToast("Данные импортированы");
      } catch (err) {
        showToast("Ошибка файла");
      }
    };
    reader.readAsText(file);
  };

  const loadDemo = () => { persist(demoData()); showToast("Демо-данные загружены"); };
  const clearAll = () => { if (confirm("Удалить все данные без возможности восстановления?")) { const base = emptyData(); base.settings.onboarded = true; base.settings.name = data.settings.name; base.settings.currency = data.settings.currency; persist(base); showToast("Данные очищены"); } };

  return (
    <div>
      <PageHeader title="Настройки" onBack={onBack} />

      <SectionLabel>ПРОФИЛЬ</SectionLabel>
      <Card className="mb-5">
        <TextField label="Имя" value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName} />
        <div className="text-xs font-medium text-neutral-500 mb-1.5">Валюта</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CURRENCIES).map(([k, sym]) => (
            <button key={k} onClick={() => setCurrency(k)} className="px-3 py-2 rounded-xl text-sm font-semibold border"
              style={data.settings.currency === k ? { background: ACCENT_SOFT, borderColor: ACCENT, color: "#fff" } : { borderColor: "#262626", color: "#a3a3a3" }}>
              {sym} {k}
            </button>
          ))}
        </div>
      </Card>

      <SectionLabel>ДАННЫЕ</SectionLabel>
      <Card className="!p-0 overflow-hidden mb-5">
        <button onClick={exportData} className="w-full flex items-center gap-3 px-5 py-4 border-b border-neutral-800/70">
          <Icon name="download" size={16} style={{ color: ACCENT }} /><span className="text-[14px] font-medium">Экспорт данных</span>
        </button>
        <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3 px-5 py-4 border-b border-neutral-800/70">
          <Icon name="upload" size={16} style={{ color: ACCENT }} /><span className="text-[14px] font-medium">Импорт данных</span>
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importData} />
        <button onClick={loadDemo} className="w-full flex items-center gap-3 px-5 py-4 border-b border-neutral-800/70">
          <Icon name="sparkles" size={16} className="text-amber-400" /><span className="text-[14px] font-medium">Загрузить демо-данные</span>
        </button>
        <button onClick={clearAll} className="w-full flex items-center gap-3 px-5 py-4">
          <Icon name="rotate" size={16} className="text-rose-400" /><span className="text-[14px] font-medium text-rose-400">Очистить все данные</span>
        </button>
      </Card>

      <div className="text-center text-[11px] text-neutral-600 pb-4">VAULT · Personal Operating System</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
