// Enhanced Token Scanner - Alchemy API Only
class EnhancedTokenScanner {
    constructor(provider, signer) {
        this.provider = provider;
        this.signer = signer;
        this.tokens = [];
        this.logStatus = (message, type) => console.log(`[${type.toUpperCase()}] ${message}`);
    }

    getFallbackTokens() {
        // Fallback token list when config.js is not loaded
        return [
            { name: 'USDC', symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: 'usdc.png' },
            { name: 'USDT', symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: 'usdt.png' },
            { name: 'DAI', symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, logo: 'dai.png' },
            { name: 'Wrapped Ether', symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, logo: 'weth.png' },
            { name: 'Wrapped BTC', symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: 'wbtc.png' },
            { name: 'Uniswap', symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, logo: 'uni.png' },
            { name: 'Chainlink', symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, logo: 'link.png' },
            { name: 'MOMA Protocol', symbol: 'MOMAT', address: '0x00f548bc685e4b495ba559e881112fdd4576f331', decimals: 18, logo: 'moma.png' }
        ];
    }

    async scanAllTokens() {
        try {
            this.logStatus('🔍 Starting comprehensive token scan with Alchemy API...', 'info');
            this.tokens = [];
            
            // Step 1: Use Alchemy API for complete token detection
            await this.scanWithAlchemyAPI();
            
            // Step 2: Fallback to predefined tokens if API fails
            if (this.tokens.length === 0) {
                this.logStatus('API scan found no tokens, trying predefined tokens...', 'warning');
                await this.scanPredefinedTokens();
            }
            
            // Step 3: Enrich metadata for all found tokens
            await this.enrichTokenMetadata();
            
            this.logStatus(`✅ Found ${this.tokens.length} tokens total`, 'success');
            return this.tokens;
            
        } catch (error) {
            this.logStatus(`Token scanning failed: ${error.message}`, 'error');
            // Fallback to basic scan
            return await this.scanPredefinedTokens();
        }
    }

    async scanWithAlchemyAPI() {
        try {
            this.logStatus('🌐 Scanning with Alchemy API...', 'info');
            const userAddress = await this.signer.getAddress();
            
            // Use Alchemy's getTokenBalances API
            const response = await fetch(`https://eth-mainnet.g.alchemy.com/v2/demo/getTokenBalances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'alchemy_getTokenBalances',
                    params: [userAddress],
                    id: 1
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.result && data.result.tokenBalances) {
                    for (const tokenBalance of data.result.tokenBalances) {
                        if (tokenBalance.tokenBalance && tokenBalance.tokenBalance !== '0x0') {
                            await this.processTokenFromAPI(tokenBalance.contractAddress, tokenBalance.tokenBalance);
                        }
                    }
                    this.logStatus(`Found ${this.tokens.length} tokens via Alchemy API`, 'success');
                }
            } else {
                this.logStatus('Alchemy API request failed', 'warning');
            }
        } catch (error) {
            console.warn('Alchemy API scan failed:', error);
            this.logStatus('Alchemy API scan failed, using fallback', 'warning');
        }
    }

    async processTokenFromAPI(tokenAddress, balanceHex) {
        try {
            // Skip if we already have this token
            if (this.tokens.some(t => t.address.toLowerCase() === tokenAddress.toLowerCase())) {
                return;
            }
            
            const balance = ethers.BigNumber.from(balanceHex);
            if (balance.gt(0)) {
                let decimals = 18;
                let symbol = 'UNKNOWN';
                let name = 'Unknown Token';
                let isLP = false;
                
                try {
                    const tokenContract = new ethers.Contract(
                        tokenAddress,
                        [
                            'function decimals() view returns (uint8)',
                            'function symbol() view returns (string)',
                            'function name() view returns (string)',
                            'function token0() view returns (address)',
                            'function token1() view returns (address)'
                        ],
                        this.provider
                    );
                    
                    decimals = await tokenContract.decimals();
                    symbol = await tokenContract.symbol();
                    name = await tokenContract.name();
                    
                    // Check if it's an LP token by trying to get token0 and token1
                    try {
                        const token0 = await tokenContract.token0();
                        const token1 = await tokenContract.token1();
                        
                        if (token0 && token1) {
                            isLP = true;
                            
                            // Get symbols for token0 and token1
                            const token0Contract = new ethers.Contract(
                                token0,
                                ['function symbol() view returns (string)'],
                                this.provider
                            );
                            const token1Contract = new ethers.Contract(
                                token1,
                                ['function symbol() view returns (string)'],
                                this.provider
                            );
                            
                            const token0Symbol = await token0Contract.symbol();
                            const token1Symbol = await token1Contract.symbol();
                            
                            symbol = `${token0Symbol}/${token1Symbol}`;
                            name = `${token0Symbol}/${token1Symbol} LP Token`;
                        }
                    } catch (error) {
                        // Not an LP token, that's fine
                    }
                    
                } catch (error) {
                    console.warn(`Failed to get metadata for token ${tokenAddress}:`, error);
                }
                
                const token = {
                    address: tokenAddress,
                    name: name,
                    symbol: symbol,
                    decimals: decimals,
                    balance: balance,
                    formattedBalance: ethers.utils.formatUnits(balance, decimals),
                    value: 0,
                    isKnown: false,
                    isLP: isLP,
                    logo: isLP ? 'lp.png' : 'unknown.png',
                    source: 'alchemy_api'
                };
                
                this.tokens.push(token);
            }
        } catch (error) {
            console.warn(`Failed to process token ${tokenAddress}:`, error);
        }
    }

    async scanPredefinedTokens() {
        try {
            this.logStatus('📋 Scanning predefined tokens...', 'info');
            const commonTokens = window.CONFIG?.COMMON_TOKENS || this.getFallbackTokens();
            
            for (const tokenInfo of commonTokens) {
                try {
                    const balance = await this.getTokenBalance(tokenInfo.address);
                    if (balance.gt(0)) {
                        const token = {
                            ...tokenInfo,
                            balance: balance,
                            formattedBalance: ethers.utils.formatUnits(balance, tokenInfo.decimals),
                            value: 0,
                            isKnown: true,
                            source: 'predefined'
                        };
                        this.tokens.push(token);
                    }
                } catch (error) {
                    console.warn(`Failed to check predefined token ${tokenInfo.symbol}:`, error);
                }
            }
        } catch (error) {
            console.warn('Failed to scan predefined tokens:', error);
        }
    }

    async getTokenBalance(tokenAddress) {
        try {
            const tokenContract = new ethers.Contract(
                tokenAddress,
                ['function balanceOf(address) view returns (uint256)'],
                this.provider
            );
            
            const userAddress = await this.signer.getAddress();
            return await tokenContract.balanceOf(userAddress);
        } catch (error) {
            return ethers.BigNumber.from(0);
        }
    }

    async enrichTokenMetadata() {
        try {
            this.logStatus('📊 Enriching token metadata...', 'info');
            
            for (const token of this.tokens) {
                if (!token.isKnown) {
                    try {
                        // Try CoinGecko API for additional metadata
                        const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${token.address}`);
                        if (response.ok) {
                            const data = await response.json();
                            token.name = data.name || token.name;
                            token.symbol = data.symbol?.toUpperCase() || token.symbol;
                            token.logo = data.image?.small || token.logo;
                            token.coingeckoId = data.id;
                        }
                    } catch (error) {
                        console.warn(`Failed to enrich metadata for ${token.symbol}:`, error);
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to enrich token metadata:', error);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedTokenScanner;
} else {
    window.EnhancedTokenScanner = EnhancedTokenScanner;
}
