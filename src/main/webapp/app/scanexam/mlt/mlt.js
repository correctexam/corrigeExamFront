const tf = require('@tensorflow/tfjs');
const ort = require('onnxruntime-node');

const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const charList = [
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

// Helper function to load image as tensor
async function plotPreprocessedImage(tensor) {
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');

  // Rescale tensor from [0, 1] back to [0, 255] for visualization
  const tensorRescaled = tensor.mul(255).cast('int32');

  // Get the shape of the tensor and prepare the canvas
  const [height, width, channels] = tensorRescaled.shape;
  canvas.width = width;
  canvas.height = height;

  // Convert tensor to ImageData format for rendering in the canvas
  const imageData = ctx.createImageData(width, height);
  const data = await tensorRescaled.data(); // Get the data from the tensor

  // Convert the tensor back into ImageData (RGBA format)
  for (let i = 0; i < height * width; i++) {
    const j = i * 4; // index in ImageData (RGBA, 4 channels)
    const r = data[i * channels]; // Red
    const g = data[i * channels + 1]; // Green
    const b = data[i * channels + 2]; // Blue
    imageData.data[j] = r; // Set Red
    imageData.data[j + 1] = g; // Set Green
    imageData.data[j + 2] = b; // Set Blue
    imageData.data[j + 3] = 255; // Set Alpha (fully opaque)
  }

  // Put the imageData back on the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Decoding function (equivalent to `best_path_common` in Python)
function bestPathDecoding(probabilities, charList, maxLen, blankIndex, removeDuplicates = true) {
  console.log('Probabilities:', probabilities);
  // If max_len is -1, use the length of probabilities; otherwise, clip at maxLen
  maxLen = maxLen === -1 ? probabilities.length : Math.min(maxLen, probabilities.length);

  // Get the character with the highest probability for each frame (argmax)
  // const sequenceRaw = probabilities.slice(0, maxLen).map(frame => frame.indexOf(Math.max(...frame)));
  const sequenceRaw = probabilities.slice(0, maxLen).map(frame => frame.indexOf(Math.max(...frame)));
  console.log('raw sequence:', sequenceRaw);
  // Process sequence for removing duplicates and blanks
  let processedSequence = [];
  if (removeDuplicates) {
    let previousChar = null;
    for (let i = 0; i < sequenceRaw.length; i++) {
      const char = sequenceRaw[i];
      // Collapse duplicates and remove blanks
      if (char !== previousChar && char !== blankIndex) {
        processedSequence.push(char);
      }
      previousChar = char;
    }
  } else {
    processedSequence = sequenceRaw;
  }
  console.log('Processed Sequence:', processedSequence);
  // Convert the integer indices to characters
  return convertIntToChars(processedSequence, charList);
}

// Convert integer sequence to characters
function convertIntToChars(sequence, charList) {
  const done = sequence.map(index => charList[index]).join('');
  console.log('Prediction:', done);
  return done;
}

// Define preprocessing steps (similar to prepare_image_f in C++)
async function preprocessImage(imageFile, channelNb, padValue, padWidthRight, padWidthLeft, mean, std, targetHeight) {
  // Load the image
  console.log('I am in preprocessImage');
  const imageTensor = await loadImageTensor(imageFile);
  console.log('Image came to tensor');
  let processedImage = imageTensor;

  // If grayscale conversion is needed
  if (channelNb === 1 && imageTensor.shape[2] > 1) {
    processedImage = tf.mean(imageTensor, -1, true); // Convert to grayscale
  }

  // Resize the image to target height, maintaining aspect ratio
  const aspectRatio = imageTensor.shape[1] / imageTensor.shape[0]; // width/height
  const newWidth = Math.round(targetHeight * aspectRatio);
  processedImage = tf.image.resizeBilinear(processedImage, [targetHeight, newWidth]);

  // Normalize the image tensor (normalize_tensor_f equivalent)
  processedImage = processedImage.div(tf.scalar(255.0)); // Divide by 255 to scale pixel values
  processedImage = processedImage.sub(tf.scalar(mean)).div(tf.scalar(std)); // Apply mean and std normalization

  // Pad the image on both sides
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

// Helper function to load image into tensor
async function loadImageTensor(imageFile) {
  const imagePath = path.resolve(__dirname, imageFile);
  console.log('I am in loadImageTensor');
  const img = await loadImage(imagePath);
  console.log('I got the img', img);
  return new Promise(resolve => {
    console.log('I loaded the img');
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = tf.tensor(imageData.data, [img.height, img.width, 4], 'float32'); // RGBA

    // Extract the RGB channels
    const rgb = data.slice([0, 0, 0], [-1, -1, 3]);
    console.log('Rgb', rgb);
    resolve(rgb);
  });
}

// Function to run ONNX inference
async function runInference(imageTensor, modelPath) {
  try {
    // Load the ONNX model
    const session = await ort.InferenceSession.create(modelPath);

    // Prepare inputs for the model (like the prepare_model_input_f function)
    const inputImage = imageTensor.expandDims(0).transpose([0, 3, 1, 2]); // b c h w format

    // Assume width is the third dimension (H x W x C)
    const imageWidth = tf.scalar(inputImage.shape[3], 'int32'); // Width of image
    const outputHidden = tf.scalar(0, 'int32');
    const prod = tf.scalar(1, 'int32');

    // Convert tf.Tensor to ort.Tensor
    const inputImageONNX = new ort.Tensor('float32', await inputImage.data(), inputImage.shape);
    console.log(' inputImage.data():', inputImage.data());
    console.log('inputImage.shape', inputImage.shape);
    console.log('inputImageONNX ', inputImageONNX);
    const imageWidthONNX = new ort.Tensor('int32', await imageWidth.dataSync());
    const outputHiddenONNX = new ort.Tensor('int32', await outputHidden.dataSync());
    const prodONNX = new ort.Tensor('int32', await prod.dataSync());

    console.log('imageWidth:', await imageWidth.data());
    console.log('inputImage:', inputImage.shape);
    // Run inference
    const results = await session.run({
      inputs: inputImageONNX,
      image_widths: imageWidthONNX,
    });

    console.log('Inference Output:', results);
    // Parameters for decoding
    const maxLen = -1; // No specific max length
    const blankIndex = 0; // '<BLANK>' corresponds to index 0
    const removeDuplicates = true;
    const probabilitiesTensor = results.output; // Adjust based on your model's output name
    const probabilities1D = Array.from(probabilitiesTensor.data); // Convert ONNX tensor to flat array
    console.log('probabilities1D:', probabilities1D);
    console.log('probabilities1D shape:', probabilities1D.shape);
    const batchSize = probabilitiesTensor.dims[0];
    const numFrames = probabilitiesTensor.dims[1];
    const numChars = probabilitiesTensor.dims[2];

    // Reshape the 1D array into a 3D array: [batch_size, numFrames, numChars]
    const reshapedProbabilities = [];
    let offset = 0;
    for (let b = 0; b < batchSize; b++) {
      const batchFrames = [];
      for (let i = 0; i < numFrames; i++) {
        batchFrames.push(probabilities1D.slice(offset, offset + numChars));
        offset += numChars;
      }
      reshapedProbabilities.push(batchFrames);
    }
    console.log('Reshaped probobilities:', reshapedProbabilities);
    // Perform decoding
    // Decode all sequences in the batch
    const decodedBatch = reshapedProbabilities.map(probabilities =>
      bestPathDecoding(probabilities, charList, maxLen, blankIndex, removeDuplicates),
    );
    console.log(decodedBatch);
    document.getElementById('result').textContent = decodedBatch;
  } catch (error) {
    console.error('Error during inference:', error);
  }
}

async function firstDo() {
  const imageFile = 'refined_line_2.png';

  // Preprocessing parameters (These would normally come from your model or a config)
  const channelNb = 1; // RGB
  const padValue = 0.0;
  const padWidthRight = 64;
  const padWidthLeft = 64;
  const mean = 238.6531 / 255;
  const std = 43.4356 / 255;
  const targetHeight = 128;

  // Preprocess the image
  const preprocessedImage = await preprocessImage(imageFile, channelNb, padValue, padWidthRight, padWidthLeft, mean, std, targetHeight);
  console.log('I passed here');
  // Run inference using the preprocessed image
  const modelPath = 'trace_mlt-4modern_hw_rimes_lines-v3+synth-1034184_best_encoder.tar.onnx'; // Specify the ONNX model path
  runInference(preprocessedImage, modelPath);
}

console.log('Script is running...');
firstDo();
