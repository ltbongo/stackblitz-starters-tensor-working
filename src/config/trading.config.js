export const TRADING_CONFIG = {
    // Position management
    POSITION_SIZE: 1000,           // Size of each position in USDT
    MAX_POSITIONS: 1,              // Maximum number of concurrent positions
    
    // Risk management
    STOP_LOSS_PERCENTAGE: 1.5,     // Stop loss percentage
    TAKE_PROFIT_PERCENTAGE: 3.0,   // Take profit percentage
    MAX_DRAWDOWN: 15,             // Maximum drawdown percentage allowed
    RISK_PER_TRADE: 1.0,          // Percentage of account to risk per trade
    
    // Signal thresholds
    MIN_CONFIDENCE: 0.55,         // Minimum prediction confidence to enter trade
    MIN_DIRECTION_BIAS: 0.05,     // Minimum difference between up/down probabilities
    
    // Trailing stop configuration
    TRAILING_STOP: {
        ENABLED: true,
        ACTIVATION_PERCENTAGE: 0.8, // Profit percentage to activate trailing stop
        TRAILING_PERCENTAGE: 0.4    // Distance to maintain for trailing stop
    },
    
    // Exchange settings
    COMMISSION_RATE: 0.1,          // Trading fee percentage
};