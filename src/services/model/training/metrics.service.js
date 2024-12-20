class MetricsService {
    formatEpochMetrics(epoch, logs) {
        return {
            epoch,
            loss: logs.loss.toFixed(4),
            accuracy: logs.acc.toFixed(4),
            valLoss: logs.val_loss?.toFixed(4) || 'N/A',
            valAccuracy: logs.val_acc?.toFixed(4) || 'N/A'
        };
    }

    logEpochMetrics(metrics, improvement = false) {
        const message = 
            `Epoch ${metrics.epoch}: ` +
            `loss = ${metrics.loss}, ` +
            `accuracy = ${metrics.accuracy}, ` +
            `val_loss = ${metrics.valLoss}, ` +
            `val_acc = ${metrics.valAccuracy}`;

        if (improvement) {
            console.log(`${message} (new best model)`);
        } else {
            console.log(message);
        }
    }
}

export const metricsService = new MetricsService();