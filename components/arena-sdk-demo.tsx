"use client"

import { useState, useEffect } from 'react';
import { useArena } from '@/components/arena-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, User, Activity, ArrowRightLeft } from 'lucide-react';

export function ArenaSdkDemo() {
  const { sdk, isConnected, address, userProfile, isInitialized } = useArena();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  // Fetch balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (!sdk || !isConnected) return;
      
      try {
        const balanceWei = await sdk.sendRequest('getWalletBalance');
        const balanceAvax = parseInt(balanceWei, 16) / Math.pow(10, 18);
        setBalance(balanceAvax.toFixed(4));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    fetchBalance();
  }, [sdk, isConnected]);

  const handleConnect = async () => {
    if (!sdk) return;
    
    setLoading(true);
    try {
      await sdk.connect();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!sdk) return;
    
    try {
      await sdk.disconnect();
      setBalance(null);
      setLastTransaction(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const handleTestTransaction = async () => {
    if (!sdk || !isConnected) return;
    
    setLoading(true);
    try {
      const txHash = await sdk.provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f',
          value: '0x16345785d8a0000', // 0.1 AVAX
        }]
      });
      
      setLastTransaction(txHash);
      console.log('Transaction sent:', txHash);
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetProfile = async () => {
    if (!sdk) return;
    
    try {
      const profile = await sdk.sendRequest('getUserProfile');
      console.log('User Profile:', profile);
    } catch (error) {
      console.error('Failed to get profile:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-400">Initializing Arena SDK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-orange-500" />
          Arena SDK Integration Demo
        </h3>
        <Badge className={`${isConnected ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2 flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-orange-500" />
            Wallet Status
          </h4>
          {isConnected ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-300">
                <span className="text-zinc-500">Address:</span> {address?.slice(0, 10)}...{address?.slice(-8)}
              </p>
              <p className="text-sm text-zinc-300">
                <span className="text-zinc-500">Balance:</span> {balance || 'Loading...'} AVAX
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Not connected to wallet</p>
          )}
        </div>

        <div className="bg-zinc-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2 flex items-center">
            <User className="w-4 h-4 mr-2 text-orange-500" />
            User Profile
          </h4>
          {userProfile ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-300">
                <span className="text-zinc-500">Username:</span> {userProfile.username}
              </p>
              <p className="text-sm text-zinc-300">
                <span className="text-zinc-500">ID:</span> {userProfile.id}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">No profile data</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        ) : (
          <>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="border-zinc-700 text-zinc-400 hover:text-white hover:border-orange-500"
            >
              Disconnect
            </Button>
            
            <Button
              onClick={handleTestTransaction}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Test Transaction'}
            </Button>
            
            <Button
              onClick={handleGetProfile}
              variant="outline"
              className="border-zinc-700 text-zinc-400 hover:text-white hover:border-orange-500"
            >
              <User className="w-4 h-4 mr-2" />
              Get Profile
            </Button>
          </>
        )}
      </div>

      {/* Last Transaction */}
      {lastTransaction && (
        <div className="bg-zinc-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Last Transaction</h4>
          <p className="text-sm text-zinc-300 font-mono break-all">
            {lastTransaction}
          </p>
        </div>
      )}

      {/* SDK Events Log */}
      <div className="bg-zinc-800 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-2">SDK Events</h4>
        <div className="text-xs text-zinc-400 space-y-1">
          <p>✅ Arena SDK initialized</p>
          {isConnected && <p>✅ Wallet connected</p>}
          {userProfile && <p>✅ User profile loaded</p>}
          {balance && <p>✅ Balance fetched</p>}
          {lastTransaction && <p>✅ Transaction sent</p>}
        </div>
      </div>

      {/* Arena SDK Info */}
      <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-4">
        <p>Arena SDK v1.0.0 - Integration demo for AVAX Gaming Platform</p>
        <p>This component demonstrates Arena SDK wallet integration, user profiles, and transactions.</p>
      </div>
    </div>
  );
} 