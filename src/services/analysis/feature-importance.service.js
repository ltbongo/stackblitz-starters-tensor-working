import * as tf from '@tensorflow/tfjs';
import { CONFIG } from '../../config.js';

class FeatureImportanceService {
    constructor() {
        this.featureNames = this.generateFeatureNames();
        this.featureGroups = this.defineFeatureGroups();
    }

    generateFeatureNames() {
        const names = [];
        
        // For each lookback period
        for (let i = 0; i < CONFIG.LOOKBACK_PERIODS; i++) {
            // Base features
            names.push(`MA_t-${i}`);
            
            // EMAs
            CONFIG.TECHNICAL_INDICATORS.EMA.periods.forEach(period => {
                names.push(`EMA${period}_t-${i}`);
            });
            
            // Pattern features
            names.push(`Pattern_t-${i}`);
        }
        
        return names;
    }

    defineFeatureGroups() {
        return {
            'Moving Averages': this.featureNames.filter(name => name.startsWith('MA_')),
            'EMAs': this.featureNames.filter(name => name.startsWith('EMA')),
            'Pattern Features': this.featureNames.filter(name => name.startsWith('Pattern_'))
        };
    }

    async calculatePermutationImportance(model, features, labels, numPermutations = 10) {
        const baselineMetrics = await this.evaluateModel(model, features, labels);
        const importanceScores = {};

        for (let featureIdx = 0; featureIdx < features[0].length; featureIdx++) {
            const scores = [];

            for (let p = 0; p < numPermutations; p++) {
                const permutedFeatures = this.permuteFeature(features, featureIdx);
                const metrics = await this.evaluateModel(model, permutedFeatures, labels);
                
                const importance = baselineMetrics.accuracy - metrics.accuracy;
                scores.push(importance);
            }

            importanceScores[this.featureNames[featureIdx]] = {
                meanImportance: scores.reduce((a, b) => a + b, 0) / numPermutations,
                stdDev: this.calculateStdDev(scores)
            };
        }

        return this.rankFeatures(importanceScores);
    }

    async analyzeFeatureGroups(model, features, labels) {
        const baselineMetrics = await this.evaluateModel(model, features, labels);
        const groupImportance = {};

        for (const [groupName, groupFeatures] of Object.entries(this.featureGroups)) {
            const featureIndices = groupFeatures.map(name => 
                this.featureNames.indexOf(name)
            ).filter(idx => idx !== -1);

            const modifiedFeatures = features.map(row => {
                const newRow = [...row];
                featureIndices.forEach(idx => {
                    newRow[idx] = 0;
                });
                return newRow;
            });

            const metrics = await this.evaluateModel(model, modifiedFeatures, labels);
            groupImportance[groupName] = baselineMetrics.accuracy - metrics.accuracy;
        }

        return this.rankFeatures(
            Object.entries(groupImportance).reduce((acc, [group, importance]) => {
                acc[group] = { meanImportance: importance, stdDev: 0 };
                return acc;
            }, {})
        );
    }

    async evaluateModel(model, features, labels) {
        const xs = tf.tensor2d(features);
        const predictions = model.predict(xs);
        const predArray = await predictions.array();
        
        xs.dispose();
        predictions.dispose();

        return {
            accuracy: this.calculateAccuracy(predArray, labels)
        };
    }

    permuteFeature(features, featureIdx) {
        const permutedFeatures = features.map(row => [...row]);
        const values = features.map(row => row[featureIdx]);
        const shuffled = this.shuffle([...values]);

        for (let i = 0; i < features.length; i++) {
            permutedFeatures[i][featureIdx] = shuffled[i];
        }

        return permutedFeatures;
    }

    calculateAccuracy(predictions, labels) {
        let correct = 0;
        for (let i = 0; i < predictions.length; i++) {
            const predClass = predictions[i].indexOf(Math.max(...predictions[i]));
            const trueClass = labels[i].indexOf(Math.max(...labels[i]));
            if (predClass === trueClass) correct++;
        }
        return correct / predictions.length;
    }

    calculateStdDev(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        const variance = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
        return Math.sqrt(variance);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    rankFeatures(importanceScores) {
        return Object.entries(importanceScores)
            .sort(([, a], [, b]) => b.meanImportance - a.meanImportance)
            .reduce((acc, [feature, scores]) => {
                acc[feature] = scores;
                return acc;
            }, {});
    }
}

export const featureImportanceService = new FeatureImportanceService();