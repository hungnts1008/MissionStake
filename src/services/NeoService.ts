/**
 * NEO Blockchain Service - Frontend
 * Mock mode for MVP - no backend/blockchain required
 * All data stored in React state (resets on page reload)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ============================================
// MOCK MODE CONFIGURATION
// ============================================
const USE_MOCK_MODE = true; // Set to false to use real backend

export interface NeoBlockchainStatus {
  network: string;
  rpc: string;
  blockHeight: number;
  status: string;
  walletAddress?: string;
  balance?: {
    neo: string;
    gas: string;
  };
}

export interface NeOMission {
  mission_id: number;
  creator: string;
  title: string;
  description: string;
  reward_amount: number;
  deadline: number;
  category: string;
  status: number; // 0=PENDING, 1=IN_PROGRESS, 2=COMPLETED, 3=VERIFIED, 4=CANCELLED
  assigned_user?: string;
  created_at: number;
  completed_at?: number;
  verified_at?: number;
  proof?: string;
}

export interface CreateMissionRequest {
  creator: string;
  title: string;
  description: string;
  reward_amount: number;
  deadline: number;
  category: string;
}

export interface MissionActionResult {
  success: boolean;
  txHash?: string;
  message?: string;
  error?: string;
}

export class NeoService {
  private walletAddress: string = 'NWWkFU3dKWTHNpxjz8MRgt5eKe1Ld834xQ'; // Default mock wallet
  private mockMissionCounter: number = 100; // For generating IDs

  /**
   * Set current user's NEO wallet address
   */
  setWalletAddress(address: string) {
    this.walletAddress = address;
  }

  /**
   * Get current wallet address
   */
  getWalletAddress(): string | null {
    return this.walletAddress;
  }

  /**
   * Generate mock transaction hash
   */
  private generateMockTxHash(): string {
    return `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
  }

  /**
   * Get NEO blockchain status
   */
  async getBlockchainStatus(): Promise<NeoBlockchainStatus> {
    if (USE_MOCK_MODE) {
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      return {
        network: 'NEO N3 TestNet',
        rpc: 'http://seed1t5.neo.org:20332',
        blockHeight: 11108000 + Math.floor(Math.random() * 1000),
        status: 'connected',
        walletAddress: this.walletAddress,
        balance: {
          neo: '0.0000005',
          gas: '50.0'
        }
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/neo/status`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Failed to get NEO status:', error);
      throw new Error(error.message || 'Failed to connect to NEO blockchain');
    }
  }

  /**
   * Create a new mission on NEO blockchain
   */
  async createMission(missionData: CreateMissionRequest): Promise<{
    success: boolean;
    missionId?: number;
    txHash?: string;
    error?: string;
  }> {
    if (USE_MOCK_MODE) {
      // Mock mode: simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const missionId = ++this.mockMissionCounter;
      const txHash = this.generateMockTxHash();
      
      console.log('✅ Mock mission created:', { missionId, txHash, missionData });
      
      return {
        success: true,
        missionId,
        txHash,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/neo/create-mission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.detail || 'Failed to create mission',
        };
      }

      return {
        success: true,
        missionId: result.missionId,
        txHash: result.txHash,
      };
    } catch (error: any) {
      console.error('Create mission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create mission',
      };
    }
  }

  /**
   * Get mission details
   */
  async getMission(missionId: number): Promise<NeOMission | null> {
    if (USE_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock mission data
      return {
        mission_id: missionId,
        creator: this.walletAddress,
        title: `Mission #${missionId}`,
        description: 'Mock mission description',
        reward_amount: 10,
        deadline: Date.now() + 86400000,
        category: 'fitness',
        status: 0, // PENDING
        assigned_user: '',
        created_at: Date.now() - 3600000,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get mission error:', error);
      return null;
    }
  }

  /**
   * Accept a mission
   */
  async acceptMission(missionId: number, userAddress?: string): Promise<MissionActionResult> {
    if (USE_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const txHash = this.generateMockTxHash();
      console.log('✅ Mock mission accepted:', { missionId, txHash });
      
      return {
        success: true,
        txHash,
        message: 'Mission accepted successfully',
      };
    }

    try {
      const user = userAddress || this.walletAddress;
      
      if (!user) {
        return {
          success: false,
          error: 'Wallet address not set. Please connect your NEO wallet first.',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.detail || 'Failed to accept mission',
        };
      }

      return {
        success: result.success,
        txHash: result.txHash,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Accept mission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to accept mission',
      };
    }
  }

  /**
   * Complete a mission with proof
   */
  async completeMission(
    missionId: number,
    proof: string,
    userAddress?: string
  ): Promise<MissionActionResult> {
    if (USE_MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const txHash = this.generateMockTxHash();
      console.log('✅ Mock mission completed:', { missionId, proof, txHash });
      
      return {
        success: true,
        txHash,
        message: 'Mission completed, awaiting verification',
      };
    }

    try {
      const user = userAddress || this.walletAddress;
      
      if (!user) {
        return {
          success: false,
          error: 'Wallet address not set',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, proof }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.detail || 'Failed to complete mission',
        };
      }

      return {
        success: result.success,
        txHash: result.txHash,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Complete mission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete mission',
      };
    }
  }

  /**
   * Verify a completed mission
   */
  async verifyMission(
    missionId: number,
    approved: boolean,
    verifierAddress?: string
  ): Promise<MissionActionResult> {
    try {
      const verifier = verifierAddress || this.walletAddress;
      
      if (!verifier) {
        return {
          success: false,
          error: 'Wallet address not set',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/missions/${missionId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verifier, approved }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.detail || 'Failed to verify mission',
        };
      }

      return {
        success: result.success,
        txHash: result.txHash,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Verify mission error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify mission',
      };
    }
  }

  /**
   * Get all missions for a user
   */
  async getUserMissions(userAddress?: string): Promise<{
    missionIds: number[];
    missions: NeOMission[];
    count: number;
  } | null> {
    try {
      const user = userAddress || this.walletAddress;
      
      if (!user) {
        throw new Error('Wallet address not set');
      }

      const response = await fetch(`${API_BASE_URL}/api/missions/user/${user}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get user missions error:', error);
      return null;
    }
  }

  /**
   * Get total mission count
   */
  async getMissionCount(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/missions/count`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return result.count || 0;
    } catch (error: any) {
      console.error('Get mission count error:', error);
      return 0;
    }
  }

  /**
   * Check if service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const neoService = new NeoService();
