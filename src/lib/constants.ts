export const APP_NAME = "LamboBoost";
export const APP_DESCRIPTION =
  "Discover, purchase, and manage digital marketing services from one powerful platform.";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const CURRENCY = "NGN";
export const CURRENCY_SYMBOL = "₦";

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
  partial: "Partial",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  processing: "default",
  completed: "default",
  failed: "destructive",
  cancelled: "destructive",
  partial: "secondary",
  refunded: "outline",
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  order_payment: "Order Payment",
  refund: "Refund",
  bonus: "Bonus",
  adjustment: "Adjustment",
};

export const RATE_LIMITS = {
  AUTH: { requests: 5, window: 15 * 60 * 1000 },
  API: { requests: 100, window: 15 * 60 * 1000 },
  PAYMENT: { requests: 10, window: 60 * 1000 },
};

export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export const WALLET_MIN_DEPOSIT = 100;
export const WALLET_MAX_DEPOSIT = 10_000_000;

export const SUPPORTED_PAYMENT_GATEWAYS = ["paystack", "flutterwave"] as const;

// ─── Navigation ────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

// ─── Footer ────────────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  product: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "How It Works", href: "/#how-it-works" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/#faq" },
  ],
  resources: [
    { label: "Support", href: "/dashboard/support" },
    { label: "Documentation", href: "/docs" },
    { label: "API", href: "/docs/api" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

// ─── Platforms ─────────────────────────────────────────────────────────────

export const PLATFORMS = [
  { name: "Instagram", slug: "instagram" },
  { name: "TikTok", slug: "tiktok" },
  { name: "YouTube", slug: "youtube" },
  { name: "Facebook", slug: "facebook" },
  { name: "Telegram", slug: "telegram" },
  { name: "X", slug: "x" },
];

// ─── Features ──────────────────────────────────────────────────────────────

export const FEATURES = [
  {
    icon: "ShoppingCart",
    title: "Simple Ordering",
    description:
      "Browse the service catalog, enter your link and quantity, and confirm. Your order starts processing in minutes.",
  },
  {
    icon: "Wallet",
    title: "Secure Wallet",
    description:
      "Fund your wallet once using Paystack or Flutterwave. Spend across multiple orders without re-entering payment details.",
  },
  {
    icon: "BarChart3",
    title: "Order Tracking",
    description:
      "Track every order's progress in real time. See start count, current count, and remaining quantity live from your dashboard.",
  },
  {
    icon: "Layers",
    title: "Multiple Services",
    description:
      "A growing catalog of services across Instagram, TikTok, YouTube, Facebook, Telegram, and more.",
  },
  {
    icon: "ArrowLeftRight",
    title: "Transaction History",
    description:
      "Every deposit, payment, and refund is logged with a full audit trail. Review at any time from your account.",
  },
  {
    icon: "Headphones",
    title: "Customer Support",
    description:
      "Open a support ticket directly from your dashboard. Our team reviews and responds to every request.",
  },
];

// ─── How it works ──────────────────────────────────────────────────────────

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Create your account",
    description:
      "Sign up with your email or Google account. No credit card required to get started.",
  },
  {
    step: "02",
    title: "Fund your wallet",
    description:
      "Add funds using Paystack or Flutterwave. Your wallet balance is available immediately after payment.",
  },
  {
    step: "03",
    title: "Choose a service",
    description:
      "Browse the service catalog and select what you need. Set your link and quantity, then confirm.",
  },
  {
    step: "04",
    title: "Track your order",
    description:
      "Your order starts processing. Monitor real-time progress from the Orders section of your dashboard.",
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────

export const FAQS = [
  {
    question: "How does LamboBoost work?",
    answer:
      "LamboBoost is a platform where you can purchase digital marketing services for social media platforms. Fund your wallet, browse the catalog, choose a service, and place your order. We process your order and you track it live from your dashboard.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Create an account, fund your wallet, then navigate to Services. Choose the service you want, enter your profile or content link, set the quantity, and confirm. Your order begins processing shortly after placement.",
  },
  {
    question: "How do I fund my wallet?",
    answer:
      "Go to the Wallet section of your dashboard and click 'Add funds'. You can deposit using Paystack or Flutterwave. Your balance updates as soon as the payment is confirmed.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Every order appears in your Orders dashboard with a real-time status. You can see the current progress, start count, and remaining quantity for any active order.",
  },
  {
    question: "Can I cancel an order?",
    answer:
      "Orders can be cancelled before they start processing. Once an order is in progress, cancellation may not be possible depending on the service type. You can contact support for assistance with any order issue.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Open a support ticket from the Support section in your dashboard. Describe your issue and our team will respond. For order-related issues, including your order ID speeds up the process.",
  },
];

// ─── Service categories (marketplace preview) ──────────────────────────────

export const SERVICE_CATEGORIES = [
  {
    platform: "Instagram",
    slug: "instagram",
    description: "Followers, likes, views, story views, and reel engagement.",
    services: [
      { name: "Instagram Followers", startsAt: "₦0.25 / unit" },
      { name: "Reel Likes", startsAt: "₦0.08 / unit" },
      { name: "Story Views", startsAt: "₦0.05 / unit" },
    ],
  },
  {
    platform: "TikTok",
    slug: "tiktok",
    description: "Followers, video views, likes, and profile engagement.",
    services: [
      { name: "TikTok Followers", startsAt: "₦0.30 / unit" },
      { name: "Video Views", startsAt: "₦0.02 / unit" },
      { name: "Video Likes", startsAt: "₦0.04 / unit" },
    ],
  },
  {
    platform: "YouTube",
    slug: "youtube",
    description: "Subscribers, views, watch hours, and video engagement.",
    services: [
      { name: "YouTube Subscribers", startsAt: "₦0.80 / unit" },
      { name: "Video Views", startsAt: "₦0.05 / unit" },
      { name: "Watch Hours", startsAt: "₦0.12 / unit" },
    ],
  },
  {
    platform: "Facebook",
    slug: "facebook",
    description: "Page likes, post engagement, followers, and video views.",
    services: [
      { name: "Page Likes", startsAt: "₦0.35 / unit" },
      { name: "Post Likes", startsAt: "₦0.06 / unit" },
      { name: "Video Views", startsAt: "₦0.03 / unit" },
    ],
  },
  {
    platform: "Telegram",
    slug: "telegram",
    description: "Channel members, post views, and group engagement.",
    services: [
      { name: "Channel Members", startsAt: "₦0.50 / unit" },
      { name: "Post Views", startsAt: "₦0.01 / unit" },
    ],
  },
  {
    platform: "Other Digital Services",
    slug: "other",
    description: "Spotify streams, LinkedIn connections, X followers, and more.",
    services: [
      { name: "X Followers", startsAt: "₦0.40 / unit" },
      { name: "Spotify Streams", startsAt: "₦0.10 / unit" },
      { name: "LinkedIn Connections", startsAt: "₦0.60 / unit" },
    ],
  },
];
