class TradeRecorder {
    constructor() {
        this.trades = [];
    }

    recordTrade(trade) {
        this.trades.push({
            ...trade,
            timestamp: new Date().toISOString()
        });
    }

    getTrades() {
        return this.trades;
    }

    clear() {
        this.trades = [];
    }
}

export const tradeRecorder = new TradeRecorder();