// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUniswapV3Router {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

interface IWETH9 {
    function deposit() external payable;
    function withdraw(uint256 wad) external;
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address owner) external view returns (uint256);
}

/**
 * @title SwapQuestRouter
 * @dev Simplified router for SwapQuest that handles real swaps through Uniswap V3 on World Chain
 * @notice This contract facilitates token swaps for the SwapQuest gaming platform
 */
contract SwapQuestRouter is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Uniswap V3 Router on World Chain
    address public constant UNISWAP_V3_ROUTER = 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45;
    
    // WETH on World Chain
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    
    // WLD token on World Chain
    address public constant WLD = 0x163f8C2467924be0ae7B5347228CABF260318753;
    
    // USDC token on World Chain
    address public constant USDC = 0x79A02482A880bCE3F13e09Da970dC34db4CD24d1;

    // Events
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint24 fee,
        string missionId
    );

    event MissionCompleted(
        address indexed user,
        string indexed missionId,
        uint256 reward
    );

    // Mission tracking
    mapping(address => mapping(string => bool)) public completedMissions;
    mapping(address => uint256) public userRewards;
    mapping(address => uint256) public userSwapCount;

    constructor() {}

    /**
     * @dev Execute a swap through Uniswap V3
     * @param tokenIn Address of input token (use address(0) for ETH)
     * @param tokenOut Address of output token (use address(0) for ETH)
     * @param amountIn Amount of input tokens
     * @param amountOutMinimum Minimum amount of output tokens
     * @param fee Pool fee (500, 3000, or 10000)
     * @param missionId Optional mission ID for tracking
     */
    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint24 fee,
        string calldata missionId
    ) external payable nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");
        require(tokenIn != tokenOut, "Cannot swap same token");
        
        address actualTokenIn = tokenIn;
        address actualTokenOut = tokenOut;
        
        // Handle ETH input
        if (tokenIn == address(0)) {
            require(msg.value == amountIn, "ETH amount mismatch");
            actualTokenIn = WETH;
            // Wrap ETH to WETH
            IWETH9(WETH).deposit{value: amountIn}();
        } else {
            require(msg.value == 0, "ETH not expected");
            IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        }

        // Handle ETH output
        if (tokenOut == address(0)) {
            actualTokenOut = WETH;
        }

        // Approve Uniswap router
        IERC20(actualTokenIn).safeApprove(UNISWAP_V3_ROUTER, amountIn);

        // Execute swap
        IUniswapV3Router.ExactInputSingleParams memory params = 
            IUniswapV3Router.ExactInputSingleParams({
                tokenIn: actualTokenIn,
                tokenOut: actualTokenOut,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp + 300, // 5 minutes
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        amountOut = IUniswapV3Router(UNISWAP_V3_ROUTER).exactInputSingle(params);

        // Handle ETH output
        if (tokenOut == address(0)) {
            IWETH9(WETH).withdraw(amountOut);
            payable(msg.sender).transfer(amountOut);
        } else {
            IERC20(actualTokenOut).safeTransfer(msg.sender, amountOut);
        }

        // Update user stats
        userSwapCount[msg.sender]++;

        // Track mission completion
        if (bytes(missionId).length > 0 && !completedMissions[msg.sender][missionId]) {
            completedMissions[msg.sender][missionId] = true;
            uint256 reward = calculateMissionReward(missionId, amountIn);
            userRewards[msg.sender] += reward;
            
            emit MissionCompleted(msg.sender, missionId, reward);
        }

        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut, fee, missionId);
    }

    /**
     * @dev Calculate mission reward based on swap amount and mission type
     */
    function calculateMissionReward(string calldata missionId, uint256 amountIn) 
        public 
        pure 
        returns (uint256) 
    {
        bytes32 missionHash = keccak256(bytes(missionId));
        
        // Mission-specific rewards
        if (missionHash == keccak256(bytes("first_swap"))) {
            return 75; // First swap mission
        } else if (missionHash == keccak256(bytes("usdc_wld_swap"))) {
            return 100; // USDC to WLD swap
        } else if (missionHash == keccak256(bytes("wld_eth_swap"))) {
            return 90; // WLD to ETH swap
        } else if (missionHash == keccak256(bytes("large_swap"))) {
            return 200; // Large swap mission
        } else if (missionHash == keccak256(bytes("arbitrage_swap"))) {
            return 300; // Arbitrage mission
        }
        
        // Default reward based on amount (minimum 10 tokens)
        uint256 baseReward = (amountIn / 1e16) * 1; // 1 token per 0.01 ETH equivalent
        return baseReward < 10 ? 10 : baseReward;
    }

    /**
     * @dev Get user's completed missions status
     */
    function getUserMissionStatus(address user, string calldata missionId) 
        external 
        view 
        returns (bool) 
    {
        return completedMissions[user][missionId];
    }

    /**
     * @dev Get user's total rewards
     */
    function getUserRewards(address user) external view returns (uint256) {
        return userRewards[user];
    }

    /**
     * @dev Get user's total swap count
     */
    function getUserSwapCount(address user) external view returns (uint256) {
        return userSwapCount[user];
    }

    /**
     * @dev Emergency function to recover stuck tokens (only owner)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).safeTransfer(owner(), amount);
        }
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {}
} 