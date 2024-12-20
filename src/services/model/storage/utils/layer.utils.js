import * as tf from '@tensorflow/tfjs';

// Map Keras layer names to TensorFlow.js layer names
const LAYER_MAPPING = {
    'Dense': 'dense',
    'Activation': 'activation',
    'BatchNormalization': 'batchNormalization',
    'Dropout': 'dropout'
};

export function createLayer(layerConfig, isFirstLayer = false) {
    const config = { ...layerConfig.config };
    
    // Ensure input shape is properly set for first layer
    if (isFirstLayer && config.batch_input_shape) {
        config.inputShape = config.batch_input_shape.slice(1);
        delete config.batch_input_shape;
    }

    // Get the correct layer type from mapping
    const layerType = LAYER_MAPPING[layerConfig.class_name];
    if (!layerType) {
        throw new Error(`Unsupported layer type: ${layerConfig.class_name}`);
    }

    return tf.layers[layerType](config);
}