"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Trophy, Target, Coins, Star, Calendar, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div className="container mx-auto p-4 pt-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="bg-purple-900/50 border-purple-700">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">SwapQuest Hero</CardTitle>
                  <p className="text-purple-300">Level 12 • Avalanche Explorer</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-purple-900/50 border-purple-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-300 flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  Total Missions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">47</div>
                <p className="text-xs text-purple-400">+3 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/50 border-purple-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-300 flex items-center">
                  <Coins className="w-4 h-4 mr-2" />
                  ARENA Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">1,247</div>
                <p className="text-xs text-purple-400">+125 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/50 border-purple-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-300 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">94%</div>
                <p className="text-xs text-purple-400">Excellent!</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="bg-purple-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-amber-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Swap Master</h4>
                    <p className="text-sm text-purple-300">Complete 50 successful swaps</p>
                  </div>
                </div>
                <Badge className="bg-amber-500 text-white">New!</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Daily Grinder</h4>
                    <p className="text-sm text-purple-300">Complete daily missions for 7 days</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-purple-500 text-purple-300">Earned</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-purple-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="text-white">Level Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Level 12</span>
                  <span className="text-purple-300">2,847 / 3,000 XP</span>
                </div>
                <Progress value={94.9} className="h-2" />
              </div>
              <p className="text-sm text-purple-400">153 XP needed for Level 13</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
