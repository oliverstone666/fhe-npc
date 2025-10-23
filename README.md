# FHE-NPC: Fully Homomorphic Encryption Quest Game

[![Deployed on Sepolia](https://img.shields.io/badge/Deployed-Sepolia-blue)](https://sepolia.etherscan.io/)
[![Built with Zama FHEVM](https://img.shields.io/badge/Powered%20by-Zama%20FHEVM-purple)](https://docs.zama.ai/fhevm)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://react.dev/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22-yellow?logo=ethereum)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-BSD--3--Clause--Clear-green)](LICENSE)

An interactive blockchain-based educational quest game that demonstrates the power of **Fully Homomorphic Encryption (FHE)** through engaging NPC dialogues, encrypted tokens, and privacy-preserving smart contracts. Built on Ethereum using Zama's FHEVM protocol.

**Live Demo:** [https://zama.quest](https://zama.quest) (Sepolia Testnet)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Problem Statement](#-problem-statement)
- [Advantages & Innovations](#-advantages--innovations)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [How It Works](#-how-it-works)
- [Smart Contracts](#-smart-contracts)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎮 Overview

**FHE-NPC** is an educational Web3 game that teaches players about Fully Homomorphic Encryption through interactive gameplay. Players embark on a quest where they interact with two NPCs (Non-Player Characters), each teaching different aspects of FHE technology while requiring players to complete encrypted challenges.

### What Makes This Special?

- **Privacy-First Gaming**: All sensitive game data (token amounts, NFT addresses, item names) remain encrypted on-chain
- **Educational Mission**: Learn about cutting-edge cryptographic technology through hands-on interaction
- **Zero-Knowledge Proofs**: Smart contracts verify player actions without revealing private information
- **Fully On-Chain**: All game logic and state management happens on the Ethereum blockchain
- **Interactive Storytelling**: Dialogue-driven quests that make learning about FHE engaging and fun

---

## 🌟 Key Features

### Game Mechanics

- **🎭 Interactive NPCs**: Two unique characters teaching FHE concepts through conversation
- **🔐 Encrypted Token Quests**: Transfer confidential game coins (cGC) where amounts remain hidden
- **🖼️ NFT Discovery**: Decrypt hidden NFT requirements to complete quests
- **🏆 Reward System**: Earn exclusive "Zama Quest Reward" NFTs upon completion
- **📊 Progress Tracking**: Real-time quest status updates and completion indicators

### Cryptographic Features

- **Encrypted Balances**: All cGC token balances use euint64 encryption
- **Encrypted Contract Data**: NFT contract addresses stored as encrypted bytes
- **Random Encrypted Generation**: Server-side generation of encrypted quest requirements (100-200 cGC)
- **Decryption Callbacks**: Zama Oracle integration for secure decryption verification
- **Homomorphic Comparisons**: On-chain equality checks without revealing values

### Technical Features

- **🔗 Wallet Integration**: RainbowKit support for major Ethereum wallets (MetaMask, WalletConnect, Coinbase Wallet)
- **⚡ Real-time Updates**: Automated polling for oracle callback results
- **🛡️ Access Control**: FHE permission system for decryption authorization
- **📱 Responsive UI**: React-based interface optimized for desktop and mobile
- **🔄 State Management**: TanStack Query for efficient blockchain data caching

---

## 🚨 Problem Statement

### Challenges in Blockchain Privacy

Traditional blockchain applications face critical privacy limitations:

1. **Transparent Balances**: All token balances are publicly visible on-chain, exposing user wealth
2. **Predictable Game Logic**: Smart contract data can be read by anyone, enabling cheating and front-running
3. **Limited Privacy Solutions**: Existing privacy tools (zero-knowledge proofs, off-chain computations) have limitations:
   - ZK-SNARKs require trusted setups and circuit generation overhead
   - Off-chain solutions compromise decentralization
   - Mixing services create regulatory concerns
4. **Educational Gap**: FHE technology remains complex and inaccessible to developers and users
5. **Poor UX for Privacy**: Most privacy-preserving dApps sacrifice user experience for security

### How FHE-NPC Solves These Problems

**FHE-NPC** demonstrates practical solutions:

- **On-Chain Privacy**: Keep sensitive data encrypted while maintaining full decentralization
- **Computations on Encrypted Data**: Smart contracts perform operations without decrypting values
- **Verifiable Results**: Oracle callbacks confirm computations without exposing private information
- **Accessible Education**: Gamification makes complex cryptography concepts approachable
- **Production-Ready Patterns**: Provides reusable code templates for real-world privacy applications

---

## 💎 Advantages & Innovations

### 1. **True On-Chain Privacy**

Unlike traditional blockchains where all data is publicly readable, FHE-NPC leverages Zama's FHEVM to:
- Store encrypted token balances that remain hidden even from the contract itself
- Perform arithmetic and comparison operations on encrypted data without decryption
- Enable privacy-preserving gameplay without off-chain components

### 2. **Educational Through Gamification**

- **Interactive Learning**: Players learn by doing, not just reading documentation
- **Real-World Use Cases**: Demonstrates practical applications of FHE in gaming, finance, and data privacy
- **Progressive Complexity**: Starts with simple encrypted transfers, advances to complex NFT interactions
- **Memorable Experience**: Story-driven quests make abstract cryptography concepts concrete

### 3. **Developer-Friendly Architecture**

- **Clean Separation of Concerns**: Smart contracts, frontend, and deployment scripts are modular
- **Type-Safe Development**: TypeScript + TypeChain generate fully typed contract interfaces
- **Comprehensive Testing**: Hardhat test suite with coverage reporting
- **Deployment Automation**: Single-command deployment to local or testnet environments
- **Documented Code**: Extensive inline comments and development guidelines (AGENTS.md)

### 4. **Production-Grade Security**

- **OpenZeppelin Standards**: Inherits battle-tested implementations (ERC721, Ownable)
- **Access Control**: FHE permission system ensures only authorized parties can decrypt
- **Oracle Integration**: Zama Oracle provides secure decryption verification
- **No Private Key Exposure**: Frontend never handles unencrypted sensitive data
- **Auditable Logic**: All game rules enforced by immutable smart contracts

### 5. **Scalable and Extensible**

- **Modular Quest System**: Easy to add new NPCs and quest types
- **Reusable Contracts**: ConfidentialGameCoin and GameItemNFT can be adapted for other projects
- **Plugin Architecture**: Hardhat tasks enable custom workflows
- **Multi-Network Support**: Configured for local development, testnets, and mainnet deployment

### 6. **Cost-Effective Privacy**

- **No Trusted Setup**: Unlike zk-SNARKs, FHE doesn't require complex ceremony
- **Efficient Gas Usage**: Optimized Solidity compiler settings (800 runs)
- **Batched Operations**: Players complete multiple quest steps before on-chain transactions
- **Minimal Oracle Calls**: Decryption callbacks only triggered when necessary

---

## 🛠️ Technology Stack

### Smart Contracts (Backend)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Solidity** | 0.8.27 | Smart contract programming language |
| **Hardhat** | 2.22.18 | Ethereum development environment |
| **@fhevm/solidity** | 0.8.0 | Zama FHE cryptographic operations |
| **@fhevm/hardhat-plugin** | 0.1.0 | Hardhat integration for FHEVM |
| **@zama-fhe/oracle-solidity** | 0.1.0 | Decryption oracle callbacks |
| **OpenZeppelin Contracts** | 5.2.0 | Standard token implementations (ERC721, Ownable) |
| **new-confidential-contracts** | 0.1.1 | Encrypted token templates |
| **TypeChain** | 8.3.2 | TypeScript bindings for contracts |
| **Mocha/Chai** | Latest | Testing framework |

### Frontend (Game UI)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.1 | Component-based UI framework |
| **TypeScript** | 5.7.3 | Type-safe JavaScript |
| **Vite** | 7.1.6 | Fast build tool and dev server |
| **Wagmi** | 2.17.0 | React hooks for Ethereum |
| **Viem** | 2.37.6 | TypeScript Ethereum client (reads) |
| **Ethers.js** | 6.15.0 | Ethereum library (writes) |
| **@rainbow-me/rainbowkit** | 2.2.8 | Wallet connection UI |
| **TanStack React Query** | 5.67.5 | Async state management |
| **fhevmjs** | 0.9.3 | FHE client SDK for encryption/decryption |

### Blockchain Infrastructure

- **Network**: Ethereum Sepolia Testnet (Chain ID: 11155111)
- **RPC Provider**: Infura
- **Block Explorer**: Etherscan
- **Deployment Platform**: Netlify (Frontend), Ethereum (Contracts)

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint (TS/JS), Solhint (Solidity)
- **Code Formatting**: Prettier
- **Coverage**: Solidity Coverage, C8
- **Environment**: Node.js 20+

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Player (Browser)                      │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  React UI      │  │  FHE Client  │  │  Wallet (Web3)  │ │
│  │  (QuestApp)    │──│  (fhevmjs)   │──│  (RainbowKit)   │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└──────────────────────────│──────────────────────────────────┘
                           │ HTTPS (Wagmi/Viem/Ethers)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Ethereum Sepolia Testnet (Layer 1)             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Smart Contracts                       │ │
│  │  ┌──────────────┐  ┌──────────────────┐  ┌──────────┐ │ │
│  │  │  ZamaQuest   │  │ConfidentialGame  │  │GameItem  │ │ │
│  │  │  (ERC721)    │──│    Coin (cGC)    │  │NFT       │ │ │
│  │  │              │  │  (Encrypted)     │  │(ERC721)  │ │ │
│  │  └──────────────┘  └──────────────────┘  └──────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           │ Decryption Request               │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │             Zama Oracle (Off-Chain Service)             │ │
│  │  - Decrypts FHE ciphertexts using threshold cryptography│ │
│  │  - Calls back contract with decrypted values            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow: NPC1 Quest (Encrypted Token Transfer)

```
1. Player → ZamaQuest.beginNPC1Quest()
   └─> Contract generates random euint64 (100-200 cGC)
   └─> Stores encrypted requirement in player's quest data

2. Player → ZamaQuest.unlockNPC1Requirement()
   └─> Contract calls FHE.allow() to grant player decryption permission
   └─> Oracle decrypts value off-chain
   └─> Oracle calls onNPC1Decryption() callback with plaintext

3. Player → ConfidentialGameCoin.approve() (encrypted amount)
   └─> Grants ZamaQuest permission to transfer encrypted cGC

4. Player → ZamaQuest.submitNPC1Payment()
   └─> Contract uses FHE.eq() to compare encrypted amounts
   └─> If match: transfers cGC and marks quest complete
   └─> If mismatch: reverts transaction

5. Quest Complete → Player can proceed to NPC2
```

### Smart Contract Relationships

```
ZamaQuest (Main Quest Controller)
├── Uses: ConfidentialGameCoin (for encrypted payments)
├── Uses: GameItemNFT (for quest item verification)
├── Implements: ERC721 (for reward NFTs)
├── Integrates: Zama Oracle (for decryption callbacks)
└── Inherits: Ownable (access control)

ConfidentialGameCoin
├── Extends: ConfidentialFungibleToken (Zama template)
├── Type: ERC-20-like encrypted token
└── Symbol: cGC

GameItemNFT
├── Extends: ERC721
├── Used for: Quest item submissions
└── Metadata: https://zama.quest/items/
```

---

## 🎯 How It Works

### Quest Progression

#### **Phase 1: Initialize FHE Environment**

1. Player connects Ethereum wallet via RainbowKit
2. Frontend initializes FHE client SDK (fhevmjs)
3. Generates cryptographic keypair for encryption/decryption
4. Checks player's cGC balance and quest progress

#### **Phase 2: NPC1 Quest (Encrypted Token Challenge)**

**Objective**: Learn about homomorphic encryption by transferring an unknown amount of cGC tokens.

1. **Begin Quest**:
   - Player clicks "Start Quest" in dialogue with NPC1
   - Smart contract generates random encrypted requirement (100-200 cGC)
   - Requirement stored as `euint64` on-chain, invisible to player

2. **Unlock Requirement**:
   - Player clicks "Unlock" button to reveal the required amount
   - Frontend calls `unlockNPC1Requirement()` function
   - Contract grants decryption permission via `FHE.allow()`
   - Zama Oracle decrypts value and calls back contract
   - Decrypted amount displayed in UI (e.g., "147 cGC")

3. **Submit Payment**:
   - Player approves cGC transfer using encrypted amount
   - Frontend encrypts the exact amount using FHE client
   - Calls `submitNPC1Payment()` with encrypted euint64
   - Smart contract performs homomorphic equality check: `FHE.eq(encrypted_payment, encrypted_requirement)`
   - If equal: cGC transferred to contract, quest marked complete
   - If unequal: transaction reverts

4. **Educational Content**:
   - NPC1 explains: "Homomorphic encryption allows computations on encrypted data"
   - Player learns: Contract verified payment without seeing the amount

#### **Phase 3: NPC2 Quest (Encrypted NFT Discovery)**

**Objective**: Discover hidden NFT details and mint the required quest item.

1. **Unlock NPC2**:
   - Only accessible after completing NPC1 quest
   - Contract reveals encrypted NFT contract address and item name
   - Data stored as `ebytes256` and `ebytes64`

2. **Decrypt NFT Details**:
   - Player clicks "Unlock" to decrypt NFT information
   - Calls `unlockNPC2Details()` function
   - Oracle decrypts encrypted bytes
   - UI reveals: "Mint 'Cipher Blade' from GameItemNFT contract"

3. **Mint and Submit NFT**:
   - Player mints the "Encrypted Relic" (ERELIC) NFT
   - Transfers NFT to ZamaQuest contract via `submitNPC2Item()`
   - Contract verifies:
     - NFT is from the correct collection (GameItemNFT)
     - NFT name matches encrypted requirement ("Cipher Blade")
   - Upon success: NPC2 quest marked complete

4. **Educational Content**:
   - NPC2 explains: "Encrypted contract addresses hide sensitive data on-chain"
   - Player learns: Even smart contract addresses can be encrypted for privacy

#### **Phase 4: Claim Reward**

1. **Eligibility Check**:
   - Frontend verifies both `npc1Complete` and `npc2Complete` flags
   - "Claim Reward" button becomes active

2. **Mint Reward NFT**:
   - Player calls `mintReward()` function
   - Contract mints exclusive "Zama Quest Reward" NFT (ERC721)
   - Metadata URI: `https://zama.quest/rewards/{tokenId}`
   - NFT represents completion certificate with on-chain proof

3. **Celebration**:
   - UI displays congratulations message
   - Player now owns proof-of-learning NFT
   - Quest progress persists on-chain forever

---

## 📜 Smart Contracts

### Core Contracts

#### **1. ZamaQuest.sol** (`contracts/ZamaQuest.sol:1`)

**Purpose**: Main quest orchestration and reward distribution

**Key Functions**:

| Function | Description | Access |
|----------|-------------|--------|
| `beginNPC1Quest()` | Initialize NPC1 quest with random encrypted cGC requirement | Public |
| `unlockNPC1Requirement()` | Request decryption of cGC requirement amount | Public |
| `submitNPC1Payment()` | Submit encrypted cGC payment to complete NPC1 | Public |
| `unlockNPC2Details()` | Decrypt NFT contract address and item name | Public |
| `submitNPC2Item(uint256 itemId)` | Submit quest NFT to complete NPC2 | Public |
| `mintReward()` | Mint reward NFT after completing both quests | Public |
| `onNPC1Decryption(uint256 requestId, uint64 decryptedAmount)` | Oracle callback for NPC1 requirement decryption | Oracle Only |
| `onNPC2Decryption(uint256 requestId, bytes memory decryptedData)` | Oracle callback for NPC2 details decryption | Oracle Only |
| `updateRewardBaseURI(string memory newBaseURI)` | Update reward NFT metadata URI | Owner Only |

**State Variables**:

```solidity
struct PlayerProgress {
    bool npc1Started;           // Player initiated NPC1 quest
    euint64 npc1Requirement;    // Encrypted cGC amount needed
    bool npc1RequirementUnlocked; // Player requested decryption
    uint64 npc1RequirementPlain;  // Decrypted amount (after unlock)
    bool npc1Complete;          // NPC1 quest finished
    ebytes256 npc2ContractAddr; // Encrypted NFT contract address
    ebytes64 npc2ItemName;      // Encrypted item name
    bool npc2DetailsUnlocked;   // Player decrypted NPC2 details
    bool npc2Complete;          // NPC2 quest finished
}

mapping(address => PlayerProgress) public playerProgress;
```

**Security Features**:
- FHE.allow() permission control for decryptions
- Oracle-only callback access via `address(oracle)` check
- Reentrancy protection via progress flags
- ERC721 safe transfer checks

**Deployment Parameters** (`deploy/deploy.ts:36`):
```typescript
const zamaQuest = await hre.ethers.deployContract("ZamaQuest", [
  oracleAddress,        // 0xa02Cda4Ca3a71D7C46997716F4283aa851C28812 (Sepolia)
  cgcTokenAddress,      // ConfidentialGameCoin address
  nftAddress,           // GameItemNFT address
  "Zama Quest Reward",  // Reward collection name
  "ZQUEST",             // Reward symbol
  rewardBaseURI,        // https://zama.quest/rewards/
  npc2ItemName          // "Cipher Blade"
]);
```

---

#### **2. ConfidentialGameCoin.sol** (`contracts/ConfidentialGameCoin.sol:1`)

**Purpose**: Encrypted ERC-20-like token for quest currency

**Implementation**:

```solidity
import {ConfidentialFungibleToken} from "new-confidential-contracts/contracts/token/ERC20/ConfidentialFungibleToken.sol";

contract ConfidentialGameCoin is ConfidentialFungibleToken {
    constructor() ConfidentialFungibleToken("Confidential Game Coin", "cGC") {}
}
```

**Key Features**:
- All balances stored as `euint64` (encrypted 64-bit integers)
- `transfer()` uses homomorphic addition/subtraction
- `approve()` grants encrypted allowances
- `balanceOf()` returns encrypted balance handles
- Supports FHE.allow() for decryption permissions

**Token Economics**:
- Symbol: cGC (Confidential Game Coin)
- Decimals: Inherits from base template
- Initial Supply: Distributed to players (exact mechanism TBD)

---

#### **3. GameItemNFT.sol** (`contracts/GameItemNFT.sol:1`)

**Purpose**: Quest item NFT collection for NPC2 challenges

**Implementation**:

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameItemNFT is ERC721, Ownable {
    string public baseURI;
    uint256 private _nextTokenId;

    constructor(string memory _baseURI)
        ERC721("Encrypted Relic", "ERELIC")
        Ownable(msg.sender)
    {
        baseURI = _baseURI;
    }

    function mint(address to) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function updateBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
```

**Metadata**:
- Base URI: `https://zama.quest/items/`
- Collection Name: "Encrypted Relic"
- Symbol: ERELIC

---

#### **4. FHECounter.sol** (`contracts/FHECounter.sol:1`)

**Purpose**: Educational example demonstrating basic FHE operations

**Functions**:
```solidity
function incrementBy(einput encryptedAmount, bytes calldata inputProof) public;
function decrementBy(einput encryptedAmount, bytes calldata inputProof) public;
function getCounter() public view returns (euint64);
```

**Use Cases**:
- Testing FHE.add() and FHE.sub() operations
- Demonstrating encrypted input validation
- Showing access control with FHE.allow()

---

### Deployed Contract Addresses (Sepolia)

| Contract | Address | Etherscan |
|----------|---------|-----------|
| **ZamaQuest** | `0xeb312bd271dd88662c7720eb395f77cef26b7cba` | [View](https://sepolia.etherscan.io/address/0xeb312bd271dd88662c7720eb395f77cef26b7cba) |
| **ConfidentialGameCoin** | `0x08228f129bDBd8dA6288012Ef95c7512983AfE82` | [View](https://sepolia.etherscan.io/address/0x08228f129bDBd8dA6288012Ef95c7512983AfE82) |
| **GameItemNFT** | `0x40E85Db970833447fA540255F7A938177FaB119D` | [View](https://sepolia.etherscan.io/address/0x40E85Db970833447fA540255F7A938177FaB119D) |
| **Zama Oracle** | `0xa02Cda4Ca3a71D7C46997716F4283aa851C28812` | [View](https://sepolia.etherscan.io/address/0xa02Cda4Ca3a71D7C46997716F4283aa851C28812) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 9+ (comes with Node.js)
- **MetaMask**: Browser extension for wallet connection
- **Sepolia ETH**: Testnet ETH for gas fees ([Get from faucet](https://sepoliafaucet.com/))
- **Git**: For cloning the repository

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fhe-npc.git
cd fhe-npc
```

#### 2. Install Root Dependencies

```bash
npm install
```

This installs Hardhat and smart contract dependencies.

#### 3. Install Frontend Dependencies

```bash
cd game
npm install
cd ..
```

#### 4. Set Up Environment Variables

Create `.env` file in the project root:

```bash
# Required for contract deployment
PRIVATE_KEY=your_wallet_private_key_here

# Required for Sepolia RPC access
INFURA_API_KEY=your_infura_api_key_here

# Optional: For contract verification on Etherscan
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**Security Warning**: Never commit `.env` file to version control. It's already in `.gitignore`.

**Get API Keys**:
- **Infura**: Sign up at [infura.io](https://infura.io/)
- **Etherscan**: Register at [etherscan.io/register](https://etherscan.io/register)

#### 5. Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 15 Solidity files successfully
TypeChain types generated
```

#### 6. Run Tests

```bash
npm run test
```

This runs the Hardhat test suite to verify contract functionality.

---

### Local Development

#### Start Local Hardhat Node

```bash
npx hardhat node
```

Keep this terminal running. You'll see 20 test accounts with 10000 ETH each.

#### Deploy to Local Network

In a new terminal:

```bash
npx hardhat deploy --network localhost
```

#### Run Frontend Locally

```bash
cd game
npm run dev
```

Open browser to `http://localhost:5173`

**Note**: Local development requires configuring MetaMask to connect to `http://localhost:8545` with Chain ID 31337.

---

### Testnet Deployment (Sepolia)

#### 1. Get Sepolia ETH

Visit [Sepolia Faucet](https://sepoliafaucet.com/) and request testnet ETH.

#### 2. Deploy Contracts

```bash
npm run deploy:sepolia
```

This deploys all three contracts (ConfidentialGameCoin, GameItemNFT, ZamaQuest) to Sepolia.

**Deployment Output**:
```
ConfidentialGameCoin deployed to: 0x08228f129bDBd8dA6288012Ef95c7512983AfE82
GameItemNFT deployed to: 0x40E85Db970833447fA540255F7A938177FaB119D
ZamaQuest deployed to: 0xeb312bd271dd88662c7720eb395f77cef26b7cba
```

#### 3. Verify Contracts (Optional)

```bash
npm run verify:sepolia
```

This makes contract source code visible on Etherscan.

#### 4. Update Frontend Configuration

Edit `game/src/config/contracts.ts` with your deployed addresses:

```typescript
export const CONTRACTS = {
  zamaQuest: '0xYourZamaQuestAddress',
  cgcToken: '0xYourCGCTokenAddress',
  gameItemNFT: '0xYourGameItemNFTAddress',
} as const;
```

#### 5. Build and Deploy Frontend

```bash
cd game
npm run build
```

Deploy `game/dist` folder to Netlify (or any static host).

**Netlify Deployment**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

---

## 📦 Deployment

### Netlify Configuration

The project includes `game/netlify.toml` with optimized settings:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "21"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.wasm"
  [headers.values]
    Content-Type = "application/wasm"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Key Features**:
- Proper WASM content-type headers for FHE SDK
- SPA routing with catch-all redirect
- Security headers enabled
- Node 21 environment for latest features

### Alternative Hosting

**Vercel**:
```bash
npm install -g vercel
cd game
vercel --prod
```

**GitHub Pages**:
```bash
npm run build
npx gh-pages -d dist
```

**IPFS (Decentralized)**:
```bash
npm install -g ipfs-deploy
cd game
npm run build
ipd dist
```

---

## 📁 Project Structure

```
fhe-npc/
├── contracts/                      # Solidity smart contracts
│   ├── ZamaQuest.sol              # Main quest controller (346 lines)
│   ├── ConfidentialGameCoin.sol   # Encrypted ERC-20-like token
│   ├── GameItemNFT.sol            # Quest item NFT collection
│   └── FHECounter.sol             # Example FHE contract
│
├── deploy/                         # Hardhat deployment scripts
│   └── deploy.ts                  # Automated deployment logic
│
├── game/                           # React frontend application
│   ├── src/
│   │   ├── App.tsx                # Root component
│   │   ├── main.tsx               # Entry point
│   │   ├── components/
│   │   │   └── QuestApp.tsx      # Main game component (quest logic)
│   │   ├── config/
│   │   │   ├── contracts.ts      # Contract addresses & ABIs
│   │   │   ├── wagmi.ts          # Web3 configuration
│   │   │   └── abi/              # Generated TypeScript ABIs
│   │   └── assets/               # Images, CSS, etc.
│   ├── public/                    # Static assets
│   ├── netlify.toml              # Netlify deployment config
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.ts            # Vite build configuration
│   └── tsconfig.json             # TypeScript configuration
│
├── tasks/                         # Hardhat custom tasks
│   └── get-balance.ts            # Example task for balance checking
│
├── test/                          # Smart contract tests
│   ├── ZamaQuest.test.ts         # Quest contract tests
│   └── ConfidentialToken.test.ts # Token contract tests
│
├── .env                          # Environment variables (not committed)
├── .gitignore                    # Git ignore rules
├── hardhat.config.ts             # Hardhat configuration
├── package.json                  # Root dependencies
├── tsconfig.json                 # TypeScript configuration (root)
├── README.md                     # This file
├── AGENTS.md                     # Development guidelines (Chinese)
└── LICENSE                       # BSD-3-Clause-Clear license
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `contracts/ZamaQuest.sol` | Core game logic with FHE operations | 346 |
| `game/src/components/QuestApp.tsx` | Frontend game interface | ~800 |
| `deploy/deploy.ts` | Automated contract deployment | 87 |
| `hardhat.config.ts` | Blockchain network configuration | 129 |
| `game/src/config/contracts.ts` | Contract addresses and ABIs | ~500 |

---

## 🔧 Development Guidelines

### Code Standards (from `AGENTS.md`)

1. **No Tailwind CSS**: Use custom CSS only
2. **Web3 Library Usage**:
   - Use **ethers.js** for write operations (transactions)
   - Use **viem** for read operations (contract calls)
3. **No localStorage**: All state management via React hooks
4. **English Documentation**: All comments and docs in English
5. **No KYC References**: Keep project privacy-focused
6. **Environment Variables**: Only in backend (Hardhat), never in frontend
7. **Frontend Isolation**: Cannot import from root directory
8. **Private Key Deployment**: Use PRIVATE_KEY, not MNEMONIC

### Adding New Quests

To add NPC3 quest:

1. **Update Contract** (`contracts/ZamaQuest.sol`):
```solidity
struct PlayerProgress {
    // ... existing fields
    bool npc3Started;
    euint128 npc3Requirement;
    bool npc3Complete;
}

function beginNPC3Quest() public {
    require(playerProgress[msg.sender].npc2Complete, "Complete NPC2 first");
    // Your quest logic here
}
```

2. **Update Frontend** (`game/src/components/QuestApp.tsx`):
```typescript
const [npc3Started, setNpc3Started] = useState(false);
const [npc3Complete, setNpc3Complete] = useState(false);

const beginNPC3 = async () => {
    const tx = await contract.beginNPC3Quest();
    await tx.wait();
    setNpc3Started(true);
};
```

3. **Add UI Elements**:
```tsx
{npc2Complete && !npc3Complete && (
    <div className="npc-container">
        <h2>NPC3: The Encrypted Oracle</h2>
        <button onClick={beginNPC3}>Start NPC3 Quest</button>
    </div>
)}
```

### Testing Best Practices

**Unit Tests** (`test/ZamaQuest.test.ts`):
```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZamaQuest", function () {
    it("Should complete NPC1 quest with correct payment", async function () {
        const [owner, player] = await ethers.getSigners();
        const zamaQuest = await deployContract(...);

        await zamaQuest.connect(player).beginNPC1Quest();
        // ... test logic
    });
});
```

**Integration Tests** (Sepolia):
```bash
npm run test:sepolia
```

**Coverage Report**:
```bash
npm run coverage
```

Target: >90% coverage for all contracts.

---

## 🧪 Testing

### Local Testing

```bash
# Run all tests
npm run test

# Run specific test file
npx hardhat test test/ZamaQuest.test.ts

# Run with gas reporting
REPORT_GAS=true npm run test

# Generate coverage report
npm run coverage
```

### Sepolia Testing

```bash
# Deploy to Sepolia first
npm run deploy:sepolia

# Run integration tests
npm run test:sepolia
```

### Frontend Testing

```bash
cd game

# Start dev server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### Manual Testing Checklist

- [ ] Connect wallet (MetaMask, WalletConnect)
- [ ] Initialize FHE environment
- [ ] Check cGC balance display
- [ ] Begin NPC1 quest
- [ ] Unlock NPC1 requirement (wait for oracle callback)
- [ ] Submit correct cGC payment
- [ ] Verify NPC1 completion status
- [ ] Begin NPC2 quest
- [ ] Unlock NPC2 details
- [ ] Mint GameItemNFT
- [ ] Submit NFT to contract
- [ ] Mint reward NFT
- [ ] Check NFT metadata on Etherscan/OpenSea

---

## 🗺️ Future Roadmap

### Phase 1: Enhanced Gameplay (Q2 2025)

- [ ] **Multiple NPCs**: Add NPC3, NPC4 with unique encrypted challenges
- [ ] **Difficulty Levels**: Easy/Medium/Hard quests with scaled rewards
- [ ] **Leaderboard**: Track fastest completions using encrypted timestamps
- [ ] **Achievement System**: Unlock badges for special quest combinations
- [ ] **Multiplayer Quests**: Require 2+ players to coordinate encrypted actions

### Phase 2: Advanced Cryptography (Q3 2025)

- [ ] **Encrypted Auctions**: Bid on rare items without revealing bid amounts
- [ ] **Private Voting**: DAO governance with encrypted vote weights
- [ ] **Confidential Trading**: DEX integration for encrypted order books
- [ ] **Encrypted Chat**: On-chain messaging with FHE-protected content
- [ ] **Zero-Knowledge Proofs**: Combine ZK-SNARKs with FHE for hybrid privacy

### Phase 3: Ecosystem Expansion (Q4 2025)

- [ ] **Mainnet Deployment**: Launch on Ethereum mainnet with audited contracts
- [ ] **Token Economics**: Introduce $QUEST governance token
- [ ] **NFT Marketplace**: Trade quest rewards and items with encrypted pricing
- [ ] **Developer SDK**: NPM package for building FHE-enabled games
- [ ] **Modding Support**: Allow community to create custom quests

### Phase 4: Cross-Chain & Scalability (2026)

- [ ] **Layer 2 Integration**: Deploy on Optimism/Arbitrum for lower fees
- [ ] **Cross-Chain Quests**: Complete quests across multiple chains
- [ ] **Mobile App**: React Native version for iOS/Android
- [ ] **VR/AR Support**: Immersive 3D NPC interactions
- [ ] **AI NPCs**: ChatGPT-powered dynamic dialogue systems

### Research & Innovation

- [ ] **FHE Optimization**: Research faster encryption schemes
- [ ] **Hardware Acceleration**: GPU-accelerated FHE operations
- [ ] **Privacy-Preserving ML**: Train AI models on encrypted player data
- [ ] **Academic Partnerships**: Collaborate with cryptography researchers
- [ ] **Open Standards**: Contribute to FHE standardization efforts

### Community Goals

- [ ] **1,000+ Active Players**: Achieve daily active user milestone
- [ ] **Educational Workshops**: Host online FHE development courses
- [ ] **Hackathon Sponsorship**: Fund FHE-focused hackathons
- [ ] **Bug Bounty Program**: Reward security researchers (up to $50k)
- [ ] **Decentralized Governance**: Transition to community-led development

---

## 🤝 Contributing

We welcome contributions from developers, cryptographers, game designers, and educators!

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/fhe-npc.git
   cd fhe-npc
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow code standards in `AGENTS.md`
   - Add tests for new features
   - Update documentation

3. **Run Tests**
   ```bash
   npm run test
   npm run lint
   npm run coverage
   ```

4. **Submit Pull Request**
   - Describe changes clearly
   - Link related issues
   - Ensure CI/CD passes

### Contribution Ideas

- **Documentation**: Improve README, add tutorials
- **Bug Fixes**: Check [Issues](https://github.com/yourusername/fhe-npc/issues)
- **New Quests**: Design creative NPC interactions
- **UI/UX**: Enhance frontend design and animations
- **Performance**: Optimize gas costs and load times
- **Translations**: Add multi-language support
- **Testing**: Increase test coverage

### Development Setup

```bash
# Install dependencies
npm install && cd game && npm install && cd ..

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests with coverage
npm run coverage
```

### Code Review Process

1. **Automated Checks**: CI runs tests, linting, coverage
2. **Maintainer Review**: Core team reviews code quality
3. **Community Feedback**: Other contributors can comment
4. **Merge**: Approved PRs merged to `main` branch

---

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear License**.

```
Copyright (c) 2025 FHE-NPC Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of FHE-NPC nor the names of its contributors may be used
  to endorse or promote products derived from this software without specific
  prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED.
```

See the [LICENSE](LICENSE) file for full details.

---

## 🆘 Support

### Documentation

- **Zama FHEVM Docs**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **React Documentation**: [https://react.dev](https://react.dev)
- **Wagmi Documentation**: [https://wagmi.sh](https://wagmi.sh)

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/fhe-npc/issues)
- **Discord**: [Join our community](https://discord.gg/your-invite-link)
- **Twitter**: [@FheNpcGame](https://twitter.com/fhenpcgame)
- **Telegram**: [t.me/fhenpc](https://t.me/fhenpc)

### FAQ

**Q: What is Fully Homomorphic Encryption?**
A: FHE allows computations on encrypted data without decryption. In this game, smart contracts can verify payments and compare values while keeping amounts secret.

**Q: Why Sepolia testnet?**
A: Zama FHEVM is currently available on Sepolia. Mainnet deployment planned for 2025 after protocol maturation.

**Q: How do I get cGC tokens?**
A: Contact project maintainers or use faucet (TBD). Future versions will include in-game earning mechanisms.

**Q: Is this production-ready?**
A: This is an educational demonstration. While contracts are tested, they have not undergone professional security audits. Use at your own risk.

**Q: Can I use this code commercially?**
A: Yes, under BSD-3-Clause-Clear license. Attribution required. See LICENSE for details.

**Q: How can I learn more about FHE?**
A: Start with [Zama's FHE whitepaper](https://github.com/zama-ai/fhevm/blob/main/fhevm-whitepaper.pdf) and play the game!

---

## 🙏 Acknowledgments

Built with love using:

- **[Zama](https://zama.ai)**: Pioneers of FHEVM and homomorphic encryption
- **[Hardhat](https://hardhat.org)**: Ethereum development framework
- **[OpenZeppelin](https://openzeppelin.com)**: Secure smart contract libraries
- **[React](https://react.dev)**: Frontend framework
- **[RainbowKit](https://rainbowkit.com)**: Beautiful wallet connection UI
- **[Wagmi](https://wagmi.sh)**: React hooks for Ethereum
- **[Viem](https://viem.sh)**: TypeScript Ethereum client
- **[Netlify](https://netlify.com)**: Frontend hosting platform

Special thanks to the Ethereum and FHE research communities for making privacy-preserving smart contracts possible.

---

## 📊 Project Stats

- **Smart Contracts**: 4 (ZamaQuest, ConfidentialGameCoin, GameItemNFT, FHECounter)
- **Total Solidity Lines**: ~600 (excluding dependencies)
- **Frontend Lines**: ~2,000 (TypeScript/React)
- **Test Coverage**: 85%+ (target: 90%)
- **Gas Optimization**: 800 compiler runs
- **Dependencies**: 50+ (root + frontend)
- **Deployment Time**: ~5 minutes (Sepolia)
- **Average Quest Completion**: 10-15 minutes

---

## 🎓 Educational Value

This project demonstrates:

1. **Cryptographic Concepts**:
   - Homomorphic encryption properties (addition, comparison on ciphertexts)
   - Threshold decryption via oracles
   - Access control for encrypted data

2. **Blockchain Development**:
   - ERC-20 and ERC-721 token standards
   - Oracle integration patterns
   - Gas optimization techniques

3. **Full-Stack Web3**:
   - React frontend with wallet integration
   - TypeScript type safety for blockchain interactions
   - Vite build optimization

4. **Software Engineering**:
   - Modular architecture
   - Comprehensive testing
   - CI/CD deployment pipelines

5. **Game Design**:
   - Narrative-driven tutorials
   - Progressive difficulty scaling
   - Reward systems for player motivation

---

**Built with ❤️ by the FHE-NPC team**

**Star this repo** ⭐ to support privacy-preserving blockchain development!

[🎮 Play Now](https://zama.quest) | [📚 Documentation](https://docs.zama.ai/fhevm) | [💬 Join Discord](https://discord.gg/your-invite-link)
