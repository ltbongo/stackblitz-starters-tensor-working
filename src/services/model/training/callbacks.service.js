import { modelStorageService } from '../storage/model-storage.service.js';
import { metricsService } from './metrics.service.js';
import { earlyStoppingService } from './early-stopping.service.js';

class CallbacksService {
    getTrainingCallbacks(model) {
        return {
            onEpochEnd: async (epoch, logs) => {
                const metrics = metricsService.formatEpochMetrics(epoch, logs);
                const { shouldStop, isImprovement } = earlyStoppingService.check(logs.val_loss);
                
                metricsService.logEpochMetrics(metrics, isImprovement);

                if (isImprovement && modelStorageService.shouldSaveCheckpoint(logs)) {
                    await modelStorageService.saveModel(model, {
                        accuracy: logs.val_acc,
                        loss: logs.val_loss,
                        epoch
                    });
                }

                if (shouldStop) {
                    console.log(`\nEarly stopping triggered after ${epoch + 1} epochs`);
                    model.stopTraining = true;
                }
            }
        };
    }
}

export const callbacksService = new CallbacksService();