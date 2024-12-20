export const MODEL_CONFIG = {
    // Training parameters
    BATCH_SIZE: 32,
    EPOCHS: 150,
    VALIDATION_SPLIT: 0.2,
    LEARNING_RATE: 0.001,
    
    // Early stopping configuration
    EARLY_STOPPING: {
        patience: 10,
        minDelta: 0.001
    },
    
    // Feature importance weights
    FEATURE_WEIGHTS: {
        Pattern: 3.0,     // Highest importance
        EMA: 1.5,         // Positive impact
        MA: 2.0          // Moderate weight
    }
};