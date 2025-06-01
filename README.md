# 🎮 SwapQuest - Gaming DApp on Avalanche

> **A gamified DeFi experience that rewards users with ARENA tokens for completing swap missions on Avalanche Fuji testnet.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![Avalanche](https://img.shields.io/badge/Avalanche-Fuji-red?style=for-the-badge&logo=avalanche)](https://www.avax.network/)

## 🌟 Overview

SwapQuest transforms traditional DeFi swapping into an engaging gaming experience. Users complete daily missions by performing token swaps on Avalanche, earning ARENA tokens as rewards. Built for the **London Avalanche Hackathon**.

### ✨ Key Features

- 🎯 **8 Daily Missions** with Avalanche-compatible tokens
- 🪙 **ARENA Token Rewards** for completed swaps
- ⚡ **Real Blockchain Transactions** on Avalanche Fuji
- 🎮 **Gamified Interface** with progress tracking
- 🔗 **Chainlink Price Feeds** for accurate validation
- 📱 **Responsive Design** for mobile and desktop
- 🔐 **Secure Smart Contracts** with OpenZeppelin

## 🚀 Live Demo

🌐 **Frontend**: Running on `http://localhost:3001`  
🔗 **Contracts**: Deployed on Avalanche Fuji Testnet  
📊 **Explorer**: [Snowtrace Fuji](https://testnet.snowtrace.io)

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible components

### Blockchain
- **Solidity ^0.8.19** - Smart contract language
- **Hardhat** - Development framework
- **OpenZeppelin** - Security standards
- **Chainlink** - Price feed oracles

### Web3 Integration
- **Wagmi v2** - React hooks for Ethereum
- **Reown (WalletConnect v2)** - Universal wallet connection
- **Viem** - TypeScript Ethereum library

## 📦 Installation

### Prerequisites
- Node.js (v16, v18, or v20)
- npm or yarn
- MetaMask or compatible wallet

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Cector1/swapquest.git
cd swapquest
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Add your environment variables
```

4. **Compile smart contracts**
```bash
npx hardhat compile
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## 🔧 Configuration

### Contract Addresses
Update the contract addresses in `lib/contracts.ts`:

```typescript
export const CONTRACTS = {
  SWAP_QUEST: '0xYOUR_SWAP_QUEST_ADDRESS',
  ARENA_TOKEN: '0xYOUR_ARENA_TOKEN_ADDRESS',
  SWAP_TRACKER: '0xYOUR_SWAP_TRACKER_ADDRESS',
} as const
```

### Supported Tokens (Avalanche)
- **AVAX** - Native token
- **WAVAX** - Wrapped AVAX
- **USDC** - USD Coin
- **USDT** - Tether
- **WETH** - Wrapped Ethereum
- **WBTC** - Wrapped Bitcoin
- **LINK** - Chainlink
- **JOE** - TraderJoe token

## 🎮 How to Play

1. **Connect Wallet** - Connect MetaMask to Avalanche Fuji
2. **Choose Mission** - Select from 8 daily swap missions
3. **Complete Swap** - Execute the required token swap
4. **Earn Rewards** - Receive ARENA tokens
5. **Claim Tokens** - Withdraw earned ARENA to your wallet

### Mission Types
- 🔄 **Regular Missions** - Standard token swaps (25-50 ARENA)
- 👑 **Gold Day Special** - Limited-time bonus (100 ARENA)
- ⏰ **Timed Events** - 30-minute countdown missions

## 📋 Smart Contracts

### SwapQuest.sol
Main contract managing missions and rewards:
- Mission creation and management
- Swap validation with Chainlink oracles
- ARENA token distribution
- User progress tracking

### ArenaToken.sol
ERC20 reward token:
- Standard ERC20 functionality
- Minting capabilities for rewards
- Access control for authorized minters

### SwapTracker.sol
DEX integration tracker:
- Monitors swaps from authorized DEXs
- Records swap data for missions
- Validates swap completion

## 🔐 Security Features

- **ReentrancyGuard** - Protection against reentrancy attacks
- **Access Control** - Owner-only administrative functions
- **Price Validation** - Chainlink oracle price verification
- **Authorized DEXs** - Whitelist of trusted DEX contracts

## 🧪 Testing

Run the test suite:
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run specific test
npx hardhat test test/swapQuest.test.ts
```

## 🚀 Deployment

### Deploy to Fuji Testnet
```bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network fuji

# Verify contracts
npx hardhat verify --network fuji DEPLOYED_ADDRESS
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 📊 Project Structure

```
swapquest/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # UI primitives
│   └── ...                # Feature components
├── contracts/             # Solidity smart contracts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── scripts/               # Deployment scripts
├── test/                  # Contract tests
└── public/                # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Submission

**Event**: London Avalanche Hackathon  
**Category**: Gaming DeFi  
**Team**: SwapQuest Team  

### Achievements
- ✅ Full-stack DApp with real blockchain integration
- ✅ Gamified user experience with reward system
- ✅ Smart contracts deployed on Avalanche Fuji
- ✅ Chainlink oracle integration for price feeds
- ✅ Mobile-responsive gaming interface

## 📞 Contact

- **GitHub**: [@Cector1](https://github.com/Cector1)
- **Project**: [SwapQuest Repository](https://github.com/Cector1/swapquest)

---

**Built with ❤️ for the Avalanche ecosystem**

# SwapQuest - WorldCoin x AVAX Gaming 🌍⚡

A **WorldCoin MiniApp** built on **Avalanche Fuji** that combines DeFi gaming with WorldID verification for a secure and engaging crypto experience.

## 🌟 What's New - WorldCoin Integration

### 🔧 **MiniApp Features**
- **WorldID Verification**: Secure human verification using WorldCoin's biometric identity system
- **MiniKit Integration**: Runs natively within the World App for seamless user experience
- **Cross-Platform**: Works both in World App and standard web browsers
- **Enhanced Security**: Leverages WorldID for sybil resistance and authentic user verification

### 🎯 **Key Benefits**
- ✅ **Verified Users Only**: Premium features require WorldID verification
- 🔒 **Sybil Resistant**: Prevents bot abuse through biometric verification
- 📱 **Mobile-First**: Optimized for World App mobile experience
- 🌍 **Global Access**: WorldCoin's global identity network

## 🚀 Features

### 🎮 **Gaming & DeFi**
- **SwapQuest Missions**: Complete token swaps to earn ARENA tokens
- **Daily Challenges**: Time-limited missions with bonus rewards
- **Progressive Rewards**: Earn more by completing streaks and achievements
- **Real DEX Integration**: Actual token swaps on Avalanche Fuji testnet

### 🎓 **Learning Hub** 
- **DeFi Education**: Interactive courses on decentralized finance
- **Security Training**: Learn smart contract security best practices
- **Ecosystem Deep Dives**: Avalanche and TraderJoe tutorials
- **Skill Verification**: WorldID-verified completion certificates
- **Author Attribution**: Each lesson shows "Hecho por [Author Name]"

### 🎨 **Visual Design**
- **Crypto Color Palette**: Ethereum Blue, Bitcoin Orange, and crypto-themed gradients
- **Modern UI**: Glassmorphism effects with vibrant, saturated colors
- **Responsive Design**: Optimized for both mobile World App and desktop browsers
- **Dark Mode**: Crypto-native dark theme with neon accents

## 🛠 Technology Stack

### **Frontend**
- **Next.js 15**: React framework with app router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom crypto color palette
- **Framer Motion**: Smooth animations and transitions

### **WorldCoin Integration**
- **@worldcoin/minikit-js**: Core MiniKit functionality
- **@worldcoin/minikit-react**: React hooks for WorldCoin features
- **WorldID**: Biometric identity verification
- **MiniApp Framework**: Native World App integration

### **Blockchain**
- **Avalanche Fuji**: Testnet for development and testing
- **Wagmi**: React hooks for Ethereum/Avalanche
- **Reown AppKit**: Wallet connection and management
- **Real DEX**: TraderJoe integration for actual swaps

## 🏃‍♂️ Quick Start

### **Installation**
```bash
git clone https://github.com/Cector1/swapquest.git
cd swapquest
npm install
```

### **Environment Setup**
Create a `.env.local` file:
```env
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
NEXT_PUBLIC_ENVIRONMENT=development
```

### **Development**
```bash
npm run dev
```

### **WorldCoin Testing**
1. **Browser Mode**: Open `http://localhost:3000` - WorldCoin features will show as unavailable
2. **World App Mode**: Use WorldCoin's developer tools to test MiniApp integration
3. **WorldID**: Test verification flow in World App environment

## 📱 WorldCoin MiniApp Setup

### **MiniApp Configuration**
The app is configured as a WorldCoin MiniApp with:

- **App ID**: `swapquest-miniapp`
- **Permissions**: WorldID verification, wallet access
- **Platform**: Mobile-first, World App optimized
- **Security**: CSP headers for iframe compatibility

### **Integration Points**
1. **WorldID Verification**: Required for premium features
2. **Transaction Signing**: Enhanced security through World App
3. **User Identity**: Persistent verified identity across sessions
4. **Cross-App Integration**: Seamless World App ecosystem integration

## 🎯 How It Works

### **For Regular Users (Browser)**
1. Connect any Avalanche-compatible wallet
2. Complete basic missions and earn ARENA tokens
3. Access free educational content
4. Limited features without WorldID verification

### **For WorldCoin Users (World App)**
1. Open the MiniApp within World App
2. Automatic WorldCoin integration detection
3. Verify identity with WorldID for premium access
4. Enhanced security and exclusive features
5. Seamless transaction signing through World App

### **Mission System**
1. **Daily Missions**: Complete token swaps for ARENA rewards
2. **Gold Day Challenges**: Time-limited high-reward missions
3. **Learning Rewards**: Earn tokens by completing educational modules
4. **WorldID Bonuses**: Extra rewards for verified users

### **Knowledge Hub**
- **Author Attribution**: Each lesson displays "Hecho por [Author Name]"
- **Featured Lesson**: "Tu Primera MiniApp con WorldCoin" by Lautaro Oliver
- **Interactive Content**: Hands-on tutorials and quizzes
- **Progress Tracking**: Complete lessons to earn WLD tokens

## 🔧 Development

### **WorldCoin Integration**
```typescript
import { useWorldCoin } from '@/hooks/useWorldCoin'

function MyComponent() {
  const { 
    isInstalled,        // Running in World App?
    isWorldCoinUser,    // WorldID verified?
    verifyWithWorldID,  // Trigger verification
    sendTransaction     // World App transaction
  } = useWorldCoin()
  
  // Component logic...
}
```

### **Custom Hooks**
- `useWorldCoin()`: WorldCoin MiniKit integration
- `useSwapQuest()`: Game mechanics and missions
- `useTokenSwap()`: DEX integration for swaps

### **Component Structure**
```
components/
├── worldcoin-auth-header.tsx   # WorldCoin authentication UI
├── worldcoin-status.tsx        # WorldCoin integration status
├── swapquest-card.tsx          # Main game interface
├── daily-missions.tsx          # Mission system
├── learning-hub.tsx            # Educational content with authors
└── wallet-connect.tsx          # Multi-wallet support
```

## 🎨 Design System

### **Color Palette (Crypto Theme)**
- **Primary**: `#88aaf1` (Ethereum Blue - Bright)
- **Chart-1**: `#f7931a` (Bitcoin Orange - Vibrant) 
- **Chart-2**: `#329239` (Crypto Green - Saturated)
- **Chart-3**: `#1616b4` (Ethereum Dark Blue)
- **Chart-4**: `#c9b3f5` (Ethereum Violet - Bright)
- **Chart-5**: `#b8faf6` (Ethereum Sky Blue - Light)

### **Visual Effects**
- **Glassmorphism**: Backdrop blur with transparency
- **Gradient Overlays**: Crypto-themed color combinations
- **Glow Effects**: Shadow effects with color-matched glows
- **Animations**: Smooth transitions with Framer Motion

## 🚀 Deployment

### **WorldCoin MiniApp Deployment**
1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **WorldCoin App Store**: Submit through WorldCoin developer portal
3. **Web Deployment**: Deploy to Vercel/Netlify for browser access
4. **Testing**: Use WorldCoin's testing environment

### **Configuration**
- **CSP Headers**: Configured for World App iframe compatibility
- **Mobile Optimization**: PWA-like features for mobile experience
- **Manifest**: WorldCoin-specific app manifest

## 🔐 Security Features

### **WorldID Integration**
- **Biometric Verification**: Iris scan for human verification
- **Sybil Resistance**: One person, one account principle
- **Privacy Preserving**: Zero-knowledge proof system
- **Global Identity**: Cross-platform verified identity

### **Smart Contract Security**
- **Audited Contracts**: Using established DEX protocols
- **Testnet First**: Full testing on Avalanche Fuji
- **User Education**: Security training in Learning Hub

## 🎓 Learning Content

### **Available Lessons**
- **DeFi Basics**: Introduction to decentralized finance (Lautaro Oliver, María González, Carlos Mendoza)
- **Trading**: Token swapping and chart reading (Lautaro Oliver, Ana Rodríguez)
- **Advanced**: Yield farming and MiniApp development (Diego Fernández, Lautaro Oliver)

### **Featured Content**
- **"Tu Primera MiniApp con WorldCoin"**: 35-minute hands-on tutorial by Lautaro Oliver
- **200 WLD Reward**: Highest reward for completing the MiniApp development course

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/worldcoin-enhancement`
3. Commit changes: `git commit -am 'Add WorldCoin feature'`
4. Push to branch: `git push origin feature/worldcoin-enhancement`
5. Submit Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **WorldCoin**: [worldcoin.org](https://worldcoin.org)
- **Avalanche**: [avax.network](https://avax.network)
- **TraderJoe**: [traderjoexyz.com](https://traderjoexyz.com)
- **MiniKit Docs**: [WorldCoin MiniKit Documentation](https://docs.worldcoin.org/minikit)

---

**🌍 Ready to revolutionize DeFi gaming with verified human identity? Deploy SwapQuest as a WorldCoin MiniApp today!**
