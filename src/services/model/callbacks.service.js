import * as tf from '@tensorflow/tfjs';
import { CONFIG } from '../../config.js';

class CallbacksService {
    getCallbacks() {
        return {
            onEpochEnd: (epoch, logs) => {
                // Learning rate decay
                if (epoch > 0 && epoch % 20 === 0) {
                    const newLR = CONFIG.LEARNING_RATE * Math.pow(0.9, Math.floor(epoch / 20));
                    logs.newLearningRate = newLR;
                }
                
                // Log training progress
                console.log(
                    `Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, ` +
                    `accuracy = ${logs.acc.toFixed(4)}, ` +
                    `val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}, ` +
                    `val_acc = ${logs.val_acc?.toFixed(4) || 'N/A'}`
                );
            }
        };
    }
}

export const callbacksService = new CallbacksService();