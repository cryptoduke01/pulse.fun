# PULSE.FUN

Your wallet tells your story. The social network for crypto traders.

PULSE.FUN turns onchain activity into a living profile and feed. Connect a wallet, view a portfolio and transactions, and discover interesting traders.

## Features

- Auto-generated profiles from onchain activity
- Live portfolio value and charts
- Transaction feed with pagination
- Trading style analysis and stats
- Discover trending wallets and follow
- Shareable profile card
- Responsive, fast UI with animations

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript, TailwindCSS
- Framer Motion, Recharts
- Zustand for state
- TanStack Query for data fetching
- Zerion API (via Next.js API routes)

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
4) Build command: `pnpm build`
5) Install command: `pnpm install --frozen-lockfile`
6) Output: default (Next.js)

## Links

- GitHub: https://github.com/cryptoduke01/pulse.fun
- X: https://x.com/pulsedotfun
- X (author): https://x.com/cryptoduke01
- Zerion: https://x.com/zerion

## License

MIT