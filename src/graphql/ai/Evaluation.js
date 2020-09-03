import * as tf from "@tensoflow/tfjs-node";

class Evaluation {
  constructor(
    X_train,
    Y_train,
    X_test,
    Y_test,
    model_type,
    save_computation = false
  ) {
    this.X_train = X_train;
    this.Y_train = Y_train;
    this.X_test = X_test;
    this.Y_test = Y_test;
    this.model_type = model_type;
    this.save_computation = save_computation;

    switch (model_type) {
      case 1: // Logistic Regression
        const input_shape = X_train.shape[1]
        const model = tf.sequential({
          layers: [
            tf.layers.dense({
              units: 1,
              inputDim: input_shape,
              activation: "sigmoid",
            }),
          ],
        });
        const sgd = tf.train.sgd({ lr: 0.01 });
        model.compile({
          optimizer: sgd,
          loss: "binaryCrossentropy",
          metrics: ["accuracy"],
        });
        this.model = model;
        this.X_train = X_train;
        this.Y_train = Y_train;
        this.X_test = X_test;
        this.Y_test = Y_test;
        break;
      case 2: // Neural Network
        const input_shape = X_train[1].length;
        const model = tf.sequential({
          layers: [
            tf.layers.dense({
              units: Math.round(input_shape / 2),
              inputDim: input_shape,
              activation: "relu",
              kernelRegularizer: tf.regularizers.l2(0.01),
            }),
            tf.layers.dropout({ rate: 0.5 }),
            tf.layers.dense({
              units: Math.round(input_shape / 4),
              kernelRegularizer: tf.regularizers.l2(0.01),
              activation: "relu",
            }),
            tf.layers.batchNormalization(),
            tf.layers.dense({
              units: 2,
              kernelRegularizer: tf.regularizers.l2(0.01),
              activation: "softmax",
            }),
          ],
        });
        const sgd = tf.train.sgd({ lr: 0.001 });
        model.compile({
          optimizer: sgd,
          loss: "categoricalCrossentropy",
          metrics: ["accuracy"],
        });
        this.model = model;
        this.X_train = tf.oneHot(X_train, 2);
        this.Y_train = tf.oneHot(Y_train, 2);
        this.X_test = X_test;
        this.Y_test = Y_test;
        break;
      default: // Stacking LR + NN
        const input_shape = X_train.shape[1];
        const train_sample_num = X_train.shape[0];
        // Neural Network
        model1 = tf.sequential({
          layers: [
            tf.layers.dense({
              units: Math.round(input_shape / 2),
              inputDim: input_shape,
              activation: "relu",
              kernelRegularizer: tf.regularizers.l2(0.01),
            }),
            tf.layers.dropout({ rate: 0.5 }),
            tf.layers.dense({
              units: Math.round(input_shape / 4),
              kernelRegularizer: tf.regularizers.l2(0.01),
              activation: "relu",
            }),
            tf.layers.batchNormalization(),
            tf.layers.dense({
              units: 2,
              kernelRegularizer: tf.regularizers.l2(0.01),
              activation: "softmax",
            })
          ]
        });
        const sgd1 = tf.train.sgd({ lr: 0.001 });
        model.compile({
          optimizer: sgd1,
          loss: "categoricalCrossentropy",
          metrics: ["accuracy"],
        });
        this.model1 = model1;
        this.X_train1 = Array.slice(X_train, Math.round(train_sample_num));
        this.Y_train1 = Array.slice(tf.oneHot(Y_train, 2), Math.round(train_sample_num));
        // Linear Regression
        const model = tf.sequential({
          layers: [
            tf.layers.dense({
              units: 1,
              inputDim: input_shape,
              activation: "sigmoid",
            }),
          ],
        });
        const sgd = tf.train.sgd({ lr: 0.01 });
        model.compile({
          optimizer: sgd,
          loss: "binaryCrossentropy",
          metrics: ["accuracy"],
        });
        this.X_train2 = Array.slice(X_train, 0, Math.round(train_sample_num));
        this.Y_train = Array.slice(X_train, 0, Math.round(train_sample_num));
        this.X_test = X_test;
        this.Y_test = Y_test;
        break;
    }
  }

  evalu_sta() {
    if (this.model_type === 1 || this.model_type === 2) {
      if (this.save_computation) {
        this.model.fit(this.X_train, this.Y_train, {
          batchSize: 128,
          epochs: 5,
          verbose: 0
        });
      } else {
        this.model.fit(this.X_train, this.Y_train, {
          batchSize: 128,
          epochs: 20,
          verbose: 1
        });
      }
    } else {
      this.model1.fit(this.X_train1, this.Y_train1, {
        batchSize: 128,
        epochs: 20,
        verbose: 0
      });
      const Y1 = this.model1.predict(this.X_train2)
    }
  }
  
}
