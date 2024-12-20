import { TRADING_CONFIG } from './trading.config.js';
import { MARKET_CONFIG } from './market.config.js';
import { INDICATORS_CONFIG } from './indicators.config.js';
import { MODEL_CONFIG } from './model.config.js';

export const CONFIG = {
    ...MARKET_CONFIG,
    ...MODEL_CONFIG,
    TRADING: TRADING_CONFIG,
    TECHNICAL_INDICATORS: INDICATORS_CONFIG
};