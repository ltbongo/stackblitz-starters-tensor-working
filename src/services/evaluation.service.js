class EvaluationService {
    calculateMetrics(predictions, actualValues) {
        const metrics = {
            accuracy: this.calculateAccuracy(predictions, actualValues),
            precision: this.calculatePrecision(predictions, actualValues),
            recall: this.calculateRecall(predictions, actualValues),
            roi: this.calculateROI(predictions, actualValues)
        };
        return metrics;
    }

    calculateAccuracy(predictions, actualValues) {
        const correct = predictions.filter((pred, i) => pred === actualValues[i]).length;
        return correct / predictions.length;
    }

    calculatePrecision(predictions, actualValues) {
        const truePositives = predictions.filter((pred, i) => pred === 1 && actualValues[i] === 1).length;
        const falsePositives = predictions.filter((pred, i) => pred === 1 && actualValues[i] === 0).length;
        return truePositives / (truePositives + falsePositives);
    }

    calculateRecall(predictions, actualValues) {
        const truePositives = predictions.filter((pred, i) => pred === 1 && actualValues[i] === 1).length;
        const falseNegatives = predictions.filter((pred, i) => pred === 0 && actualValues[i] === 1).length;
        return truePositives / (truePositives + falseNegatives);
    }

    calculateROI(predictions, priceData) {
        let balance = 0;
        let position = null;

        predictions.forEach((pred, i) => {
            if (pred === 1 && !position) { // Buy signal
                position = {
                    entry: priceData[i],
                    stopLoss: priceData[i] * (1 - CONFIG.STOP_LOSS_PERCENTAGE / 100)
                };
            } else if (pred === 0 && position) { // Sell signal
                const profit = position.entry - priceData[i];
                balance += profit * CONFIG.POSITION_SIZE;
                position = null;
            }

            // Check stop loss
            if (position && priceData[i] <= position.stopLoss) {
                const loss = (position.stopLoss - position.entry) * CONFIG.POSITION_SIZE;
                balance += loss;
                position = null;
            }
        });

        return balance;
    }
}

export const evaluationService = new EvaluationService();