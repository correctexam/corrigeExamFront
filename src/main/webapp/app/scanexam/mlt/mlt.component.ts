import * as tf from '@tensorflow/tfjs';
import * as ort from 'onnxruntime-web';

import { NgIf, NgFor } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InferenceSession, env } from 'onnxruntime-web';

type Tensor = tf.Tensor;
// Optionnel: Vérifie la compatibilité WASM
ort.env.wasm.wasmPaths = '/public/';

@Component({
  selector: 'jhi-mlt',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mlt.component.html',
  styleUrl: './mlt.component.scss',
})
export class MltComponent {
  session: InferenceSession | undefined = undefined;
  constructor(private route: ActivatedRoute) {}

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

  // Fonction pour afficher l'image prétraitée
  async plotPreprocessedImage(tensor: Tensor): Promise<void> {
    const canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const tensorRescaled = tensor.mul(255).cast('int32');
    const [height, width, channels] = tensorRescaled.shape as [number, number, number];
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    const data = await tensorRescaled.data();

    for (let i = 0; i < height * width; i++) {
      const j = i * 4;
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];
      imageData.data[j] = r;
      imageData.data[j + 1] = g;
      imageData.data[j + 2] = b;
      imageData.data[j + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }
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
  async preprocessImage(
    imageFile: File,
    channelNb: number,
    padValue: number,
    padWidthRight: number,
    padWidthLeft: number,
    mean: number,
    std: number,
    targetHeight: number,
  ): Promise<Tensor> {
    const imageTensor = await this.loadImageTensor(imageFile);
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

  // Chargement de l'image en tenseur
  async loadImageTensor(imageFile: File): Promise<Tensor> {
    if (!imageFile.type.startsWith('image/')) {
      throw new Error(`Invalid file type: ${imageFile.type}`);
    }

    const img = new Image();
    const objectURL = URL.createObjectURL(imageFile);
    img.src = objectURL;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          let canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
          if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'imageCanvas';
            canvas.style.display = 'none';
            document.body.appendChild(canvas);
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = tf.tensor(imageData.data, [img.height, img.width, 4], 'float32');
          const rgb = data.slice([0, 0, 0], [-1, -1, 3]);
          resolve(rgb);
        } catch (error) {
          console.error('Error processing image:', error);
          reject(error);
        } finally {
          URL.revokeObjectURL(objectURL);
        }
      };

      img.onerror = event => {
        console.error('Image loading error details:', event);
        reject(new Error('Failed to load image'));
      };
    });
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
      //document.getElementById('result')!.textContent = decodedBatch.join(', ');
      return decodedBatch.join(', ');
    } catch (error) {
      console.error('Error during inference:', error);
      return '';
    }
  }

  async executeMLT(base64: any): Promise<string | undefined> {
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
      // Chargement du fichier image
      //const imageFileUrl = 'content/images/refined_line_2.png'; // Chemin relatif à partir de la racine du serveur web
      //const cleanedBase64 = await this.removeRectangles(base64);
      const response = await fetch(base64);
      const blob = await response.blob();
      const imageFile = new File([blob], 'my_image.png', { type: blob.type });
      // Prétraitement de l'image
      const preprocessedImage = await this.preprocessImage(
        imageFile,
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

      console.log('Prediction:', prediction);
      return prediction;
    } catch (error) {
      console.error('Error in executeMLT:', error);
      return undefined;
    }
  }
}
