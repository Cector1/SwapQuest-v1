"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Globe, Shield, Zap } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  showDetails?: boolean
}

export function LoadingScreen({ message = "Cargando...", showDetails = false }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md bg-card/70 backdrop-blur-lg border border-border shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-r from-primary to-chart-1 rounded-full flex items-center justify-center mx-auto"
            >
              <Globe className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                SwapQuest
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                WorldCoin Gaming Platform
              </p>
            </motion.div>

            {/* Loading Spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center space-x-2"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{message}</span>
            </motion.div>

            {/* Details */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">WorldCoin</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">Seguro</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">Rápido</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Conectando con World App...
                </div>
              </motion.div>
            )}

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="w-full h-1 bg-muted rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/3 bg-gradient-to-r from-primary to-chart-1"
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Minimal loading component for smaller spaces
export function MiniLoader({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  )
} 