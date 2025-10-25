# PULSE.FUN 🌊

**Your wallet tells your story. The social network for crypto traders.**

PULSE.FUN is a revolutionary crypto social network where wallet activity automatically generates profiles and feeds. No manual posting required - your transactions become your social content.

## 🚀 Features

- **Auto-Generated Profiles**: Connect your wallet and watch as your trading history creates a unique social profile
- **Real-Time Performance Tracking**: Live portfolio values, PnL, and performance metrics
- **Trading Style Analysis**: AI-powered classification of your trading patterns (Degen, Diamond Hands, Yield Farmer, etc.)
- **Social Discovery**: Find and follow successful traders based on their performance and style
- **Beautiful Interface**: Minimal, dark-mode design inspired by Linear, Arc, and Raycast
- **Mobile-First**: Responsive design that works perfectly on all devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Wallet Connection**: Wagmi, RainbowKit
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **API**: Zerion API for onchain data
- **Database**: PostgreSQL with Prisma (planned)

## 🎯 Trading Styles

Our AI analyzes your trading patterns to identify your unique style:

- 🚀 **Degen**: High frequency, high risk trading
- 💎 **Diamond Hands**: Long-term holding strategy  
- 🌾 **Yield Farmer**: Optimizing for passive income
- 🎨 **NFT Collector**: Curating digital art and assets
- 📈 **Day Trader**: Active daily trading strategies
- ⚡ **Arbitrageur**: Capitalizing on price differences

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Zerion API key

### Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd pulse.fun
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_ZERION_API_KEY=your_zerion_api_key
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Start the development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Users

1. **Connect Your Wallet**: Click "Connect Wallet" and approve the connection
2. **View Your Profile**: Your trading history automatically generates your social profile
3. **Discover Traders**: Browse the Discover page to find interesting wallets
4. **Follow & Learn**: Follow successful traders to see their activity in your feed

### For Developers

The app is built with a modular architecture:

- **Components**: Reusable UI components in `/src/components`
- **Hooks**: Custom React hooks for data fetching in `/src/hooks`
- **API Routes**: Server-side API endpoints in `/app/api`
- **Types**: TypeScript definitions in `/src/types`
- **Store**: Zustand state management in `/src/store`

## 🔧 API Integration

PULSE.FUN leverages the Zerion API for comprehensive onchain data:

- **Portfolio Data**: Real-time balances and positions
- **Transaction History**: Decoded swaps, transfers, and approvals
- **Performance Charts**: Portfolio value over time
- **Asset Metadata**: Token information and market data

### Key Endpoints

- `GET /api/portfolio/[address]` - Get portfolio data
- `GET /api/transactions/[address]` - Get transaction history
- `GET /api/trending` - Get trending wallets

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (Deep black)
- **Surface**: `#151515` (Dark gray)
- **Border**: `#2a2a2a` (Subtle gray)
- **Accent**: `#8B5CF6` (Purple)
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#a0a0a0`

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components
- **Cards**: Rounded corners, subtle borders, hover effects
- **Buttons**: Smooth transitions, focus states
- **Animations**: 200-300ms duration, subtle and fast

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

1. **Build the application**
   ```bash
   pnpm run build
   ```

2. **Start the production server**
   ```bash
   pnpm run start
   ```

## 🏆 Hackathon Submission

Built for the **Cypherpunk Hackathon** with Zerion API integration.

### Submission Requirements ✅

- ✅ **Deployed and functional application**
- ✅ **Clear explanation of concept and target users**
- ✅ **Demo video (5 minutes max)**
- ✅ **GitHub repository with all code**
- ✅ **English language**

### Judging Criteria

- **Innovation**: Novel crypto social networking concept
- **User Experience**: Intuitive, beautiful, mobile-first design
- **Impact**: Addresses real need for crypto social features
- **Zerion API Usage**: Comprehensive integration of portfolio, transaction, and chart data
- **Technical Implementation**: Clean code, TypeScript, modern React patterns
- **User Adoption Potential**: Clear value proposition for crypto traders

## 🔮 Future Roadmap

- **Database Integration**: PostgreSQL with Prisma for persistent social features
- **Real-time Updates**: WebSocket integration for live activity feeds
- **Advanced Analytics**: More sophisticated trading pattern analysis
- **Social Features**: Comments, reactions, and community features
- **Mobile App**: React Native version for iOS/Android
- **Multi-chain Support**: Beyond Ethereum to Solana, Base, etc.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Zerion API** for comprehensive onchain data
- **RainbowKit** for wallet connection
- **Next.js** for the amazing React framework
- **TailwindCSS** for beautiful styling
- **Cypherpunk Hackathon** for the opportunity

---

**Built with ❤️ for the crypto community**

*PULSE.FUN - Where your wallet tells your story*