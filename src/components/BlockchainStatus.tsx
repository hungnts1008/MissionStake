import { useState, useEffect } from 'react';
import { web3Service } from '../services/Web3Service';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

export function BlockchainStatus() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-detect if already connected
    checkConnection();
  }, []);

  const checkConnection = () => {
    setConnected(web3Service.getConnectionStatus());
  };

  const handleConnect = async () => {
    setLoading(true);
    const result = await web3Service.connect();
    
    if (result.success && result.address) {
      setConnected(true);
      setAddress(result.address);
    } else {
      console.log('Blockchain not available:', result.error);
    }
    
    setLoading(false);
  };

  // If MetaMask not available, don't show anything
  if (!web3Service.isMetaMaskAvailable()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="p-3 bg-white shadow-lg">
        {connected ? (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500">
              🟢 Blockchain Connected
            </Badge>
            {address && (
              <span className="text-xs text-gray-600">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            )}
          </div>
        ) : (
          <Button 
            size="sm" 
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? 'Connecting...' : '🔗 Connect Wallet'}
          </Button>
        )}
      </Card>
    </div>
  );
}
