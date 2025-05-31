"use client"

import { useState, useCallback, useEffect } from 'react'
import { useWorldCoin } from '@/hooks/useWorldCoin'
import { CONTRACTS } from '@/lib/contracts'

export interface Mission {
  id: number
  fromToken: string
  toToken: string
  fromAmount: bigint
  requiredSwaps: number
  rewardAmount: bigint
  isActive: boolean
  expiryTime: number
}

export interface UserProgress {
  completedSwaps: number
  lastSwapTime: number
  claimed: boolean
}

export function useSwapQuest() {
  const { isConnected, userAddress, sendTransaction } = useWorldCoin()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [wldBalance, setWldBalance] = useState('0')
  const [wldTokenBalance, setWldTokenBalance] = useState('0')

  // Mock balances for demo
  useEffect(() => {
    if (isConnected) {
      setWldBalance('125.5')
      setWldTokenBalance('1250.0')
    } else {
      setWldBalance('0')
      setWldTokenBalance('0')
    }
  }, [isConnected])

  // Record a swap transaction using WorldCoin
  const recordSwap = async (missionId: number, amount: string) => {
    if (!isConnected || !userAddress) {
      throw new Error('WorldCoin wallet not connected')
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log('Recording swap via WorldCoin:', { missionId, amount, userAddress })

      // Send transaction via WorldCoin MiniKit
      const result = await sendTransaction({
        to: CONTRACTS.SWAP_QUEST,
        value: '0', // No ETH value for this call
        data: `0x${missionId.toString(16).padStart(64, '0')}${amount.padStart(64, '0')}` // Encoded function call
      })

      if (result.success) {
        console.log('Swap recorded successfully:', result.hash)
        
        // Update local balance (in real app, this would come from contract)
        setWldBalance(prev => (parseFloat(prev) + 25).toString())
        
        return result.hash
      } else {
        throw new Error('Transaction failed')
      }
    } catch (err: any) {
      console.error('Swap recording failed:', err)
      setError(err.message || 'Transaction failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // State
    isLoading,
    error,
    isConnected,
    userAddress,
    
    // Balances
    wldBalance,
    wldTokenBalance,
    
    // Functions
    recordSwap,
    clearError,
    
    // Refetch functions (mock for now)
    refetchBalances: async () => {
      console.log('Refreshing balances...')
    },
    
    // Transaction status (mock)
    isPending: false,
    isConfirming: false,
    isConfirmed: false,
    transactionHash: undefined,
  }
} 