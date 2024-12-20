import { checkpointManager } from './checkpoint.manager.js';
import { modelSerializer } from './serialization/model.serializer.js';

class ModelStorageService {
    shouldSaveCheckpoint(metrics) {
        return checkpointManager.isBetterCheckpoint(metrics);
    }

    async saveModel(model, metrics) {
        if (!model) {
            console.error('No model provided to saveModel');
            return false;
        }

        try {
            const modelData = await modelSerializer.serializeModel(model, metrics);
            const checkpointDir = await checkpointManager.saveCheckpoint(modelData);
            
            this.logCheckpoint(checkpointDir, metrics);
            return true;
        } catch (error) {
            console.error('Error saving model:', error);
            return false;
        }
    }

    logCheckpoint(checkpointDir, metrics) {
        const modelId = checkpointDir.split('/').pop();
        console.log('\nCheckpoint saved at epoch', metrics.epoch);
        console.log('- Model ID:', modelId);
        console.log('- Validation accuracy:', metrics.accuracy.toFixed(4));
        console.log('- Validation loss:', metrics.loss.toFixed(4));
    }
}

export const modelStorageService = new ModelStorageService();