"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LearningHub } from "./learning-hub"
import { MissionsSystem } from "./missions-system"
import { LoadingScreen } from "./loading-screen"
import { useWorldCoin } from "@/hooks/useWorldCoin"
import { 
  BookOpen, 
  Trophy,
  Zap,
  TrendingUp,
  Users,
  Star,
  Target
} from 'lucide-react'

export function MainContent() {
  const [activeTab, setActiveTab] = useState("missions")
  const { isLoading, isInstalled } = useWorldCoin()

  // Show loading screen while WorldCoin initializes
  if (isLoading) {
    return <LoadingScreen message="Inicializando WorldCoin..." showDetails={true} />
  }

  const tabs = [
    { 
      id: "missions", 
      label: "Misiones", 
      icon: Target
    },
    { 
      id: "knowledge", 
      label: "Conocimiento", 
      icon: BookOpen
    }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "missions":
        return <MissionsSystem />
      case "knowledge":
        return <LearningHub />
      default:
        return <MissionsSystem />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 pt-20 pb-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content - Mobile optimized with larger slides */}
      <div className="relative z-10 px-4 max-w-md mx-auto">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-card/70 backdrop-blur-lg border border-border rounded-2xl p-1 shadow-lg w-full">
            <div className="grid grid-cols-2 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-chart-1 text-primary-foreground shadow-md'
                      : 'text-primary hover:text-primary/80 hover:bg-secondary/20'
                  }`}
                >
                  <span className="flex flex-col items-center space-y-1">
                    <tab.icon className="w-6 h-6" />
                    <span className="text-sm leading-tight">{tab.label}</span>
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {renderContent()}
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 mb-6"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Target className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-lg font-bold text-blue-600">13</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Misiones</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-lg font-bold text-purple-600">6</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Lecciones</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-lg font-bold text-yellow-600">4.9</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
