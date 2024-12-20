import { CONFIG } from '../../../config.js';

class EarlyStoppingService {
    constructor() {
        this.reset();
    }

    reset() {
        this.bestValLoss = Infinity;
        this.bestValAccuracy = 0;
        this.patienceCounter = 0;
        this.bestEpoch = 0;
        this.bestMetrics = null;
    }

    check(metrics) {
        const hasImproved = this.hasModelImproved(metrics);
        
        if (hasImproved) {
            this.updateBestMetrics(metrics);
            this.patienceCounter = 0;
            return {
                shouldStop: false,
                isImprovement: true,
                remainingPatience: CONFIG.EARLY_STOPPING.patience
            };
        }

        this.patienceCounter++;
        const remainingPatience = CONFIG.EARLY_STOPPING.patience - this.patienceCounter;
        const shouldStop = remainingPatience <= 0;

        return {
            shouldStop,
            isImprovement: false,
            remainingPatience
        };
    }

    hasModelImproved(metrics) {
        // Primary condition: Better accuracy with similar or better loss
        if (metrics.val_acc > this.bestValAccuracy && 
            metrics.val_loss <= this.bestValLoss * 1.1) {
            return true;
        }

        // Secondary condition: Similar accuracy but significantly better loss
        if (metrics.val_acc >= this.bestValAccuracy * 0.99 && 
            metrics.val_loss < this.bestValLoss * 0.95) {
            return true;
        }

        return false;
    }

    updateBestMetrics(metrics) {
        this.bestValLoss = metrics.val_loss;
        this.bestValAccuracy = metrics.val_acc;
        this.bestEpoch = metrics.epoch;
        this.bestMetrics = { ...metrics };
    }

    getBestMetrics() {
        return this.bestMetrics;
    }
}

export const earlyStoppingService = new EarlyStoppingService();