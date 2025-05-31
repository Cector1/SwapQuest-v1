interface ArenaAppSdkConfig {
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

interface WalletChangedEvent {
  address: string;
  chainId?: string;
}

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  walletAddress: string;
}

interface TransactionParams {
  from: string;
  to: string;
  value: string;
  gas?: string;
  gasPrice?: string;
  data?: string;
}

interface EthereumProvider {
  accounts: string[];
  request: (params: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: Function) => void;
  removeListener: (event: string, callback: Function) => void;
}

export class ArenaAppStoreSdk {
  private config: ArenaAppSdkConfig;
  private eventListeners: Map<string, Function[]> = new Map();
  public provider: EthereumProvider;
  private isInitialized = false;

  constructor(config: ArenaAppSdkConfig) {
    this.config = config;
    this.provider = this.createMockProvider();
    this.initialize();
  }

  private async initialize() {
    try {
      // In a real implementation, this would connect to Arena's infrastructure
      console.log('Initializing Arena App SDK...');
      console.log('Project ID:', this.config.projectId);
      console.log('App Metadata:', this.config.metadata);
      
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isInitialized = true;
      console.log('Arena App SDK initialized successfully');
      
      // Emit wallet connection event
      this.emit('walletChanged', { 
        address: '0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f' 
      });
    } catch (error) {
      console.error('Failed to initialize Arena App SDK:', error);
    }
  }

  private createMockProvider(): EthereumProvider {
    return {
      accounts: ['0x742d35Cc6634C0532925a3b8D20Eb0d8f4C2f35f'],
      request: async ({ method, params }) => {
        console.log('Arena SDK Provider Request:', method, params);
        
        switch (method) {
          case 'eth_getBalance':
            return '0x1bc16d674ec80000'; // 2 ETH in wei
          case 'eth_sendTransaction':
            return `0x${Math.random().toString(16).substring(2, 66)}`;
          case 'eth_accounts':
            return this.provider.accounts;
          case 'eth_chainId':
            return '0xa869'; // Fuji testnet
          case 'wallet_requestPermissions':
            return [{ parentCapability: 'eth_accounts' }];
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      },
      on: (event: string, callback: Function) => {
        if (!this.eventListeners.has(event)) {
          this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
      },
      removeListener: (event: string, callback: Function) => {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
          const index = listeners.indexOf(callback);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      }
    };
  }

  public on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  public async sendRequest(method: string, params?: any): Promise<any> {
    console.log('Arena SDK Request:', method, params);
    
    switch (method) {
      case 'getUserProfile':
        return {
          id: 'user123',
          username: 'arena_user',
          email: 'user@arena.com',
          avatar: 'https://avatar.url',
          walletAddress: this.provider.accounts[0]
        } as UserProfile;
      
      case 'getWalletBalance':
        return await this.provider.request({
          method: 'eth_getBalance',
          params: [this.provider.accounts[0], 'latest']
        });
      
      case 'sendTransaction':
        return await this.provider.request({
          method: 'eth_sendTransaction',
          params: [params]
        });
      
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }

  public async connect(): Promise<string[]> {
    if (!this.isInitialized) {
      throw new Error('SDK not initialized');
    }
    
    // In real implementation, this would trigger Arena's wallet connection flow
    console.log('Connecting to Arena wallet...');
    return this.provider.accounts;
  }

  public async disconnect(): Promise<void> {
    console.log('Disconnecting from Arena wallet...');
    // Clear accounts and emit disconnect event
    this.provider.accounts = [];
    this.emit('disconnect', {});
  }

  public isConnected(): boolean {
    return this.provider.accounts.length > 0;
  }

  public getAccount(): string | null {
    return this.provider.accounts[0] || null;
  }
}

// Global instance for the app
let arenaAppSdkInstance: ArenaAppStoreSdk | null = null;

export function initializeArenaSDK(config: ArenaAppSdkConfig): ArenaAppStoreSdk {
  if (!arenaAppSdkInstance) {
    arenaAppSdkInstance = new ArenaAppStoreSdk(config);
  }
  return arenaAppSdkInstance;
}

export function getArenaSDK(): ArenaAppStoreSdk | null {
  return arenaAppSdkInstance;
} 