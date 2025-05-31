"use client"

import { useWorldCoin } from '@/hooks/useWorldCoin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, Shield, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react'
import { motion } from 'framer-motion'

export function WorldCoinStatus() {
  const {
    isInstalled,
    isConnected, 
    isLoading,
    user,
    userAddress,
    signInWithWorldCoin 
  } = useWorldCoin()

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">Verificando WorldCoin...</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Connection Status */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isInstalled 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            {isInstalled ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Estado de WorldCoin
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isInstalled ? 'MiniKit Activo' : 'Modo Estándar'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            className={`${
              isInstalled 
                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' 
                : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
            }`}
          >
            {isInstalled ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>
      </div>

      {/* User Status */}
      {isConnected && user ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Usuario Autenticado
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {user.username || 'Usuario WorldCoin'}
              </p>
              {userAddress && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </p>
              )}
            </div>
            {user.isVerified && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
                <Shield className="w-3 h-3 mr-1" />
                Verificado
              </Badge>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                No Autenticado
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Inicia sesión para acceder a todas las funciones
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Available */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border ${
          isInstalled 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Globe className={`w-4 h-4 ${
              isInstalled ? 'text-green-600' : 'text-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              isInstalled 
                ? 'text-green-900 dark:text-green-100' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              World App
            </span>
          </div>
          <p className={`text-xs mt-1 ${
            isInstalled 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {isInstalled ? 'Disponible' : 'No disponible'}
          </p>
        </div>

        <div className={`p-3 rounded-lg border ${
          isConnected 
            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
        }`}>
          <div className="flex items-center space-x-2">
            <Shield className={`w-4 h-4 ${
              isConnected ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <span className={`text-sm font-medium ${
              isConnected 
                ? 'text-blue-900 dark:text-blue-100' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              Autenticación
            </span>
          </div>
          <p className={`text-xs mt-1 ${
            isConnected 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {isConnected ? 'Activa' : 'Inactiva'}
          </p>
        </div>
      </div>

      {/* Debug Info */}
      <details className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          Información de Debug
        </summary>
        <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <p>• isInstalled: {isInstalled ? '✅' : '❌'}</p>
          <p>• isConnected: {isConnected ? '✅' : '❌'}</p>
          <p>• isLoading: {isLoading ? '✅' : '❌'}</p>
          <p>• User Agent: {navigator.userAgent.slice(0, 50)}...</p>
          <p>• URL: {window.location.href}</p>
        </div>
      </details>
    </motion.div>
  )
} 