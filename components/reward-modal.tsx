"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle2, Trophy, Coins, ArrowRightLeft } from "lucide-react"

interface RewardModalProps {
  isOpen: boolean
  onClose: () => void
  mission: {
    title: string
    fromToken: string
    toToken: string
    fromAmount: string
    completedSwaps: number
    totalSwaps: number
    reward: number
    completed: boolean
  } | null
}

export function RewardModal({ isOpen, onClose, mission }: RewardModalProps) {
  if (!mission) return null

  const isFullyCompleted = mission.completedSwaps >= mission.totalSwaps

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <div className="text-center space-y-6 py-4">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 ${isFullyCompleted ? "bg-green-600" : "bg-orange-600"} rounded-full flex items-center justify-center`}
            >
              {isFullyCompleted ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <ArrowRightLeft className="w-10 h-10 text-white" />
              )}
            </div>
          </div>

          {/* Swap Completed */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isFullyCompleted ? "Mission Completed!" : "Swap Successful!"}
            </h2>
            <p className="text-zinc-400">{mission.title}</p>
          </div>

          {/* Swap Details */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex justify-between mb-3">
              <span className="text-zinc-400">Swapped</span>
              <span className="font-semibold">
                {mission.fromAmount} {mission.fromToken}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Received</span>
              <span className="font-semibold">
                {(
                  Number(mission.fromAmount) *
                  (mission.fromToken === "USDC" && mission.toToken === "AVAX"
                    ? 0.067
                    : mission.fromToken === "ETH" && mission.toToken === "BTC"
                      ? 0.06
                      : mission.fromToken === "AVAX" && mission.toToken === "JOE"
                        ? 30
                        : mission.fromToken === "USDT" && mission.toToken === "ETH"
                          ? 0.0005
                          : mission.fromToken === "BTC" && mission.toToken === "AVAX"
                            ? 600
                            : mission.fromToken === "JOE" && mission.toToken === "USDC"
                              ? 0.2
                              : 1)
                ).toFixed(4)}{" "}
                {mission.toToken}
              </span>
            </div>
          </div>

          {/* Progress Display */}
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <h3 className="font-semibold mb-2">Mission Progress</h3>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <span className="text-orange-500 font-bold">{mission.completedSwaps}</span>
              <span className="text-zinc-400">/</span>
              <span className="text-white">{mission.totalSwaps} swaps</span>
            </div>
          </div>

          {/* Reward Display (only if fully completed) */}
          {isFullyCompleted && (
            <div className="bg-gradient-to-r from-orange-900/50 to-orange-800/50 rounded-lg p-6 border border-orange-700/50">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Trophy className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-semibold">Reward Earned</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Coins className="w-8 h-8 text-orange-500" />
                <span className="text-3xl font-bold text-orange-500">{mission.reward}</span>
                <span className="text-xl font-semibold text-white">WLD</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold"
            >
              {isFullyCompleted ? "Continue" : "Continue Swapping"}
            </Button>
            {!isFullyCompleted && (
              <div className="text-xs text-zinc-400 text-center">
                Complete {mission.totalSwaps - mission.completedSwaps} more swaps to earn {mission.reward} WLD
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
