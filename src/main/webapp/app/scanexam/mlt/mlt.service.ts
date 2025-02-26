/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as tf from '@tensorflow/tfjs';
import * as ort from 'onnxruntime-web';
import { Injectable } from '@angular/core';

import { InferenceSession } from 'onnxruntime-web';

type Tensor = tf.Tensor;
// Optionnel: Vérifie la compatibilité WASM
ort.env.wasm.wasmPaths = '/public/';

@Injectable({
  providedIn: 'root',
})
export class MLTService {
  session: InferenceSession | undefined = undefined;
  charList: string[] = [
    '<BLANK>',
    ' ',
    '!',
    '"',
    '#',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ':',
    ';',
    '=',
    '?',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '_',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '{',
    '}',
    '¤',
    '°',
    '²',
    'À',
    'É',
    'à',
    'â',
    'ç',
    'è',
    'é',
    'ê',
    'ë',
    'î',
    'ô',
    'ù',
    'û',
    'œ',
    '€',
  ];

  constructor() {}

  async initializeOrt() {
    try {
      ort.env.wasm.numThreads = 1; // Set WebAssembly threads
      ort.env.wasm.proxy = false; // Disable proxy if not required
    } catch (error) {
      console.error('Error configuring ONNX Runtime:', error);
    }
  }

  // Fonction de décodage
  bestPathDecoding(probabilities: number[][], charList: string[], maxLen: number, blankIndex: number, removeDuplicates = true): string {
    maxLen = maxLen === -1 ? probabilities.length : Math.min(maxLen, probabilities.length);

    const sequenceRaw = probabilities.slice(0, maxLen).map(frame => frame.indexOf(Math.max(...frame)));
    let processedSequence: number[] = [];

    if (removeDuplicates) {
      let previousChar: number | null = null;
      for (const char of sequenceRaw) {
        if (char !== previousChar && char !== blankIndex) {
          processedSequence.push(char);
        }
        previousChar = char;
      }
    } else {
      processedSequence = sequenceRaw;
    }

    return this.convertIntToChars(processedSequence, charList);
  }

  convertIntToChars(sequence: number[], charList: string[]): string {
    return sequence.map(index => charList[index]).join('');
  }
  // Prétraitement de l'image
  async preprocessImageFromImgData(
    imageData: ImageData,
    width: number,
    height: number,
    channelNb: number,
    padValue: number,
    padWidthRight: number,
    padWidthLeft: number,
    mean: number,
    std: number,
    targetHeight: number,
  ): Promise<Tensor> {
    const imageTensor = await this.loadImageTensorFromImageData(imageData, width, height);
    let processedImage = imageTensor;
    if (channelNb === 1 && imageTensor.shape[2] !== undefined && imageTensor.shape[2] > 1) {
      processedImage = tf.mean(imageTensor, -1, true);
    }

    const aspectRatio = (imageTensor.shape[1] ?? 1) / (imageTensor.shape[0] ?? 1);
    const newWidth = Math.round(targetHeight * aspectRatio);
    processedImage = tf.image.resizeBilinear(processedImage as tf.Tensor3D, [targetHeight, newWidth]);

    processedImage = processedImage.div(tf.scalar(255.0));
    processedImage = processedImage.sub(tf.scalar(mean)).div(tf.scalar(std));

    const padLeft = tf.pad(
      processedImage,
      [
        [0, 0],
        [padWidthLeft, 0],
        [0, 0],
      ],
      padValue,
    );
    const paddedImage = tf.pad(
      padLeft,
      [
        [0, 0],
        [0, padWidthRight],
        [0, 0],
      ],
      padValue,
    );

    return paddedImage;
  }

  loadImageTensorFromImageData(imageData: ImageData, width: number, height: number): Tensor {
    const data = tf.tensor(imageData.data, [height, width, 4], 'float32');
    const rgb = data.slice([0, 0, 0], [-1, -1, 3]);
    return rgb;
  }

  // Fonction pour effectuer une inférence avec le modèle ONNX
  async runInference(imageTensor: Tensor, modelPath: string): Promise<string> {
    try {
      if (this.session === undefined) {
        this.session = await ort.InferenceSession.create(modelPath, {
          executionProviders: ['wasm'],
        });
      }
      const inputImage = imageTensor.expandDims(0).transpose([0, 3, 1, 2]);
      const imageWidth = tf.scalar(inputImage.shape[3] ?? 0, 'int32');

      const inputImageONNX = new ort.Tensor('float32', await inputImage.data(), inputImage.shape);
      const imageWidthONNX = new ort.Tensor('int32', await imageWidth.dataSync());

      const results = await this.session.run({
        inputs: inputImageONNX,
        image_widths: imageWidthONNX,
      });

      const probabilitiesTensor = results.output;
      const probabilities1D: number[] = Array.from(probabilitiesTensor.data as Float32Array);
      const batchSize = probabilitiesTensor.dims[0];
      const numFrames = probabilitiesTensor.dims[1];
      const numChars = probabilitiesTensor.dims[2];

      const reshapedProbabilities: number[][][] = [];
      let offset = 0;
      for (let b = 0; b < batchSize; b++) {
        const batchFrames: number[][] = [];
        for (let i = 0; i < numFrames; i++) {
          batchFrames.push(probabilities1D.slice(offset, offset + numChars));
          offset += numChars;
        }
        reshapedProbabilities.push(batchFrames);
      }

      const decodedBatch = reshapedProbabilities.map(probabilities => this.bestPathDecoding(probabilities, this.charList, -1, 0, true));
      return decodedBatch.join(', ');
    } catch (error) {
      console.error('Error during inference:', error);
      return '';
    }
  }
  async executeMLTFromImagData(imageData: ImageData, width: number, height: number): Promise<string | undefined> {
    this.initializeOrt();
    // Paramètres de prétraitement (issus de la configuration ou d'un modèle)
    const channelNb: number = 1; // Monochrome
    const padValue: number = 0.0;
    const padWidthRight: number = 64;
    const padWidthLeft: number = 64;
    const mean: number = 238.6531 / 255;
    const std: number = 43.4356 / 255;
    const targetHeight: number = 128;

    try {
      // Prétraitement de l'image
      const preprocessedImage = await this.preprocessImageFromImgData(
        imageData,
        width,
        height,
        channelNb,
        padValue,
        padWidthRight,
        padWidthLeft,
        mean,
        std,
        targetHeight,
      );
      // Spécification du chemin du modèle ONNX
      const modelPath: string = '../../content/classifier/trace_mlt-4modern_hw_rimes_lines-v3+synth-1034184_best_encoder.tar.onnx';

      // Exécution de l'inférence
      const prediction = await this.runInference(preprocessedImage, modelPath);

      return prediction;
    } catch (error) {
      console.error('Error in executeMLT:', error);
      return undefined;
    }
  }
}
