class MetricsValidator {
    isImprovement(current, best) {
        // Primary condition: Better accuracy with similar or better loss
        if (current.accuracy > best.accuracy && 
            current.loss <= best.loss * 1.1) {
            return true;
        }

        // Secondary condition: Similar accuracy but significantly better loss
        if (current.accuracy >= best.accuracy * 0.99 && 
            current.loss < best.loss * 0.95) {
            return true;
        }

        return false;
    }

    formatMetrics(logs) {
        return {
            accuracy: logs.val_acc,
            loss: logs.val_loss,
            epoch: logs.epoch
        };
    }
}

export const metricsValidator = new MetricsValidator();