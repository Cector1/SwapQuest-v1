"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowRightLeft, ArrowDown, ExternalLink, AlertCircle, TrendingUp } from "lucide-react"
import { TokenLogo } from "@/components/token-logo"
import { useRealSwap } from "@/hooks/useRealSwap"

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
  mission: {
    id: string
    title: string
    fromToken: string
    toToken: string
    fromAmount: string
    fromAmountValue: number
    completedSwaps: number
    totalSwaps: number
    reward: number
  } | null
  onSwapComplete: (missionId: string) => void
}

// Tasas de conversión hacia AVAX (aproximadas)
const tokenToAvaxRates = {
  USDC: 0.067, // 1 USDC = 0.067 AVAX
  ETH: 67.5, // 1 ETH = 67.5 AVAX
  BTC: 1350, // 1 BTC = 1350 AVAX
  USDT: 0.067, // 1 USDT = 0.067 AVAX
  SOL: 3.2, // 1 SOL = 3.2 AVAX
  MATIC: 0.045, // 1 MATIC = 0.045 AVAX
  LINK: 0.85, // 1 LINK = 0.85 AVAX
  UNI: 0.42, // 1 UNI = 0.42 AVAX
  DOT: 0.38, // 1 DOT = 0.38 AVAX
  ADA: 0.018, // 1 ADA = 0.018 AVAX
  JOE: 0.0085, // 1 JOE = 0.0085 AVAX
}

export function SwapModal({ isOpen, onClose, mission, onSwapComplete }: SwapModalProps) {
  const [isSwapping, setIsSwapping] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const { isLoading, error, quote, getSwapQuote, executeSwap, clearError } = useRealSwap()

  // Get quote when modal opens and mission is available
  useEffect(() => {
    if (isOpen && mission) {
      console.log('Getting quote for mission:', mission)
      getSwapQuote({
        fromToken: mission.fromToken,
        toToken: mission.toToken, // Use mission's target token instead of hardcoded AVAX
        amount: mission.fromAmount,
        slippage: 1 // 1% slippage
      })
    }
  }, [isOpen, mission, getSwapQuote])

  // Clear quote and error when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearError()
      setTxHash(null)
    }
  }, [isOpen, clearError])

  if (!mission) return null

  const handleSwap = async () => {
    setIsSwapping(true)
    clearError()

    try {
      console.log('Executing swap for mission:', mission)
      
      const hash = await executeSwap({
        fromToken: mission.fromToken,
        toToken: mission.toToken, // Use mission's target token
        amount: mission.fromAmount,
        slippage: 1 // 1% slippage
      })

      if (hash) {
        setTxHash(hash)
        console.log('Swap completed with hash:', hash)
        
        // Complete the mission
        onSwapComplete(mission.id)

        // Close modal after showing success
        setTimeout(() => {
          onClose()
          setTxHash(null)
        }, 3000)
      }
    } catch (error) {
      console.error("Swap failed:", error)
    } finally {
      setIsSwapping(false)
    }
  }

  const isQuoteLoading = isLoading && !quote
  const expectedOutput = quote?.amountOut || "Loading..."
  const minimumOutput = quote?.minimumAmountOut || "..."
  const priceImpact = quote?.priceImpact || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center">
            <span className="mr-2">🌍</span>
            Swap on World Chain
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mission Info */}
          <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
            <h3 className="font-semibold text-orange-500 mb-1">{mission.title}</h3>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Reward: {mission.reward} WLD</span>
              <span>
                Progress: {mission.completedSwaps}/{mission.totalSwaps}
              </span>
            </div>
          </div>

          {/* World Chain Notice */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <div className="text-blue-400 text-sm">
              <p className="font-semibold">World Chain Swap</p>
              <p className="text-xs">Using Uniswap V3 on World Chain for real transactions</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* From Token */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">From</span>
              <span className="text-sm text-zinc-400">World Chain</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TokenLogo token={mission.fromToken} size={32} />
                <span className="font-semibold">{mission.fromToken}</span>
              </div>
              <div className="text-right text-lg font-semibold text-white">{mission.fromAmount}</div>
            </div>
            <div className="mt-2 text-xs text-zinc-500 text-right">Fixed amount for this mission</div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* To Token */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">To</span>
              <span className="text-sm text-zinc-400">World Chain</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TokenLogo token={mission.toToken} size={32} />
                <span className="font-semibold">{mission.toToken}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-white">
                  {isQuoteLoading ? "..." : expectedOutput}
                  </div>
                <div className="text-xs text-zinc-500">Expected output</div>
              </div>
            </div>
          </div>

          {/* Swap Details */}
          <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">DEX Protocol</span>
              <span className="text-blue-400">Uniswap V3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Network</span>
              <span className="text-blue-400">World Chain</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Wallet Provider</span>
              <span className="text-blue-400">WorldCoin MiniKit</span>
            </div>
            {quote && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Expected Output</span>
                  <span>{expectedOutput} {mission.toToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Minimum Output</span>
                  <span>{minimumOutput} {mission.toToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Price Impact</span>
                  <span className={priceImpact > 5 ? 'text-red-400' : 'text-green-400'}>
                    {priceImpact.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Slippage Tolerance</span>
                  <span>1.0%</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm border-t border-zinc-700 pt-2">
              <span className="text-orange-400">🌍 {mission.toToken} Output</span>
              <span className="text-orange-400 font-semibold">{expectedOutput} {mission.toToken}</span>
            </div>
          </div>

          {/* Transaction success state */}
          {txHash && (
            <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">World Chain Swap Completed!</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Transaction Hash:</span>
                  <span className="text-green-400 font-mono text-xs">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Network:</span>
                  <span className="text-blue-400">World Chain</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="text-green-400">Confirmed</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-green-600/20">
                <a 
                  href={`https://worldscan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  <span>View on World Chain Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2">
                <p className="text-orange-400 text-xs text-center">
                  🌍 {mission.toToken} received! Mission progress updated.
                </p>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={isSwapping || isQuoteLoading || !!txHash || !!error}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 disabled:opacity-50"
          >
            {isQuoteLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Getting Quote...</span>
              </div>
            ) : isSwapping || isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Executing Swap...</span>
              </div>
            ) : txHash ? (
              <div className="flex items-center space-x-2">
                <span>🌍</span>
                <span>World Chain Swap Completed</span>
              </div>
            ) : error ? (
              <span>Swap Failed - Try Again</span>
            ) : (
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4" />
                <span>Execute Swap on World Chain</span>
                <span>🌍</span>
              </div>
            )}
          </Button>

          <p className="text-xs text-zinc-500 text-center">
            Powered by WorldCoin MiniKit on World Chain 🌍
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

