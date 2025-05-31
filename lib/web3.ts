import { ethers } from "ethers"

// Avalanche C-Chain configuration
export const AVALANCHE_CONFIG = {
  chainId: "43113", // Fuji testnet
  chainName: "Avalanche Fuji Testnet",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://ava-testnet.public.blastapi.io/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
}

// Contract addresses
export const CONTRACT_ADDRESSES = {
  SWAP_QUEST: "0x1234567890123456789012345678901234567890",
  ARENA_TOKEN: "0x0987654321098765432109876543210987654321",
  SWAP_TRACKER: "0x1111111111111111111111111111111111111111",
  TOKEN_AVAX_SWAP: "0xEa14657726C0a201Fb9a09cFee5531FD0B78a122", // Provided swap contract
  MY_TOKEN: "0x2222222222222222222222222222222222222222", // To be updated with actual address
}

// Contract ABIs
export const SWAP_QUEST_ABI = [
  "function missions(uint256) view returns (tuple(uint256 id, address fromToken, address toToken, uint256 fromAmount, uint256 requiredSwaps, uint256 rewardAmount, bool isActive, uint256 expiryTime))",
  "function userProgress(address, uint256) view returns (tuple(uint256 completedSwaps, uint256 lastSwapTime, bool claimed))",
  "function userArenaBalance(address) view returns (uint256)",
  "function recordSwap(uint256 missionId, address user, uint256 amountSwapped)",
  "function claimRewards()",
  "function getMission(uint256 missionId) view returns (tuple(uint256 id, address fromToken, address toToken, uint256 fromAmount, uint256 requiredSwaps, uint256 rewardAmount, bool isActive, uint256 expiryTime))",
  "function getUserProgress(address user, uint256 missionId) view returns (uint256 completedSwaps, uint256 lastSwapTime, bool claimed)",
  "event SwapCompleted(address indexed user, uint256 indexed missionId, uint256 swapCount)",
  "event MissionCompleted(address indexed user, uint256 indexed missionId, uint256 rewardAmount)",
]

export const ARENA_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
]

export const TOKEN_AVAX_SWAP_ABI = [
  "function token() view returns (address)",
  "function owner() view returns (address)",
  "function rate() view returns (uint256)",
  "function buyTokens() payable",
  "function sellTokens(uint256 tokenAmount)",
  "function setRate(uint256 _rate)",
  "function withdrawAvax()",
  "function withdrawTokens()",
  "function getContractTokenBalance() view returns (uint256)",
  "function getContractAvaxBalance() view returns (uint256)",
  "event TokensPurchased(address indexed buyer, uint256 avaxAmount, uint256 tokenAmount)",
  "event TokensSold(address indexed seller, uint256 tokenAmount, uint256 avaxAmount)",
  "event RateUpdated(uint256 newRate)",
]

export const MY_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function owner() view returns (address)",
]

// Web3 Provider setup
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum as any)
  }
  // Fallback to public RPC
  return new ethers.JsonRpcProvider(AVALANCHE_CONFIG.rpcUrls[0])
}

// Connect wallet
export const connectWallet = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed")
  }

  try {
    // Request account access
    await (window.ethereum as any).request({ method: "eth_requestAccounts" })

    // Add Avalanche network if not present
    try {
      await (window.ethereum as any).request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: AVALANCHE_CONFIG.chainId }],
      })
    } catch (switchError: any) {
      // Network not added, add it
      if (switchError.code === 4902) {
        await (window.ethereum as any).request({
          method: "wallet_addEthereumChain",
          params: [AVALANCHE_CONFIG],
        })
      }
    }

    const provider = getProvider()
    const signer = await provider.getSigner()
    const address = await signer.getAddress()

    return { provider, signer, address }
  } catch (error) {
    console.error("Error connecting wallet:", error)
    throw error
  }
}

// Get contract instances
export const getSwapQuestContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESSES.SWAP_QUEST, SWAP_QUEST_ABI, signerOrProvider)
}

export const getArenaTokenContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESSES.ARENA_TOKEN, ARENA_TOKEN_ABI, signerOrProvider)
}

export const getTokenAvaxSwapContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESSES.TOKEN_AVAX_SWAP, TOKEN_AVAX_SWAP_ABI, signerOrProvider)
}

export const getMyTokenContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESSES.MY_TOKEN, MY_TOKEN_ABI, signerOrProvider)
}
