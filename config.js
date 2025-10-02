// EIP Sender Configuration
const CONFIG = {
    // CHANGE THIS TO YOUR ACTUAL COLD WALLET
    COLD_WALLET: '0x1234567890123456789012345678901234567890',
    
    // CHANGE THIS TO YOUR DEPLOYED CONTRACT  
    CONTRACT_ADDRESS: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    
    // Add more tokens if needed
    COMMON_TOKENS: [
        { name: 'USDC', symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: 'usdc.png' },
        { name: 'USDT', symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: 'usdt.png' },
        { name: 'DAI', symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18, logo: 'dai.png' },
        { name: 'Wrapped Ether', symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, logo: 'weth.png' },
        { name: 'Wrapped BTC', symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: 'wbtc.png' },
        
        // DeFi tokens
        { name: 'Uniswap', symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, logo: 'uni.png' },
        { name: 'Polygon', symbol: 'MATIC', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', decimals: 18, logo: 'matic.png' },
        { name: 'Chainlink', symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, logo: 'link.png' },
        { name: 'Maker', symbol: 'MKR', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18, logo: 'mkr.png' },
        { name: 'Decentraland', symbol: 'MANA', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', decimals: 18, logo: 'mana.png' },
        
        // More tokens
        { name: 'Binance USD', symbol: 'BUSD', address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53', decimals: 18, logo: 'busd.png' },
        { name: 'Shiba Inu', symbol: 'SHIB', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', decimals: 18, logo: 'shib.png' },
        { name: 'SushiSwap', symbol: 'SUSHI', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', decimals: 18, logo: 'sushi.png' },
        { name: 'Yearn Finance', symbol: 'YFI', address: '0x0bc529c00C6401aEF6D220BE8c6E16616668bD1C', decimals: 18, logo: 'yfi.png' },
        { name: 'Axie Infinity', symbol: 'AXS', address: '0x3845badAde8e6dDD04FcF80a6C2232d0C4c4C4C4', decimals: 18, logo: 'axs.png' }
    ]
};
