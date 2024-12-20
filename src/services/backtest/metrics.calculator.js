import { CONFIG } from '../../config.js';
import { positionManager } from './position.manager.js';

class MetricsCalculator {
    calculateResults() {
        const trades = positionManager.getClosedTrades();
        const profits = trades.filter(t => t.pnl > 0);
        const losses = trades.filter(t => t.pnl <= 0);

        return {
            totalTrades: trades.length,
            winningTrades: profits.length,
            losingTrades: losses.length,
            winRate: this.calculateWinRate(profits.length, trades.length),
            totalProfit: this.calculateTotalProfit(trades),
            averageProfit: this.calculateAverageProfit(profits),
            averageLoss: this.calculateAverageLoss(losses),
            profitFactor: this.calculateProfitFactor(profits, losses),
            maxDrawdown: this.calculateMaxDrawdown(trades),
            finalBalance: positionManager.getBalance()
        };
    }

    calculateWinRate(winCount, totalCount) {
        return totalCount > 0 ? (winCount / totalCount) * 100 : 0;
    }

    calculateTotalProfit(trades) {
        return trades.reduce((sum, trade) => sum + trade.pnl, 0);
    }

    calculateAverageProfit(profits) {
        return profits.length > 0 ? 
            profits.reduce((sum, trade) => sum + trade.pnl, 0) / profits.length : 0;
    }

    calculateAverageLoss(losses) {
        return losses.length > 0 ? 
            Math.abs(losses.reduce((sum, trade) => sum + trade.pnl, 0)) / losses.length : 0;
    }

    calculateProfitFactor(profits, losses) {
        const totalProfit = this.calculateTotalProfit(profits);
        const totalLoss = Math.abs(this.calculateTotalProfit(losses));
        return totalLoss > 0 ? totalProfit / totalLoss : 0;
    }

    calculateMaxDrawdown(trades) {
        let peak = CONFIG.TRADING.POSITION_SIZE;
        let maxDrawdown = 0;
        let balance = CONFIG.TRADING.POSITION_SIZE;

        trades.forEach(trade => {
            balance += trade.pnl;
            peak = Math.max(peak, balance);
            const drawdown = ((peak - balance) / peak) * 100;
            maxDrawdown = Math.max(maxDrawdown, drawdown);
        });

        return maxDrawdown;
    }
}

export const metricsCalculator = new MetricsCalculator();