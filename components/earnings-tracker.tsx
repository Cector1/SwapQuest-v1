"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorldCoin } from "@/hooks/useWorldCoin"
import { TrendingUp, Calendar, Coins, Trophy } from "lucide-react"

interface Earning {
  id: string
  date: string
  amount: number
  type: 'swap' | 'mission' | 'bonus'
  description: string
}

export function EarningsTracker() {
  const { isConnected } = useWorldCoin()
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)

  useEffect(() => {
    if (isConnected) {
      // Mock earnings data
      const mockEarnings: Earning[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          amount: 25,
          type: 'swap',
          description: 'USDC → AVAX Swap'
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString(),
          amount: 50,
          type: 'mission',
          description: 'Daily Mission Complete'
        },
        {
          id: '3',
          date: new Date(Date.now() - 172800000).toISOString(),
          amount: 100,
          type: 'bonus',
          description: 'Weekly Bonus'
        }
      ]
      
      setEarnings(mockEarnings)
      setTotalEarnings(mockEarnings.reduce((sum, earning) => sum + earning.amount, 0))
    }
  }, [isConnected])

  if (!isConnected) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Connect your WorldCoin wallet to view earnings</p>
        </CardContent>
      </Card>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap': return <TrendingUp className="w-4 h-4" />
      case 'mission': return <Trophy className="w-4 h-4" />
      case 'bonus': return <Coins className="w-4 h-4" />
      default: return <Coins className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-primary/20 text-primary'
      case 'mission': return 'bg-chart-1/20 text-chart-1'
      case 'bonus': return 'bg-chart-3/20 text-chart-3'
      default: return 'bg-muted/20 text-muted-foreground'
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-primary" />
          <span>Earnings Tracker</span>
        </CardTitle>
        <div className="text-2xl font-bold text-foreground">
          {totalEarnings} WLD
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {earnings.map((earning) => (
          <div key={earning.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTypeColor(earning.type)}`}>
                {getTypeIcon(earning.type)}
              </div>
              <div>
                <p className="font-medium text-foreground">{earning.description}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(earning.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="font-semibold">
              +{earning.amount} WLD
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
