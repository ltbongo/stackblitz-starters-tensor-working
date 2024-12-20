export class ModelWeights {
    constructor(weights) {
        if (!Array.isArray(weights)) {
            throw new Error('Weights must be an array');
        }
        
        this.weights = weights.map(w => ({
            data: w.arraySync(),
            shape: w.shape
        }));
    }
}