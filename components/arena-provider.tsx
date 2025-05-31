"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ArenaAppStoreSdk, initializeArenaSDK } from '@/lib/arena-sdk';

interface ArenaContextType {
  sdk: ArenaAppStoreSdk | null;
  isInitialized: boolean;
  isConnected: boolean;
  address: string | null;
  userProfile: any | null;
}

const ArenaContext = createContext<ArenaContextType>({
  sdk: null,
  isInitialized: false,
  isConnected: false,
  address: null,
  userProfile: null,
});

export function useArena() {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider');
  }
  return context;
}

interface ArenaProviderProps {
  children: ReactNode;
}

export function ArenaProvider({ children }: ArenaProviderProps) {
  const [sdk, setSdk] = useState<ArenaAppStoreSdk | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    // Initialize Arena SDK
    const initSdk = async () => {
      try {
        const arenaConfig = {
          projectId: process.env.NEXT_PUBLIC_ARENA_PROJECT_ID || "demo-project-id",
          metadata: {
            name: "AVAX Arena Gaming Platform",
            description: "A blockchain gaming platform focused on AVAX ecosystem",
            url: typeof window !== 'undefined' ? window.location.href : 'https://localhost:3000',
            icons: ["https://your-app.com/icon.png"]
          }
        };

        const sdkInstance = initializeArenaSDK(arenaConfig);
        setSdk(sdkInstance);

        // Listen for wallet events
        sdkInstance.on('walletChanged', (event: { address: string }) => {
          console.log('Wallet changed:', event.address);
          setAddress(event.address);
          setIsConnected(true);
        });

        sdkInstance.on('disconnect', () => {
          console.log('Wallet disconnected');
          setAddress(null);
          setIsConnected(false);
          setUserProfile(null);
        });

        // Check if already connected
        if (sdkInstance.isConnected()) {
          const account = sdkInstance.getAccount();
          setAddress(account);
          setIsConnected(true);
          
          // Get user profile
          try {
            const profile = await sdkInstance.sendRequest('getUserProfile');
            setUserProfile(profile);
          } catch (error) {
            console.error('Failed to get user profile:', error);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Arena SDK:', error);
      }
    };

    initSdk();
  }, []);

  const value: ArenaContextType = {
    sdk,
    isInitialized,
    isConnected,
    address,
    userProfile,
  };

  return (
    <ArenaContext.Provider value={value}>
      {children}
    </ArenaContext.Provider>
  );
} 