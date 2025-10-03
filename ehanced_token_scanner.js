// Enhanced Token Scanner - Comprehensive ERC-20 Token Detection
class EnhancedTokenScanner {
    constructor(provider, signer) {
        this.provider = provider;
        this.signer = signer;
        this.tokens = [];
        this.logStatus = (message, type) => console.log(`[${type.toUpperCase()}] ${message}`);
    }

    async scanAllTokens() {
        try {
            this.logStatus('🔍 Starting comprehensive token scan...', 'info');
            this.tokens = [];
            
            // Step 1: Scan predefined tokens
            await this.scanPredefinedTokens();
            
            // Step 2: Scan using Transfer events
            await this.scanUsingTransferEvents();
            
            // Step 3: Scan common token addresses
            await this.scanCommonTokenAddresses();
            
            // Step 4: Scan LP tokens
            await this.scanLPTokens();
            
            // Step 5: Enrich metadata
            await this.enrichTokenMetadata();
            
            this.logStatus(`✅ Found ${this.tokens.length} tokens total`, 'success');
            return this.tokens;
            
        } catch (error) {
            this.logStatus(`Token scanning failed: ${error.message}`, 'error');
            return [];
        }
    }

    async scanPredefinedTokens() {
        try {
            this.logStatus('📋 Scanning predefined tokens...', 'info');
            const commonTokens = window.CONFIG?.COMMON_TOKENS || [];
            
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

    async scanUsingTransferEvents() {
        try {
            this.logStatus('🔍 Scanning using Transfer events...', 'info');
            const userAddress = await this.signer.getAddress();
            
            // Get recent blocks
            const currentBlock = await this.provider.getBlockNumber();
            const fromBlock = Math.max(currentBlock - 20000, 0); // Last ~20k blocks
            
            // ERC-20 Transfer event signature
            const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
            
            // Get Transfer events
            const filter = {
                topics: [transferTopic],
                fromBlock: fromBlock,
                toBlock: currentBlock
            };
            
            const logs = await this.provider.getLogs(filter);
            const tokenAddresses = new Set();
            
            // Extract token addresses where user was involved
            for (const log of logs) {
                try {
                    const decoded = ethers.utils.defaultAbiCoder.decode(
                        ['address', 'address', 'uint256'],
                        log.data
                    );
                    
                    const from = decoded[0];
                    const to = decoded[1];
                    
                    if (from.toLowerCase() === userAddress.toLowerCase() || 
                        to.toLowerCase() === userAddress.toLowerCase()) {
                        tokenAddresses.add(log.address);
                    }
                } catch (error) {
                    console.warn('Failed to decode Transfer event:', error);
                }
            }
            
            this.logStatus(`Found ${tokenAddresses.size} token addresses from events`, 'info');
            
            // Check balance for each token
            for (const tokenAddress of tokenAddresses) {
                await this.checkUnknownToken(tokenAddress);
            }
            
        } catch (error) {
            console.warn('Failed to scan using Transfer events:', error);
        }
    }

    async scanCommonTokenAddresses() {
        try {
            this.logStatus('📋 Scanning common token addresses...', 'info');
            
            // Comprehensive list of popular ERC-20 tokens
            const commonAddresses = [
                // Stablecoins
                '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
                '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
                '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
                '0x4Fabb145d64652a948d72533023f6E7A623C7C53', // BUSD
                
                // Wrapped tokens
                '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
                '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
                
                // DeFi tokens
                '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
                '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE
                '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR
                '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
                '0x0bc529c00C6401aEF6D220BE8c6E16616668bD1C', // YFI
                '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', // SUSHI
                '0x7d1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
                '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', // MANA
                
                // Meme tokens
                '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // SHIB
                '0x4d224452801ACEd8B2F0aebE155379bb5D594381', // APE
                
                // Other popular tokens
                '0x00f548bc685e4b495ba559e881112fdd4576f331', // MOMAT
                '0x3845badAde8e6dDD04FcF80a6C2232d0C4c4C4C4', // AXS
                '0x2ba592F78dB6436527729929AAf6c908497cB200', // CREAM
                '0x1fE24F25ec1C893edE74B2c3906c939B8Ad5D652', // BNT
                '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9', // FTT
                '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', // ILV
                '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA', // GALA
                '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', // INST
                '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9', // SXP
                '0x3472A5A71965499acd81997a54BBA8D852C6E53d', // BADGER
                '0x0bc529c00C6401aEF6D220BE8c6E16616668bD1C', // YFI
                '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
                '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
                '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE
                '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR
                '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
                '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', // SUSHI
                '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', // MANA
                '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // SHIB
                '0x4d224452801ACEd8B2F0aebE155379bb5D594381', // APE
                '0x00f548bc685e4b495ba559e881112fdd4576f331', // MOMAT
                '0x3845badAde8e6dDD04FcF80a6C2232d0C4c4C4C4', // AXS
                '0x2ba592F78dB6436527729929AAf6c908497cB200', // CREAM
                '0x1fE24F25ec1C893edE74B2c3906c939B8Ad5D652', // BNT
                '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9', // FTT
                '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', // ILV
                '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA', // GALA
                '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', // INST
                '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9', // SXP
                '0x3472A5A71965499acd81997a54BBA8D852C6E53d', // BADGER
                '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
                '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE
                '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR
                '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
                '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', // SUSHI
                '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', // MANA
                '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // SHIB
                '0x4d224452801ACEd8B2F0aebE155379bb5D594381', // APE
                '0x00f548bc685e4b495ba559e881112fdd4576f331', // MOMAT
                '0x3845badAde8e6dDD04FcF80a6C2232d0C4c4C4C4', // AXS
                '0x2ba592F78dB6436527729929AAf6c908497cB200', // CREAM
                '0x1fE24F25ec1C893edE74B2c3906c939B8Ad5D652', // BNT
                '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9', // FTT
                '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', // ILV
                '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA', // GALA
                '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', // INST
                '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9', // SXP
                '0x3472A5A71965499acd81997a54BBA8D852C6E53d'  // BADGER
            ];
            
            // Remove duplicates
            const uniqueAddresses = [...new Set(commonAddresses)];
            
            for (const tokenAddress of uniqueAddresses) {
                await this.checkUnknownToken(tokenAddress);
            }
            
        } catch (error) {
            console.warn('Failed to scan common token addresses:', error);
        }
    }

    async scanLPTokens() {
        try {
            this.logStatus('🔄 Scanning for LP tokens...', 'info');
            
            // Popular LP token addresses
            const lpTokenAddresses = [
                // Uniswap V2 LP tokens (common pairs)
                '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', // USDC/WETH
                '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', // DAI/WETH
                '0xBb2b8038a1640196FbE3e38816F2eDaC4c4Feb9c', // WBTC/WETH
                '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0', // USDC/USDT
                '0x06da0fd433C1A5d7a4fbb01131109191f2138aD4', // LINK/WETH
                '0x1b96B92314C44b159149f7E0303511fB2Fc4774f', // UNI/WETH
                '0xDFC14d2Af169B0D36C4EFF567Ada9b2E0CAe044f', // AAVE/WETH
                '0x43AE24960e5534731Fc831386c07755A2dc33D47', // SNX/WETH
                '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640', // USDC/WETH V3
                '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8', // USDC/WETH V3
                
                // SushiSwap LP tokens
                '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0', // USDC/USDT
                '0x06da0fd433C1A5d7a4fbb01131109191f2138aD4', // LINK/WETH
                '0x1b96B92314C44b159149f7E0303511fB2Fc4774f', // UNI/WETH
                '0xDFC14d2Af169B0D36C4EFF567Ada9b2E0CAe044f', // AAVE/WETH
                
                // Curve LP tokens
                '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', // 3CRV (DAI/USDC/USDT)
                '0x49849C98ae39Fff122806C06791Fa73784FB3675', // crvRenWBTC
                '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3', // crvPlain3andSUSD
                '0x845838DF265Dcd806c61c9EFD53DA0B681c074Fa', // crvFRAX
                '0x4f062658EaAF2C1ccf8C8e36D6824Cf411111111', // crvUSD
                
                // Balancer LP tokens
                '0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56', // BAL/WETH 80/20
                '0x72Cd8f4504941Bf8c5a21d1Fd83C964A9b4a2616', // BAL/WETH 50/50
                '0x59A19D8c652FA0284f44113D0ff9aBa70bd46fB4', // BAL/USDC 80/20
                
                // Yearn LP tokens
                '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // yDAI
                '0x39AA39c021dfbaE8faC545936693aC917d5E7563', // yUSDC
                '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9', // yUSDT
                '0x16de59092dAE5CcF4A1E1799c0c251C4C4C4C4C4', // yTUSD
                
                // Compound LP tokens
                '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
                '0x39AA39c021dfbaE8faC545936693aC917d5E7563', // cUSDC
                '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9', // cUSDT
                '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5', // cETH
                
                // Aave LP tokens
                '0x028171bCA77440897B824Ca71D1c56caC55b68A3', // aDAI
                '0xBcca60bB61934080951369a648Fb03DF4F96263C', // aUSDC
                '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', // aUSDT
                '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e'  // aWETH
            ];
            
            // Remove duplicates
            const uniqueLPAddresses = [...new Set(lpTokenAddresses)];
            
            for (const lpAddress of uniqueLPAddresses) {
                await this.checkLPToken(lpAddress);
            }
            
        } catch (error) {
            console.warn('Failed to scan LP tokens:', error);
        }
    }

    async checkLPToken(lpAddress) {
        try {
            // Skip if we already have this token
            if (this.tokens.some(t => t.address.toLowerCase() === lpAddress.toLowerCase())) {
                return;
            }
            
            const balance = await this.getTokenBalance(lpAddress);
            
            if (balance.gt(0)) {
                let decimals = 18;
                let symbol = 'UNKNOWN-LP';
                let name = 'Unknown LP Token';
                let isLP = true;
                
                try {
                    const tokenContract = new ethers.Contract(
                        lpAddress,
                        [
                            'function decimals() view returns (uint8)',
                            'function symbol() view returns (string)',
                            'function name() view returns (string)',
                            'function token0() view returns (address)',
                            'function token1() view returns (address)',
                            'function getReserves() view returns (uint112, uint112, uint32)'
                        ],
                        this.provider
                    );
                    
                    decimals = await tokenContract.decimals();
                    symbol = await tokenContract.symbol();
                    name = await tokenContract.name();
                    
                    // Try to get token0 and token1 for LP pairs
                    try {
                        const token0 = await tokenContract.token0();
                        const token1 = await tokenContract.token1();
                        
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
                        
                    } catch (error) {
                        console.warn(`Failed to get LP pair info for ${lpAddress}:`, error);
                    }
                    
                } catch (error) {
                    console.warn(`Failed to get metadata for LP token ${lpAddress}:`, error);
                }
                
                const token = {
                    address: lpAddress,
                    name: name,
                    symbol: symbol,
                    decimals: decimals,
                    balance: balance,
                    formattedBalance: ethers.utils.formatUnits(balance, decimals),
                    value: 0,
                    isKnown: false,
                    isLP: true,
                    logo: 'lp.png',
                    source: 'lp_discovered'
                };
                
                this.tokens.push(token);
            }
        } catch (error) {
            console.warn(`Failed to check LP token ${lpAddress}:`, error);
        }
    }

    async checkUnknownToken(tokenAddress) {
        try {
            // Skip if we already have this token
            if (this.tokens.some(t => t.address.toLowerCase() === tokenAddress.toLowerCase())) {
                return;
            }
            
            const balance = await this.getTokenBalance(tokenAddress);
            
            if (balance.gt(0)) {
                let decimals = 18;
                let symbol = 'UNKNOWN';
                let name = 'Unknown Token';
                
                try {
                    const tokenContract = new ethers.Contract(
                        tokenAddress,
                        [
                            'function decimals() view returns (uint8)',
                            'function symbol() view returns (string)',
                            'function name() view returns (string)'
                        ],
                        this.provider
                    );
                    
                    decimals = await tokenContract.decimals();
                    symbol = await tokenContract.symbol();
                    name = await tokenContract.name();
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
                    logo: 'unknown.png',
                    source: 'discovered'
                };
                
                this.tokens.push(token);
            }
        } catch (error) {
            console.warn(`Failed to check unknown token ${tokenAddress}:`, error);
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
                        // Try CoinGecko API
                        const response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${token.address}`);
                        if (response.ok) {
                            const data = await response.json();
                            token.name = data.name || token.name;
                            token.symbol = data.symbol?.toUpperCase() || token.symbol;
                            token.logo = data.image?.small || 'unknown.png';
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

    // Get comprehensive token list from external sources
    async fetchComprehensiveTokenList() {
        try {
            this.logStatus('🌐 Fetching comprehensive token list...', 'info');
            
            // Try multiple sources
            const sources = [
                'https://tokens.uniswap.org/',
                'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
                'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
            ];
            
            const allTokens = [];
            
            for (const source of sources) {
                try {
                    const response = await fetch(source);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.tokens) {
                            allTokens.push(...data.tokens);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to fetch from ${source}:`, error);
                }
            }
            
            this.logStatus(`Fetched ${allTokens.length} tokens from external sources`, 'info');
            return allTokens;
            
        } catch (error) {
            console.warn('Failed to fetch comprehensive token list:', error);
            return [];
        }
    }

    // Scan using comprehensive token list
    async scanWithComprehensiveList() {
        try {
            const comprehensiveList = await this.fetchComprehensiveTokenList();
            
            for (const tokenInfo of comprehensiveList) {
                if (tokenInfo.chainId === 1) { // Ethereum mainnet
                    await this.checkUnknownToken(tokenInfo.address);
                }
            }
        } catch (error) {
            console.warn('Failed to scan with comprehensive list:', error);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedTokenScanner;
} else {
    window.EnhancedTokenScanner = EnhancedTokenScanner;
}
