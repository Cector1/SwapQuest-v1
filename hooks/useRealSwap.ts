"use client"

import { useState, useCallback } from 'react';
import { useWorldCoin } from '@/hooks/useWorldCoin';
import { ethers } from 'ethers';
import { 
  createRealBlockchainIntegration, 
  RealSwapParams, 
  RealSwapQuote 
} from '@/lib/real-blockchain-integration';

export interface RealSwapHook {
  isLoading: boolean;
  error: string | null;
  quote: RealSwapQuote | null;
  getSwapQuote: (params: Omit<RealSwapParams, 'userAddress'>) => Promise<RealSwapQuote | null>;
  executeSwap: (params: Omit<RealSwapParams, 'userAddress'>) => Promise<string | null>;
  clearError: () => void;
}

export function useRealSwap(): RealSwapHook {
  const { isConnected, userAddress, executeSwap: worldCoinSwap } = useWorldCoin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<RealSwapQuote | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create ethers provider for World Chain
  const getEthersProvider = useCallback(() => {
    // Use World Chain RPC endpoint
    return new ethers.JsonRpcProvider('https://worldchain-mainnet.g.alchemy.com/public');
  }, []);

  const getSwapQuote = useCallback(async (params: Omit<RealSwapParams, 'userAddress'>): Promise<RealSwapQuote | null> => {
    if (!isConnected || !userAddress) {
      setError('WorldCoin wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Getting REAL swap quote on World Chain via WorldCoin...', params);
      
      const provider = getEthersProvider();
      
      // For quotes we only need the provider (read-only)
      const blockchain = createRealBlockchainIntegration(provider, null);
      
      const swapParams: RealSwapParams = {
        ...params,
        userAddress,
      };

      const swapQuote = await blockchain.getSwapQuote(swapParams);
      setQuote(swapQuote);
      
      console.log('REAL swap quote received from World Chain:', swapQuote);
      return swapQuote;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get real swap quote on World Chain';
      console.error('Real swap quote error on World Chain:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress, getEthersProvider]);

  const executeSwap = useCallback(async (params: Omit<RealSwapParams, 'userAddress'>): Promise<string | null> => {
    if (!isConnected || !userAddress) {
      setError('WorldCoin wallet not connected');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Executing REAL swap on World Chain via WorldCoin MiniKit...', params);
      
      // Use WorldCoin's executeSwap method which handles World Chain transactions
      const swapParams = {
        tokenIn: getTokenAddress(params.fromToken),
        tokenOut: getTokenAddress(params.toToken),
        amountIn: parseTokenAmount(params.amount, params.fromToken),
        amountOutMinimum: calculateMinimumOutput(params.amount, params.fromToken, params.toToken, params.slippage),
        fee: 3000, // 0.3% fee tier for Uniswap V3
        recipient: userAddress
      };

      const result = await worldCoinSwap(swapParams);

      if (result.success) {
        console.log('REAL swap executed on World Chain via WorldCoin!');
        console.log('Transaction Hash:', result.transactionHash);
        console.log('View on World Chain explorer:', `https://worldscan.org/tx/${result.transactionHash}`);
        
        // Clear quote after successful swap
        setQuote(null);
        
        return result.transactionHash;
      } else {
        throw new Error('Transaction failed on World Chain');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute real swap on World Chain';
      console.error('Real swap execution error on World Chain:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress, worldCoinSwap]);

  // Helper function to get token addresses on World Chain
  const getTokenAddress = (tokenSymbol: string): string => {
    const addresses: Record<string, string> = {
      'ETH': '0x0000000000000000000000000000000000000000',
      'WETH': '0x4200000000000000000000000000000000000006',
      'WLD': '0x163f8C2467924be0ae7B5347228CABF260318753',
      'USDC': '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1'
    };
    
    const address = addresses[tokenSymbol.toUpperCase()];
    if (!address) {
      throw new Error(`Token ${tokenSymbol} not supported on World Chain`);
    }
    
    return address;
  };

  // Helper function to parse token amounts
  const parseTokenAmount = (amount: string, tokenSymbol: string): string => {
    const decimals = getTokenDecimals(tokenSymbol);
    return ethers.parseUnits(amount, decimals).toString();
  };

  // Helper function to get token decimals
  const getTokenDecimals = (tokenSymbol: string): number => {
    const decimals: Record<string, number> = {
      'ETH': 18,
      'WETH': 18,
      'WLD': 18,
      'USDC': 6
    };
    
    return decimals[tokenSymbol.toUpperCase()] || 18;
  };

  // Helper function to calculate minimum output with slippage
  const calculateMinimumOutput = (amount: string, fromToken: string, toToken: string, slippage: number): string => {
    // Simplified rate calculation for World Chain
    const rates: Record<string, Record<string, number>> = {
      'ETH': {
        'WLD': 2000,
        'USDC': 3000
      },
      'WLD': {
        'ETH': 0.0005,
        'USDC': 1.5
      },
      'USDC': {
        'ETH': 0.00033,
        'WLD': 0.67
      }
    };
    
    const rate = rates[fromToken.toUpperCase()]?.[toToken.toUpperCase()] || 1;
    const estimatedOutput = parseFloat(amount) * rate;
    const minimumOutput = estimatedOutput * (100 - slippage) / 100;
    
    const decimals = getTokenDecimals(toToken);
    return ethers.parseUnits(minimumOutput.toString(), decimals).toString();
  };

  return {
    isLoading,
    error,
    quote,
    getSwapQuote,
    executeSwap,
    clearError
  };
} 