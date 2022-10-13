/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/**
 * class Model
 * Loads the Tensorflow model and preprocesses and predicts images
 */
declare let tf: any;

export class MLModel {
  alphabet!: string;
  characters!: string;
  isWarmedUp!: Promise<any>;
  _model: any;
  /**
   * Initializes the Model class, loads and warms up the model, etc
   */
  constructor(letteranddigit: boolean) {
    if (letteranddigit) {
      this.alphabet = ' abcdefghijklmnopqrstuvwxyz';
      //      this.characters = '0123456789' + this.alphabet.toUpperCase() + this.alphabet;
      this.characters = this.alphabet.toUpperCase();
    } else {
      //			this.alphabet = "abcdefghijklmnopqrstuvwxyz";
      this.characters = '0123456789';
    }
    this.isWarmedUp = this.initModel(letteranddigit);
  }

  initModel(letteranddigit: boolean): Promise<void> {
    return new Promise<void>(resolve => {
      tf.setBackend('wasm').then(() => {
        this.loadModel(letteranddigit)
          .then()
          .then(() => {
            console.info('Backend running on:', tf.getBackend());
            resolve();
          });
      });
    });
  }

  /**
   * Loads the model
   */
  public loadModel(letteranddigit: boolean): Promise<any> {
    console.time('Load model');
    if (letteranddigit) {
      console.log('load letter');
      return tf.loadLayersModel('content/classifier/letterclassifier/model.json').then((model: any) => {
        this._model = model;
        console.timeEnd('Load model');
      });
    } else {
      console.log('load digit');
      return tf.loadLayersModel('content/classifier/digitclassifier/model.json').then((model: any) => {
        this._model = model;
        console.timeEnd('Load model');
      });
    }
  }

  /**
   * Runs a prediction with random data to warm up the GPU
   */
  public warmUp(): any {
    console.time('Warmup');
    this._model
      .predict(tf.randomNormal([1, 28, 28, 1]))
      .as1D()
      .dataSync();
    console.timeEnd('Warmup');
  }

  /**
   * Takes an ImageData object and reshapes it to fit the model
   * @param {ImageData} pixelData
   */
  preprocessImage(pixelData: ImageData): any {
    const targetDim = 28,
      edgeSize = 2,
      resizeDim = targetDim - edgeSize * 2,
      padVertically = pixelData.width > pixelData.height,
      padSize = Math.round((Math.max(pixelData.width, pixelData.height) - Math.min(pixelData.width, pixelData.height)) / 2),
      padSquare = padVertically
        ? [
            [padSize, padSize],
            [0, 0],
            [0, 0],
          ]
        : [
            [0, 0],
            [padSize, padSize],
            [0, 0],
          ];

    return tf.tidy(() => {
      // convert the pixel data into a tensor with 1 data channel per pixel
      // i.e. from [h, w, 4] to [h, w, 1]
      let tensor = tf.browser
        .fromPixels(pixelData, 1)
        // pad it such that w = h = max(w, h)
        .pad(padSquare, 255.0);

      // scale it down
      tensor = tf.image
        .resizeBilinear(tensor, [resizeDim, resizeDim])
        // pad it with blank pixels along the edges (to better match the training data)
        .pad(
          [
            [edgeSize, edgeSize],
            [edgeSize, edgeSize],
            [0, 0],
          ],
          255.0
        );

      // invert and normalize to match training data
      tensor = tf.scalar(1.0).sub(tensor.toFloat().div(tf.scalar(255.0)));

      // Reshape again to fit training model [N, 28, 28, 1]
      // where N = 1 in this case
      return tensor.expandDims(0);
    });
  }

  /**
   * Takes an ImageData objects and predict a character
   * @param {ImageData} pixelData
   * @returns {string} character
   */
  predict(pixelData: ImageData): any {
    if (!this._model) {
      return console.warn('Model not loaded yet!');
    }
    //	console.time("Prediction")
    const tensor = this.preprocessImage(pixelData);
    const prediction = this._model.predict(tensor).as1D();
    // get the index of the most probable character
    const argMax = prediction.argMax().dataSync()[0];
    const probability = prediction.max().dataSync()[0];
    // get the character at that index
    const character = this.characters[argMax];

    // console.log('Predicted', character, 'Probability', probability);
    // console.timeEnd("Prediction")
    return [character, probability];
  }
}
