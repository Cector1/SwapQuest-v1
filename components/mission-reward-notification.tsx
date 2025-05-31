"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coins, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RewardNotificationProps {
  isVisible: boolean
  amount: number
  missionTitle: string
  onClose: () => void
}

export function MissionRewardNotification({ isVisible, amount, missionTitle, onClose }: RewardNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-900 to-green-800 border border-green-600 rounded-lg p-4 shadow-2xl max-w-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Mission Completed!</h4>
                <p className="text-sm text-green-200">{missionTitle}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Coins className="w-4 h-4 text-orange-500" />
                  <span className="text-lg font-bold text-orange-400">+{amount} WLD</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-green-300 hover:text-white p-1">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
