export class ModelCheckpoint {
    constructor(modelId, weights, metadata) {
        this.modelId = modelId;
        this.weights = weights;
        this.metadata = metadata;
        this.timestamp = new Date().toISOString();
    }

    static fromModel(modelId, model, metrics) {
        const weights = model.getWeights().map(w => ({
            name: w.name,
            data: w.arraySync(),
            shape: w.shape
        }));

        return new ModelCheckpoint(modelId, weights, metrics);
    }
}