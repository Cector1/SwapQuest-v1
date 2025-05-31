"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WldBalanceContextType {
  balance: number
  addEarning: (amount: number, mission: string, txHash: string) => void
  earnings: WldEarning[]
  totalEarned: number
}

interface WldEarning {
  id: string
  date: string
  mission: string
  amount: number
  txHash: string
}

const WldBalanceContext = createContext<WldBalanceContextType>({
  balance: 0,
  addEarning: () => {},
  earnings: [],
  totalEarned: 0,
})

export function WldBalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1250) // Starting balance
  const [earnings, setEarnings] = useState<WldEarning[]>([
    {
      id: '1',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      mission: 'USDC to AVAX Swap',
      amount: 25,
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
    },
    {
      id: '2',
      date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      mission: 'Daily Quest Completion',
      amount: 50,
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
    {
      id: '3',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      mission: 'Weekly Challenge',
      amount: 100,
      txHash: '0x567890abcdef1234567890abcdef1234567890ab',
    },
  ])

  const totalEarned = earnings.reduce((sum, earning) => sum + earning.amount, 0)

  const addEarning = (amount: number, mission: string, txHash: string) => {
    const newEarning: WldEarning = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mission,
      amount,
      txHash,
    }
    
    setEarnings(prev => [newEarning, ...prev])
    setBalance(prev => prev + amount)
  }

  return (
    <WldBalanceContext.Provider value={{
      balance,
      addEarning,
      earnings,
      totalEarned,
    }}>
      {children}
    </WldBalanceContext.Provider>
  )
}

export function useWldBalance() {
  const context = useContext(WldBalanceContext)
  if (!context) {
    throw new Error('useWldBalance must be used within a WldBalanceProvider')
  }
  return context
} 