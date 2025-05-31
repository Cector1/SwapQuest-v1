"use client"

import { motion } from "framer-motion"
import { useWorldCoin } from '@/hooks/useWorldCoin'
import { Badge } from './ui/badge'
import { Globe, Shield } from 'lucide-react'

export function Header() {
  const { isInstalled, isWorldCoinUser } = useWorldCoin()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border shadow-md"
    >
      <div className="px-3 py-2">
        <div className="flex items-center justify-center max-w-sm mx-auto">
          {/* WorldCoin Status Badges - Centered */}
          <div className="flex items-center space-x-2">
            {isInstalled && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Badge className="bg-gradient-to-r from-primary to-chart-3 text-primary-foreground border-0 text-xs font-medium shadow-sm px-3 py-1">
                  <Globe className="w-3 h-3 mr-1.5" />
                  WorldCoin App
                </Badge>
              </motion.div>
            )}
            {isWorldCoinUser && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Badge className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground border-0 text-xs font-medium shadow-sm px-3 py-1">
                  <Shield className="w-3 h-3 mr-1.5" />
                  Verified
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${
        isInstalled 
          ? 'from-primary/2 via-chart-3/3 to-chart-1/2' 
          : 'from-secondary/2 via-muted/3 to-secondary/2'
      } pointer-events-none`}></div>
    </motion.header>
  )
} 