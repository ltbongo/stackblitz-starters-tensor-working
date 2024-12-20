class BacktestLogger {
    log(message, ...args) {
        console.log(`[Backtest] ${message}`, ...args);
    }

    logProgress(current, total) {
        const progress = ((current / total) * 100).toFixed(1);
        console.log(`Progress: ${progress}% (${current}/${total})`);
    }

    displayResults(results) {
        console.log('\nBacktest Results:');
        console.log('================');
        console.log(`Total Trades: ${results.totalTrades}`);
        console.log(`Win Rate: ${results.winRate.toFixed(2)}%`);
        console.log(`Total Profit: $${results.totalProfit.toFixed(2)}`);
        console.log(`Average Profit: $${results.averageProfit.toFixed(2)}`);
        console.log(`Average Loss: $${results.averageLoss.toFixed(2)}`);
        console.log(`Profit Factor: ${results.profitFactor.toFixed(2)}`);
        console.log(`Max Drawdown: ${results.maxDrawdown.toFixed(2)}%`);
        console.log(`Final Balance: $${results.finalBalance.toFixed(2)}`);
    }
}

export const backtestLogger = new BacktestLogger();