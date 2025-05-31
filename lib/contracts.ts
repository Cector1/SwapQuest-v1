// Configuración centralizada de contratos para Avalanche Fuji Testnet
export const CONTRACTS = {
  // ACTUALIZAR ESTAS DIRECCIONES CON LAS REALES DESPUÉS DEL DEPLOY
  SWAP_QUEST: '0x1234567890123456789012345678901234567890' as const,
  WLD_TOKEN: '0x0987654321098765432109876543210987654321' as const,
  SWAP_TRACKER: '0x1111111111111111111111111111111111111111' as const,
} as const

// Información de la red
export const NETWORK_CONFIG = {
  chainId: 43113, // Avalanche Fuji Testnet
  name: 'Avalanche Fuji Testnet',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
  blockExplorer: 'https://testnet.snowtrace.io',
} as const

// Función helper para obtener URL del explorador de bloques
export const getExplorerUrl = (txHash: string) => {
  return `${NETWORK_CONFIG.blockExplorer}/tx/${txHash}`
}

export const getAddressUrl = (address: string) => {
  return `${NETWORK_CONFIG.blockExplorer}/address/${address}`
}

// Función para validar si las direcciones están configuradas
export const areContractsConfigured = () => {
  return !Object.values(CONTRACTS).some(address => 
    address === '0x1234567890123456789012345678901234567890' ||
    address === '0x0987654321098765432109876543210987654321' ||
    address === '0x1111111111111111111111111111111111111111'
  )
}

// Función para actualizar las direcciones (para uso en desarrollo)
export const updateContractAddresses = (addresses: {
  swapQuest?: string
  wldToken?: string
  swapTracker?: string
}) => {
  console.log('Updating contract addresses:', addresses)
  
  if (addresses.swapQuest) {
    console.log('SwapQuest:', addresses.swapQuest)
  }
  if (addresses.wldToken) {
    console.log('WldToken:', addresses.wldToken)
  }
  if (addresses.swapTracker) {
    console.log('SwapTracker:', addresses.swapTracker)
  }
  
  console.log('Remember to update the CONTRACTS object in lib/contracts.ts')
}

export const TOKENS = {
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000' as const,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' as const,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7' as const,
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB' as const,
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0x50b7545627a5162F82A992c33b87aDc75187B218' as const,
  },
  LINK: {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    address: '0x5947BB275c521040051D82396192181b413227A3' as const,
  },
  JOE: {
    symbol: 'JOE',
    name: 'TraderJoe',
    decimals: 18,
    address: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd' as const,
  },
  WAVAX: {
    symbol: 'WAVAX',
    name: 'Wrapped AVAX',
    decimals: 18,
    address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' as const,
  },
} as const

export function getContractAddresses(chainId?: number) {
  const addresses = {
    swapQuest: CONTRACTS.SWAP_QUEST,
    wldToken: CONTRACTS.WLD_TOKEN
  }
  
  if (addresses.wldToken) {
    console.log('WldToken:', addresses.wldToken)
  }
  
  return addresses
} 