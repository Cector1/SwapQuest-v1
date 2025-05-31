"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useWorldCoin } from '@/hooks/useWorldCoin'
import { MiniKit } from '@worldcoin/minikit-js'
import { Globe, Shield, LogIn, Wallet, Plus, CheckCircle, AlertCircle, User, Settings, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export function WorldCoinAuthHeader() {
  const { 
    isInstalled, 
    isConnected, 
    userAddress, 
    user,
    signInWithWorldCoin, 
    depositFunds,
    isLoading,
    disconnectWallet
  } = useWorldCoin()

  // Debug logs
  console.log('🎯 WorldCoinAuthHeader state:', {
    isInstalled,
    isConnected,
    isLoading,
    userAddress,
    user,
    timestamp: new Date().toISOString()
  })

  // Additional debug info
  if (typeof window !== 'undefined') {
    console.log('🌐 Browser environment:', {
      userAgent: navigator.userAgent,
      hostname: window.location.hostname,
      href: window.location.href,
      localStorage: {
        session: localStorage.getItem('worldcoin_session'),
        userData: localStorage.getItem('worldcoin_user_data'),
        connected: localStorage.getItem('worldcoin_connected')
      }
    })
  }

  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositToken, setDepositToken] = useState<'WLD' | 'USDC'>('WLD')
  const [isDepositing, setIsDepositing] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    console.log('🔘 Sign in button clicked!')
    console.log('📋 Button state check:', {
      isInstalled,
      isSigningIn,
      isLoading,
      buttonDisabled: !isInstalled || isSigningIn || isLoading
    })

    setIsSigningIn(true)
    try {
      console.log('🔄 Calling signInWithWorldCoin...')
      const result = await signInWithWorldCoin()
      console.log('📤 Sign in result:', result)
      
      if (result.success) {
        toast.success(`¡Bienvenido ${result.username || 'Usuario'}!`)
      } else {
        toast.error(result.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('❌ Sign in error:', error)
      toast.error('Error al iniciar sesión')
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Por favor ingresa una cantidad válida')
      return
    }

    if (parseFloat(depositAmount) < 0.01) {
      toast.error('La cantidad mínima de depósito es $0.01')
      return
    }

    setIsDepositing(true)
    try {
      const result = await depositFunds(depositAmount, depositToken)
      if (result.success) {
        toast.success(`¡Depósito exitoso de ${result.amount} ${result.token}!`)
        setShowDepositModal(false)
        setDepositAmount('')
      } else {
        toast.error(result.error || 'Error en el depósito')
      }
    } catch (error) {
      toast.error('Error en el depósito')
    } finally {
      setIsDepositing(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Inicializando WorldCoin...</span>
      </div>
    )
  }

  if (!isInstalled) {
    return (
      <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <span className="text-sm text-red-700 dark:text-red-300 font-medium">
          Esta aplicación DEBE abrirse en World App
        </span>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <Wallet className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            WorldCoin no conectado
          </span>
        </div>
        <Button
          onClick={handleSignIn}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Conectar WorldCoin
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg"
      >
        <div className="px-3 py-2">
          <div className="flex items-center justify-between max-w-md mx-auto">
            
            {/* Logo y Título - Más compacto */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">SwapQuest</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-none">Gaming DeFi</p>
              </div>
            </div>

            {/* Auth Section - Simplificado para móvil */}
            <div className="flex items-center space-x-2">
              {/* Status Badges - Solo mostrar si está conectado */}
              {isInstalled && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800 text-xs px-2 py-1">
                    <Globe className="w-3 h-3 mr-1" />
                  WC
                  </Badge>
              )}

              {isConnected && user?.isVerified && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800 text-xs px-2 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                  ✓
                  </Badge>
              )}

              {!isConnected ? (
                <Button
                  onClick={handleSignIn}
                  disabled={!isInstalled || isSigningIn || isLoading}
                  size="sm"
                  className={`font-medium px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ${
                    isInstalled 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {isSigningIn ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <LogIn className="w-3 h-3" />
                      <span>{isInstalled ? 'Entrar' : 'World App'}</span>
                    </div>
                  )}
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* User Info - Compacto */}
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900 dark:text-white leading-none">
                      {user?.username || formatAddress(userAddress || '')}
                    </p>
                  </div>
                  
                  {/* Deposit Button - Más pequeño */}
                  <Button
                    onClick={() => setShowDepositModal(true)}
                    size="sm"
                    variant="outline"
                    className="px-2 py-1 text-xs"
                  >
                      <Plus className="w-3 h-3" />
                  </Button>

                  {/* Settings/Disconnect - Más pequeño */}
                  <Button
                    onClick={handleDisconnect}
                    size="sm"
                    variant="ghost"
                    className="px-2 py-1 text-xs"
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </div>
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

      {/* Spacer for fixed header */}
      <div className="h-4"></div>

      {/* WorldCoin Required Notice */}
      {!isInstalled && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 text-xs">
                World App Requerido
              </h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Esta aplicación requiere World App para funcionar.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-600" />
              Depositar Fondos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Info banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <div className="text-blue-800 dark:text-blue-200 text-sm">
                <p className="font-semibold">Pago Seguro</p>
                <p className="text-xs">Transacciones descentralizadas</p>
              </div>
            </div>

            {/* Token selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Token</label>
              <select
                value={depositToken}
                onChange={(e) => setDepositToken(e.target.value as 'WLD' | 'USDC')}
                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="WLD">WLD (WorldCoin)</option>
                <option value="USDC">USDC (USD Coin)</option>
              </select>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Cantidad</label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Depósito mínimo: $0.01 • Gas fees patrocinados por World App
              </p>
            </div>

            {/* Deposit details */}
            {depositAmount && parseFloat(depositAmount) >= 0.01 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Vas a depositar:</span>
                  <span className="font-semibold">{depositAmount} {depositToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Red:</span>
                  <span className="text-blue-600">World Chain</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Gas fees:</span>
                  <span className="text-green-600">Gratis (Patrocinado)</span>
                </div>
              </div>
            )}

            {/* Warning for low amounts */}
            {depositAmount && parseFloat(depositAmount) < 0.01 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-600 dark:text-red-400 text-sm">
                  La cantidad mínima de depósito es $0.01
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 border-gray-300 dark:border-gray-600"
                disabled={isDepositing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) < 0.01 || isDepositing}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {isDepositing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>Depositar {depositToken}</span>
                  </div>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Powered by Blockchain Technology • Seguro y Descentralizado
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 