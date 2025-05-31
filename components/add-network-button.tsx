"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function AddNetworkButton() {
  const addAvalancheFuji = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Verificar si la red ya existe
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xA869' }], // 43113 en hexadecimal
          })
          console.log('Red Avalanche Fuji ya existe')
          return
        } catch (switchError: any) {
          // Si la red no existe, la agregamos
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xA869', // 43113 en hexadecimal
                  chainName: 'Avalanche Fuji Testnet',
                  nativeCurrency: {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18,
                  },
                  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
                },
              ],
            })
            console.log('Red Avalanche Fuji agregada exitosamente')
          } else {
            console.error('Error agregando red:', switchError)
          }
        }
      } catch (error) {
        console.error('Error cambiando red:', error)
      }
    }
  }

  return (
    <Button
      onClick={addAvalancheFuji}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <Plus className="w-4 h-4" />
      <span>Add Fuji Network</span>
    </Button>
  )
} 