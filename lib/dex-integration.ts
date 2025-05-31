import { Contract, formatEther, formatUnits, parseUnits } from 'ethers';

// Fuji Testnet Token Addresses
export const FUJI_TOKENS = {
  AVAX: '0x0000000000000000000000000000000000000000', // Native AVAX
  WAVAX: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
  USDC: '0x5425890298aed601595a70AB815c96711a31Bc65',
  USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
  ETH: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  BTC: '0x50b7545627a5162F82A992c33b87aDc75187B218',
  LINK: '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846',
  JOE: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd',
};

// TraderJoe Router on Fuji
export const TRADERJOE_ROUTER = '0x60aE616a2155Ee3d9A68541Ba4544862310933d4';

// ERC20 ABI (simplified)
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

// TraderJoe Router ABI (simplified)
export const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactAVAXForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForAVAX(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

export interface SwapQuote {
  amountIn: string;
  amountOut: string;
  minimumAmountOut: string;
  priceImpact: number;
  gasEstimate: string;
  path: string[];
}

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage?: number; // percentage (e.g., 1 for 1%), defaults to 1%
  userAddress: string;
}

export class RealDexIntegration {
  private provider: any; // Reown/Wagmi compatible provider

  constructor(provider: any) {
    this.provider = provider;
  }

  // Get token information
  async getTokenInfo(tokenAddress: string) {
    try {
      if (tokenAddress === FUJI_TOKENS.AVAX) {
        return { symbol: 'AVAX', decimals: 18 };
      }

      // For now, return hardcoded info for known tokens
      const tokenInfo = this.getKnownTokenInfo(tokenAddress);
      if (tokenInfo) {
        return tokenInfo;
      }

      return { symbol: 'UNKNOWN', decimals: 18 };
    } catch (error) {
      console.error('Error getting token info:', error);
      return { symbol: 'UNKNOWN', decimals: 18 };
    }
  }

  // Get hardcoded token info for known Fuji tokens
  private getKnownTokenInfo(address: string) {
    const tokenMap: Record<string, { symbol: string, decimals: number }> = {
      [FUJI_TOKENS.WAVAX]: { symbol: 'WAVAX', decimals: 18 },
      [FUJI_TOKENS.USDC]: { symbol: 'USDC', decimals: 6 },
      [FUJI_TOKENS.USDT]: { symbol: 'USDT', decimals: 6 },
      [FUJI_TOKENS.ETH]: { symbol: 'ETH', decimals: 18 },
      [FUJI_TOKENS.BTC]: { symbol: 'BTC', decimals: 8 },
      [FUJI_TOKENS.LINK]: { symbol: 'LINK', decimals: 18 },
      [FUJI_TOKENS.JOE]: { symbol: 'JOE', decimals: 18 },
    };
    return tokenMap[address.toLowerCase()] || null;
  }

  // Get token balance (simplified for Reown integration)
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      if (tokenAddress === FUJI_TOKENS.AVAX) {
        // For native AVAX, we'd need the provider balance
        // This is simplified for demo purposes
        return "1.0";
      } else {
        // For ERC20 tokens, return demo balance
        return "100.0";
      }
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }

  // Get swap quote (simplified for Reown demo)
  async getSwapQuote(params: SwapParams): Promise<SwapQuote> {
    try {
      console.log('Getting swap quote with params:', params);
      
      const fromTokenAddress = this.getTokenAddress(params.fromToken);
      const toTokenAddress = this.getTokenAddress(params.toToken);
      
      // Build swap path
      const path = this.buildSwapPath(fromTokenAddress, toTokenAddress);
      
      // Get token info
      const fromTokenInfo = await this.getTokenInfo(fromTokenAddress);
      const toTokenInfo = await this.getTokenInfo(toTokenAddress);

      // Simplified quote calculation for demo
      // In production, this would call the actual router contract
      const inputAmount = parseFloat(params.amount);
      const mockExchangeRate = this.getMockExchangeRate(params.fromToken, params.toToken);
      const outputAmount = inputAmount * mockExchangeRate;
      
      // Calculate slippage
      const slippage = params.slippage || 1;
      const minimumOutput = outputAmount * (1 - slippage / 100);
      
      // Mock values for demo
      const priceImpact = 0.1; // 0.1%
      const gasEstimate = "150000"; // 150k gas units
      
      return {
        amountIn: params.amount,
        amountOut: outputAmount.toFixed(6),
        minimumAmountOut: minimumOutput.toFixed(6),
        priceImpact,
        gasEstimate,
        path
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw error;
    }
  }

  // Mock exchange rates for demo
  private getMockExchangeRate(fromToken: string, toToken: string): number {
    // All rates are to AVAX for this demo
    const rates: Record<string, number> = {
      'USDC': 0.067, // 1 USDC = 0.067 AVAX
      'USDT': 0.067, // 1 USDT = 0.067 AVAX
      'ETH': 67.5, // 1 ETH = 67.5 AVAX
      'BTC': 1350, // 1 BTC = 1350 AVAX
      'LINK': 0.85, // 1 LINK = 0.85 AVAX
      'JOE': 0.0085, // 1 JOE = 0.0085 AVAX
    };

    if (toToken === 'AVAX' && rates[fromToken]) {
      return rates[fromToken];
    }

    // Default rate
    return 1.0;
  }

  // Execute swap (mock for demo with Reown)
  async executeSwap(params: SwapParams): Promise<string> {
    try {
      console.log('Executing mock swap for Reown demo:', params);
      
      // Simulate transaction execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      console.log('Mock swap executed with hash:', mockTxHash);
      return mockTxHash;
    } catch (error) {
      console.error('Error executing swap:', error);
      throw error;
    }
  }

  // Mock approve token for demo
  async approveToken(tokenAddress: string, spenderAddress: string, amount: string): Promise<void> {
    try {
      console.log('Mock token approval for Reown demo');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Mock token approval completed');
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    }
  }

  // Get token address from symbol
  private getTokenAddress(tokenSymbol: string): string {
    const symbol = tokenSymbol.toUpperCase();
    const address = FUJI_TOKENS[symbol as keyof typeof FUJI_TOKENS];
    
    if (!address) {
      throw new Error(`Token ${tokenSymbol} not supported`);
    }
    
    return address;
  }

  // Build swap path through WAVAX if needed
  private buildSwapPath(fromToken: string, toToken: string): string[] {
    if (fromToken === FUJI_TOKENS.AVAX) {
      // AVAX to token
      if (toToken === FUJI_TOKENS.WAVAX) {
        return [FUJI_TOKENS.WAVAX, toToken]; // Direct path
      }
      return [FUJI_TOKENS.WAVAX, toToken]; // Through WAVAX
    }
    
    if (toToken === FUJI_TOKENS.AVAX) {
      // Token to AVAX
      if (fromToken === FUJI_TOKENS.WAVAX) {
        return [fromToken, FUJI_TOKENS.WAVAX]; // Direct path
      }
      return [fromToken, FUJI_TOKENS.WAVAX]; // Through WAVAX
    }
    
    // Token to token (through WAVAX)
    if (fromToken === FUJI_TOKENS.WAVAX || toToken === FUJI_TOKENS.WAVAX) {
      return [fromToken, toToken]; // Direct path
    }
    
    return [fromToken, FUJI_TOKENS.WAVAX, toToken]; // Through WAVAX
  }
}

// Utility function to create DEX integration instance
export function createDexIntegration(provider: any): RealDexIntegration {
  return new RealDexIntegration(provider);
} 