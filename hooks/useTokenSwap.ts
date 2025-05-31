"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { getProvider, getTokenAvaxSwapContract, getMyTokenContract, connectWallet } from "@/lib/web3"

export interface SwapStats {
  rate: number
  contractTokenBalance: string
  contractAvaxBalance: string
  userTokenBalance: string
  userAvaxBalance: string
}

export function useTokenSwap() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [swapStats, setSwapStats] = useState<SwapStats>({
    rate: 100,
    contractTokenBalance: "0",
    contractAvaxBalance: "0",
    userTokenBalance: "0",
    userAvaxBalance: "0"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Connect wallet
  const connect = async () => {
    try {
      setIsLoading(true)
      setError("")
      const { address } = await connectWallet()
      setUserAddress(address)
      setIsConnected(true)
      await loadSwapStats(address)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  // Load swap statistics
  const loadSwapStats = async (address?: string) => {
    try {
      const provider = getProvider()
      const swapContract = getTokenAvaxSwapContract(provider)
      const tokenContract = getMyTokenContract(provider)

      // Get contract stats
      const [rate, contractTokenBalance, contractAvaxBalance] = await Promise.all([
        swapContract.rate(),
        swapContract.getContractTokenBalance(),
        swapContract.getContractAvaxBalance()
      ])

      let userTokenBalance = "0"
      let userAvaxBalance = "0"

      if (address) {
        // Get user balances
        const [tokenBalance, avaxBalance] = await Promise.all([
          tokenContract.balanceOf(address),
          provider.getBalance(address)
        ])
        userTokenBalance = ethers.formatEther(tokenBalance)
        userAvaxBalance = ethers.formatEther(avaxBalance)
      }

      setSwapStats({
        rate: Number(rate),
        contractTokenBalance: ethers.formatEther(contractTokenBalance),
        contractAvaxBalance: ethers.formatEther(contractAvaxBalance),
        userTokenBalance,
        userAvaxBalance
      })
    } catch (err: any) {
      console.error("Error loading swap stats:", err)
      setError("Failed to load swap statistics")
    }
  }

  // Buy tokens with AVAX
  const buyTokens = async (avaxAmount: string) => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    try {
      setIsLoading(true)
      setError("")

      const { signer } = await connectWallet()
      const swapContract = getTokenAvaxSwapContract(signer)

      const tx = await swapContract.buyTokens({
        value: ethers.parseEther(avaxAmount)
      })

      await tx.wait()
      
      // Reload stats after successful transaction
      await loadSwapStats(userAddress)
      
      return tx.hash
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Transaction failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Sell tokens for AVAX
  const sellTokens = async (tokenAmount: string) => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    try {
      setIsLoading(true)
      setError("")

      const { signer } = await connectWallet()
      const swapContract = getTokenAvaxSwapContract(signer)
      const tokenContract = getMyTokenContract(signer)

      // First approve the swap contract to spend tokens
      const approvalTx = await tokenContract.approve(
        swapContract.target,
        ethers.parseEther(tokenAmount)
      )
      await approvalTx.wait()

      // Then sell the tokens
      const sellTx = await swapContract.sellTokens(ethers.parseUnits(tokenAmount, 4))
      await sellTx.wait()

      // Reload stats after successful transaction
      await loadSwapStats(userAddress)
      
      return sellTx.hash
    } catch (err: any) {
      const errorMessage = err.reason || err.message || "Transaction failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate token amount for given AVAX
  const calculateTokensForAvax = (avaxAmount: string): string => {
    if (!avaxAmount || isNaN(Number(avaxAmount))) return "0"
    return (Number(avaxAmount) * swapStats.rate).toString()
  }

  // Calculate AVAX amount for given tokens
  const calculateAvaxForTokens = (tokenAmount: string): string => {
    if (!tokenAmount || isNaN(Number(tokenAmount))) return "0"
    return (Number(tokenAmount) / swapStats.rate).toString()
  }

  // Load initial stats on mount
  useEffect(() => {
    loadSwapStats()
  }, [])

  return {
    isConnected,
    userAddress,
    swapStats,
    isLoading,
    error,
    connect,
    buyTokens,
    sellTokens,
    calculateTokensForAvax,
    calculateAvaxForTokens,
    refreshStats: () => loadSwapStats(userAddress)
  }
} 