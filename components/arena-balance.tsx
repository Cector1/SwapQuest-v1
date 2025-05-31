"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWldBalance } from "@/hooks/useArenaBalance"
import { Coins, TrendingUp, Zap, Star } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export function WldBalance() {
  const { balance: localBalance, earnings } = useWldBalance()
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaimRewards = async () => {
    setIsClaiming(true)
    try {
      // Simulate claiming process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Rewards claimed successfully!")
    } catch (error) {
      toast.error("Failed to claim rewards")
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Main Balance Card */}
      <div className="relative bg-gradient-to-br from-background/90 via-card/95 to-accent/10 backdrop-blur-lg border border-border rounded-2xl p-6 overflow-hidden shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-chart-1 rounded-xl flex items-center justify-center shadow-lg">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">WLD Balance</h3>
              <p className="text-muted-foreground text-sm">Your WorldCoin Rewards</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {localBalance.toLocaleString()} WLD
            </div>
            <div className="text-sm text-muted-foreground">
              Total Earned
            </div>
          </div>
        </div>

        {/* Claim Button */}
        <Button
          onClick={handleClaimRewards}
          disabled={isClaiming}
          className="w-full bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-bold py-3 rounded-xl shadow-lg border-0"
        >
          {isClaiming ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Claiming...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Claim Rewards
            </>
          )}
        </Button>
      </div>

      {/* Recent Earnings */}
      <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-4">
        <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-chart-1" />
          <span>Recent Earnings</span>
        </h4>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {earnings.slice(0, 3).map((earning) => (
            <div
              key={earning.id}
              className="flex items-center justify-between p-2 bg-background/50 rounded-lg"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{earning.mission}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(earning.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-primary font-semibold">+{earning.amount} WLD</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-3/10 backdrop-blur-sm border border-primary/30 rounded-xl p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div className="text-lg font-bold text-foreground">
              {earnings.length}
            </div>
            <div className="text-xs text-muted-foreground">Missions Completed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-chart-1" />
            </div>
            <div className="text-lg font-bold text-foreground">
              {earnings.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Earned</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
