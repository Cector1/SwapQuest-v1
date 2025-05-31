"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Wallet, TrendingUp, Coins, Zap, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useTokenSwap } from "@/hooks/useTokenSwap"
import { toast } from "sonner"

export function TokenSwapInterface() {
  const {
    isConnected,
    userAddress,
    swapStats,
    isLoading,
    error,
    connect,
    buyTokens,
    sellTokens,
    calculateTokensForAvax,
    calculateAvaxForTokens,
    refreshStats
  } = useTokenSwap()

  const [swapMode, setSwapMode] = useState<"buy" | "sell">("buy")
  const [inputAmount, setInputAmount] = useState("")
  const [isTransacting, setIsTransacting] = useState(false)

  const handleSwap = async () => {
    if (!inputAmount || Number(inputAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      setIsTransacting(true)
      let txHash: string

      if (swapMode === "buy") {
        txHash = await buyTokens(inputAmount)
        toast.success(`Successfully bought tokens! TX: ${txHash.slice(0, 10)}...`)
      } else {
        txHash = await sellTokens(inputAmount)
        toast.success(`Successfully sold tokens! TX: ${txHash.slice(0, 10)}...`)
      }

      setInputAmount("")
    } catch (err: any) {
      toast.error(err.message || "Transaction failed")
    } finally {
      setIsTransacting(false)
    }
  }

  const getOutputAmount = () => {
    if (!inputAmount) return "0"
    return swapMode === "buy" 
      ? calculateTokensForAvax(inputAmount)
      : calculateAvaxForTokens(inputAmount)
  }

  const getMaxAmount = () => {
    if (swapMode === "buy") {
      return parseFloat(swapStats.userAvaxBalance).toFixed(4)
    } else {
      return parseFloat(swapStats.userTokenBalance).toFixed(4)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      {/* Main Swap Card */}
      <Card className="bg-gradient-to-br from-black/80 via-zinc-900/90 to-orange-950/80 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-orange-500/20">
        <CardHeader className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/50">
              <ArrowUpDown className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Token Swap
            </CardTitle>
          </motion.div>
          
          {!isConnected ? (
            <Button
              onClick={connect}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/30"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </Badge>
              <Button
                onClick={refreshStats}
                variant="outline"
                size="sm"
                className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          )}
        </CardHeader>

        {isConnected && (
          <CardContent className="space-y-6">
            {/* Swap Mode Toggle */}
            <div className="flex bg-black/40 backdrop-blur-sm border border-orange-500/20 rounded-xl p-1">
              <Button
                onClick={() => setSwapMode("buy")}
                variant={swapMode === "buy" ? "default" : "ghost"}
                className={`flex-1 ${
                  swapMode === "buy"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "text-orange-300 hover:text-orange-200"
                }`}
              >
                Buy Tokens
              </Button>
              <Button
                onClick={() => setSwapMode("sell")}
                variant={swapMode === "sell" ? "default" : "ghost"}
                className={`flex-1 ${
                  swapMode === "sell"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "text-orange-300 hover:text-orange-200"
                }`}
              >
                Sell Tokens
              </Button>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-black/30 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-orange-300 font-medium">
                    {swapMode === "buy" ? "Pay with AVAX" : "Sell MTK Tokens"}
                  </span>
                  <span className="text-sm text-orange-400">
                    Balance: {swapMode === "buy" ? swapStats.userAvaxBalance : swapStats.userTokenBalance}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className="bg-black/50 border-orange-500/30 text-white placeholder-orange-300/50 text-lg"
                  />
                  <Button
                    onClick={() => setInputAmount(getMaxAmount())}
                    variant="outline"
                    className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                  >
                    MAX
                  </Button>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                >
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </motion.div>
              </div>

              {/* Output Section */}
              <div className="bg-black/30 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-orange-300 font-medium">
                    {swapMode === "buy" ? "Receive MTK Tokens" : "Receive AVAX"}
                  </span>
                  <span className="text-sm text-orange-400">
                    Rate: 1 AVAX = {swapStats.rate} MTK
                  </span>
                </div>
                <div className="text-2xl font-bold text-white bg-black/50 border border-orange-500/20 rounded-lg p-3">
                  {getOutputAmount()}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={!inputAmount || Number(inputAmount) <= 0 || isTransacting}
              className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-red-500 hover:to-red-600 text-white font-bold py-4 text-lg rounded-xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
            >
              {isTransacting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Zap className="w-5 h-5 mr-2" />
              )}
              {isTransacting ? "Processing..." : `${swapMode === "buy" ? "Buy" : "Sell"} Tokens`}
            </Button>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Stats Cards */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mt-6"
        >
          <Card className="bg-black/40 backdrop-blur-sm border border-orange-500/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Coins className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 font-medium">Contract Tokens</span>
              </div>
              <div className="text-xl font-bold text-white">
                {parseFloat(swapStats.contractTokenBalance).toFixed(2)} MTK
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border border-orange-500/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <span className="text-orange-300 font-medium">Contract AVAX</span>
              </div>
              <div className="text-xl font-bold text-white">
                {parseFloat(swapStats.contractAvaxBalance).toFixed(4)} AVAX
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
} 