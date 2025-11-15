import { ethers } from 'ethers';

// Contract ABIs (simplified - chỉ functions cần dùng)
const PREDICTION_MARKET_ABI = [
  "function createPrediction(string _title, string _ipfsMetadata, uint256 _duration) payable returns (uint256)",
  "function submitEvidence(uint256 _predictionId, string _ipfsHash) returns (uint256)",
  "function recordAIVerification(uint256 _predictionId, uint256 _evidenceId, bool _approved, uint8 _confidence)",
  "function voteOnEvidence(uint256 _predictionId, uint256 _evidenceId, bool _approve)",
  "function finalizePrediction(uint256 _predictionId)",
  "function predictions(uint256) view returns (address creator, string title, string ipfsMetadata, uint256 stake, uint256 deadline, bool finalized, bool outcome, uint256 createdAt)",
  "function getEvidenceCount(uint256 _predictionId) view returns (uint256)",
  "function getEvidence(uint256 _predictionId, uint256 _evidenceId) view returns (string ipfsHash, uint256 timestamp, bool aiApproved, uint8 aiConfidence, uint256 approveVotes, uint256 rejectVotes, bool finalized)",
  "event PredictionCreated(uint256 indexed predictionId, address indexed creator, uint256 stake)",
  "event EvidenceSubmitted(uint256 indexed predictionId, uint256 evidenceId, string ipfsHash)",
  "event AIVerificationRecorded(uint256 indexed predictionId, uint256 evidenceId, bool approved, uint8 confidence)",
  "event VoteCast(uint256 indexed predictionId, uint256 evidenceId, address voter, bool approve)",
  "event PredictionFinalized(uint256 indexed predictionId, bool outcome)"
];

const REPUTATION_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private predictionMarketContract: ethers.Contract | null = null;
  private reputationTokenContract: ethers.Contract | null = null;
  private isConnected: boolean = false;

  /**
   * Check if MetaMask is available
   */
  isMetaMaskAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  /**
   * Connect to MetaMask
   */
  async connect(): Promise<{ success: boolean; address?: string; error?: string }> {
    try {
      if (!this.isMetaMaskAvailable() || !window.ethereum) {
        return { 
          success: false, 
          error: 'MetaMask not installed. App will work in offline mode.' 
        };
      }

      // Request account access
      this.provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await this.provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        return { success: false, error: 'No accounts found' };
      }

      this.signer = await this.provider.getSigner();
      
      // Initialize contracts
      const marketAddress = import.meta.env.VITE_PREDICTION_MARKET_ADDRESS;
      const tokenAddress = import.meta.env.VITE_REPUTATION_TOKEN_ADDRESS;

      if (!marketAddress || !tokenAddress) {
        return { 
          success: false, 
          error: 'Contract addresses not configured. Please deploy contracts first.' 
        };
      }

      this.predictionMarketContract = new ethers.Contract(
        marketAddress,
        PREDICTION_MARKET_ABI,
        this.signer
      );

      this.reputationTokenContract = new ethers.Contract(
        tokenAddress,
        REPUTATION_TOKEN_ABI,
        this.signer
      );

      this.isConnected = true;

      return { 
        success: true, 
        address: accounts[0] 
      };
    } catch (error: any) {
      console.error('Web3 connection error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to connect to MetaMask' 
      };
    }
  }

  /**
   * Create a new prediction on blockchain
   */
  async createPrediction(
    title: string,
    ipfsMetadata: string,
    durationInSeconds: number,
    stakeInEth: string
  ): Promise<{ success: boolean; predictionId?: number; txHash?: string; error?: string }> {
    try {
      if (!this.isConnected || !this.predictionMarketContract) {
        return { 
          success: false, 
          error: 'Not connected to blockchain. Mission created in offline mode.' 
        };
      }

      const tx = await this.predictionMarketContract.createPrediction(
        title,
        ipfsMetadata,
        durationInSeconds,
        { value: ethers.parseEther(stakeInEth) }
      );

      const receipt = await tx.wait();
      
      // Extract predictionId from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.predictionMarketContract!.interface.parseLog(log);
          return parsed?.name === 'PredictionCreated';
        } catch {
          return false;
        }
      });

      let predictionId = 0;
      if (event) {
        const parsed = this.predictionMarketContract.interface.parseLog(event);
        predictionId = Number(parsed!.args.predictionId);
      }

      return {
        success: true,
        predictionId,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Create prediction error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create prediction on blockchain'
      };
    }
  }

  /**
   * Submit evidence to blockchain
   */
  async submitEvidence(
    predictionId: number,
    ipfsHash: string
  ): Promise<{ success: boolean; evidenceId?: number; txHash?: string; error?: string }> {
    try {
      if (!this.isConnected || !this.predictionMarketContract) {
        return { 
          success: false, 
          error: 'Not connected. Evidence saved locally only.' 
        };
      }

      const tx = await this.predictionMarketContract.submitEvidence(
        predictionId,
        ipfsHash
      );

      const receipt = await tx.wait();

      // Extract evidenceId from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.predictionMarketContract!.interface.parseLog(log);
          return parsed?.name === 'EvidenceSubmitted';
        } catch {
          return false;
        }
      });

      let evidenceId = 0;
      if (event) {
        const parsed = this.predictionMarketContract.interface.parseLog(event);
        evidenceId = Number(parsed!.args.evidenceId);
      }

      return {
        success: true,
        evidenceId,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Submit evidence error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit evidence to blockchain'
      };
    }
  }

  /**
   * Record AI verification on blockchain
   */
  async recordAIVerification(
    predictionId: number,
    evidenceId: number,
    approved: boolean,
    confidence: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.isConnected || !this.predictionMarketContract) {
        return { success: false, error: 'Not connected' };
      }

      const tx = await this.predictionMarketContract.recordAIVerification(
        predictionId,
        evidenceId,
        approved,
        Math.floor(confidence)
      );

      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Record AI verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Vote on evidence
   */
  async voteOnEvidence(
    predictionId: number,
    evidenceId: number,
    approve: boolean
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.isConnected || !this.predictionMarketContract) {
        return { success: false, error: 'Not connected' };
      }

      const tx = await this.predictionMarketContract.voteOnEvidence(
        predictionId,
        evidenceId,
        approve
      );

      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Vote error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Finalize prediction
   */
  async finalizePrediction(
    predictionId: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.isConnected || !this.predictionMarketContract) {
        return { success: false, error: 'Not connected' };
      }

      const tx = await this.predictionMarketContract.finalizePrediction(predictionId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Finalize prediction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(address: string): Promise<string> {
    try {
      if (!this.isConnected || !this.reputationTokenContract) {
        return '0';
      }

      const balance = await this.reputationTokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Get balance error:', error);
      return '0';
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect
   */
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.predictionMarketContract = null;
    this.reputationTokenContract = null;
    this.isConnected = false;
  }
}

// Export singleton instance
export const web3Service = new Web3Service();
