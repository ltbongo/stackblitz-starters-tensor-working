import { CONFIG } from '../../config.js';
import { callbacksService } from './training/callbacks.service.js';
import { earlyStoppingService } from './training/early-stopping.service.js';

class TrainingService {
    async trainModel(model, xs, ys) {
        earlyStoppingService.reset();
        
        // Get callbacks with model reference
        const callbacks = callbacksService.getTrainingCallbacks(model);

        return await model.fit(xs, ys, {
            batchSize: CONFIG.BATCH_SIZE,
            epochs: CONFIG.EPOCHS,
            validationSplit: CONFIG.VALIDATION_SPLIT,
            shuffle: true,
            callbacks: [callbacks]
        });
    }
}

export const trainingService = new TrainingService();