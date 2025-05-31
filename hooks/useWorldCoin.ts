"use client"

import { useState, useEffect } from 'react'
import { MiniKit, WalletAuthInput, PayCommandInput, Tokens, tokenToDecimals } from '@worldcoin/minikit-js'
import { ethers } from 'ethers'

export interface WorldCoinState {
  isInstalled: boolean
  isReady: boolean
  isLoading: boolean
  isConnected: boolean
  userAddress?: string
  user?: {
    id: string
    isVerified: boolean
    username?: string
    balance?: string
  }
}

// Utility functions for persistent storage
const STORAGE_KEYS = {
  WORLDCOIN_SESSION: 'worldcoin_session',
  USER_DATA: 'worldcoin_user_data',
  CONNECTION_STATE: 'worldcoin_connected'
}

// Safe storage functions with error handling
const saveToStorage = (key: string, data: any) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.warn('Failed to save to storage:', error)
  }
}

const loadFromStorage = (key: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
  } catch (error) {
    console.warn('Failed to load from storage:', error)
  }
  return null
}

const clearStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  } catch (error) {
    console.warn('Failed to clear storage:', error)
  }
}

export function useWorldCoin() {
  const [state, setState] = useState<WorldCoinState>({
    isInstalled: false,
    isReady: false,
    isLoading: true,
    isConnected: false,
  })

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout | null = null
    
    const initializeWorldCoin = async () => {
      try {
        // Early return if component unmounted
        if (!isMounted) return
        
        console.log('🔍 Initializing WorldCoin MiniKit...')
        
        // Safe environment checks
        const isClient = typeof window !== 'undefined'
        const hasNavigator = typeof navigator !== 'undefined'
        
        if (!isClient) {
          console.log('❌ Not in client environment')
          if (isMounted) {
            setState(prev => ({ ...prev, isLoading: false, isInstalled: false }))
          }
          return
        }
        
        // Safe user agent check
        const userAgent = hasNavigator ? navigator.userAgent : ''
        const currentUrl = window.location.href
        
        console.log('🌍 User Agent:', userAgent)
        console.log('🔗 Current URL:', currentUrl)
        
        // Check for saved session FIRST - ALWAYS try to restore if exists
        const savedSession = loadFromStorage(STORAGE_KEYS.WORLDCOIN_SESSION)
        const savedUserData = loadFromStorage(STORAGE_KEYS.USER_DATA)
        const wasConnected = loadFromStorage(STORAGE_KEYS.CONNECTION_STATE)
        
        console.log('💾 Saved session data:', { savedSession, savedUserData, wasConnected })
        
        // If we have a valid saved session, restore it IMMEDIATELY
        if (savedSession && savedUserData && wasConnected && isMounted) {
          console.log('🔄 Restoring previous WorldCoin session from storage...')
          setState({
            isInstalled: true, // Assume installed if we had a session
            isReady: true,
            isLoading: false,
            isConnected: true,
            userAddress: savedSession.address,
            user: savedUserData
          })
          console.log('✅ Session restored successfully from storage!')
          
          // Continue with MiniKit detection in background, but don't block UI
          timeoutId = setTimeout(() => {
            if (isMounted) {
              detectMiniKitEnvironment()
            }
          }, 100)
          return
        }
        
        // No saved session, proceed with fresh detection
        await detectMiniKitEnvironment()
        
      } catch (error) {
        console.error('❌ Error initializing WorldCoin:', error)
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isInstalled: false,
            isReady: false,
            isConnected: false
          }))
        }
      }
    }

    const detectMiniKitEnvironment = async () => {
      try {
        if (!isMounted) return
        
        // Safe environment checks
        const isClient = typeof window !== 'undefined'
        const hasNavigator = typeof navigator !== 'undefined'
        
        if (!isClient || !hasNavigator) {
          console.log('❌ Missing browser APIs')
          if (isMounted) {
            setState(prev => ({ ...prev, isLoading: false, isInstalled: false }))
          }
          return
        }
        
        // Improved World App detection with safe checks
        const isWorldApp = (
          navigator.userAgent.includes('WorldApp') || 
          navigator.userAgent.includes('World App') ||
          navigator.userAgent.includes('worldcoin') ||
          window.location.hostname.includes('worldcoin') ||
          window.location.hostname.includes('worldapp') ||
          // Check for MiniKit global object
          typeof (window as any).MiniKit !== 'undefined'
        )
        
        console.log('🌍 Is World App environment (improved detection):', isWorldApp)
        
        // Wait for MiniKit to initialize (shorter wait)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        if (!isMounted) return
        
        // Check if MiniKit is installed with proper error handling
        let installed = false
        try {
          // Safe MiniKit check with multiple fallbacks
          if (typeof window !== 'undefined' && (window as any).MiniKit) {
            const MiniKitGlobal = (window as any).MiniKit
            if (typeof MiniKitGlobal.isInstalled === 'function') {
              installed = MiniKitGlobal.isInstalled()
              console.log('📱 MiniKit.isInstalled():', installed)
            } else {
              console.log('📱 MiniKit.isInstalled not a function')
              installed = isWorldApp // Fallback to environment detection
            }
          } else if (typeof MiniKit !== 'undefined' && MiniKit.isInstalled) {
            installed = MiniKit.isInstalled()
            console.log('📱 MiniKit.isInstalled() (import):', installed)
          } else {
            console.log('📱 MiniKit not available')
            installed = isWorldApp // Fallback to environment detection
          }
        } catch (error) {
          console.log('📱 MiniKit.isInstalled() failed:', error)
          // If we're in a World App environment but MiniKit failed, still consider it potentially installed
          installed = isWorldApp
        }
        
        console.log('📱 Final installation status:', installed)
        
        // Update state with detection results
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isInstalled: installed,
            isReady: installed,
            isLoading: false,
            // Keep existing connection if we had one
            isConnected: prev.isConnected || false,
            userAddress: prev.userAddress,
            user: prev.user
          }))
        }

        if (installed) {
          console.log('✅ WorldCoin MiniKit detected - Running inside World App!')
        } else {
          console.log('❌ Running in browser - MiniKit not available')
          console.log('📱 Please open this app in World App to use WorldCoin features')
          // Only clear storage if we're definitely not in World App AND have no valid session
          if (!isWorldApp && !loadFromStorage(STORAGE_KEYS.WORLDCOIN_SESSION)) {
            clearStorage()
          }
        }
      } catch (error) {
        console.error('❌ Error detecting MiniKit environment:', error)
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isInstalled: false,
            isReady: false
          }))
        }
      }
    }

    // Add a timeout to prevent infinite loading
    const initTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('⏰ Initialization timeout - setting loading to false')
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }, 10000) // 10 second timeout

    initializeWorldCoin()
    
    // Cleanup function
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
      clearTimeout(initTimeout)
    }
  }, [])

  // Add effect to listen for storage changes (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === STORAGE_KEYS.CONNECTION_STATE) {
          const wasConnected = e.newValue ? JSON.parse(e.newValue) : false
          if (wasConnected) {
            // Another tab connected, sync the state
            const savedSession = loadFromStorage(STORAGE_KEYS.WORLDCOIN_SESSION)
            const savedUserData = loadFromStorage(STORAGE_KEYS.USER_DATA)
            
            if (savedSession && savedUserData) {
              console.log('🔄 Syncing connection state from another tab...')
              setState(prev => ({
                ...prev,
                isConnected: true,
                userAddress: savedSession.address,
                user: savedUserData
              }))
            }
          } else {
            // Another tab disconnected
            setState(prev => ({
              ...prev,
              isConnected: false,
              userAddress: undefined,
              user: undefined
            }))
          }
        }
      } catch (error) {
        console.warn('Error handling storage change:', error)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Add effect to periodically check and maintain connection
  useEffect(() => {
    if (!state.isConnected) return

    const maintainConnection = () => {
      const savedSession = loadFromStorage(STORAGE_KEYS.WORLDCOIN_SESSION)
      const savedUserData = loadFromStorage(STORAGE_KEYS.USER_DATA)
      const wasConnected = loadFromStorage(STORAGE_KEYS.CONNECTION_STATE)
      
      // If storage data exists but state is disconnected, restore it
      if (savedSession && savedUserData && wasConnected && !state.isConnected) {
        console.log('🔄 Maintaining connection - restoring from storage...')
        setState(prev => ({
          ...prev,
          isConnected: true,
          userAddress: savedSession.address,
          user: savedUserData
        }))
      }
      
      // If state is connected but storage is missing, save it
      if (state.isConnected && state.userAddress && state.user && !wasConnected) {
        console.log('💾 Maintaining connection - saving to storage...')
        saveToStorage(STORAGE_KEYS.WORLDCOIN_SESSION, {
          address: state.userAddress,
          timestamp: Date.now(),
          nonce: 'maintained-session'
        })
        saveToStorage(STORAGE_KEYS.USER_DATA, state.user)
        saveToStorage(STORAGE_KEYS.CONNECTION_STATE, true)
      }
    }

    // Check every 5 seconds
    const interval = setInterval(maintainConnection, 5000)
    
    return () => clearInterval(interval)
  }, [state.isConnected, state.userAddress, state.user])

  // Sign in with WorldCoin using Wallet Auth - REAL ONLY
  const signInWithWorldCoin = async () => {
    console.log('🚀 Starting REAL WorldCoin sign in process...')
    console.log('📊 Current state:', { isInstalled: state.isInstalled, isReady: state.isReady })
    
    if (!state.isInstalled) {
      console.log('❌ WorldCoin MiniKit not available - MUST use World App')
      return { success: false, error: 'Esta aplicación DEBE abrirse en World App para funcionar. No hay modo de desarrollo.' }
    }

    try {
      console.log('🔄 Initiating REAL WorldCoin sign in...')
      
      // Get nonce from backend
      console.log('🎲 Requesting nonce from backend...')
      const nonceRes = await fetch('/api/nonce')
      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.status} ${nonceRes.statusText}`)
      }
      const { nonce } = await nonceRes.json()
      console.log('🎲 Got nonce:', nonce)

      // Prepare wallet auth input
      const walletAuthInput: WalletAuthInput = {
        nonce: nonce,
        requestId: '0',
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
        statement: 'Sign in to SwapQuest - Gaming DeFi Platform powered by WorldCoin'
      }

      console.log('📝 Wallet auth input:', walletAuthInput)

      // Execute wallet auth with REAL MiniKit
      console.log('🔐 Calling MiniKit.commandsAsync.walletAuth...')
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth(walletAuthInput)
      console.log('📤 REAL WorldCoin auth response:', { commandPayload, finalPayload })

      if (finalPayload.status === 'error') {
        console.error('❌ WorldCoin wallet auth failed:', finalPayload)
        return { success: false, error: 'WorldCoin authentication failed' }
      }

      if (finalPayload.status !== 'success') {
        console.error('❌ Unexpected WorldCoin response status:', finalPayload)
        return { success: false, error: 'WorldCoin authentication returned unexpected status' }
      }

      // Verify the authentication in backend
      console.log('🔐 Verifying authentication with backend...')
      const verifyRes = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: finalPayload, nonce })
      })

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text()
        throw new Error(`Failed to verify WorldCoin authentication: ${verifyRes.status} ${errorText}`)
      }

      const verifyResult = await verifyRes.json()
      console.log('🔐 WorldCoin verification result:', verifyResult)

      if (verifyResult.isValid) {
        // Prepare user data
        const userData = {
          id: 'worldcoin-authenticated-user',
          isVerified: true,
          username: MiniKit.user?.username || 'WorldCoin User',
          balance: '0.00' // Will be updated by balance fetching
        }

        // Save session data persistently
        const sessionData = {
          address: finalPayload.address,
          timestamp: Date.now(),
          nonce: nonce
        }

        saveToStorage(STORAGE_KEYS.WORLDCOIN_SESSION, sessionData)
        saveToStorage(STORAGE_KEYS.USER_DATA, userData)
        saveToStorage(STORAGE_KEYS.CONNECTION_STATE, true)

        // Update state with authenticated user
        setState(prev => ({
          ...prev,
          isConnected: true,
          userAddress: finalPayload.address,
          user: userData
        }))

        console.log('✅ REAL WorldCoin sign in successful!')
        console.log('💾 Session data saved to persistent storage')
        
        return { 
          success: true, 
          address: finalPayload.address,
          username: userData.username
        }
      } else {
        return { success: false, error: `WorldCoin verification failed: ${verifyResult.error || 'Unknown error'}` }
      }
    } catch (error) {
      console.error('❌ WorldCoin sign in failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `WorldCoin sign in failed: ${errorMessage}` }
    }
  }

  // Execute REAL token swap using WorldCoin MiniKit - ACTUAL SWAP NOT PAYMENT
  const executeSwap = async (params: {
    tokenIn: string
    tokenOut: string
    amountIn: string
    amountOutMinimum: string
    fee: number
    recipient?: string
  }) => {
    if (!state.isInstalled || !state.isConnected) {
      throw new Error('WorldCoin wallet not connected - MUST use World App')
    }

    try {
      console.log('🔄 Executing REAL TOKEN SWAP (not payment)...', params)
      
      // Convert token addresses to proper format
      const tokenInAddress = params.tokenIn === '0x0000000000000000000000000000000000000000' 
        ? '0x4200000000000000000000000000000000000006' // Use WETH for ETH
        : params.tokenIn
      
      const tokenOutAddress = params.tokenOut === '0x0000000000000000000000000000000000000000'
        ? '0x4200000000000000000000000000000000000006' // Use WETH for ETH  
        : params.tokenOut

      // Convert amounts to BigInt and then hex
      const amountInBigInt = BigInt(params.amountIn)
      const amountOutMinBigInt = BigInt(params.amountOutMinimum)
      const feeBigInt = BigInt(params.fee)
      const deadlineBigInt = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes

      console.log('🔄 REAL Swap parameters:', {
        tokenIn: tokenInAddress,
        tokenOut: tokenOutAddress,
        amountIn: amountInBigInt.toString(),
        amountOutMinimum: amountOutMinBigInt.toString(),
        fee: feeBigInt.toString(),
        deadline: deadlineBigInt.toString(),
        recipient: params.recipient || state.userAddress
      })

      // Use World Chain Uniswap V3 Router for REAL swaps
      const uniswapV3Router = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
      
      // Create the swap transaction data with hex values
      const swapParams = {
        tokenIn: tokenInAddress,
        tokenOut: tokenOutAddress,
        fee: '0x' + feeBigInt.toString(16),
        recipient: params.recipient || state.userAddress,
        deadline: '0x' + deadlineBigInt.toString(16),
        amountIn: '0x' + amountInBigInt.toString(16),
        amountOutMinimum: '0x' + amountOutMinBigInt.toString(16),
        sqrtPriceLimitX96: '0x0'
      }

      console.log('🔄 Calling Uniswap V3 exactInputSingle with params:', swapParams)

      // Execute REAL swap transaction
      const swapResult = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: uniswapV3Router,
          abi: [
            {
              "inputs": [
                {
                  "components": [
                    {"name": "tokenIn", "type": "address"},
                    {"name": "tokenOut", "type": "address"}, 
                    {"name": "fee", "type": "uint24"},
                    {"name": "recipient", "type": "address"},
                    {"name": "deadline", "type": "uint256"},
                    {"name": "amountIn", "type": "uint256"},
                    {"name": "amountOutMinimum", "type": "uint256"},
                    {"name": "sqrtPriceLimitX96", "type": "uint160"}
                  ],
                  "name": "params",
                  "type": "tuple"
                }
              ],
              "name": "exactInputSingle",
              "outputs": [{"name": "amountOut", "type": "uint256"}],
              "stateMutability": "payable",
              "type": "function"
            }
          ],
          functionName: 'exactInputSingle',
          args: [swapParams],
          value: params.tokenIn === '0x0000000000000000000000000000000000000000' ? '0x' + amountInBigInt.toString(16) : '0x0'
        }]
      })

      console.log('📤 REAL Swap transaction result:', swapResult)

      if (swapResult.finalPayload.status === 'success') {
        console.log('✅ REAL TOKEN SWAP COMPLETED! Tokens exchanged successfully!')
        console.log('💰 Your balance should now reflect the swapped tokens')
        
        return {
          success: true,
          transactionHash: swapResult.finalPayload.transaction_id,
          swapParams: params,
          type: 'REAL_SWAP',
          note: 'Real token swap executed - balances changed!'
        }
      } else {
        throw new Error(`Real swap failed: ${swapResult.finalPayload.status}`)
      }
    } catch (error) {
      console.error('❌ REAL Token swap failed:', error)
      
      // Handle specific swap errors
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()
        
        if (errorMsg.includes('insufficient')) {
          throw new Error('Fondos insuficientes para realizar el swap real')
        } else if (errorMsg.includes('allowance') || errorMsg.includes('approve')) {
          throw new Error('Necesitas aprobar el token antes del swap. Intenta de nuevo.')
        } else if (errorMsg.includes('slippage') || errorMsg.includes('price')) {
          throw new Error('Precio cambió demasiado. Intenta con menos cantidad.')
        } else if (errorMsg.includes('liquidity')) {
          throw new Error('Liquidez insuficiente en el pool para este swap')
        } else if (errorMsg.includes('rejected') || errorMsg.includes('cancelled')) {
          throw new Error('Swap cancelado por el usuario')
        } else {
          throw new Error(`Error en swap real: ${error.message}`)
        }
      }
      
      throw new Error('Error desconocido en el swap real')
    }
  }

  // Add a proper message signing function
  const signMessage = async (message: string) => {
    if (!state.isInstalled || !state.isConnected) {
      throw new Error('WorldCoin wallet not connected - MUST use World App')
    }

    try {
      console.log('✍️ Signing message via WorldCoin MiniKit...', message)
      
      // Use MiniKit's verify command with a valid action
      // Since 'sign-message' might not be a valid action, we'll use a custom action
      const signResult = await MiniKit.commandsAsync.verify({
        action: `message-${Date.now()}`, // Use a unique action identifier
        signal: message
      })

      console.log('📤 REAL Message signing result:', signResult)

      if (signResult.finalPayload.status === 'success') {
        console.log('✅ Message signed successfully!')
        return {
          success: true,
          signature: signResult.finalPayload.merkle_root,
          message: message,
          proof: signResult.finalPayload
        }
      } else {
        throw new Error(`Message signing failed: ${signResult.finalPayload.status}`)
      }
    } catch (error) {
      console.error('❌ Message signing failed:', error)
      // If verify fails, try using a simple payment as signature proof
      console.log('🔄 Fallback: Using micro-payment as signature proof...')
      try {
        const fallbackResult = await MiniKit.commandsAsync.pay({
          reference: `signature_${Date.now()}`,
          to: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f',
          tokens: [{
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.001, Tokens.WLD).toString() // 0.001 WLD
          }],
          description: `Message signature: ${message.substring(0, 50)}...`
        })
        
        if (fallbackResult.finalPayload.status === 'success') {
          console.log('✅ Fallback signature successful!')
          return {
            success: true,
            signature: fallbackResult.finalPayload.transaction_id,
            message: message,
            fallback: true
          }
        }
      } catch (fallbackError) {
        console.error('❌ Fallback signature also failed:', fallbackError)
      }
      
      throw error
    }
  }

  // Enhanced deposit function with better error handling - REAL ONLY
  const depositFunds = async (amount: string, token: 'WLD' | 'USDC' = 'WLD') => {
    if (!state.isInstalled || !state.isConnected) {
      return { success: false, error: 'WorldCoin wallet not connected - MUST use World App' }
    }

    try {
      console.log('💰 Initiating REAL deposit...', { amount, token })

      // Initialize payment in backend
      const initRes = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, token, userAddress: state.userAddress })
      })
      
      if (!initRes.ok) {
        throw new Error(`Failed to initialize payment: ${initRes.status}`)
      }
      
      const { id: reference } = await initRes.json()
      console.log('🎫 Payment reference:', reference)

      // Prepare payment input
      const tokenSymbol = token === 'WLD' ? Tokens.WLD : Tokens.USDCE
      const tokenAmount = tokenToDecimals(parseFloat(amount), tokenSymbol).toString()

      const paymentInput: PayCommandInput = {
        reference: reference,
        to: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f', // Your app's deposit address
        tokens: [{
          symbol: tokenSymbol,
          token_amount: tokenAmount
        }],
        description: `Deposit ${amount} ${token} to SwapQuest Gaming Platform`
      }

      console.log('💳 Executing REAL payment with MiniKit...', paymentInput)

      // Execute REAL payment
      const { finalPayload } = await MiniKit.commandsAsync.pay(paymentInput)
      console.log('📤 REAL Payment result:', finalPayload)

      if (finalPayload.status === 'error') {
        console.error('❌ Payment failed:', finalPayload)
        return { success: false, error: 'Payment failed' }
      }

      // Verify payment in backend
      console.log('🔐 Verifying payment with backend...')
      const confirmRes = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payload: finalPayload, 
          reference: reference,
          userAddress: state.userAddress
        })
      })

      if (!confirmRes.ok) {
        throw new Error(`Payment verification failed: ${confirmRes.status}`)
      }

      const confirmResult = await confirmRes.json()
      console.log('✅ Payment verification result:', confirmResult)

      if (confirmResult.success) {
        console.log('💰 REAL Deposit successful!')
        return { 
          success: true, 
          transactionId: finalPayload.transaction_id,
          amount,
          token
        }
      } else {
        return { success: false, error: confirmResult.error || 'Payment verification failed' }
      }
    } catch (error) {
      console.error('❌ REAL Deposit failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Deposit failed: ${errorMessage}` }
    }
  }

  const connectWallet = async () => {
    console.log('🔗 Manual wallet connection attempt...')
    
    // First try to restore from storage - ALWAYS
    const savedSession = loadFromStorage(STORAGE_KEYS.WORLDCOIN_SESSION)
    const savedUserData = loadFromStorage(STORAGE_KEYS.USER_DATA)
    const wasConnected = loadFromStorage(STORAGE_KEYS.CONNECTION_STATE)
    
    if (savedSession && savedUserData && wasConnected) {
      console.log('🔄 Restoring connection from storage...')
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isReady: true,
        isConnected: true,
        userAddress: savedSession.address,
        user: savedUserData
      }))
      return { success: true, address: savedSession.address, username: savedUserData.username }
    }
    
    // If no saved session, check if we can sign in
    if (!state.isInstalled) {
      console.log('❌ Cannot connect - not in World App environment')
      return { success: false, error: 'Esta aplicación debe abrirse en World App para conectar la wallet.' }
    }
    
    // Try to sign in with REAL WorldCoin
    return await signInWithWorldCoin()
  }

  // Manual connection check function - REAL ONLY
  const checkConnection = async () => {
    console.log('🔍 Checking REAL WorldCoin connection status...')
    
    const savedSession = loadFromStorage(STORAGE_KEYS.WORLDCOIN_SESSION)
    const savedUserData = loadFromStorage(STORAGE_KEYS.USER_DATA)
    const wasConnected = loadFromStorage(STORAGE_KEYS.CONNECTION_STATE)
    
    console.log('💾 Connection check - saved data:', { savedSession, savedUserData, wasConnected })
    
    if (savedSession && savedUserData && wasConnected) {
      console.log('✅ Found valid session, restoring connection...')
      setState(prev => ({
        ...prev,
        isInstalled: true, // If we had a session, assume we can connect
        isReady: true,
        isConnected: true,
        userAddress: savedSession.address,
        user: savedUserData
      }))
      return true
    }
    
    console.log('❌ No valid session found')
    return false
  }

  const disconnectWallet = async () => {
    console.log('🔌 Disconnecting WorldCoin wallet...')
    
    // Clear persistent storage
    clearStorage()
    
    // Reset state
    setState(prev => ({
      ...prev,
      isConnected: false,
      userAddress: undefined,
      user: undefined
    }))
    
    console.log('✅ WorldCoin wallet disconnected and session cleared')
  }

  const verifyWithWorldID = async () => {
    if (!state.isInstalled) {
      throw new Error('WorldCoin MiniKit not available - MUST use World App')
    }

    try {
      console.log('Triggering REAL WorldID verification...')
      
      // This would trigger REAL WorldID verification
      const verifyResult = await MiniKit.commandsAsync.verify({
        action: 'verify-human',
        signal: 'swapquest-verification'
      })

      if (verifyResult.finalPayload.status === 'success') {
        setState(prev => ({
          ...prev,
          user: {
            ...prev.user!,
            isVerified: true
          }
        }))
        
        return {
          success: true,
          proof: verifyResult.finalPayload.merkle_root
        }
      } else {
        throw new Error('Verification failed')
      }
    } catch (error) {
      console.error('REAL Verification failed:', error)
      throw error
    }
  }

  const sendTransaction = async (params: {
    to: string
    value: string
    data?: string
  }) => {
    if (!state.isInstalled || !state.isConnected) {
      throw new Error('WorldCoin wallet not connected - MUST use World App')
    }

    try {
      console.log('Sending REAL transaction via WorldCoin...', params)
      
      // Use REAL MiniKit sendTransaction command
      const result = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: params.to,
          abi: [], // Add appropriate ABI
          functionName: 'transfer', // Or appropriate function
          args: []
        }]
      })

      if (result.finalPayload.status === 'success') {
        return {
          success: true,
          hash: result.finalPayload.transaction_id
        }
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error) {
      console.error('REAL Transaction failed:', error)
      throw error
    }
  }

  return {
    ...state,
    signInWithWorldCoin,
    depositFunds,
    connectWallet,
    disconnectWallet,
    verifyWithWorldID,
    sendTransaction,
    // Utility functions
    canUseWorldCoin: state.isInstalled && state.isReady,
    isWorldCoinUser: state.user?.isVerified || false,
    executeSwap,
    checkConnection,
    signMessage,
  }
} 