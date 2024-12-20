import * as tf from '@tensorflow/tfjs';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';
import { bybitService } from './services/bybit.service.js';
import { featureFactory } from './services/features/feature.factory.js';
import { labelService } from './services/label.service.js';
import { preprocessingService } from './services/data/preprocessing.service.js';
import { modelService } from './services/model/model.service.js';
import { evaluationService } from './services/evaluation.service.js';
import { featureImportanceService } from './services/analysis/feature-importance.service.js';
import { visualizationService } from './services/analysis/visualization.service.js';

dotenv.config();

async function main() {
    try {
        await tf.ready();
        console.log('TensorFlow.js initialized successfully');
        
        console.log('Starting trading bot...');
        console.log(`Trading pair: ${CONFIG.TRADING_PAIR}`);
        
        // Fetch historical data
        const klineData = await bybitService.getKlineData(CONFIG.DEFAULT_TIMEFRAME);
        console.log(`Fetched ${klineData.length} candles`);

        // Create and process features
        let features = featureFactory.createFeatures(klineData);
        console.log('Features created');

        features = preprocessingService.normalizeFeatures(features);
        console.log('Features normalized');

        // Create labels
        const labels = labelService.createLabels(klineData);
        const tensorLabels = labelService.convertLabelsToTensor(labels);
        console.log('Labels created');

        // Prepare training data
        const { training, validation } = preprocessingService.prepareTrainingData(features, tensorLabels);
        console.log('Training data prepared');

        // Train model
        const model = modelService.createModel();
        await modelService.train(training.features, training.labels);
        console.log('Model trained');

        // Analyze feature importance
        console.log('\nCalculating feature importance...');
        const importanceScores = await featureImportanceService.calculatePermutationImportance(
            model,
            validation.features,
            validation.labels
        );
        visualizationService.displayFeatureImportance(importanceScores);

        // Analyze group importance
        console.log('\nCalculating feature group importance...');
        const groupImportance = await featureImportanceService.analyzeFeatureGroups(
            model,
            validation.features,
            validation.labels
        );
        visualizationService.displayGroupImportance(groupImportance);

        // Evaluate model
        const predictions = model.predict(tf.tensor2d(validation.features));
        const metrics = evaluationService.calculateMetrics(
            predictions.arraySync(),
            validation.labels
        );
        console.log('\nModel evaluation metrics:', metrics);

        console.log('\nTrading bot initialized successfully');
    } catch (error) {
        console.error('Error initializing trading bot:', error);
    }
}

main().catch(console.error);