export class ModelMetadata {
    constructor(config, metrics, tradingPair, timeframe) {
        this.modelConfig = config;
        this.metrics = metrics;
        this.tradingPair = tradingPair;
        this.timeframe = timeframe;
        this.timestamp = new Date().toISOString();
    }
}