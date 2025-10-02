# EIP Sender - Vercel Deployment Guide

## 🚀 **Deploy to Vercel (Recommended)**

Vercel makes deployment **super easy** with automatic HTTPS, custom domains, and one-click deployments!

### **Method 1: Deploy from GitHub (Recommended)**

#### **Step 1: Create GitHub Repository**
```bash
# Initialize git repository
cd eipsender
git init
git add .
git commit -m "Initial commit: EIP Sender with wallet connect modal"

# Create GitHub repository and push
# Go to GitHub.com → New Repository → Create
git remote add origin https://github.com/yourusername/eip-sender.git
git push -u origin main
```

#### **Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your `eip-sender` repository
5. Click **"Deploy"**

**That's it!** Your site will be live in 30 seconds! 🎉

### **Method 2: Deploy from Local Files**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Deploy**
```bash
cd eipsender
vercel

# Follow the prompts:
# ? Set up and deploy "~/eipsender"? [Y/n] y
# ? Which scope do you want to deploy to? Your Personal Account
# ? Link to existing project? [y/N] n
# ? What's your project's name? eip-sender
# ? In which directory is your code located? ./
```

#### **Step 3: Production Deploy**
```bash
vercel --prod
```

## 🌐 **Custom Domain Setup**

### **Add Custom Domain:**
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **"Domains"** tab
4. Add your domain (e.g., `eipsender.com`)
5. Update DNS records as instructed
6. **Automatic HTTPS** will be enabled!

## ⚙️ **Configuration**

### **Update config.js:**
```javascript
const CONFIG = {
    // Your cold wallet address
    COLD_WALLET: '0xYourColdWalletAddress',
    
    // Your deployed contract address
    CONTRACT_ADDRESS: '0xYourDeployedContractAddress',
    
    // Token list
    COMMON_TOKENS: [...]
};
```

### **Environment Variables (Optional):**
If you want to use environment variables instead of hardcoded values:

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Add:
   - `COLD_WALLET` = `0xYourColdWalletAddress`
   - `CONTRACT_ADDRESS` = `0xYourDeployedContractAddress`

## 🔄 **Automatic Deployments**

### **GitHub Integration:**
- **Push to main** → Automatic production deployment
- **Create pull request** → Automatic preview deployment
- **Merge PR** → Automatic production deployment

### **Manual Deployments:**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## 📊 **Vercel Benefits**

### **Free Tier Includes:**
- ✅ **100GB bandwidth** per month
- ✅ **Unlimited static sites**
- ✅ **Automatic HTTPS**
- ✅ **Custom domains**
- ✅ **Preview deployments**
- ✅ **Analytics dashboard**
- ✅ **Performance monitoring**

### **Advanced Features:**
- ✅ **Edge functions** (if needed)
- ✅ **Serverless functions** (if needed)
- ✅ **Image optimization**
- ✅ **Automatic compression**
- ✅ **CDN distribution**

## 🚀 **Deployment Steps Summary**

### **Quick Deploy (5 minutes):**
1. **Create GitHub repo** → Push code
2. **Go to Vercel** → Import repository
3. **Click Deploy** → Site is live!
4. **Add custom domain** → Professional URL
5. **Update config.js** → Your addresses

### **Result:**
- ✅ **Professional URL** (e.g., `eipsender.vercel.app`)
- ✅ **Automatic HTTPS** (free SSL)
- ✅ **Fast global CDN**
- ✅ **Automatic deployments**
- ✅ **Analytics dashboard**

## 🔧 **Troubleshooting**

### **Common Issues:**
- **Build fails** → Check `vercel.json` configuration
- **Domain not working** → Check DNS settings
- **HTTPS issues** → Usually auto-resolves in 24h

### **Support:**
- Vercel has excellent documentation
- Community support on Discord
- Professional support available

## 🎉 **Why Vercel is Better**

| Feature | Hostinger | Vercel |
|---------|-----------|--------|
| **Deployment** | Manual FTP | One-click |
| **HTTPS** | Manual setup | Automatic |
| **Custom Domain** | Complex | Easy |
| **Updates** | Manual upload | Automatic |
| **Analytics** | None | Built-in |
| **Performance** | Basic | Optimized |
| **Cost** | $2-5/month | Free tier |

**Vercel is definitely the way to go!** 🚀
