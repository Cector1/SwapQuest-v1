"use client"

import { useWldBalance } from "@/hooks/useArenaBalance"
import { Coins, TrendingUp, Zap, Crown, Flame, Star } from "lucide-react"
import { motion } from "framer-motion"

export function WldBalanceDisplay() {
  const { balance, totalEarned, earnings } = useWldBalance()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative group"
    >
      {/* Main Balance Card */}
      <div className="relative bg-gradient-to-br from-background/90 via-card/95 to-accent/10 backdrop-blur-lg border border-border rounded-2xl p-6 overflow-hidden shadow-xl">
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-radial from-primary to-transparent rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -3, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-radial from-chart-1 to-transparent rounded-full blur-xl"
          />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-chart-1 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Coins className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-3 bg-clip-text text-transparent">
                WLD Balance
              </h2>
              <p className="text-muted-foreground font-medium text-sm">Your WorldCoin Rewards</p>
            </div>
          </div>
          
          <div className="text-right">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl font-bold text-foreground"
            >
              {balance.toLocaleString()}
            </motion.div>
            <div className="text-sm text-primary font-medium">WLD</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: TrendingUp, label: "Total Earned", value: totalEarned.toLocaleString(), color: "from-primary to-chart-1" },
            { icon: Star, label: "Recent Earnings", value: earnings.length, color: "from-chart-1 to-chart-3" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-md`}>
                  <stat.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Earnings */}
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-chart-1" />
            <span>Recent Earnings</span>
          </h3>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {earnings.slice(0, 3).map((earning, index) => (
              <motion.div
                key={earning.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{earning.mission}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(earning.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="w-3 h-3 text-chart-1" />
                  <span className="text-sm font-bold text-foreground">+{earning.amount}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
