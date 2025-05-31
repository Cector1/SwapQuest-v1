"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Coins, Info } from "lucide-react"
import { useWorldCoin } from '@/hooks/useWorldCoin'
import { useState, useEffect } from 'react'

export function GetTestAvax() {
  const { isConnected, userAddress } = useWorldCoin()
  const [needsAvax, setNeedsAvax] = useState(false)
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    // Mock balance check for demo
    if (isConnected) {
      const mockBalance = '0.05' // Simulate low balance
      setBalance(mockBalance)
      setNeedsAvax(parseFloat(mockBalance) < 0.1)
    }
  }, [isConnected])

  if (!isConnected) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Coins className="w-5 h-5 text-blue-400" />
        <h3 className="text-blue-400 font-semibold">AVAX Testnet Faucet</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Your AVAX Balance:</span>
          <span className={needsAvax ? 'text-red-400' : 'text-green-400'}>
            {balance ? `${parseFloat(balance).toFixed(4)} AVAX` : 'Loading...'}
          </span>
        </div>
        
        {needsAvax && (
          <div className="flex items-start space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
            <Info className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-400 text-xs">
              You need AVAX to pay for gas fees on real swaps. Get free testnet AVAX below.
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={() => window.open('https://faucet.avax.network', '_blank')}
          variant="outline"
          size="sm"
          className="w-full border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
        >
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4" />
            <span>Get Free AVAX</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </Button>
        
        <p className="text-xs text-zinc-500 text-center">
          Official Avalanche Fuji faucet • Get 2 AVAX per day
        </p>
      </div>
      
      <div className="text-xs text-zinc-600 space-y-1">
        <p><strong>How to use:</strong></p>
        <p>1. Click "Get Free AVAX" above</p>
        <p>2. Connect your wallet on the faucet site</p>
        <p>3. Request 2 AVAX (wait 24h between requests)</p>
        <p>4. Return here and start making real swaps!</p>
      </div>
    </div>
  )
} 