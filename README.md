# PULSE.FUN

Your wallet tells your story. The social network for crypto traders.

PULSE.FUN turns onchain activity into a living profile and feed. Connect a wallet, view a portfolio and transactions, and discover interesting traders.

Status: This application is in active development. Some features are experimental and subject to change.

## Features

- Auto-generated profiles from onchain activity
- Live portfolio value and charts
- Transaction feed with pagination
- Trading style analysis and stats
- Discover trending wallets and follow
- Shareable profile card
- Responsive, fast UI with animations
 - Global toasts for insights and actions
 - Recommendations modal and onboarding guide
 - Emoji-free UI using Lucide icons

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript, TailwindCSS
- Framer Motion, Recharts
- Zustand for state
- TanStack Query for data fetching
- Zerion API (via Next.js API routes)
 - Lucide React (icons)
 - RainbowKit + Wagmi (wallet connect)

## Prerequisites

- Node.js 18+
- pnpm (recommended)
- Zerion API key
- WalletConnect project id (optional, for RainbowKit)

## Setup

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_ZERION_API_KEY=your_zerion_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

Run dev server:

```bash
pnpm dev
```

Open http://localhost:3000

## API Routes (server-side proxy)

- GET `/api/portfolio/[address]`
- GET `/api/transactions/[address]`
- GET `/api/chart/[address]?period=30d`
- GET `/api/trending`
- GET `/api/nfts/[address]`
 - POST `/api/trading-signals`

All client requests go through these routes; no direct Zerion calls from the browser.

## Build

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1) Push this repo to GitHub
2) Import in Vercel and choose the Next.js preset
3) Set Environment Variables in Vercel:
   - `NEXT_PUBLIC_ZERION_API_KEY`
   - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` (optional)
   - Any other secrets required by integrations
4) Build command: `pnpm build`
5) Install command: `pnpm install --frozen-lockfile`
6) Output: default (Next.js)

## Links

- GitHub: https://github.com/cryptoduke01/pulse.fun
- X: https://x.com/pulsedotfun
- X (author): https://x.com/cryptoduke01
- Zerion: https://x.com/zerion

## Zerion Cypherpunk Hackathon Submission

Overview: Pulse.fun is a social wallet and discovery app that surfaces onchain activity, portfolio performance, and insights from trending wallets using the Zerion API.

Target users:
- Crypto-native users who want a social lens on onchain activity
- Traders seeking discovery, copy-trading signals, and portfolio insights
- Curators and researchers tracking notable wallets

Zerion API usage:
- Portfolio: `/wallets/{address}/portfolio` via server-side proxy `/api/portfolio/[address]`
- Transactions: `/wallets/{address}/transactions` via `/api/transactions/[address]`
- Charts: `/wallets/{address}/charts/{period}` via `/api/chart/[address]`
- NFTs: `/nfts` with owner filters via `/api/nfts/[address]`
- Signals: derived from recent transactions via `/api/trading-signals`

Key features leveraging Zerion:
- Real-time portfolio, PnL and charts
- Decoded transactions with pagination
- NFT collection preview
- Trending wallets (curated + live portfolio data)
- Insights and recommendations (guide + toasts)

Demo video: Add a 3–5 minute walkthrough showing connect, profile, feed, discover, and signals.

Deployed app: Add your Vercel deployment URL.

Repository: This GitHub repository.

Notes:
- All third-party API calls are proxied through Next.js API routes.
- The app uses conservative retries and error handling for rate limits.
- Some analytics and advanced insights are in progress.

## Submission Checklist

- Deployed and functional app (Vercel URL)
- Demo video (≤ 5 minutes) covering main user flows
- README explaining concept, target users, and Zerion API usage
- Public GitHub repository link
- English-language submission


## License

MIT