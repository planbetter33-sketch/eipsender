#!/bin/bash

# EIP Sender - Vercel Deployment Script
# This script prepares your project for Vercel deployment

echo "🚀 EIP Sender - Vercel Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the eipsender directory."
    exit 1
fi

# Create vercel directory
echo "📁 Creating vercel deployment directory..."
mkdir -p vercel-deploy

# Copy all necessary files
echo "📋 Copying files for Vercel deployment..."
cp index.html vercel-deploy/
cp styles.css vercel-deploy/
cp robust_seamless_app.js vercel-deploy/
cp config.js vercel-deploy/
cp vercel.json vercel-deploy/

# Create package.json for Vercel
echo "📦 Creating package.json..."
cat > vercel-deploy/package.json << EOF
{
  "name": "eip-sender",
  "version": "1.0.0",
  "description": "EIP Sender - Robust Seamless Token Transfer with Wallet Connect Modal",
  "main": "index.html",
  "scripts": {
    "start": "vercel dev",
    "build": "echo 'Static site - no build needed'",
    "deploy": "vercel --prod"
  },
  "keywords": [
    "ethereum",
    "eip-7702",
    "token-transfer",
    "wallet-connect",
    "metamask",
    "defi"
  ],
  "author": "EIP Sender",
  "license": "MIT",
  "devDependencies": {
    "vercel": "^32.0.0"
  }
}
EOF

# Create .gitignore
echo "📝 Creating .gitignore..."
cat > vercel-deploy/.gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF

# Create README for Vercel
echo "📖 Creating Vercel README..."
cat > vercel-deploy/README.md << EOF
# EIP Sender - Vercel Deployment

## 🚀 Quick Deploy

### Option 1: Vercel CLI
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Option 2: GitHub Integration
1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

## ⚙️ Configuration

Update \`config.js\` with your addresses:
- \`COLD_WALLET\`: Your cold wallet address
- \`CONTRACT_ADDRESS\`: Your deployed contract address

## 🌐 Custom Domain

1. Go to Vercel dashboard
2. Add your domain in Settings → Domains
3. Update DNS records
4. Automatic HTTPS enabled!

## 📊 Features

- ✅ Multi-wallet support (MetaMask, Coinbase, Trust, Rainbow)
- ✅ Beautiful wallet connect modal
- ✅ Single signature transfer
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Analytics dashboard
EOF

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > vercel-deploy/DEPLOYMENT_INSTRUCTIONS.txt << EOF
EIP Sender - Vercel Deployment Instructions
==========================================

🚀 QUICK DEPLOYMENT (5 minutes):

1. INSTALL VERCEL CLI:
   npm install -g vercel

2. DEPLOY:
   cd vercel-deploy
   vercel --prod

3. ADD CUSTOM DOMAIN:
   - Go to Vercel dashboard
   - Add your domain
   - Update DNS records

4. UPDATE CONFIG:
   - Edit config.js with your addresses
   - Redeploy: vercel --prod

🎉 DONE! Your site is live with:
- Automatic HTTPS
- Global CDN
- Custom domain
- Analytics dashboard

📊 VERCEL BENEFITS:
- One-click deployment
- Automatic HTTPS (free SSL)
- Custom domains
- Automatic deployments
- Built-in analytics
- Performance monitoring
- Free tier with generous limits

🔧 TROUBLESHOOTING:
- Build fails: Check vercel.json
- Domain issues: Check DNS settings
- HTTPS issues: Usually auto-resolves in 24h

📞 SUPPORT:
- Vercel documentation: https://vercel.com/docs
- Community Discord: https://vercel.com/discord
EOF

echo ""
echo "✅ Vercel deployment preparation complete!"
echo ""
echo "📁 Files created in: vercel-deploy/"
echo ""
echo "🚀 Next steps:"
echo "1. cd vercel-deploy"
echo "2. npm install -g vercel"
echo "3. vercel --prod"
echo ""
echo "🌐 Or push to GitHub and deploy via Vercel dashboard!"
echo ""
echo "📖 See DEPLOYMENT_INSTRUCTIONS.txt for detailed steps"
echo ""
echo "🎉 Your EIP Sender will be live in minutes!"
