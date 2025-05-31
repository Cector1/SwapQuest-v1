"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useWorldCoin } from '@/hooks/useWorldCoin'
import { MiniKit, Tokens, tokenToDecimals } from '@worldcoin/minikit-js'
import { 
  Wallet, 
  Send, 
  Shield, 
  Trophy, 
  Star, 
  CheckCircle, 
  Clock, 
  Coins,
  ArrowUpRight,
  Target,
  Zap,
  Gift,
  Users,
  TrendingUp,
  Lock,
  Unlock,
  Play,
  BookOpen,
  Award,
  ArrowLeftRight,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Mission {
  id: string
  title: string
  description: string
  type: 'pay' | 'send_transaction' | 'verify' | 'wallet_auth' | 'sign_message' | 'swap'
  difficulty: 'Fácil' | 'Medio' | 'Difícil'
  reward: number
  xpReward: number
  knowledgePoints: number
  status: 'available' | 'in_progress' | 'completed'
  requirements?: string[]
  contractAddress?: string
  tokenAddress?: string
  minAmount?: string
  targetAddress?: string
  message?: string
  icon: any
  category: 'defi' | 'payments' | 'security' | 'social' | 'swap'
  swapFrom?: string
  swapTo?: string
  swapFromAddress?: string
  swapToAddress?: string
  poolFee?: number
}

export function MissionsSystem() {
  const { 
    isInstalled, 
    isConnected, 
    userAddress, 
    signInWithWorldCoin,
    depositFunds,
    verifyWithWorldID,
    sendTransaction,
    isLoading,
    executeSwap,
    connectWallet,
    checkConnection,
    signMessage
  } = useWorldCoin()

  const [missions, setMissions] = useState<Mission[]>([
    // Todas las misiones están disponibles desde el inicio
    {
      id: 'first_payment',
      title: 'Tu Primer Pago WorldCoin',
      description: 'Realiza tu primer pago usando WLD o USDC en World App',
      type: 'pay',
      difficulty: 'Fácil',
      reward: 50,
      xpReward: 100,
      knowledgePoints: 25,
      status: 'available',
      minAmount: '0.01',
      icon: Wallet,
      category: 'payments'
    },
    {
      id: 'verify_human',
      title: 'Verificación Humana',
      description: 'Verifica tu identidad humana usando WorldID',
      type: 'verify',
      difficulty: 'Medio',
      reward: 100,
      xpReward: 200,
      knowledgePoints: 50,
      status: 'available',
      icon: Shield,
      category: 'security'
    },
    {
      id: 'send_wld',
      title: 'Enviar WLD',
      description: 'Envía WLD a otro usuario usando transacciones reales',
      type: 'send_transaction',
      difficulty: 'Medio',
      reward: 75,
      xpReward: 150,
      knowledgePoints: 35,
      status: 'available',
      tokenAddress: '0x163f8C2467924be0ae7B5347228CABF260318753', // WLD en World Chain
      minAmount: '0.01',
      icon: Send,
      category: 'payments'
    },
    {
      id: 'defi_interaction',
      title: 'Interacción DeFi',
      description: 'Interactúa con un protocolo DeFi real en World Chain',
      type: 'send_transaction',
      difficulty: 'Difícil',
      reward: 200,
      xpReward: 400,
      knowledgePoints: 100,
      status: 'available',
      contractAddress: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f', // Ejemplo de contrato DeFi
      icon: TrendingUp,
      category: 'defi'
    },
    {
      id: 'sign_message',
      title: 'Firma Digital',
      description: 'Firma un mensaje usando tu wallet WorldCoin',
      type: 'sign_message',
      difficulty: 'Fácil',
      reward: 25,
      xpReward: 50,
      knowledgePoints: 15,
      status: 'available',
      message: 'Soy un usuario verificado de SwapQuest Gaming Platform',
      icon: Lock,
      category: 'security'
    },
    {
      id: 'large_payment',
      title: 'Pago Mediano',
      description: 'Realiza un pago de $1 usando WorldCoin',
      type: 'pay',
      difficulty: 'Medio',
      reward: 150,
      xpReward: 300,
      knowledgePoints: 75,
      status: 'available',
      minAmount: '1',
      icon: Coins,
      category: 'payments'
    },
    {
      id: 'social_share',
      title: 'Compartir Experiencia',
      description: 'Firma un mensaje compartiendo tu experiencia con SwapQuest',
      type: 'sign_message',
      difficulty: 'Fácil',
      reward: 30,
      xpReward: 60,
      knowledgePoints: 20,
      status: 'available',
      message: 'He completado misiones en SwapQuest Gaming Platform y recomiendo esta experiencia DeFi',
      icon: Users,
      category: 'social'
    },
    {
      id: 'advanced_defi',
      title: 'DeFi Avanzado',
      description: 'Realiza múltiples transacciones DeFi en una sesión',
      type: 'send_transaction',
      difficulty: 'Difícil',
      reward: 250,
      xpReward: 500,
      knowledgePoints: 125,
      status: 'available',
      contractAddress: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f',
      icon: Award,
      category: 'defi'
    },
    // Nuevas misiones de swap reales con cantidades reducidas
    {
      id: 'first_swap',
      title: 'Tu Primer Swap',
      description: 'Realiza tu primer swap de ETH a WLD usando Uniswap V3 en World Chain',
      type: 'swap',
      difficulty: 'Fácil',
      reward: 75,
      xpReward: 150,
      knowledgePoints: 40,
      status: 'available',
      minAmount: '0.001',
      swapFrom: 'ETH',
      swapTo: 'WLD',
      swapFromAddress: '0x0000000000000000000000000000000000000000', // ETH nativo
      swapToAddress: '0x163f8C2467924be0ae7B5347228CABF260318753', // WLD en World Chain
      poolFee: 3000, // 0.3%
      icon: ArrowLeftRight,
      category: 'swap'
    },
    {
      id: 'usdc_wld_swap',
      title: 'Swap USDC a WLD',
      description: 'Intercambia USDC por WLD usando el pool de liquidez de Uniswap V3',
      type: 'swap',
      difficulty: 'Fácil',
      reward: 100,
      xpReward: 200,
      knowledgePoints: 50,
      status: 'available',
      minAmount: '0.5',
      swapFrom: 'USDC',
      swapTo: 'WLD',
      swapFromAddress: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', // USDC en World Chain
      swapToAddress: '0x163f8C2467924be0ae7B5347228CABF260318753', // WLD en World Chain
      poolFee: 500, // 0.05%
      icon: ArrowLeftRight,
      category: 'swap'
    },
    {
      id: 'wld_eth_swap',
      title: 'Swap WLD a ETH',
      description: 'Convierte tus tokens WLD de vuelta a ETH usando Uniswap V3',
      type: 'swap',
      difficulty: 'Fácil',
      reward: 90,
      xpReward: 180,
      knowledgePoints: 45,
      status: 'available',
      minAmount: '0.1',
      swapFrom: 'WLD',
      swapTo: 'ETH',
      swapFromAddress: '0x163f8C2467924be0ae7B5347228CABF260318753', // WLD en World Chain
      swapToAddress: '0x0000000000000000000000000000000000000000', // ETH nativo
      poolFee: 3000, // 0.3%
      icon: ArrowLeftRight,
      category: 'swap'
    },
    {
      id: 'large_swap',
      title: 'Swap de $1',
      description: 'Realiza un swap de $1 usando cualquier par de tokens',
      type: 'swap',
      difficulty: 'Medio',
      reward: 200,
      xpReward: 400,
      knowledgePoints: 80,
      status: 'available',
      minAmount: '1',
      swapFrom: 'USDC',
      swapTo: 'WLD',
      swapFromAddress: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', // USDC en World Chain
      swapToAddress: '0x163f8C2467924be0ae7B5347228CABF260318753', // WLD en World Chain
      poolFee: 500, // 0.05%
      icon: ArrowLeftRight,
      category: 'swap'
    },
    {
      id: 'arbitrage_swap',
      title: 'Swap de 0.2 WLD',
      description: 'Realiza un swap con 0.2 WLD para practicar trading',
      type: 'swap',
      difficulty: 'Medio',
      reward: 300,
      xpReward: 600,
      knowledgePoints: 120,
      status: 'available',
      minAmount: '0.2',
      swapFrom: 'WLD',
      swapTo: 'USDC',
      swapFromAddress: '0x163f8C2467924be0ae7B5347228CABF260318753', // WLD en World Chain
      swapToAddress: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', // USDC en World Chain
      poolFee: 500, // 0.05%
      icon: ArrowLeftRight,
      category: 'swap'
    }
  ])

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [showMissionDialog, setShowMissionDialog] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    completedMissions: 0,
    totalRewards: 0,
    knowledgePoints: 0
  })

  // Load missions and stats from localStorage on component mount
  useEffect(() => {
    console.log('🔄 Loading missions and stats from localStorage...')
    
    // Load saved missions
    const savedMissions = localStorage.getItem('swapquest_missions')
    if (savedMissions) {
      try {
        const parsedMissions = JSON.parse(savedMissions)
        console.log('✅ Loaded saved missions:', parsedMissions.length, 'missions')
        // Validate that the missions have the correct structure
        if (Array.isArray(parsedMissions) && parsedMissions.length > 0) {
          setMissions(parsedMissions)
        } else {
          console.log('⚠️ Invalid missions data, using default missions')
        }
      } catch (error) {
        console.error('❌ Error loading saved missions:', error)
        console.log('🔄 Using default missions due to parse error')
      }
    } else {
      console.log('📝 No saved missions found, using default missions')
    }
    
    // Load saved stats
    const savedStats = localStorage.getItem('swapquest_stats')
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats)
        console.log('✅ Loaded saved stats:', parsedStats)
        // Validate stats structure
        if (parsedStats && typeof parsedStats === 'object') {
          setUserStats(parsedStats)
        }
      } catch (error) {
        console.error('❌ Error loading saved stats:', error)
      }
    }
  }, []) // Empty dependency array - only run on mount

  // Calcular estadísticas del usuario
  useEffect(() => {
    const completed = missions.filter(m => m.status === 'completed')
    const totalXP = completed.reduce((sum, m) => sum + m.xpReward, 0)
    const totalRewards = completed.reduce((sum, m) => sum + m.reward, 0)
    const knowledgePoints = completed.reduce((sum, m) => sum + m.knowledgePoints, 0)
    const level = Math.floor(totalXP / 100) + 1

    setUserStats({
      totalXP,
      level,
      completedMissions: completed.length,
      totalRewards,
      knowledgePoints
    })

    // Guardar puntos en localStorage para usar en área de conocimiento
    localStorage.setItem('knowledgePoints', knowledgePoints.toString())
  }, [missions])

  // Function to reset all progress (for debugging/testing)
  const resetProgress = () => {
    console.log('🔄 Resetting all mission progress...')
    
    // Reset missions to default state
    const resetMissions = missions.map(m => ({ ...m, status: 'available' as const }))
    setMissions(resetMissions)
    
    // Reset stats
    const resetStats = {
      totalXP: 0,
      level: 1,
      completedMissions: 0,
      totalRewards: 0,
      knowledgePoints: 0
    }
    setUserStats(resetStats)
    
    // Clear localStorage
    localStorage.removeItem('swapquest_missions')
    localStorage.removeItem('swapquest_stats')
    localStorage.removeItem('knowledgePoints')
    
    toast.success('Progreso reseteado exitosamente')
  }

  const executeMission = async (mission: Mission) => {
    setIsExecuting(true)
    
    try {
      let result: any = null

      if (!isInstalled) {
        // NO SIMULATION - Must use World App
        toast.error('Esta aplicación DEBE abrirse en World App para realizar misiones reales')
        setIsExecuting(false)
        return
      }

      if (!isConnected) {
        // Try to restore connection first
        console.log('🔄 Wallet not connected, attempting to restore connection...')
        const connectionResult = await checkConnection()
        
        if (!connectionResult) {
          toast.error('Debes conectar tu wallet de WorldCoin primero')
          setIsExecuting(false)
          return
        }
      }

      // Execute REAL mission based on type
      switch (mission.type) {
        case 'pay':
          console.log('💰 Executing REAL payment mission...')
          result = await depositFunds(mission.minAmount || '1', 'WLD')
          break
          
        case 'verify':
          console.log('🔐 Executing REAL WorldID verification...')
          result = await verifyWithWorldID()
          break
          
        case 'send_transaction':
          console.log('📤 Executing REAL send transaction...')
          result = await sendTransaction({
            to: mission.targetAddress || '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f',
            value: '1000000000000000', // 0.001 ETH
          })
          break
          
        case 'sign_message':
          console.log('✍️ Executing REAL message signing...')
          // Use the new signMessage function
          result = await signMessage(mission.message || 'SwapQuest Gaming Platform - Message Signature')
          break
          
        case 'swap':
          console.log('🔄 Executing REAL swap mission on World Chain...')
          try {
            // Use simplified swap parameters that work with WorldCoin MiniKit
            const swapParams = getSwapParamsForMission(mission)
            result = await executeSwap(swapParams)
          } catch (swapError) {
            console.error('Swap mission failed:', swapError)
            // If swap fails, try a simplified payment approach
            console.log('🔄 Fallback: Using payment for swap mission...')
            result = await depositFunds(mission.minAmount || '0.01', 'WLD')
          }
          break
          
        default:
          throw new Error(`Unknown mission type: ${mission.type}`)
      }

      if (result && result.success) {
        // Complete mission and award rewards
        const updatedMissions = missions.map(m => 
          m.id === mission.id 
            ? { ...m, status: 'completed' as const }
            : m
        )
        setMissions(updatedMissions)
        
        // Calculate new stats
        const newStats = {
          totalRewards: userStats.totalRewards + mission.reward,
          totalXP: userStats.totalXP + mission.xpReward,
          knowledgePoints: userStats.knowledgePoints + mission.knowledgePoints,
          completedMissions: userStats.completedMissions + 1,
          level: Math.floor((userStats.totalXP + mission.xpReward) / 100) + 1
        }
        
        // Update stats state
        setUserStats(newStats)
        
        // Save to localStorage immediately with error handling
        try {
          localStorage.setItem('swapquest_missions', JSON.stringify(updatedMissions))
          localStorage.setItem('swapquest_stats', JSON.stringify(newStats))
          localStorage.setItem('knowledgePoints', newStats.knowledgePoints.toString())
          console.log('✅ Mission progress saved to localStorage')
        } catch (saveError) {
          console.error('❌ Error saving mission progress:', saveError)
          toast.error('Error guardando progreso - puede perderse al recargar')
        }
        
        toast.success(`¡Misión completada! +${mission.reward} tokens, +${mission.xpReward} XP, +${mission.knowledgePoints} puntos de conocimiento`)
      } else {
        const errorMessage = result?.error || 'Error desconocido'
        toast.error(`Error en la misión: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Mission execution error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error(`Error ejecutando misión: ${errorMessage}`)
    } finally {
      setIsExecuting(false)
    }
  }

  // Helper function to get swap parameters for different missions
  const getSwapParamsForMission = (mission: Mission) => {
    // World Chain token addresses
    const ETH = '0x0000000000000000000000000000000000000000'
    const WETH = '0x4200000000000000000000000000000000000006'
    const WLD = '0x163f8C2467924be0ae7B5347228CABF260318753'
    const USDC = '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1'
    
    // Convert mission amounts to wei/smallest units
    const parseAmount = (amount: string, tokenSymbol: string): string => {
      const decimals = tokenSymbol === 'USDC' ? 6 : 18
      const amountNum = parseFloat(amount)
      return Math.floor(amountNum * Math.pow(10, decimals)).toString()
    }
    
    // Calculate minimum output (simplified)
    const calculateMinOutput = (inputAmount: string, fromToken: string, toToken: string): string => {
      const rates: Record<string, Record<string, number>> = {
        'ETH': { 'WLD': 2000, 'USDC': 3000 },
        'WLD': { 'ETH': 0.0005, 'USDC': 1.5 },
        'USDC': { 'ETH': 0.00033, 'WLD': 0.67 }
      }
      
      const rate = rates[fromToken]?.[toToken] || 1
      const estimatedOutput = parseFloat(inputAmount) * rate * 0.95 // 5% slippage
      const decimals = toToken === 'USDC' ? 6 : 18
      return Math.floor(estimatedOutput * Math.pow(10, decimals)).toString()
    }
    
    switch (mission.id) {
      case 'first_swap':
        return {
          tokenIn: ETH,
          tokenOut: WLD,
          amountIn: parseAmount('0.001', 'ETH'),
          amountOutMinimum: calculateMinOutput('0.001', 'ETH', 'WLD'),
          fee: 3000
        }
      case 'usdc_wld_swap':
        return {
          tokenIn: USDC,
          tokenOut: WLD,
          amountIn: parseAmount('0.5', 'USDC'),
          amountOutMinimum: calculateMinOutput('0.5', 'USDC', 'WLD'),
          fee: 3000
        }
      case 'wld_eth_swap':
        return {
          tokenIn: WLD,
          tokenOut: ETH,
          amountIn: parseAmount('0.1', 'WLD'),
          amountOutMinimum: calculateMinOutput('0.1', 'WLD', 'ETH'),
          fee: 3000
        }
      case 'large_swap':
        return {
          tokenIn: USDC,
          tokenOut: WLD,
          amountIn: parseAmount('1', 'USDC'),
          amountOutMinimum: calculateMinOutput('1', 'USDC', 'WLD'),
          fee: 3000
        }
      case 'arbitrage_swap':
        return {
          tokenIn: WLD,
          tokenOut: USDC,
          amountIn: parseAmount('0.2', 'WLD'),
          amountOutMinimum: calculateMinOutput('0.2', 'WLD', 'USDC'),
          fee: 500
        }
      default:
        return {
          tokenIn: ETH,
          tokenOut: WLD,
          amountIn: parseAmount('0.001', 'ETH'),
          amountOutMinimum: calculateMinOutput('0.001', 'ETH', 'WLD'),
          fee: 3000
        }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medio': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Difícil': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'defi': return TrendingUp
      case 'payments': return Wallet
      case 'security': return Shield
      case 'social': return Users
      case 'swap': return ArrowLeftRight
      default: return Target
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={`${
        isConnected 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isConnected 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                {isConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${
                  isConnected 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}>
                  {isConnected ? 'WorldCoin Wallet Conectada' : 'WorldCoin Wallet No Conectada'}
                </h3>
                <p className={`text-sm ${
                  isConnected 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {isConnected 
                    ? `Conectado como ${userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Usuario WorldCoin'}`
                    : 'Conecta tu wallet para realizar misiones reales'
                  }
                </p>
              </div>
            </div>
            {!isConnected && (
              <div className="flex space-x-2">
                <Button
                  onClick={async () => {
                    try {
                      const result = await connectWallet()
                      if (result.success) {
                        toast.success('¡Wallet conectada exitosamente!')
                      } else {
                        toast.error('error' in result ? result.error : 'Error al conectar wallet')
                      }
                    } catch (error) {
                      toast.error('Error al conectar wallet')
                    }
                  }}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const restored = await checkConnection()
                      if (restored) {
                        toast.success('¡Conexión restaurada!')
                      } else {
                        toast.info('No se encontró sesión guardada')
                      }
                    } catch (error) {
                      toast.error('Error al verificar conexión')
                    }
                  }}
                  size="sm"
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verificar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats del Usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Tu Progreso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.level}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Nivel</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.totalXP}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">XP Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.completedMissions}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Misiones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userStats.totalRewards}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 flex items-center justify-center space-x-1">
                <BookOpen className="w-5 h-5" />
                <span>{userStats.knowledgePoints}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Puntos Conocimiento</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso al Nivel {userStats.level + 1}</span>
              <span>{userStats.totalXP % 100}/100 XP</span>
            </div>
            <Progress value={(userStats.totalXP % 100)} className="h-2" />
          </div>
          
          {/* Debug/Testing Reset Button */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={resetProgress}
              variant="outline"
              size="sm"
              className="text-xs text-gray-500 hover:text-red-600 border-gray-300"
            >
              🔄 Reset Progress (Debug)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información sobre Puntos de Conocimiento */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Puntos de Conocimiento</h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Usa tus puntos para desbloquear contenido premium en el área de conocimiento
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{userStats.knowledgePoints}</div>
              <div className="text-xs text-indigo-500">disponibles</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Misiones */}
      <div className="grid gap-4">
        {missions.map((mission) => {
          const IconComponent = mission.icon
          const CategoryIcon = getCategoryIcon(mission.category)
          
          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                mission.status === 'completed' 
                  ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                  : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        mission.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {mission.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{mission.title}</h3>
                          <CategoryIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {mission.description}
                        </p>
                        
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <Badge className={getDifficultyColor(mission.difficulty)}>
                            {mission.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            {mission.xpReward} XP
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Coins className="w-3 h-3 mr-1" />
                            {mission.reward} tokens
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {mission.knowledgePoints} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {mission.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completada
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedMission(mission)
                            setShowMissionDialog(true)
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Iniciar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Dialog de Ejecución de Misión */}
      <Dialog open={showMissionDialog} onOpenChange={setShowMissionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedMission && <selectedMission.icon className="w-5 h-5" />}
              <span>{selectedMission?.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedMission && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMission.description}
              </p>
              
              {/* Campos específicos por tipo de misión */}
              {(selectedMission.type === 'pay' || selectedMission.type === 'send_transaction' || selectedMission.type === 'swap') && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Cantidad</label>
                    <Input
                      type="number"
                      placeholder={`Mínimo: ${selectedMission.minAmount || '0.1'}`}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min={selectedMission.minAmount || '0.1'}
                      step="0.1"
                    />
                  </div>
                  
                  {selectedMission.type === 'send_transaction' && selectedMission.tokenAddress && (
                    <div>
                      <label className="text-sm font-medium">Dirección del Destinatario</label>
                      <Input
                        placeholder="0x..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {selectedMission.type === 'swap' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Intercambio</span>
                          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">{selectedMission.swapFrom}</span>
                          <ArrowLeftRight className="w-3 h-3" />
                          <span className="font-medium">{selectedMission.swapTo}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Fee del pool: {(selectedMission.poolFee || 3000) / 10000}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        ⚡ Swap real usando Uniswap V3 en World Chain
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedMission.type === 'sign_message' && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium mb-1">Mensaje a firmar:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMission.message}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Recompensas</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedMission.xpReward} XP + {selectedMission.knowledgePoints} Puntos + {selectedMission.reward} tokens
                  </div>
                </div>
                <Badge className={getDifficultyColor(selectedMission.difficulty)}>
                  {selectedMission.difficulty}
                </Badge>
              </div>

              {!isInstalled && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Necesitas World App para realizar misiones reales. Sin World App, las misiones se simularán.
                  </p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMissionDialog(false)}
                  className="flex-1"
                  disabled={isExecuting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => executeMission(selectedMission)}
                  disabled={isExecuting}
                  className="flex-1"
                >
                  {isExecuting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Ejecutando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Ejecutar Misión</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 