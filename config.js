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
        { name: 'Axie Infinity', symbol: 'AXS', address: '0x3845badAde8e6dDD04FcF80a6C2232d0C4c4C4C4', decimals: 18, logo: 'axs.png' },
        
        // MOMA Protocol Token
        { name: 'MOMA Protocol', symbol: 'MOMAT', address: '0x00f548bc685e4b495ba559e881112fdd4576f331', decimals: 18, logo: 'moma.png' },
        
        // Additional Popular Tokens
        { name: 'Aave Token', symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18, logo: 'aave.png' },
        { name: 'ApeCoin', symbol: 'APE', address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', decimals: 18, logo: 'ape.png' },
        { name: 'Cream Finance', symbol: 'CREAM', address: '0x2ba592F78dB6436527729929AAf6c908497cB200', decimals: 18, logo: 'cream.png' },
        { name: 'Bancor Network Token', symbol: 'BNT', address: '0x1fE24F25ec1C893edE74B2c3906c939B8Ad5D652', decimals: 18, logo: 'bnt.png' },
        { name: 'FTX Token', symbol: 'FTT', address: '0x50D1c9771902476076eCFc8B2A83Ad6b9355a4c9', decimals: 18, logo: 'ftt.png' },
        { name: 'Illuvium', symbol: 'ILV', address: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', decimals: 18, logo: 'ilv.png' },
        { name: 'Gala', symbol: 'GALA', address: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA', decimals: 8, logo: 'gala.png' },
        { name: 'Instadapp', symbol: 'INST', address: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', decimals: 18, logo: 'inst.png' },
        { name: 'Swipe', symbol: 'SXP', address: '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9', decimals: 18, logo: 'sxp.png' },
        { name: 'Badger DAO', symbol: 'BADGER', address: '0x3472A5A71965499acd81997a54BBA8D852C6E53d', decimals: 18, logo: 'badger.png' },
        
        // More DeFi Tokens
        { name: 'Compound', symbol: 'COMP', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18, logo: 'comp.png' },
        { name: 'Curve DAO Token', symbol: 'CRV', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18, logo: 'crv.png' },
        { name: '1inch', symbol: '1INCH', address: '0x111111111117dC0aa78b770fA6A738034120C302', decimals: 18, logo: '1inch.png' },
        { name: 'Balancer', symbol: 'BAL', address: '0xba100000625a3754423978a60c9317c58a424e3D', decimals: 18, logo: 'bal.png' },
        { name: 'Ren Protocol', symbol: 'REN', address: '0x408e41876cCCDC0F92210600ef50372656052a38', decimals: 18, logo: 'ren.png' },
        { name: 'Kyber Network Crystal', symbol: 'KNC', address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200', decimals: 18, logo: 'knc.png' },
        { name: 'Loopring', symbol: 'LRC', address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD', decimals: 18, logo: 'lrc.png' },
        { name: '0x Protocol', symbol: 'ZRX', address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498', decimals: 18, logo: 'zrx.png' },
        { name: 'Bancor', symbol: 'BNT', address: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C', decimals: 18, logo: 'bnt.png' },
        { name: 'Gnosis', symbol: 'GNO', address: '0x6810e776880C02933D47DB1b9fc05908e5386b96', decimals: 18, logo: 'gno.png' },
        
        // Gaming & NFT Tokens
        { name: 'Enjin Coin', symbol: 'ENJ', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c', decimals: 18, logo: 'enj.png' },
        { name: 'Sandbox', symbol: 'SAND', address: '0x3845badAde8e6dDD04FcF80a6C2232d0C4c4C4C4', decimals: 18, logo: 'sand.png' },
        { name: 'Chiliz', symbol: 'CHZ', address: '0x3506424F91fD33084466F402d5D97f05F8e3b4AF', decimals: 18, logo: 'chz.png' },
        { name: 'Flow', symbol: 'FLOW', address: '0x5c1473347451334009A6B48B0c4E6D8b3C7c3e5a', decimals: 18, logo: 'flow.png' },
        { name: 'Immutable X', symbol: 'IMX', address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF', decimals: 18, logo: 'imx.png' },
        
        // Layer 2 & Scaling Tokens
        { name: 'Optimism', symbol: 'OP', address: '0x4200000000000000000000000000000000000042', decimals: 18, logo: 'op.png' },
        { name: 'Arbitrum', symbol: 'ARB', address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1', decimals: 18, logo: 'arb.png' },
        { name: 'Polygon', symbol: 'MATIC', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', decimals: 18, logo: 'matic.png' },
        
        // Privacy & Security Tokens
        { name: 'Tornado Cash', symbol: 'TORN', address: '0x77777FeDdddFfC19Ff86DB637967013e6C6A116C', decimals: 18, logo: 'torn.png' },
        { name: 'Keep Network', symbol: 'KEEP', address: '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC', decimals: 18, logo: 'keep.png' },
        { name: 'NuCypher', symbol: 'NU', address: '0x4fE83213D56308330EC302a8BD641f1d0113A4Cc', decimals: 18, logo: 'nu.png' },
        
        // Oracle Tokens
        { name: 'Chainlink', symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, logo: 'link.png' },
        { name: 'Band Protocol', symbol: 'BAND', address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55', decimals: 18, logo: 'band.png' },
        { name: 'UMA', symbol: 'UMA', address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', decimals: 18, logo: 'uma.png' },
        
        // Exchange Tokens
        { name: 'Binance Coin', symbol: 'BNB', address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52', decimals: 18, logo: 'bnb.png' },
        { name: 'Huobi Token', symbol: 'HT', address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161', decimals: 18, logo: 'ht.png' },
        { name: 'KuCoin Token', symbol: 'KCS', address: '0x039B5649A59967e3e936D7471f9c3700100Ee1ab', decimals: 6, logo: 'kcs.png' },
        { name: 'OKB', symbol: 'OKB', address: '0x75231F58b43240C9718Dd58B4967c5114342a86c', decimals: 18, logo: 'okb.png' },
        
        // LP Tokens (Liquidity Provider Tokens)
        { name: 'USDC/WETH LP', symbol: 'USDC-WETH', address: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', decimals: 18, logo: 'lp.png', isLP: true },
        { name: 'DAI/WETH LP', symbol: 'DAI-WETH', address: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', decimals: 18, logo: 'lp.png', isLP: true },
        { name: 'WBTC/WETH LP', symbol: 'WBTC-WETH', address: '0xBb2b8038a1640196FbE3e38816F2eDaC4c4Feb9c', decimals: 18, logo: 'lp.png', isLP: true },
        { name: 'USDC/USDT LP', symbol: 'USDC-USDT', address: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0', decimals: 18, logo: 'lp.png', isLP: true },
        { name: 'LINK/WETH LP', symbol: 'LINK-WETH', address: '0x06da0fd433C1A5d7a4fbb01131109191f2138aD4', decimals: 18, logo: 'lp.png', isLP: true },
        { name: 'UNI/WETH LP', symbol: 'UNI-WETH', address: '0x1b96B92314C44b159149f7E0303511fB2Fc4774f', decimals: 18, logo: 'lp.png', isLP: true },
        { name: 'AAVE/WETH LP', symbol: 'AAVE-WETH', address: '0xDFC14d2Af169B0D36C4EFF567Ada9b2E0CAe044f', decimals: 18, logo: 'lp.png', isLP: true },
        
        // Curve LP Tokens
        { name: '3CRV LP', symbol: '3CRV', address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', decimals: 18, logo: 'curve.png', isLP: true },
        { name: 'crvRenWBTC LP', symbol: 'crvRenWBTC', address: '0x49849C98ae39Fff122806C06791Fa73784FB3675', decimals: 18, logo: 'curve.png', isLP: true },
        { name: 'crvPlain3andSUSD LP', symbol: 'crvPlain3andSUSD', address: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3', decimals: 18, logo: 'curve.png', isLP: true },
        
        // Balancer LP Tokens
        { name: 'BAL/WETH LP', symbol: 'BAL-WETH', address: '0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56', decimals: 18, logo: 'balancer.png', isLP: true },
        { name: 'BAL/USDC LP', symbol: 'BAL-USDC', address: '0x59A19D8c652FA0284f44113D0ff9aBa70bd46fB4', decimals: 18, logo: 'balancer.png', isLP: true },
        
        // Yearn LP Tokens
        { name: 'Yearn DAI', symbol: 'yDAI', address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', decimals: 8, logo: 'yearn.png', isLP: true },
        { name: 'Yearn USDC', symbol: 'yUSDC', address: '0x39AA39c021dfbaE8faC545936693aC917d5E7563', decimals: 8, logo: 'yearn.png', isLP: true },
        { name: 'Yearn USDT', symbol: 'yUSDT', address: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9', decimals: 8, logo: 'yearn.png', isLP: true },
        
        // Compound LP Tokens
        { name: 'Compound DAI', symbol: 'cDAI', address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', decimals: 8, logo: 'compound.png', isLP: true },
        { name: 'Compound USDC', symbol: 'cUSDC', address: '0x39AA39c021dfbaE8faC545936693aC917d5E7563', decimals: 8, logo: 'compound.png', isLP: true },
        { name: 'Compound USDT', symbol: 'cUSDT', address: '0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9', decimals: 8, logo: 'compound.png', isLP: true },
        { name: 'Compound ETH', symbol: 'cETH', address: '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5', decimals: 8, logo: 'compound.png', isLP: true },
        
        // Aave LP Tokens
        { name: 'Aave DAI', symbol: 'aDAI', address: '0x028171bCA77440897B824Ca71D1c56caC55b68A3', decimals: 18, logo: 'aave.png', isLP: true },
        { name: 'Aave USDC', symbol: 'aUSDC', address: '0xBcca60bB61934080951369a648Fb03DF4F96263C', decimals: 6, logo: 'aave.png', isLP: true },
        { name: 'Aave USDT', symbol: 'aUSDT', address: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', decimals: 6, logo: 'aave.png', isLP: true },
        { name: 'Aave WETH', symbol: 'aWETH', address: '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e', decimals: 18, logo: 'aave.png', isLP: true }
    ]
};
