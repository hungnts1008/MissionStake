/**
 * IPFS Service - Optional upload to IPFS for immutable storage
 * Falls back to base64/URL if IPFS unavailable
 */

export interface IPFSUploadResult {
  success: boolean;
  ipfsHash?: string;
  url?: string;
  error?: string;
}

class IPFSService {
  private readonly PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
  private readonly PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET || '';
  
  /**
   * Check if IPFS is configured
   */
  isConfigured(): boolean {
    return !!this.PINATA_API_KEY && !!this.PINATA_SECRET;
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      // If IPFS not configured, return base64
      if (!this.isConfigured()) {
        console.log('IPFS not configured, using base64 fallback');
        return await this.convertToBase64(file);
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.PINATA_API_KEY,
          'pinata_secret_api_key': this.PINATA_SECRET,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const ipfsHash = data.IpfsHash;

      return {
        success: true,
        ipfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      };
    } catch (error: any) {
      console.error('IPFS upload error:', error);
      
      // Fallback to base64
      console.log('Falling back to base64 encoding');
      return await this.convertToBase64(file);
    }
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(data: any): Promise<IPFSUploadResult> {
    try {
      if (!this.isConfigured()) {
        return {
          success: true,
          ipfsHash: 'local_' + Date.now(),
          url: 'data:application/json;base64,' + btoa(JSON.stringify(data)),
        };
      }

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.PINATA_API_KEY,
          'pinata_secret_api_key': this.PINATA_SECRET,
        },
        body: JSON.stringify({
          pinataContent: data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinata JSON upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      const ipfsHash = result.IpfsHash;

      return {
        success: true,
        ipfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      };
    } catch (error: any) {
      console.error('IPFS JSON upload error:', error);
      
      // Fallback
      return {
        success: true,
        ipfsHash: 'local_' + Date.now(),
        url: 'data:application/json;base64,' + btoa(JSON.stringify(data)),
      };
    }
  }

  /**
   * Convert file to base64 (fallback)
   */
  private async convertToBase64(file: File): Promise<IPFSUploadResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve({
          success: true,
          ipfsHash: 'base64_' + Date.now(),
          url: base64,
        });
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file',
        });
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get IPFS gateway URL from hash
   */
  getIPFSUrl(ipfsHash: string): string {
    // If it's already a URL or base64, return as-is
    if (ipfsHash.startsWith('http') || ipfsHash.startsWith('data:')) {
      return ipfsHash;
    }

    // If it's a local/base64 identifier, return empty (will use original URL)
    if (ipfsHash.startsWith('local_') || ipfsHash.startsWith('base64_')) {
      return '';
    }

    // Return IPFS gateway URL
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }
}

export const ipfsService = new IPFSService();
