import { CONFIG } from '../config.js';
import { RestClientV5 } from 'bybit-api';

class BybitService {
    constructor() {
        this.client = new RestClientV5({
            key: process.env.BYBIT_API_KEY,
            secret: process.env.BYBIT_API_SECRET,
            testnet: false
        });
    }

    async getKlineData(timeframe) {
        try {
            const allKlines = [];
            let lastTimestamp = Date.now();
            
            while (allKlines.length < CONFIG.TRAINING_SAMPLES) {
                const response = await this.client.getKline({
                    category: 'spot',
                    symbol: CONFIG.TRADING_PAIR,
                    interval: timeframe,
                    limit: 1000,
                    end: lastTimestamp
                });

                const newKlines = response.result.list;
                if (newKlines.length === 0) break;

                allKlines.push(...newKlines);
                lastTimestamp = parseInt(newKlines[newKlines.length - 1][0]);
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            return allKlines.reverse();
        } catch (error) {
            console.error('Error fetching kline data:', error);
            throw error;
        }
    }
}

export const bybitService = new BybitService();