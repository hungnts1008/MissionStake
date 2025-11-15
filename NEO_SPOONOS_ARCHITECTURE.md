# 🏗️ MissionStake Architecture: NEO Blockchain + SpoonOS Integration

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [NEO Smart Contract Design](#neo-smart-contract-design)
4. [SpoonOS Integration](#spoonos-integration)
5. [Frontend Architecture](#frontend-architecture)
6. [Data Flow](#data-flow)
7. [Security Considerations](#security-considerations)
8. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 System Overview

### Current State
- **Frontend**: React + TypeScript với Vite
- **AI**: Gemini API cho task suggestions và personalized missions
- **Blockchain**: Hardhat + Solidity (Ethereum-compatible)
- **State Management**: React useState (in-memory)

### Target State
- **Frontend**: React + TypeScript (giữ nguyên)
- **AI Framework**: **SpoonOS Core Developer Framework**
- **Blockchain**: **NEO N3 Network**
- **Smart Contracts**: C# hoặc Python trên NeoVM
- **State Management**: NEO blockchain + SpoonOS state management

---

## 🏛️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         React Frontend (TypeScript + Vite)                │  │
│  │  - Dashboard  - Mission Feed  - Leaderboard              │  │
│  │  - AI Suggestions  - Profile  - Wallet                   │  │
│  └────────────────┬──────────────────┬──────────────────────┘  │
└───────────────────┼──────────────────┼──────────────────────────┘
                    │                  │
        ┌───────────▼──────┐  ┌────────▼─────────┐
        │   SpoonOS Core   │  │   NEO N3 Node    │
        │   Framework      │  │   (RPC/WebSocket)│
        └───────┬──────────┘  └────────┬─────────┘
                │                      │
    ┌───────────▼───────────┐         │
    │   AI Agent Layer      │         │
    │  ┌─────────────────┐  │         │
    │  │ Task Suggestion │  │         │
    │  │     Agent       │  │         │
    │  ├─────────────────┤  │         │
    │  │ Personalized    │  │         │
    │  │  Mission Agent  │  │         │
    │  ├─────────────────┤  │         │
    │  │ Prediction      │  │         │
    │  │ Analysis Agent  │  │         │
    │  ├─────────────────┤  │         │
    │  │ Reputation      │  │         │
    │  │ Scoring Agent   │  │         │
    │  └─────────────────┘  │         │
    │                       │         │
    │  SpoonOS Tools:       │         │
    │  - LLM Manager        │         │
    │  - Graph Workflows    │         │
    │  - State Management   │         │
    │  - Prompt Caching     │         │
    └───────────────────────┘         │
                                      │
            ┌─────────────────────────▼──────────────────────────┐
            │           NEO Blockchain Smart Contracts            │
            │  ┌────────────────┐  ┌──────────────────────────┐  │
            │  │  MissionStake  │  │  ReputationToken (NEP-17)│  │
            │  │   Contract     │  │                          │  │
            │  │  - Create      │  │  - Mint/Burn             │  │
            │  │  - Join        │  │  - Transfer              │  │
            │  │  - Complete    │  │  - Balance tracking      │  │
            │  │  - Verify      │  │                          │  │
            │  └────────────────┘  └──────────────────────────┘  │
            │  ┌────────────────┐  ┌──────────────────────────┐  │
            │  │  Prediction    │  │  Treasury Contract       │  │
            │  │   Market       │  │  - Stake management      │  │
            │  │  - Place bet   │  │  - Reward distribution   │  │
            │  │  - Settle      │  │  - Fee collection        │  │
            │  │  - Calculate   │  │                          │  │
            │  └────────────────┘  └──────────────────────────┘  │
            └────────────────────────────────────────────────────┘
```

---

## 🔷 NEO Smart Contract Design

### 1. MissionStake Contract (Core Contract)

**Purpose**: Quản lý toàn bộ lifecycle của missions

**Contract Structure (C#)**:
```csharp
namespace MissionStake
{
    [DisplayName("MissionStake")]
    [ManifestExtra("Author", "MissionStake Team")]
    [ManifestExtra("Email", "dev@missionstake.io")]
    [SupportedStandards("NEP-17")]
    public class MissionStakeContract : SmartContract
    {
        // Storage Keys
        private static readonly string PREFIX_MISSION = "mission";
        private static readonly string PREFIX_USER = "user";
        private static readonly string PREFIX_PARTICIPANT = "participant";
        private static readonly string PREFIX_EVIDENCE = "evidence";
        
        // Events
        [DisplayName("MissionCreated")]
        public static event Action<UInt160, ByteString, BigInteger> OnMissionCreated;
        
        [DisplayName("MissionJoined")]
        public static event Action<ByteString, UInt160, BigInteger> OnMissionJoined;
        
        [DisplayName("MissionCompleted")]
        public static event Action<ByteString, UInt160> OnMissionCompleted;
        
        [DisplayName("EvidenceSubmitted")]
        public static event Action<ByteString, UInt160, string> OnEvidenceSubmitted;
        
        // Mission Structure
        public class Mission
        {
            public ByteString Id;
            public UInt160 Creator;
            public string Title;
            public string Description;
            public BigInteger StakeAmount;
            public BigInteger StartTime;
            public BigInteger EndTime;
            public string Difficulty; // easy, medium, hard
            public string Category;
            public string Status; // active, completed, failed
            public BigInteger Progress;
            public List<UInt160> Participants;
        }
        
        // Core Functions
        public static ByteString CreateMission(
            string title,
            string description,
            BigInteger stakeAmount,
            BigInteger duration,
            string difficulty,
            string category
        )
        {
            // Verify caller has enough reputation tokens
            // Create mission ID
            // Store mission data
            // Transfer stake to contract
            // Emit event
            // Return mission ID
        }
        
        public static bool JoinMission(ByteString missionId, BigInteger stakeAmount)
        {
            // Verify mission exists and is active
            // Verify user has enough reputation tokens
            // Add user to participants
            // Transfer stake to contract
            // Emit event
            // Return success
        }
        
        public static bool SubmitEvidence(
            ByteString missionId,
            string evidenceUrl,
            string description
        )
        {
            // Verify user is participant
            // Verify mission is active
            // Store evidence
            // Update progress
            // Emit event
            // Return success
        }
        
        public static bool CompleteMission(ByteString missionId)
        {
            // Verify mission deadline
            // Verify evidence submitted
            // Calculate rewards
            // Distribute rewards to participants
            // Update reputation scores
            // Update mission status
            // Emit event
            // Return success
        }
        
        public static bool FailMission(ByteString missionId)
        {
            // Verify mission deadline passed
            // Verify insufficient evidence
            // Burn staked tokens
            // Decrease reputation
            // Update mission status
            // Return success
        }
        
        // Query Functions
        public static Mission GetMission(ByteString missionId)
        {
            // Retrieve and return mission data
        }
        
        public static List<ByteString> GetUserMissions(UInt160 userAddress)
        {
            // Return list of mission IDs for user
        }
        
        public static List<ByteString> GetActiveMissions()
        {
            // Return list of all active mission IDs
        }
    }
}
```

### 2. ReputationToken Contract (NEP-17)

**Purpose**: Token đại diện cho uy tín của người dùng

**Key Features**:
```csharp
namespace MissionStake.Reputation
{
    public class ReputationTokenContract : Nep17Token
    {
        public override string Symbol => "REP";
        public override byte Decimals => 8;
        
        // Mint reputation (only by MissionStake contract)
        public static bool Mint(UInt160 account, BigInteger amount)
        {
            // Verify caller is MissionStake contract
            // Increase balance
            // Emit Transfer event
        }
        
        // Burn reputation (only by MissionStake contract)
        public static bool Burn(UInt160 account, BigInteger amount)
        {
            // Verify caller is MissionStake contract
            // Decrease balance
            // Emit Transfer event
        }
        
        // Get reputation level based on balance
        public static BigInteger GetLevel(UInt160 account)
        {
            BigInteger balance = BalanceOf(account);
            return balance / 1000; // Level = balance / 1000
        }
        
        // Transfer with restrictions (reputation có thể transfer được)
        public override bool Transfer(UInt160 from, UInt160 to, BigInteger amount, object data)
        {
            // Standard NEP-17 transfer
            // Additional validation if needed
        }
    }
}
```

### 3. PredictionMarket Contract

**Purpose**: Quản lý prediction market cho missions

```csharp
namespace MissionStake.Prediction
{
    public class PredictionMarketContract : SmartContract
    {
        public class Prediction
        {
            public ByteString MissionId;
            public UInt160 Predictor;
            public bool PredictSuccess; // true = success, false = fail
            public BigInteger Amount;
            public BigInteger Timestamp;
            public bool Settled;
        }
        
        // Place prediction
        public static ByteString PlacePrediction(
            ByteString missionId,
            bool predictSuccess,
            BigInteger amount
        )
        {
            // Verify mission exists and is active
            // Verify user has enough tokens
            // Create prediction record
            // Lock prediction amount
            // Calculate odds
            // Return prediction ID
        }
        
        // Settle predictions when mission completes
        public static bool SettlePredictions(ByteString missionId, bool missionSuccess)
        {
            // Verify only MissionStake contract can call
            // Get all predictions for mission
            // Calculate winners and losers
            // Distribute rewards to winners
            // Burn losing predictions
            // Mark all as settled
        }
        
        // Get prediction stats for a mission
        public static object GetPredictionStats(ByteString missionId)
        {
            // Total amount on success
            // Total amount on failure
            // Number of predictors
            // Current odds
        }
    }
}
```

### 4. Treasury Contract

**Purpose**: Quản lý funds và distribution

```csharp
namespace MissionStake.Treasury
{
    public class TreasuryContract : SmartContract
    {
        // Receive stakes from missions
        public static bool DepositStake(ByteString missionId, UInt160 from, BigInteger amount)
        {
            // Record stake deposit
            // Update mission balance
        }
        
        // Distribute rewards
        public static bool DistributeRewards(
            ByteString missionId,
            List<UInt160> participants,
            BigInteger rewardPerUser
        )
        {
            // Verify caller is MissionStake contract
            // Calculate distribution
            // Transfer tokens to participants
            // Update reputation
        }
        
        // Collect platform fees
        public static bool CollectFee(BigInteger amount)
        {
            // Transfer fee to platform wallet
            // Record transaction
        }
    }
}
```

---

## 🤖 SpoonOS Integration

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              SpoonOS Backend Service                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Configuration Layer                     │    │
│  │  - config.json (LLM providers, NEO RPC, etc)   │    │
│  │  - .env (API keys, private keys)               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           LLM Manager Layer                     │    │
│  │  - OpenAI (gpt-4.1)                            │    │
│  │  - Anthropic (claude-sonnet-4)                 │    │
│  │  - Gemini (gemini-2.5-pro) [fallback]         │    │
│  │  - DeepSeek [optional]                         │    │
│  │                                                 │    │
│  │  Fallback Chain: OpenAI → Anthropic → Gemini  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          Custom Agent Layer                     │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  TaskSuggestionAgent                    │  │    │
│  │  │  - Analyzes user profile                │  │    │
│  │  │  - Generates task recommendations       │  │    │
│  │  │  - Considers skill level, schedule      │  │    │
│  │  │  - Uses Graph workflow for planning     │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  PersonalizedMissionAgent               │  │    │
│  │  │  - Reads user preferences               │  │    │
│  │  │  - Generates 3 mission suggestions      │  │    │
│  │  │  - Reroll capability (3 times/day)      │  │    │
│  │  │  - Reasoning explanation                │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  PredictionAnalysisAgent                │  │    │
│  │  │  - Analyzes mission success probability │  │    │
│  │  │  - Considers user history, difficulty   │  │    │
│  │  │  - Suggests optimal prediction bet      │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  ReputationScoringAgent                 │  │    │
│  │  │  - Calculates reputation changes        │  │    │
│  │  │  - Analyzes evidence quality            │  │    │
│  │  │  - Detects suspicious behavior          │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐  │    │
│  │  │  NEOBlockchainAgent                     │  │    │
│  │  │  - Interacts with NEO smart contracts   │  │    │
│  │  │  - Queries blockchain data              │  │    │
│  │  │  - Submits transactions                 │  │    │
│  │  └─────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          Custom Tools Layer                     │    │
│  │                                                 │    │
│  │  - NEOContractTool (invoke contracts)          │    │
│  │  - NEOQueryTool (query blockchain)             │    │
│  │  - UserProfileTool (fetch user data)           │    │
│  │  - MissionTemplateTool (fetch templates)       │    │
│  │  - EvidenceAnalysisTool (AI validation)        │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          MCP Server Layer                       │    │
│  │  - Exposes tools via Model Context Protocol    │    │
│  │  - stdio/http/websocket transports             │    │
│  │  - Dynamic tool discovery                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          FastAPI Gateway                        │    │
│  │                                                 │    │
│  │  POST /api/ai/suggest-tasks                    │    │
│  │  POST /api/ai/generate-missions                │    │
│  │  POST /api/ai/analyze-prediction               │    │
│  │  POST /api/ai/score-reputation                 │    │
│  │  POST /api/ai/validate-evidence                │    │
│  │                                                 │    │
│  │  GET  /api/neo/mission/:id                     │    │
│  │  POST /api/neo/create-mission                  │    │
│  │  POST /api/neo/join-mission                    │    │
│  │  POST /api/neo/submit-evidence                 │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### SpoonOS Project Structure

```
spoonos-missionstake/
├── .env                          # Environment variables
├── config.json                   # SpoonOS configuration
├── requirements.txt              # Python dependencies
├── main.py                       # FastAPI application entry
│
├── agents/                       # Custom agents
│   ├── __init__.py
│   ├── task_suggestion.py       # TaskSuggestionAgent
│   ├── personalized_mission.py  # PersonalizedMissionAgent
│   ├── prediction_analysis.py   # PredictionAnalysisAgent
│   ├── reputation_scoring.py    # ReputationScoringAgent
│   └── neo_blockchain.py        # NEOBlockchainAgent
│
├── tools/                        # Custom tools
│   ├── __init__.py
│   ├── neo_contract.py          # NEO contract interaction
│   ├── neo_query.py             # NEO blockchain queries
│   ├── user_profile.py          # User data management
│   ├── mission_template.py      # Mission templates
│   └── evidence_analysis.py     # Evidence validation
│
├── api/                          # FastAPI routes
│   ├── __init__.py
│   ├── ai_routes.py             # AI endpoints
│   ├── neo_routes.py            # NEO blockchain endpoints
│   └── health.py                # Health check
│
├── config/                       # Configuration
│   ├── __init__.py
│   ├── neo_config.py            # NEO network config
│   └── llm_config.py            # LLM provider config
│
├── models/                       # Data models
│   ├── __init__.py
│   ├── mission.py               # Mission models
│   ├── user.py                  # User models
│   └── prediction.py            # Prediction models
│
├── utils/                        # Utilities
│   ├── __init__.py
│   ├── neo_helper.py            # NEO blockchain helpers
│   └── ai_helper.py             # AI processing helpers
│
└── tests/                        # Test suite
    ├── test_agents.py
    ├── test_tools.py
    └── test_api.py
```

### Configuration Files

#### config.json
```json
{
  "api_keys": {
    "openai": "${OPENAI_API_KEY}",
    "anthropic": "${ANTHROPIC_API_KEY}",
    "gemini": "${GEMINI_API_KEY}",
    "deepseek": "${DEEPSEEK_API_KEY}"
  },
  "llm_providers": {
    "openai": {
      "api_key": "${OPENAI_API_KEY}",
      "model": "gpt-4.1",
      "max_tokens": 4096,
      "temperature": 0.7
    },
    "anthropic": {
      "api_key": "${ANTHROPIC_API_KEY}",
      "model": "claude-sonnet-4-20250514",
      "max_tokens": 4096,
      "temperature": 0.7,
      "enable_prompt_cache": true
    },
    "gemini": {
      "api_key": "${GEMINI_API_KEY}",
      "model": "gemini-2.5-pro",
      "max_tokens": 4096,
      "temperature": 0.7
    }
  },
  "llm_settings": {
    "default_provider": "openai",
    "fallback_chain": ["openai", "anthropic", "gemini"],
    "enable_monitoring": true,
    "enable_caching": true
  },
  "neo_config": {
    "network": "testnet",
    "rpc_url": "https://testnet1.neo.org:443",
    "magic": 844378958,
    "contract_addresses": {
      "mission_stake": "${MISSION_STAKE_CONTRACT}",
      "reputation_token": "${REPUTATION_TOKEN_CONTRACT}",
      "prediction_market": "${PREDICTION_MARKET_CONTRACT}",
      "treasury": "${TREASURY_CONTRACT}"
    },
    "wallet": {
      "address": "${NEO_WALLET_ADDRESS}",
      "private_key": "${NEO_PRIVATE_KEY}"
    }
  },
  "default_agent": "task_suggestion_agent",
  "agents": {
    "task_suggestion_agent": {
      "class": "TaskSuggestionAgent",
      "tools": ["user_profile", "mission_template", "neo_query"],
      "llm_provider": "openai",
      "max_suggestions": 20
    },
    "personalized_mission_agent": {
      "class": "PersonalizedMissionAgent",
      "tools": ["user_profile", "neo_query"],
      "llm_provider": "anthropic",
      "max_missions": 3
    },
    "prediction_analysis_agent": {
      "class": "PredictionAnalysisAgent",
      "tools": ["neo_query", "user_profile"],
      "llm_provider": "openai"
    },
    "reputation_scoring_agent": {
      "class": "ReputationScoringAgent",
      "tools": ["neo_query", "evidence_analysis"],
      "llm_provider": "anthropic"
    }
  },
  "api_settings": {
    "host": "0.0.0.0",
    "port": 8000,
    "cors_origins": ["http://localhost:5173", "http://localhost:3000"],
    "rate_limit": 100
  }
}
```

#### .env
```bash
# LLM API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-claude-key
GEMINI_API_KEY=your-gemini-api-key
DEEPSEEK_API_KEY=your-deepseek-key

# NEO Network Configuration
NEO_NETWORK=testnet
NEO_RPC_URL=https://testnet1.neo.org:443
NEO_WALLET_ADDRESS=your-neo-wallet-address
NEO_PRIVATE_KEY=your-neo-private-key-hex

# Smart Contract Addresses (will be filled after deployment)
MISSION_STAKE_CONTRACT=0x...
REPUTATION_TOKEN_CONTRACT=0x...
PREDICTION_MARKET_CONTRACT=0x...
TREASURY_CONTRACT=0x...

# Database (optional - for caching)
DATABASE_URL=postgresql://user:pass@localhost:5432/missionstake

# Redis (optional - for session management)
REDIS_URL=redis://localhost:6379

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Security
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# Feature Flags
ENABLE_PREDICTION_MARKET=true
ENABLE_AI_VALIDATION=true
ENABLE_CACHING=true
```

---

## 🎨 Frontend Architecture

### Updated Service Layer

```typescript
// src/services/SpoonOSService.ts
export class SpoonOSService {
  private apiUrl: string;

  constructor(apiUrl = 'http://localhost:8000/api') {
    this.apiUrl = apiUrl;
  }

  // AI Task Suggestions
  async getSuggestedTasks(userId: string, filters?: TaskFilters): Promise<SuggestedTask[]> {
    const response = await fetch(`${this.apiUrl}/ai/suggest-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, filters })
    });
    return response.json();
  }

  // Personalized Missions
  async generatePersonalizedMissions(
    userId: string,
    preferences: UserPreferences
  ): Promise<Mission[]> {
    const response = await fetch(`${this.apiUrl}/ai/generate-missions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, preferences })
    });
    return response.json();
  }

  // Reroll mission
  async rerollMission(
    missionId: string,
    reason: string
  ): Promise<Mission> {
    const response = await fetch(`${this.apiUrl}/ai/reroll-mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, reason })
    });
    return response.json();
  }

  // Prediction Analysis
  async analyzePrediction(
    missionId: string,
    userId: string
  ): Promise<PredictionAnalysis> {
    const response = await fetch(`${this.apiUrl}/ai/analyze-prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, userId })
    });
    return response.json();
  }

  // Evidence Validation
  async validateEvidence(
    missionId: string,
    evidenceUrl: string,
    description: string
  ): Promise<ValidationResult> {
    const response = await fetch(`${this.apiUrl}/ai/validate-evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, evidenceUrl, description })
    });
    return response.json();
  }
}

// src/services/NEOService.ts
export class NEOService {
  private apiUrl: string;
  private walletAddress: string | null = null;

  constructor(apiUrl = 'http://localhost:8000/api/neo') {
    this.apiUrl = apiUrl;
  }

  // Connect wallet
  async connectWallet(): Promise<string> {
    // Integrate with Neo Line or O3 wallet
    const address = await window.NEOLine.getAccount();
    this.walletAddress = address;
    return address;
  }

  // Create Mission
  async createMission(missionData: MissionCreate): Promise<string> {
    const response = await fetch(`${this.apiUrl}/create-mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...missionData,
        walletAddress: this.walletAddress
      })
    });
    const { missionId, txHash } = await response.json();
    return missionId;
  }

  // Join Mission
  async joinMission(missionId: string, stakeAmount: number): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/join-mission`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionId,
        stakeAmount,
        walletAddress: this.walletAddress
      })
    });
    return response.json();
  }

  // Submit Evidence
  async submitEvidence(
    missionId: string,
    evidenceUrl: string,
    description: string
  ): Promise<boolean> {
    const response = await fetch(`${this.apiUrl}/submit-evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionId,
        evidenceUrl,
        description,
        walletAddress: this.walletAddress
      })
    });
    return response.json();
  }

  // Get Mission
  async getMission(missionId: string): Promise<Mission> {
    const response = await fetch(`${this.apiUrl}/mission/${missionId}`);
    return response.json();
  }

  // Get User Missions
  async getUserMissions(userAddress: string): Promise<Mission[]> {
    const response = await fetch(`${this.apiUrl}/user/${userAddress}/missions`);
    return response.json();
  }

  // Get Active Missions
  async getActiveMissions(): Promise<Mission[]> {
    const response = await fetch(`${this.apiUrl}/missions/active`);
    return response.json();
  }

  // Get Reputation Balance
  async getReputationBalance(address: string): Promise<number> {
    const response = await fetch(`${this.apiUrl}/reputation/${address}`);
    const { balance } = await response.json();
    return balance;
  }

  // Place Prediction
  async placePrediction(
    missionId: string,
    predictSuccess: boolean,
    amount: number
  ): Promise<string> {
    const response = await fetch(`${this.apiUrl}/place-prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionId,
        predictSuccess,
        amount,
        walletAddress: this.walletAddress
      })
    });
    const { predictionId } = await response.json();
    return predictionId;
  }
}
```

### Updated Components

**AITaskSuggestions.tsx** - Replace Gemini with SpoonOS:
```typescript
// Replace GeminiAIService with SpoonOSService
import { SpoonOSService } from '../services/SpoonOSService';

const spoonOSService = new SpoonOSService();

// In component:
const handleGenerateTasks = async () => {
  setLoading(true);
  try {
    const tasks = await spoonOSService.getSuggestedTasks(user.id, {
      category: selectedCategory,
      difficulty: selectedDifficulty,
      maxResults: 20
    });
    setSuggestedTasks(tasks);
  } catch (error) {
    console.error('Error generating tasks:', error);
  } finally {
    setLoading(false);
  }
};
```

**PersonalizedMissionGenerator.tsx** - Use SpoonOS:
```typescript
const handleGenerateMissions = async () => {
  setLoading(true);
  try {
    const missions = await spoonOSService.generatePersonalizedMissions(
      user.id,
      userPreferences
    );
    setPersonalizedMissions(missions);
  } catch (error) {
    console.error('Error generating missions:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 🔄 Data Flow

### 1. Mission Creation Flow
```
User (Frontend)
    │
    ├─> SpoonOS: Generate mission suggestions (AI)
    │       └─> LLM analyzes user profile, returns suggestions
    │
    ├─> User selects/customizes mission
    │
    └─> NEO Blockchain: Create mission
            ├─> Validate user has enough reputation
            ├─> Transfer stake to Treasury contract
            ├─> Store mission data on-chain
            └─> Emit MissionCreated event
                    └─> Frontend updates UI
```

### 2. Join Mission Flow
```
User (Frontend)
    │
    ├─> NEO Blockchain: Get mission details
    │       └─> Returns mission data
    │
    ├─> SpoonOS: Analyze prediction (optional)
    │       ├─> Analyzes mission difficulty
    │       ├─> Checks user history
    │       └─> Suggests optimal strategy
    │
    ├─> User confirms join + optional prediction
    │
    └─> NEO Blockchain: Execute join
            ├─> Add user to participants
            ├─> Transfer stake to Treasury
            ├─> (If prediction) Place prediction bet
            └─> Emit events
                    └─> Frontend updates UI
```

### 3. Evidence Submission Flow
```
User (Frontend)
    │
    ├─> Upload evidence (image/video/text)
    │       └─> IPFS or cloud storage
    │
    ├─> SpoonOS: Validate evidence (AI)
    │       ├─> Analyzes content quality
    │       ├─> Checks relevance to mission
    │       └─> Returns validation score
    │
    ├─> NEO Blockchain: Submit evidence
    │       ├─> Store evidence URL + hash
    │       ├─> Update mission progress
    │       └─> Emit EvidenceSubmitted event
    │
    └─> SpoonOS: Update reputation score
            └─> Calculate reputation change
```

### 4. Mission Completion Flow
```
Automated Process (Backend Cron/Oracle)
    │
    ├─> Check missions approaching deadline
    │
    ├─> For each mission:
    │       │
    │       ├─> NEO Blockchain: Get mission + evidence
    │       │
    │       ├─> SpoonOS: Analyze completion
    │       │       ├─> Validates all evidence
    │       │       ├─> Checks completion criteria
    │       │       └─> Returns success/fail decision
    │       │
    │       └─> NEO Blockchain: Complete/Fail mission
    │               ├─> If success:
    │               │   ├─> Distribute rewards to participants
    │               │   ├─> Settle predictions
    │               │   └─> Increase reputation
    │               │
    │               └─> If fail:
    │                   ├─> Burn staked tokens
    │                   ├─> Settle predictions
    │                   └─> Decrease reputation
    │
    └─> Frontend: Listen to events and update UI
```

---

## 🔒 Security Considerations

### 1. Smart Contract Security
- ✅ **Access Control**: Only authorized contracts can mint/burn reputation
- ✅ **Reentrancy Protection**: Use NEO's built-in protections
- ✅ **Integer Overflow**: C# has built-in overflow checks
- ✅ **Input Validation**: Validate all user inputs
- ✅ **Event Logging**: Comprehensive event emission for transparency
- ✅ **Upgrade Pattern**: Implement proxy pattern for future upgrades

### 2. SpoonOS Backend Security
- ✅ **API Authentication**: JWT tokens for user authentication
- ✅ **Rate Limiting**: Prevent abuse of AI endpoints
- ✅ **Input Sanitization**: Validate all inputs before processing
- ✅ **API Key Protection**: Store in environment variables
- ✅ **CORS Configuration**: Whitelist only trusted origins
- ✅ **Data Encryption**: Encrypt sensitive data at rest

### 3. Frontend Security
- ✅ **Wallet Integration**: Use official NEO wallets (NeoLine, O3)
- ✅ **Transaction Signing**: All tx signed by user wallet
- ✅ **XSS Protection**: Sanitize user inputs
- ✅ **HTTPS Only**: Force HTTPS in production
- ✅ **Content Security Policy**: Implement CSP headers

### 4. AI Security
- ✅ **Prompt Injection**: Sanitize user inputs to LLMs
- ✅ **Output Validation**: Verify AI responses before using
- ✅ **Cost Control**: Implement rate limiting on expensive AI calls
- ✅ **Model Fallback**: Multiple LLM providers for reliability

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation Setup (Week 1-2)
**Deliverables**:
- [ ] NEO development environment setup
- [ ] NEO wallet creation and testnet GAS funding
- [ ] SpoonOS installation and configuration
- [ ] Basic FastAPI project structure
- [ ] Frontend service layer updates

**Tasks**:
1. Install NEO development tools (neo-devpack-dotnet)
2. Setup Visual Studio with Neo Blockchain Toolkit
3. Clone and configure spoon-core repository
4. Create NEO testnet wallet
5. Fund wallet with testnet GAS
6. Setup config.json and .env files
7. Test SpoonOS with basic examples
8. Create API project structure

### Phase 2: Smart Contract Development (Week 3-4)
**Deliverables**:
- [ ] MissionStake contract (C#)
- [ ] ReputationToken contract (NEP-17)
- [ ] PredictionMarket contract
- [ ] Treasury contract
- [ ] Contract unit tests
- [ ] Deployment scripts

**Tasks**:
1. Write MissionStake contract
2. Write ReputationToken contract
3. Write PredictionMarket contract
4. Write Treasury contract
5. Write comprehensive unit tests
6. Deploy to NEO testnet
7. Verify contract functionality
8. Document contract addresses

### Phase 3: SpoonOS Agent Development (Week 5-6)
**Deliverables**:
- [ ] TaskSuggestionAgent
- [ ] PersonalizedMissionAgent
- [ ] PredictionAnalysisAgent
- [ ] ReputationScoringAgent
- [ ] NEOBlockchainAgent
- [ ] Custom tools for NEO interaction
- [ ] Agent unit tests

**Tasks**:
1. Implement TaskSuggestionAgent
2. Implement PersonalizedMissionAgent
3. Implement PredictionAnalysisAgent
4. Implement ReputationScoringAgent
5. Implement NEOBlockchainAgent
6. Create NEO custom tools
7. Write agent integration tests
8. Setup MCP server

### Phase 4: API Gateway Development (Week 7)
**Deliverables**:
- [ ] FastAPI endpoints for AI operations
- [ ] FastAPI endpoints for NEO operations
- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] Error handling
- [ ] API documentation (Swagger)

**Tasks**:
1. Implement AI routes
2. Implement NEO routes
3. Setup authentication
4. Configure rate limiting
5. Add error handling
6. Generate API docs
7. Integration testing

### Phase 5: Frontend Integration (Week 8-9)
**Deliverables**:
- [ ] Updated SpoonOSService
- [ ] Updated NEOService
- [ ] Wallet connection component
- [ ] Updated AITaskSuggestions component
- [ ] Updated PersonalizedMissionGenerator
- [ ] NEO transaction handling
- [ ] Loading states and error handling

**Tasks**:
1. Create SpoonOSService
2. Create NEOService
3. Integrate NeoLine wallet
4. Update AI components
5. Add transaction confirmation UI
6. Handle loading and errors
7. Test end-to-end flows

### Phase 6: Testing & Optimization (Week 10)
**Deliverables**:
- [ ] Smart contract security audit
- [ ] API load testing
- [ ] Frontend E2E tests
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] Documentation

**Tasks**:
1. Security audit contracts
2. Load test APIs
3. E2E testing with Playwright
4. Optimize LLM calls (caching)
5. Fix identified bugs
6. Write user documentation

### Phase 7: Deployment & Launch (Week 11-12)
**Deliverables**:
- [ ] Smart contracts on NEO MainNet
- [ ] SpoonOS backend deployed
- [ ] Frontend deployed
- [ ] Monitoring setup
- [ ] Launch documentation

**Tasks**:
1. Deploy contracts to MainNet
2. Deploy backend to production server
3. Deploy frontend to hosting
4. Setup monitoring (logs, metrics)
5. Create launch materials
6. Soft launch to beta users
7. Gather feedback

---

## 📊 Key Metrics & Monitoring

### Smart Contract Metrics
- Mission creation rate
- Mission completion rate
- Average stake amount
- Prediction accuracy
- Reputation distribution
- Transaction gas costs

### AI Agent Metrics
- Task suggestion quality (user acceptance rate)
- Personalized mission generation time
- Prediction analysis accuracy
- Evidence validation accuracy
- LLM API costs
- Fallback usage frequency

### System Performance
- API response times
- NEO RPC latency
- Frontend load time
- Concurrent users
- Error rates
- Uptime

---

## 🔧 Development Tools

### NEO Development
- **neo-devpack-dotnet**: Smart contract development kit
- **Visual Studio**: IDE with Neo Blockchain Toolkit
- **neo-express**: Local blockchain for testing
- **NeoLine**: Browser wallet extension
- **O3 Wallet**: Mobile wallet

### SpoonOS Development
- **Python 3.11+**: Backend language
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **pytest**: Testing framework
- **neo-python**: NEO SDK for Python

### Frontend Development
- **Vite**: Build tool (existing)
- **React + TypeScript**: Framework (existing)
- **neo-dapi**: NEO wallet integration
- **Tailwind CSS**: Styling (existing)

---

## 💰 Cost Estimation

### Development Costs
- **Smart Contract Development**: 2-3 weeks
- **SpoonOS Integration**: 2-3 weeks
- **Frontend Updates**: 1-2 weeks
- **Testing & Security**: 1-2 weeks
- **Total Development Time**: 6-10 weeks

### Operational Costs (Monthly)
- **NEO Transaction Fees**: ~$50-100 (testnet free)
- **LLM API Costs**:
  - OpenAI: $100-500
  - Anthropic: $100-500
  - Gemini: $0-100 (free tier)
- **Server Hosting**: $50-200
- **Database/Redis**: $20-50
- **Monitoring Tools**: $20-50
- **Total Monthly**: $340-1,400

### Cost Optimization
- Use prompt caching (Anthropic) to reduce costs
- Implement aggressive caching strategy
- Use Gemini free tier as fallback
- Batch operations when possible
- Monitor and optimize expensive calls

---

## 📚 Resources

### NEO Documentation
- [NEO Developer Portal](https://developers.neo.org/)
- [neo-devpack-dotnet](https://github.com/neo-project/neo-devpack-dotnet)
- [NEO Smart Contract Tutorial](https://docs.neo.org/docs/n3/develop/write/basics)
- [NEP-17 Standard](https://github.com/neo-project/proposals/blob/master/nep-17.mediawiki)

### SpoonOS Documentation
- [SpoonOS GitHub](https://github.com/XSpoonAi/spoon-core)
- [SpoonOS Configuration Guide](https://github.com/XSpoonAi/spoon-core/blob/main/doc/configuration.md)
- [SpoonOS Agent Guide](https://github.com/XSpoonAi/spoon-core/blob/main/doc/agent.md)
- [SpoonOS Graph System](https://github.com/XSpoonAi/spoon-core/blob/main/doc/graph_agent.md)

### Integration Guides
- [NEO Wallet Integration](https://neoline.io/dapi/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

## 🎯 Success Criteria

### Technical Milestones
- ✅ All smart contracts deployed and verified on NEO testnet
- ✅ All SpoonOS agents operational with <2s response time
- ✅ Frontend successfully interacts with NEO blockchain
- ✅ AI suggestions have >70% user acceptance rate
- ✅ System handles 100+ concurrent users
- ✅ <1% error rate on critical operations

### Business Milestones
- ✅ 100+ missions created in first month
- ✅ 500+ active users
- ✅ 80%+ mission completion rate
- ✅ Positive user feedback (4+ stars)
- ✅ Monthly operational costs <$1,000

---

## 📞 Next Steps

1. **Review this architecture document**
2. **Set up development environment**
3. **Begin Phase 1: Foundation Setup**
4. **Weekly progress reviews**
5. **Iterative development and testing**

---

**Document Version**: 1.0  
**Last Updated**: November 15, 2025  
**Author**: MissionStake Development Team  
**Status**: Ready for Implementation
