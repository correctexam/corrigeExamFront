/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import {
  _FusedMatMul,
  broadcast_util,
  util,
  Abs,
  Acos,
  Acosh,
  backend_util,
  Add,
  AddN,
  Identity,
  tensor,
  Transpose,
  All,
  Any,
  ArgMax,
  ArgMin,
  Asin,
  Asinh,
  Atan,
  Atan2,
  Atanh,
  AvgPool,
  AvgPool3D,
  AvgPool3DGrad,
  AvgPoolGrad,
  Reshape,
  BatchMatMul,
  slice_util,
  buffer,
  TensorBuffer,
  Slice,
  BatchToSpaceND,
  Bincount,
  BitwiseAnd,
  BroadcastArgs,
  Cast,
  Ceil,
  ClipByValue,
  Concat,
  Conv2D,
  Conv2DBackpropInput,
  Conv3D,
  Conv3DBackpropFilterV2,
  Conv3DBackpropInputV2,
  Cos,
  Cosh,
  CropAndResize,
  Cumprod,
  Cumsum,
  DenseBincount,
  DepthToSpace,
  DepthwiseConv2dNative,
  Diag,
  Dilation2D,
  Dilation2DBackpropFilter,
  Dilation2DBackpropInput,
  Elu,
  EluGrad,
  Equal,
  Erf,
  Exp,
  ExpandDims,
  Expm1,
  Fill,
  FlipLeftRight,
  Floor,
  FloorDiv,
  FusedBatchNorm,
  FusedConv2D,
  FusedDepthwiseConv2D,
  GatherNd,
  gather_util,
  GatherV2,
  Greater,
  GreaterEqual,
  IsFinite,
  IsInf,
  IsNan,
  LeakyRelu,
  Less,
  LessEqual,
  LinSpace,
  Log,
  Log1p,
  LogicalAnd,
  LogicalNot,
  LogicalOr,
  LogicalXor,
  LRN,
  LRNGrad,
  Max,
  Maximum,
  MaxPool,
  MaxPool3D,
  MaxPool3DGrad,
  MaxPoolGrad,
  MaxPoolWithArgmax,
  Mean,
  Min,
  Minimum,
  MirrorPad,
  Softmax,
  Multinomial,
  Mod,
  Multiply,
  Neg,
  NonMaxSuppressionV3,
  NonMaxSuppressionV4,
  NonMaxSuppressionV5,
  NotEqual,
  OneHot,
  OnesLike,
  Pack,
  PadV2,
  Pow,
  Prelu,
  Prod,
  Range,
  RealDiv,
  Reciprocal,
  Relu,
  Relu6,
  ResizeBilinear,
  ResizeBilinearGrad,
  ResizeNearestNeighbor,
  ResizeNearestNeighborGrad,
  Reverse,
  RotateWithOffset,
  Round,
  Rsqrt,
  ScatterNd,
  scatter_util,
  SearchSorted,
  Select,
  Selu,
  Sigmoid,
  Sign,
  Sin,
  Sinh,
  Softplus,
  SpaceToBatchND,
  SparseFillEmptyRows,
  SparseReshape,
  SparseSegmentMean,
  SparseSegmentSum,
  SparseToDense,
  SplitV,
  Sqrt,
  Square,
  SquaredDifference,
  Step,
  StridedSlice,
  StringNGrams,
  StringSplit,
  StringToHashBucketFast,
  Sub,
  Sum,
  Tan,
  Tanh,
  TensorScatterUpdate,
  Tile,
  TopK,
  Transform,
  Unique,
  Unpack,
  ZerosLike,
  registerKernel,
  env,
  KernelBackend,
  DataStorage,
  engine,
  deprecationWarn,
  registerBackend,
} from '@tensorflow/tfjs-core';
import require$$0 from 'fs';
import require$$1 from 'path';
import require$$3 from 'perf_hooks';
import require$$4 from 'os';

function _mergeNamespaces(n, m) {
  m.forEach(function (e) {
    e &&
      typeof e !== 'string' &&
      !Array.isArray(e) &&
      Object.keys(e).forEach(function (k) {
        if (k !== 'default' && !(k in n)) {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(
            n,
            k,
            d.get
              ? d
              : {
                  enumerable: true,
                  get: function () {
                    return e[k];
                  },
                },
          );
        }
      });
  });
  return n;
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// This enum must align with the enum defined in cc/backend.h.
var CppDType;
(function (CppDType) {
  CppDType[(CppDType['float32'] = 0)] = 'float32';
  CppDType[(CppDType['int32'] = 1)] = 'int32';
  CppDType[(CppDType['bool'] = 2)] = 'bool';
  CppDType[(CppDType['string'] = 3)] = 'string';
  CppDType[(CppDType['complex64'] = 4)] = 'complex64';
})(CppDType || (CppDType = {}));
// Must match enum in cc/fusable_activations.h.
var FusableActivation;
(function (FusableActivation) {
  FusableActivation[(FusableActivation['linear'] = 0)] = 'linear';
  FusableActivation[(FusableActivation['relu'] = 1)] = 'relu';
  FusableActivation[(FusableActivation['relu6'] = 2)] = 'relu6';
  FusableActivation[(FusableActivation['prelu'] = 3)] = 'prelu';
  FusableActivation[(FusableActivation['leakyrelu'] = 4)] = 'leakyrelu';
  FusableActivation[(FusableActivation['sigmoid'] = 5)] = 'sigmoid';
  FusableActivation[(FusableActivation['elu'] = 6)] = 'elu';
})(FusableActivation || (FusableActivation = {}));

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFusedMatMul;
function setup$1a(backend) {
  wasmFusedMatMul = backend.wasm.cwrap(_FusedMatMul, null /* void */, [
    'number',
    'array',
    'number',
    'number',
    'array',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function fusedBatchMatMul(args) {
  const { inputs, backend, attrs } = args;
  const { a, b, bias, preluActivationWeights } = inputs;
  if (a.dtype !== 'float32' || b.dtype !== 'float32') {
    throw new Error(`_FusedMatMul for non non-float32 tensors not yet supported.`);
  }
  const { transposeA, transposeB, activation, leakyreluAlpha } = attrs;
  const aId = backend.dataIdMap.get(a.dataId).id;
  const bId = backend.dataIdMap.get(b.dataId).id;
  let biasId = 0;
  if (bias != null) {
    const biasData = backend.dataIdMap.get(bias.dataId);
    if (biasData.shape.length !== 1) {
      throw new Error(`_FusedMatMul only supports rank-1 bias but got ` + `rank ${biasData.shape.length}.`);
    }
    biasId = biasData.id;
  }
  const preluActivationWeightsId = preluActivationWeights == null ? 0 : backend.dataIdMap.get(preluActivationWeights.dataId).id;
  const fusedActivation = FusableActivation[activation];
  if (fusedActivation == null) {
    throw new Error(`${activation} activation not yet supported for FusedConv2D ` + `in the wasm backend.`);
  }
  const leftDim = transposeA ? a.shape[2] : a.shape[1];
  const rightDim = transposeB ? b.shape[1] : b.shape[2];
  const batchDims = broadcast_util.assertAndGetBroadcastShape(a.shape.slice(0, -2), b.shape.slice(0, -2));
  const out = backend.makeOutput([...batchDims, leftDim, rightDim], a.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
  const bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
  wasmFusedMatMul(
    aId,
    aShapeBytes,
    a.shape.length,
    bId,
    bShapeBytes,
    b.shape.length,
    transposeA,
    transposeB,
    fusedActivation,
    biasId,
    preluActivationWeightsId,
    leakyreluAlpha || 0,
    outId,
  );
  return out;
}
const _fusedMatMulConfig = {
  kernelName: _FusedMatMul,
  backendName: 'wasm',
  setupFunc: setup$1a,
  kernelFunc: fusedBatchMatMul,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function createUnaryKernelConfig(kernelName, outType) {
  let wasmFunc;
  function setupFunc(backend) {
    wasmFunc = backend.wasm.cwrap(kernelName, null /* void */, [
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function kernelFunc(args) {
    const {
      backend,
      inputs: { x },
    } = args;
    const xId = backend.dataIdMap.get(x.dataId).id;
    const out = backend.makeOutput(x.shape, outType || x.dtype);
    const outId = backend.dataIdMap.get(out.dataId).id;
    // Short-circuit zero-sized tensors.
    if (util.sizeFromShape(out.shape) === 0) {
      return out;
    }
    wasmFunc(xId, CppDType[x.dtype], outId);
    return out;
  }
  return { kernelName, backendName: 'wasm', setupFunc, kernelFunc };
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const absConfig = createUnaryKernelConfig(Abs);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const acosConfig = createUnaryKernelConfig(Acos);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const acoshConfig = createUnaryKernelConfig(Acosh);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function createBinaryKernelConfig(kernelName, supportsFullBroadcast, dtype) {
  let wasmFunc;
  function setupFunc(backend) {
    wasmFunc = backend.wasm.cwrap(kernelName, null /* void */, [
      'number',
      'array',
      'number',
      'number',
      'array',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function kernelFunc(args) {
    const { backend, inputs } = args;
    const { a, b } = inputs;
    const aId = backend.dataIdMap.get(a.dataId).id;
    const bId = backend.dataIdMap.get(b.dataId).id;
    const outputType = dtype != null ? dtype : a.dtype;
    const newShape = backend_util.assertAndGetBroadcastShape(a.shape, b.shape);
    const out = backend.makeOutput(newShape, outputType);
    // Short-circuit zero-sized tensors.
    if (util.sizeFromShape(newShape) === 0) {
      return out;
    }
    const aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
    const bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
    const outId = backend.dataIdMap.get(out.dataId).id;
    const kernelFunc = () => wasmFunc(aId, aShapeBytes, a.shape.length, bId, bShapeBytes, b.shape.length, CppDType[a.dtype], outId);
    kernelFunc();
    return out;
  }
  return { kernelName, backendName: 'wasm', setupFunc, kernelFunc };
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const addConfig = createBinaryKernelConfig(Add);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc$6;
function setupFunc$1(backend) {
  wasmFunc$6 = backend.wasm.cwrap(AddN, null /* void */, [
    'array',
    'number',
    'number',
    'number', // out_id
  ]);
}
function addn(args) {
  const { inputs, backend } = args;
  const out = backend.makeOutput(inputs[0].shape, inputs[0].dtype);
  // Short-circuit zero-sized tensors.
  if (util.sizeFromShape(out.shape) === 0) {
    return out;
  }
  const inputIds = inputs.map(x => backend.dataIdMap.get(x.dataId).id);
  const inputIdsBytes = new Uint8Array(new Int32Array(inputIds).buffer);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmFunc$6(inputIdsBytes, inputIds.length, CppDType[out.dtype], outId);
  return out;
}
const addNConfig = {
  kernelName: AddN,
  backendName: 'wasm',
  setupFunc: setupFunc$1,
  kernelFunc: addn,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function identity(args) {
  const {
    inputs: { x },
    backend,
  } = args;
  if (x.dtype === 'string') {
    return tensor(backend.readSync(x.dataId), x.shape, x.dtype);
  }
  const out = backend.makeOutput(x.shape, x.dtype);
  const inVals = backend.typedArrayFromHeap(x);
  const outVals = backend.typedArrayFromHeap(out);
  outVals.set(inVals);
  return out;
}
const identityConfig = {
  kernelName: Identity,
  backendName: 'wasm',
  kernelFunc: identity,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmTranspose;
function setup$19(backend) {
  wasmTranspose = backend.wasm.cwrap(Transpose, null /* void */, [
    'number',
    'array',
    'number',
    'number',
    'number',
    'array',
    'number', // perm.length
  ]);
}
function transpose(args) {
  const { inputs, backend, attrs } = args;
  // Reduce any dimensions with size one. Lower-rank transpose kernel performs
  // better due to simpler memory access pattern.
  const [reducedShape, perm] = removeOneSizeDims(inputs.x.shape, attrs.perm);
  let permIsNoOp = true;
  for (let i = 0; i < perm.length; i++) {
    if (perm[i] !== i) {
      permIsNoOp = false;
    }
  }
  const outShape = computeOutShape(inputs.x.shape, attrs.perm);
  const x = {
    dataId: inputs.x.dataId,
    shape: reducedShape,
    dtype: inputs.x.dtype,
  };
  if (permIsNoOp) {
    const cloned = identity({ inputs, backend });
    cloned.shape = outShape;
    return cloned;
  }
  const out = backend.makeOutput(outShape, x.dtype);
  const xId = backend.dataIdMap.get(x.dataId).id;
  const outId = backend.dataIdMap.get(out.dataId).id;
  const permBytes = new Uint8Array(new Int32Array(perm).buffer);
  const xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
  wasmTranspose(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], outId, permBytes, perm.length);
  return out;
}
function computeOutShape(inShape, perm) {
  const outShape = new Array(inShape.length);
  for (let i = 0; i < outShape.length; i++) {
    outShape[i] = inShape[perm[i]];
  }
  return outShape;
}
function removeOneSizeDims(shape, perm) {
  const newShape = [];
  const newPerm = [];
  for (let i = 0; i < shape.length; ++i) {
    if (shape[i] !== 1) {
      newShape.push(shape[i]);
    }
    if (shape[perm[i]] !== 1) {
      newPerm.push(perm[i]);
    }
  }
  for (let i = 0; i < newPerm.length; ++i) {
    let minValIdx = -1;
    for (let j = 0; j < newPerm.length; ++j) {
      if (newPerm[j] >= i && (minValIdx === -1 || newPerm[minValIdx] > newPerm[j])) {
        minValIdx = j;
      }
    }
    newPerm[minValIdx] = i;
  }
  return [newShape, newPerm];
}
const transposeConfig = {
  kernelName: Transpose,
  backendName: 'wasm',
  kernelFunc: transpose,
  setupFunc: setup$19,
};

/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Compute permutation axes and do a transpose if necessary.
 *
 * Used by reduction ops.
 * @param x input TensorInfo
 * @param axis reduction axes
 * @param backend wasm backend instance
 */
function permuteAxesAndTranspose(x, axis, backend) {
  const xShape = x.shape;
  const xRank = x.shape.length;
  const originalAxes = util.parseAxisParam(axis, xShape);
  let axes = originalAxes;
  const permutedAxes = backend_util.getAxesPermutation(axes, xRank);
  let xTransposed = null;
  let inputWasTransposed = false;
  if (permutedAxes != null) {
    const newShape = new Array(xRank);
    for (let i = 0; i < newShape.length; i++) {
      newShape[i] = xShape[permutedAxes[i]];
    }
    axes = backend_util.getInnerMostAxes(axes.length, xRank);
    xTransposed = transpose({ inputs: { x }, attrs: { perm: permutedAxes }, backend });
    const xId = backend.dataIdMap.get(x.dataId).id;
    const transposedId = backend.dataIdMap.get(xTransposed.dataId).id;
    if (transposedId !== xId) {
      inputWasTransposed = true;
    }
  }
  return { transposed: xTransposed, originalAxes, axes, inputWasTransposed };
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmAll;
function setup$18(backend) {
  wasmAll = backend.wasm.cwrap(All, null /*void*/, ['number, number, number']);
}
function all(args) {
  const { backend, inputs, attrs } = args;
  const { axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    input = transposed;
    inputId = transposedId;
  }
  const inputRank = input.shape.length;
  backend_util.assertAxesAreInnerMostDims('all', axes, inputRank);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, axes);
  const reduceSize = util.sizeFromShape(reduceShape);
  const out = backend.makeOutput(outShape, x.dtype);
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmAll(inputId, reduceSize, outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  return out;
}
const allConfig = {
  kernelName: All,
  backendName: 'wasm',
  setupFunc: setup$18,
  kernelFunc: all,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmAny;
function setup$17(backend) {
  wasmAny = backend.wasm.cwrap(Any, null /*void*/, ['number, number, number']);
}
function any(args) {
  const { backend, inputs, attrs } = args;
  const { axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    input = transposed;
    inputId = transposedId;
  }
  const inputRank = input.shape.length;
  backend_util.assertAxesAreInnerMostDims('any', axes, inputRank);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, axes);
  const reduceSize = util.sizeFromShape(reduceShape);
  const out = backend.makeOutput(outShape, x.dtype);
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmAny(inputId, reduceSize, outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  return out;
}
const anyConfig = {
  kernelName: Any,
  backendName: 'wasm',
  setupFunc: setup$17,
  kernelFunc: any,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function createArgMinMaxKernelConfig(kernelName) {
  let wasmFunc;
  function setupFunc(backend) {
    wasmFunc = backend.wasm.cwrap(kernelName, null /* void */, [
      'number',
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function kernelFunc(args) {
    const { backend, inputs, attrs } = args;
    const { axis } = attrs;
    const { x } = inputs;
    const xId = backend.dataIdMap.get(x.dataId).id;
    let inputId = xId;
    let input = x;
    const { transposed, axes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
    if (inputWasTransposed) {
      const transposedId = backend.dataIdMap.get(transposed.dataId).id;
      if (transposedId !== xId) {
        // transpose was not a no-op. We will need to dispose of this
        // once we are done.
        input = transposed;
        inputId = transposedId;
      }
    }
    const outShape = input.shape.slice(0, -1);
    const out = backend.makeOutput(outShape, 'int32');
    const outId = backend.dataIdMap.get(out.dataId).id;
    const outerSize = util.sizeFromShape(out.shape);
    const innerSize = input.shape[axes[0]];
    wasmFunc(inputId, CppDType[input.dtype], outerSize, innerSize, outId);
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    return out;
  }
  return {
    kernelName,
    backendName: 'wasm',
    setupFunc,
    kernelFunc: kernelFunc,
  };
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const argMaxConfig = createArgMinMaxKernelConfig(ArgMax);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const argMinConfig = createArgMinMaxKernelConfig(ArgMin);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const asinConfig = createUnaryKernelConfig(Asin);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const asinhConfig = createUnaryKernelConfig(Asinh);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const atanConfig = createUnaryKernelConfig(Atan);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const atan2Config = createBinaryKernelConfig(Atan2);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const atanhConfig = createUnaryKernelConfig(Atanh);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmAvgPool;
function setup$16(backend) {
  wasmAvgPool = backend.wasm.cwrap(AvgPool, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function avgPool(args) {
  const { inputs, attrs, backend } = args;
  const x = inputs.x;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const { filterSize, strides, pad, dimRoundingMode } = attrs;
  const convInfo = backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad, dimRoundingMode);
  const filterHeight = convInfo.filterHeight;
  const filterWidth = convInfo.filterWidth;
  const padTop = convInfo.padInfo.top;
  const padRight = convInfo.padInfo.right;
  const padBottom = convInfo.padInfo.bottom;
  const padLeft = convInfo.padInfo.left;
  const strideHeight = convInfo.strideHeight;
  const strideWidth = convInfo.strideWidth;
  const channels = convInfo.inChannels;
  if (convInfo.dataFormat !== 'channelsLast') {
    throw new Error(`wasm backend does not support dataFormat:'` + `${convInfo.dataFormat}'. Please use 'channelsLast'.`);
  }
  if (convInfo.dilationWidth !== 1 || convInfo.dilationHeight !== 1) {
    throw new Error(
      `was backend only supports average pooling with dilation = [1, 1], ` + `got [${convInfo.dilationHeight}, ${convInfo.dilationWidth}].`,
    );
  }
  const out = backend.makeOutput(convInfo.outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmAvgPool(
    xId,
    x.shape[0],
    x.shape[1],
    x.shape[2],
    filterHeight,
    filterWidth,
    padTop,
    padRight,
    padBottom,
    padLeft,
    strideHeight,
    strideWidth,
    channels,
    outId,
  );
  return out;
}
const avgPoolConfig = {
  kernelName: AvgPool,
  backendName: 'wasm',
  setupFunc: setup$16,
  kernelFunc: avgPool,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmAvgPool3D;
function setup$15(backend) {
  wasmAvgPool3D = backend.wasm.cwrap('AvgPool3D', null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function avgPool3D(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { filterSize, strides, pad, dimRoundingMode, dataFormat } = attrs;
  const convInfo = backend_util.computePool3DInfo(x.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode, dataFormat);
  const out = backend.makeOutput(convInfo.outShape, x.dtype);
  wasmAvgPool3D(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(out.dataId).id,
    convInfo.batchSize,
    // Since Pool3D ops (AvgPool3D and MaxPool3D) support 3D filter only, in
    // channels should always equal to out channels.
    /*channelSize=*/ convInfo.inChannels,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterDepth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return out;
}
const avgPool3DConfig = {
  kernelName: AvgPool3D,
  backendName: 'wasm',
  setupFunc: setup$15,
  kernelFunc: avgPool3D,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmAvgPool3DGrad;
function setup$14(backend) {
  wasmAvgPool3DGrad = backend.wasm.cwrap('AvgPool3DGrad', null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // filterWidth
  ]);
}
function avgPool3DGrad(args) {
  const { inputs, backend, attrs } = args;
  const { dy, input } = inputs;
  const { filterSize, strides, pad, dimRoundingMode } = attrs;
  const convInfo = backend_util.computePool3DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode);
  const dx = backend.makeOutput(input.shape, input.dtype);
  wasmAvgPool3DGrad(
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    convInfo.batchSize,
    // Since Pool3D ops (AvgPool3D and MaxPool3D) support 3D filter only, in
    // channels should always equal to out channels.
    /*channelSize=*/ convInfo.inChannels,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterDepth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
    convInfo.filterDepth,
    convInfo.filterHeight,
    convInfo.filterWidth,
  );
  return dx;
}
const avgPool3DGradConfig = {
  kernelName: AvgPool3DGrad,
  backendName: 'wasm',
  setupFunc: setup$14,
  kernelFunc: avgPool3DGrad,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmAvgPoolGrad;
function setup$13(backend) {
  wasmAvgPoolGrad = backend.wasm.cwrap('AvgPoolGrad', null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // filterWidth
  ]);
}
function avgPoolGrad(args) {
  const { inputs, backend, attrs } = args;
  const { dy, input } = inputs;
  const { filterSize, strides, pad } = attrs;
  const convInfo = backend_util.computePool2DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad);
  const dx = backend.makeOutput(input.shape, input.dtype);
  wasmAvgPoolGrad(
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    convInfo.batchSize,
    // Since Pool ops (AvgPool and MaxPool) support 2D filter only, in
    // channels should always equal to out channels.
    /*channelSize=*/ convInfo.inChannels,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
    convInfo.filterHeight,
    convInfo.filterWidth,
  );
  return dx;
}
const avgPoolGradConfig = {
  kernelName: AvgPoolGrad,
  backendName: 'wasm',
  setupFunc: setup$13,
  kernelFunc: avgPoolGrad,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function reshape(args) {
  const { inputs, attrs } = args;
  const { x } = inputs;
  const { shape } = attrs;
  const xSize = util.sizeFromShape(x.shape);
  const $shape = util.inferFromImplicitShape(shape, xSize);
  util.assert(
    xSize === util.sizeFromShape($shape),
    () => `new shape: ${$shape}, old shape: ${x.shape}. New shape and old ` + `shape must have the same number of elements.`,
  );
  // Backend needs to track refCount for the dataId for reshape op
  args.backend.incRef(x.dataId);
  return { dataId: x.dataId, shape: $shape, dtype: x.dtype };
}
const reshapeConfig = {
  kernelName: Reshape,
  backendName: 'wasm',
  kernelFunc: reshape,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmBatchMatMul;
function setup$12(backend) {
  wasmBatchMatMul = backend.wasm.cwrap(BatchMatMul, null /* void */, [
    'number',
    'array',
    'number',
    'number',
    'array',
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function batchMatMul(args) {
  const { inputs, backend, attrs } = args;
  const { a, b } = inputs;
  const { transposeA, transposeB } = attrs;
  if (a.dtype !== 'float32' || b.dtype !== 'float32') {
    throw new Error(`BatchMatMul for non non-float32 tensors not yet supported.`);
  }
  const aRank = a.shape.length;
  const bRank = b.shape.length;
  const innerShapeA = transposeA ? a.shape[aRank - 2] : a.shape[aRank - 1];
  const innerShapeB = transposeB ? b.shape[bRank - 1] : b.shape[bRank - 2];
  const outerShapeA = transposeA ? a.shape[aRank - 1] : a.shape[aRank - 2];
  const outerShapeB = transposeB ? b.shape[bRank - 2] : b.shape[bRank - 1];
  const outerDimsA = a.shape.slice(0, -2);
  const outerDimsB = b.shape.slice(0, -2);
  const batchDimA = util.sizeFromShape(outerDimsA);
  const batchDimB = util.sizeFromShape(outerDimsB);
  const outShapeOuterDims = broadcast_util.assertAndGetBroadcastShape(a.shape.slice(0, -2), b.shape.slice(0, -2));
  const outShape = outShapeOuterDims.concat([outerShapeA, outerShapeB]);
  util.assert(
    innerShapeA === innerShapeB,
    () =>
      `Error in matMul: inner shapes (${innerShapeA}) and (` +
      `${innerShapeB}) of Tensors with shapes ${a.shape} and ` +
      `${b.shape} and transposeA=${transposeA}` +
      ` and transposeB=${transposeB} must match.`,
  );
  const a3dShape = transposeA ? [batchDimA, innerShapeA, outerShapeA] : [batchDimA, outerShapeA, innerShapeA];
  const b3dShape = transposeB ? [batchDimB, outerShapeB, innerShapeB] : [batchDimB, innerShapeB, outerShapeB];
  // The rest of the implementation is designed to operate on rank-3 tensors
  const a3d = reshape({ inputs: { x: a }, backend, attrs: { shape: a3dShape } });
  const b3d = reshape({ inputs: { x: b }, backend, attrs: { shape: b3dShape } });
  const a3dId = backend.dataIdMap.get(a3d.dataId).id;
  const b3dId = backend.dataIdMap.get(b3d.dataId).id;
  const leftDim = transposeA ? a3d.shape[2] : a3d.shape[1];
  const rightDim = transposeB ? b3d.shape[1] : b3d.shape[2];
  const batchDim = Math.max(batchDimA, batchDimB);
  const out = backend.makeOutput([batchDim, leftDim, rightDim], a3d.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const aShapeBytes = new Uint8Array(new Int32Array(a3d.shape).buffer);
  const bShapeBytes = new Uint8Array(new Int32Array(b3d.shape).buffer);
  wasmBatchMatMul(a3dId, aShapeBytes, a3d.shape.length, b3dId, bShapeBytes, b3d.shape.length, transposeA, transposeB, outId);
  backend.disposeData(a3d.dataId);
  backend.disposeData(b3d.dataId);
  out.shape = outShape;
  return out;
}
const batchMatMulConfig = {
  kernelName: BatchMatMul,
  backendName: 'wasm',
  setupFunc: setup$12,
  kernelFunc: batchMatMul,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function concatImpl(inputs, outShape, dtype, simplyConcat) {
  const outVals = util.getArrayFromDType(dtype, util.sizeFromShape(outShape));
  if (simplyConcat && dtype !== 'string') {
    // Use built-in TypedArray.set() method for speed.
    let offset = 0;
    inputs.forEach(input => {
      const size = util.sizeFromShape(input.shape);
      outVals.set(input.vals, offset);
      offset += size;
    });
  } else {
    let colOffset = 0;
    inputs.forEach(input => {
      const decodedData = dtype === 'string' ? backend_util.fromUint8ToStringArray(input.vals) : input.vals;
      let tIdx = 0;
      for (let row = 0; row < input.shape[0]; ++row) {
        const resIdx = row * outShape[1] + colOffset;
        for (let col = 0; col < input.shape[1]; ++col) {
          outVals[resIdx + col] = decodedData[tIdx++];
        }
      }
      colOffset += input.shape[1];
    });
  }
  return outVals;
}

/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
backend_util.RowPartitionType;

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function rangeImpl(start, stop, step, dtype) {
  const sameStartStop = start === stop;
  const increasingRangeNegativeStep = start < stop && step < 0;
  const decreasingRangePositiveStep = stop < start && step > 1;
  if (sameStartStop || increasingRangeNegativeStep || decreasingRangePositiveStep) {
    return util.makeZerosTypedArray(0, dtype);
  }
  const numElements = Math.abs(Math.ceil((stop - start) / step));
  const values = util.makeZerosTypedArray(numElements, dtype);
  if (stop < start && step === 1) {
    // Auto adjust the step's sign if it hasn't been set
    // (or was set to 1)
    step = -1;
  }
  values[0] = start;
  for (let i = 1; i < values.length; i++) {
    values[i] = values[i - 1] + step;
  }
  return values;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function sliceImpl(vals, begin, size, shape, dtype) {
  const isContinous = slice_util.isSliceContinous(shape, begin, size);
  const length = util.sizeFromShape(size);
  const xStrides = util.computeStrides(shape);
  if (isContinous) {
    const flatOffset = slice_util.computeFlatOffset(begin, xStrides);
    if (dtype === 'string') {
      return vals.slice(flatOffset, flatOffset + length);
    }
    return vals.subarray(flatOffset, flatOffset + length);
  }
  const decodedData = dtype === 'string' ? backend_util.fromUint8ToStringArray(vals) : vals;
  const inBuf = buffer(shape, dtype, decodedData);
  const outBuf = buffer(size, dtype);
  for (let i = 0; i < outBuf.size; ++i) {
    const outLoc = outBuf.indexToLoc(i);
    const inLoc = outLoc.map((idx, j) => idx + begin[j]);
    outBuf.set(inBuf.get(...inLoc), ...outLoc);
  }
  if (dtype === 'string') {
    return backend_util.fromStringArrayToUint8(outBuf.values);
  }
  return outBuf.values;
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * The StringNGramsOp class creates ngrams from ragged string data.
 * The constructor contains all attributes related to the operation such as
 * padding widths and strings, and the compute function can be used to
 * compute the ngrams for different ragged tensor inputs.
 */
class StringNGramsOp {
  constructor(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
    this.separator = util.encodeString(separator);
    this.nGramWidths = nGramWidths;
    this.leftPad = util.encodeString(leftPad);
    this.rightPad = util.encodeString(rightPad);
    this.padWidth = padWidth;
    this.preserveShort = preserveShortSequences;
  }
  getPadWidth(nGramWidth) {
    // Ngrams can be padded with either a fixed pad width or a dynamic pad
    // width depending on the 'padWidth' arg, but in no case should the padding
    // ever be wider than 'nGramWidth' - 1.
    return Math.min(this.padWidth < 0 ? nGramWidth - 1 : this.padWidth, nGramWidth - 1);
  }
  getNumNGrams(length, nGramWidth) {
    const padWidth = this.getPadWidth(nGramWidth);
    return Math.max(0, length + 2 * padWidth - nGramWidth + 1);
  }
  createNGrams(data, splitIndex, output, outputStartIndex, numNGrams, nGramWidth) {
    for (let nGramIndex = 0; nGramIndex < numNGrams; ++nGramIndex) {
      const padWidth = this.getPadWidth(nGramWidth);
      const leftPadding = Math.max(0, padWidth - nGramIndex);
      const rightPadding = Math.max(0, padWidth - (numNGrams - (nGramIndex + 1)));
      const numTokens = nGramWidth - (leftPadding + rightPadding);
      const dataStartIndex = splitIndex + (leftPadding > 0 ? 0 : nGramIndex - padWidth);
      // Calculate the total expected size of the nGram so we can reserve the
      // correct amount of space in the string.
      let nGramSize = 0;
      // Size of the left padding.
      nGramSize += leftPadding * this.leftPad.length;
      // Size of the tokens.
      for (let n = 0; n < numTokens; ++n) {
        nGramSize += data[dataStartIndex + n].length;
      }
      // Size of the right padding.
      nGramSize += rightPadding * this.rightPad.length;
      // Size of the separators.
      const numSeparators = leftPadding + rightPadding + numTokens - 1;
      nGramSize += numSeparators * this.separator.length;
      // Build the nGram.
      output[outputStartIndex + nGramIndex] = new Uint8Array(nGramSize);
      const nGram = output[outputStartIndex + nGramIndex];
      let nextNGramIndex = 0;
      const appendToNGram = str => str.forEach(value => (nGram[nextNGramIndex++] = value));
      for (let n = 0; n < leftPadding; ++n) {
        appendToNGram(this.leftPad);
        appendToNGram(this.separator);
      }
      // Only output first numTokens - 1 pairs of data and separator
      for (let n = 0; n < numTokens - 1; ++n) {
        appendToNGram(data[dataStartIndex + n]);
        appendToNGram(this.separator);
      }
      // Handle case when there are no tokens or no right padding as these
      // can result in consecutive separators.
      if (numTokens > 0) {
        // If we have tokens, then output last and then pair each separator
        // with the right padding that follows, to ensure nGram ends either with
        // the token or with the right pad.
        appendToNGram(data[dataStartIndex + numTokens - 1]);
        for (let n = 0; n < rightPadding; ++n) {
          appendToNGram(this.separator);
          appendToNGram(this.rightPad);
        }
      } else {
        // If we don't have tokens, then the last item inserted into the nGram
        // has been the separator from the left padding loop above. Hence,
        // output right pad and separator and make sure to finish with a
        // padding, not a separator.
        for (let n = 0; n < rightPadding - 1; ++n) {
          appendToNGram(this.rightPad);
          appendToNGram(this.separator);
        }
        appendToNGram(this.rightPad);
      }
    }
  }
  // Data and splits together form the definition of the ragged tensor,
  // where data is 1 dimensional and contains the values of the tensor
  // and splits denotes the indices at which each row starts.
  compute(data, splits) {
    // Validate that the splits are valid indices into data, only if there are
    // splits specified.
    const inputDataSize = data.length;
    const splitsSize = splits.length;
    if (splitsSize > 0) {
      let prevSplit = splits[0];
      if (prevSplit !== 0) {
        throw new Error(`First split value must be 0, got ${prevSplit}`);
      }
      for (let i = 1; i < splitsSize; ++i) {
        let validSplits = splits[i] >= prevSplit;
        validSplits = validSplits && splits[i] <= inputDataSize;
        if (!validSplits) {
          throw new Error(`Invalid split value ${splits[i]}, must be in [${prevSplit}, ${inputDataSize}]`);
        }
        prevSplit = splits[i];
      }
      if (prevSplit !== inputDataSize) {
        throw new Error(`Last split value must be data size. Expected ${inputDataSize}, got ${prevSplit}`);
      }
    }
    const numBatchItems = splitsSize - 1;
    const nGramsSplits = util.getArrayFromDType('int32', splitsSize);
    // If there is no data or size, return an empty ragged tensor.
    if (inputDataSize === 0 || splitsSize === 0) {
      const empty = new Array(inputDataSize);
      for (let i = 0; i <= numBatchItems; ++i) {
        nGramsSplits[i] = 0;
      }
      return [empty, nGramsSplits];
    }
    nGramsSplits[0] = 0;
    for (let i = 1; i <= numBatchItems; ++i) {
      const length = splits[i] - splits[i - 1];
      let numNGrams = 0;
      this.nGramWidths.forEach(nGramWidth => {
        numNGrams += this.getNumNGrams(length, nGramWidth);
      });
      if (this.preserveShort && length > 0 && numNGrams === 0) {
        numNGrams = 1;
      }
      nGramsSplits[i] = nGramsSplits[i - 1] + numNGrams;
    }
    const nGrams = new Array(nGramsSplits[numBatchItems]);
    for (let i = 0; i < numBatchItems; ++i) {
      const splitIndex = splits[i];
      let outputStartIdx = nGramsSplits[i];
      this.nGramWidths.forEach(nGramWidth => {
        const length = splits[i + 1] - splits[i];
        const numNGrams = this.getNumNGrams(length, nGramWidth);
        this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
        outputStartIdx += numNGrams;
      });
      // If we're preserving short sequences, check to see if no sequence was
      // generated by comparing the current output start idx to the original
      // one (nGramSplitsdata). If no ngrams were generated, then they will
      // be equal (since we increment outputStartIdx by numNGrams every
      // time we create a set of ngrams.)
      if (this.preserveShort && outputStartIdx === nGramsSplits[i]) {
        const dataLength = splits[i + 1] - splits[i];
        // One legitimate reason to not have any ngrams when this.preserveShort
        // is true is if the sequence itself is empty. In that case, move on.
        if (dataLength === 0) {
          continue;
        }
        // We don't have to worry about dynamic padding sizes here: if padding
        // was dynamic, every sequence would have had sufficient padding to
        // generate at least one nGram.
        const nGramWidth = dataLength + 2 * this.padWidth;
        const numNGrams = 1;
        this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
      }
    }
    return [nGrams, nGramsSplits];
  }
}
function stringNGramsImpl(data, dataSplits, separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
  return new StringNGramsOp(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences).compute(data, dataSplits);
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function split(str, delimiters, skipEmpty, result) {
  if (!str.length) {
    return;
  }
  // When the delimiter is empty, the input is split into individual characters.
  if (delimiters.length === 0) {
    for (let i = 0; i < str.length; ++i) {
      result.push(str.subarray(i, i + 1));
    }
    return;
  }
  // When there is one delimiter, the input is split only at that delimiter.
  if (delimiters.length === 1) {
    const delimiter = delimiters[0];
    let f = str.indexOf(delimiter);
    while (f !== -1) {
      const token = str.subarray(0, f);
      if (!skipEmpty || token.length !== 0) {
        result.push(token);
      }
      str = str.subarray(f + 1);
      f = str.indexOf(delimiter);
    }
    if (!skipEmpty || str.length !== 0) {
      result.push(str);
    }
    return;
  }
  // When there are multiple delimiters, the input is split at every instance
  // one of the delimiters appears.
  let tokenStart = 0;
  for (let i = 0; i < str.length + 1; i++) {
    if (i === str.length || delimiters.indexOf(str[i]) !== -1) {
      const token = str.subarray(tokenStart, i);
      if (!skipEmpty || token.length !== 0) {
        result.push(token);
      }
      tokenStart = i + 1;
    }
  }
}
function stringSplitImpl(input, delimiter, skipEmpty) {
  const batchSize = input.length;
  // Empty delimiter means split the input character by character.
  const tokens = [];
  let outputSize = 0;
  let maxNumEntries = 0;
  const numIndices = new Array(batchSize);
  for (let i = 0; i < batchSize; ++i) {
    const prevTokensLength = tokens.length;
    split(input[i], delimiter, skipEmpty, tokens);
    const nEntries = tokens.length - prevTokensLength;
    numIndices[i] = nEntries;
    outputSize += nEntries;
    maxNumEntries = Math.max(maxNumEntries, nEntries);
  }
  const indices = util.getArrayFromDType('int32', outputSize * 2);
  const values = new Array(outputSize);
  const shape = [batchSize, maxNumEntries];
  let c = 0;
  for (let i = 0; i < batchSize; ++i) {
    for (let j = 0; j < numIndices[i]; ++j) {
      // indices is a 2d tensor with shape of [outputSize, 2]
      indices[c * 2] = i;
      indices[c * 2 + 1] = j;
      values[c] = tokens[c];
      ++c;
    }
  }
  return [indices, values, shape];
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stringToHashBucketFastImpl(input, numBuckets) {
  const output = util.getArrayFromDType('int32', input.length);
  for (let i = 0; i < input.length; ++i) {
    output[i] = util.fingerPrint64(input[i]).modulo(numBuckets).getLowBitsUnsigned();
  }
  return output;
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function uniqueImpl(values, axis, shape, dtype) {
  // Normalize and validate axis.
  const $axis = util.parseAxisParam(axis, shape)[0];
  // Calculate the new shape that is suitable for extracting data along the
  // given axis.
  //
  // The rank is 3.
  // The size of the 1st dimension is the size of all the axes < the given axis.
  // The size of the 2nd dimension is the same as the size of the given axis.
  // The size of the 3rd dimension is the size of all the axes > the given axis.
  //
  // For example, for a 4D tensor with shape=[2, 3, 5, 4] and axis=2, the
  // newShape would be: [2*3, 5, 4].
  //
  // Note that this is not the final output shape. This will be the shape for an
  // intermediate TensorBuffer (see inputBuffer below) to allow us to extract
  // values along the given axis. To demonstrate how it works, consider the
  // following example:
  //
  // Input: a 3D tensor, with shape [1, 2, 3]
  // [
  //   [
  //      [1,2,3],
  //      [4,5,6]
  //   ]
  // ]
  // Axis: 2 (the last axis).
  // Along axis 2, we expect to extract 3 tensors: [1,4], [2,5], [3,6].
  //
  // For this example, newShape would be: [2, 3, 1], where 2 is calculated from
  // 1*2. The re-shaped data would look like:
  //
  // [
  //   [
  //     [1], [2], [3]
  //   ],
  //   [
  //     [4], [5], [6]
  //   ]
  // ]
  //
  // Then, we can construct a 3-level nested loop by the following dimension
  // order to extract the values along the axis (dimension1):
  // i: dimension1       // 0,1,2 (newShape[1])
  //   m: dimension0     // 0,1   (newShape[0])
  //     n: dimension2   // 0     (newShape[2])
  //
  //                       m, i, n
  //                      ---------
  // Iteration 0: data at [0, 0, 0] => "1"
  // Iteration 1: data at [1, 0, 0] => "4"
  // We got [1,4].
  // Iteration 2: data at [0, 1, 0] => "2"
  // Iteration 3: data at [1, 1, 0] => "5"
  // We got [2,5].
  // Iteration 4: data at [0, 2, 0] => "3"
  // Iteration 5: data at [1, 2, 0] => "6"
  // We got [3,6].
  const newShape = [1, shape[0], 1];
  for (let i = 0; i < $axis; i++) {
    newShape[0] *= shape[i];
  }
  newShape[1] = shape[$axis];
  for (let i = $axis + 1; i < shape.length; i++) {
    newShape[2] *= shape[i];
  }
  // A map from unique elements (their string representations) to their values
  // in "indices" (below).
  const uniqueElements = new Map();
  // The indices of each unique element in the original tensor along the given
  // axis. It is 1D and has the same size as the given axis.
  const indices = new Int32Array(shape[$axis]);
  // Create a buffer so we can easily extract value at a given location.
  const inputBuffer = new TensorBuffer(newShape, dtype, values);
  // The indices along the given axis that have unique elements. This is a
  // de-duped version of "indices" above.
  const uniqueIndices = [];
  const is1DTensor = newShape[0] === 1 && newShape[2] === 1;
  for (let i = 0; i < shape[$axis]; i++) {
    // Extract values along the axis.
    let element;
    if (is1DTensor) {
      // Fast path for 1D tensor input.
      element = values[i].toString();
    } else {
      const axisValues = [];
      for (let m = 0; m < newShape[0]; m++) {
        for (let n = 0; n < newShape[2]; n++) {
          axisValues.push(inputBuffer.get(m, i, n));
        }
      }
      element = axisValues.join(',');
    }
    // Dedup and update various indices.
    const existingIndex = uniqueElements.get(element);
    if (existingIndex != null) {
      indices[i] = existingIndex;
    } else {
      const uniqueIndex = uniqueElements.size;
      uniqueElements.set(element, uniqueIndex);
      indices[i] = uniqueIndex;
      uniqueIndices.push(i);
    }
  }
  // Now we know where each of the unique elements are located along the axis
  // (uniqueIndices). Extract them from input buffer and store them in the
  // output buffer.
  const outputTmpShape = newShape.slice();
  outputTmpShape[1] = uniqueElements.size;
  const outputBuffer = new TensorBuffer(outputTmpShape, dtype);
  uniqueIndices.forEach((uniqueElementIndex, i) => {
    for (let m = 0; m < newShape[0]; m++) {
      for (let n = 0; n < newShape[2]; n++) {
        outputBuffer.set(inputBuffer.get(m, uniqueElementIndex, n), m, i, n);
      }
    }
  });
  // The output shape can be calculated from the input shape with the size of
  // the given axis replaced by the number of unique elements along that axis.
  const outputShape = shape.slice();
  outputShape[$axis] = outputTmpShape[1];
  return {
    outputValues: outputBuffer.values,
    outputShape,
    indices,
  };
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function slice(args) {
  const {
    inputs: { x },
    attrs: { begin, size },
    backend,
  } = args;
  const [begin_, size_] = slice_util.parseSliceParams(x, begin, size);
  const isContinous = slice_util.isSliceContinous(x.shape, begin_, size_);
  const xVals = backend.readSync(x.dataId);
  const out = backend.makeOutput(size_, x.dtype);
  const xStrides = util.computeStrides(x.shape);
  const outData = backend.dataIdMap.get(out.dataId);
  if (isContinous) {
    const flatOffset = slice_util.computeFlatOffset(begin_, xStrides);
    if (x.dtype === 'string') {
      outData.stringBytes = xVals.slice(flatOffset, flatOffset + util.sizeFromShape(size_));
    } else {
      const outVals = backend.typedArrayFromHeap(out);
      outVals.set(xVals.subarray(flatOffset, flatOffset + util.sizeFromShape(size_)));
    }
    return out;
  }
  if (x.dtype === 'string') {
    const res = sliceImpl(xVals, begin_, size_, x.shape, x.dtype);
    outData.stringBytes = res;
    return out;
  }
  const outVals = backend.typedArrayFromHeap(out);
  const rank = x.shape.length;
  if (rank === 2) {
    slice2d(xVals, xStrides[0], outVals, begin_, size_);
  } else if (rank === 3) {
    slice3d(xVals, xStrides[0], xStrides[1], outVals, begin_, size_);
  } else if (rank === 4) {
    slice4d(xVals, xStrides[0], xStrides[1], xStrides[2], outVals, begin_, size_);
  } else {
    const res = sliceImpl(xVals, begin_, size_, x.shape, x.dtype);
    outVals.set(res);
  }
  return out;
}
function slice2d(xVals, xStride, outVals, begin, size) {
  let outOffset = 0;
  const beginI = begin[0];
  const beginJ = begin[1];
  const endI = beginI + size[0];
  for (let i = beginI; i < endI; i++) {
    const xOffset = i * xStride + beginJ;
    outVals.set(xVals.subarray(xOffset, xOffset + size[1]), outOffset);
    outOffset += size[1];
  }
}
function slice3d(xVals, xStride1, xStride2, outVals, begin, size) {
  let outOffset = 0;
  const beginI = begin[0];
  const beginJ = begin[1];
  const beginK = begin[2];
  const endI = beginI + size[0];
  const endJ = beginJ + size[1];
  for (let i = beginI; i < endI; i++) {
    for (let j = beginJ; j < endJ; j++) {
      const xOffset = i * xStride1 + j * xStride2 + beginK;
      outVals.set(xVals.subarray(xOffset, xOffset + size[2]), outOffset);
      outOffset += size[2];
    }
  }
}
function slice4d(xVals, xStride1, xStride2, xStride3, outVals, begin, size) {
  let outOffset = 0;
  const beginI = begin[0];
  const beginJ = begin[1];
  const beginK = begin[2];
  const endI = beginI + size[0];
  const endJ = beginJ + size[1];
  const endK = beginK + size[2];
  const beginL = begin[3];
  for (let i = beginI; i < endI; i++) {
    for (let j = beginJ; j < endJ; j++) {
      for (let k = beginK; k < endK; k++) {
        const xOffset = i * xStride1 + j * xStride2 + k * xStride3 + beginL;
        outVals.set(xVals.subarray(xOffset, xOffset + size[3]), outOffset);
        outOffset += size[3];
      }
    }
  }
}
const sliceConfig = {
  kernelName: Slice,
  backendName: 'wasm',
  kernelFunc: slice,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function batchToSpaceND(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { blockShape, crops } = attrs;
  const prod = blockShape.reduce((a, b) => a * b);
  const reshaped = backend_util.getReshaped(x.shape, blockShape, prod);
  const permuted = backend_util.getPermuted(reshaped.length, blockShape.length);
  const reshapedPermuted = backend_util.getReshapedPermuted(x.shape, blockShape, prod);
  const sliceBeginCoords = backend_util.getSliceBeginCoords(crops, blockShape.length);
  const sliceSize = backend_util.getSliceSize(reshapedPermuted, crops, blockShape.length);
  const xReshaped = reshape({ inputs: { x }, backend, attrs: { shape: reshaped } });
  const xTransposed = transpose({ inputs: { x: xReshaped }, backend, attrs: { perm: permuted } });
  const xTransposedReshaped = reshape({ inputs: { x: xTransposed }, backend, attrs: { shape: reshapedPermuted } });
  const result = slice({
    inputs: { x: xTransposedReshaped },
    backend,
    attrs: { begin: sliceBeginCoords, size: sliceSize },
  });
  backend.disposeData(xReshaped.dataId);
  backend.disposeData(xTransposed.dataId);
  backend.disposeData(xTransposedReshaped.dataId);
  return result;
}
const batchToSpaceNDConfig = {
  kernelName: BatchToSpaceND,
  backendName: 'wasm',
  kernelFunc: batchToSpaceND,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmBincount;
function setup$11(backend) {
  wasmBincount = backend.wasm.cwrap(Bincount, null /*void*/, [
    'number',
    'number',
    'boolean',
    'number',
    'number',
    'number', // outId
  ]);
}
function bincount(args) {
  const { backend, inputs, attrs } = args;
  const { x, weights } = inputs;
  const { size } = attrs;
  const hasWeights = weights.shape.reduce((p, v) => p * v, 1) !== 0;
  const outShape = x.shape.length === 1 ? [size] : [x.shape[0], size];
  const out = backend.makeOutput(outShape, weights.dtype);
  function tensorId(x) {
    return backend.dataIdMap.get(x.dataId).id;
  }
  wasmBincount(tensorId(x), size, hasWeights, tensorId(weights), CppDType[weights.dtype], tensorId(out));
  return out;
}
const bincountConfig = {
  kernelName: Bincount,
  backendName: 'wasm',
  setupFunc: setup$11,
  kernelFunc: bincount,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const bitwiseAndConfig = createBinaryKernelConfig(BitwiseAnd);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function broadcastArgs(args) {
  const { inputs, backend } = args;
  const { s0, s1 } = inputs;
  const s0Vals = backend.typedArrayFromHeap(s0);
  const s1Vals = backend.typedArrayFromHeap(s1);
  const broadcastShape = backend_util.assertAndGetBroadcastShape(Array.from(s0Vals), Array.from(s1Vals));
  return backend.makeOutput([broadcastShape.length], 'int32', /*memoryOffset=*/ undefined, /*values=*/ new Int32Array(broadcastShape));
}
const broadcastArgsConfig = {
  kernelName: BroadcastArgs,
  backendName: 'wasm',
  kernelFunc: broadcastArgs,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function cast(args) {
  const {
    inputs: { x },
    attrs: { dtype },
    backend,
  } = args;
  const out = backend.makeOutput(x.shape, dtype);
  const inVals = backend.typedArrayFromHeap(x);
  const outVals = backend.typedArrayFromHeap(out);
  outVals.set(inVals);
  return out;
}
const castConfig = {
  kernelName: Cast,
  backendName: 'wasm',
  kernelFunc: cast,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const ceilConfig = createUnaryKernelConfig(Ceil);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmClip;
function setup$10(backend) {
  wasmClip = backend.wasm.cwrap(ClipByValue, null /* void */, [
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function clip(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { clipValueMin, clipValueMax } = attrs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const out = backend.makeOutput(x.shape, x.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmClip(xId, clipValueMin, clipValueMax, outId);
  return out;
}
const clipByValueConfig = {
  kernelName: ClipByValue,
  backendName: 'wasm',
  setupFunc: setup$10,
  kernelFunc: clip,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function concat(args) {
  const { inputs, backend } = args;
  const axis = util.parseAxisParam(args.attrs.axis, inputs[0].shape)[0];
  const shapes = inputs.map(t => t.shape);
  backend_util.assertParamsConsistent(shapes, axis);
  let outShape = backend_util.computeOutShape(
    inputs.map(t => t.shape),
    axis,
  );
  // Keep only non-empty tensors (ignore tensors with 0 in their shape).
  const $inputs = inputs.filter(t => util.sizeFromShape(t.shape) > 0);
  if ($inputs.length === 1) {
    return identity({ inputs: { x: $inputs[0] }, backend });
  }
  const out = backend.makeOutput(outShape, inputs[0].dtype);
  if (util.sizeFromShape(outShape) === 0) {
    return out;
  }
  if ($inputs[0].dtype === 'string') {
    // Any concat of n-dimensional tensors across any axis can be reduced to
    // a concatenation of two-dimensional tensors across the axis 1 by first
    // partitioning the axes of the original tensors into those less than the
    // axis to be concatenated and the rest. Then reshape the tensors
    // into a two-dimensional tensor by collapsing these two sets of axes and
    // concatenate the resulting matrices across the axis 1, finally reshaping
    // the result to have the proper shape.
    const inputs2D = $inputs.map(t => {
      const innerSize = util.sizeFromShape(t.shape.slice(axis));
      const shape = [-1, innerSize];
      return reshape({ inputs: { x: t }, backend, attrs: { shape } });
    });
    const inputsValShapes = inputs2D.map(t => {
      return { vals: backend.readSync(t.dataId), shape: t.shape };
    });
    // Concats 2d tensors along axis=1.
    outShape = backend_util.computeOutShape(
      inputs2D.map(t => t.shape),
      1 /* axis */,
    );
    const simplyConcat = inputs2D[0].shape[0] === 1;
    const outVals = concatImpl(inputsValShapes, outShape, inputs[0].dtype, simplyConcat);
    const finalOutShape = backend_util.computeOutShape(
      $inputs.map(t => t.shape),
      axis,
    );
    out.shape = finalOutShape;
    const outData = backend.dataIdMap.get(out.dataId);
    outData.stringBytes = backend_util.fromStringArrayToUint8(outVals);
    inputs2D.forEach(t => backend.disposeData(t.dataId));
    return out;
  }
  const batchDim = util.sizeFromShape($inputs[0].shape.slice(0, axis));
  let sumInnerDims = 0;
  const innerDims = $inputs.map(input => {
    const innerDim = util.sizeFromShape(input.shape.slice(axis));
    sumInnerDims += innerDim;
    return innerDim;
  });
  const inVals = $inputs.map(input => backend.typedArrayFromHeap(input));
  const outVals = backend.typedArrayFromHeap(out);
  for (let b = 0; b < batchDim; b++) {
    let outOffset = b * sumInnerDims;
    for (let i = 0; i < inVals.length; i++) {
      const innerDim = innerDims[i];
      const inOffset = b * innerDim;
      const vals = inVals[i].subarray(inOffset, inOffset + innerDim);
      outVals.set(vals, outOffset);
      outOffset += innerDim;
    }
  }
  return out;
}
const concatConfig = {
  kernelName: Concat,
  backendName: 'wasm',
  kernelFunc: concat,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmConv2d;
function setup$$(backend) {
  wasmConv2d = backend.wasm.cwrap(Conv2D, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function conv2d(args) {
  const { inputs, attrs, backend } = args;
  const { x, filter } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const filterId = backend.dataIdMap.get(filter.dataId).id;
  const { strides, dilations, pad, dimRoundingMode, dataFormat } = attrs;
  const $dataFormat = backend_util.convertConv2DDataFormat(dataFormat);
  const convInfo = backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, false, $dataFormat);
  const filterHeight = convInfo.filterHeight;
  const filterWidth = convInfo.filterWidth;
  const padTop = convInfo.padInfo.top;
  const padRight = convInfo.padInfo.right;
  const padBottom = convInfo.padInfo.bottom;
  const padLeft = convInfo.padInfo.left;
  const dilationHeight = convInfo.dilationHeight;
  const dilationWidth = convInfo.dilationWidth;
  const strideHeight = convInfo.strideHeight;
  const strideWidth = convInfo.strideWidth;
  const inputChannels = convInfo.inChannels;
  const outputChannels = convInfo.outChannels;
  const isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
  if (convInfo.dataFormat !== 'channelsLast') {
    throw new Error(`wasm backend Conv2D does not support dataFormat:'` + `${convInfo.dataFormat}'. Please use 'channelsLast'.`);
  }
  const out = backend.makeOutput(convInfo.outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmConv2d(
    xId,
    x.shape[0],
    x.shape[1],
    x.shape[2],
    filterId,
    filterHeight,
    filterWidth,
    padTop,
    padRight,
    padBottom,
    padLeft,
    isSamePad,
    dilationHeight,
    dilationWidth,
    strideHeight,
    strideWidth,
    inputChannels,
    outputChannels,
    outId,
  );
  return out;
}
const conv2DConfig = {
  kernelName: Conv2D,
  backendName: 'wasm',
  setupFunc: setup$$,
  kernelFunc: conv2d,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmConv2DBackpropInput;
function setup$_(backend) {
  wasmConv2DBackpropInput = backend.wasm.cwrap(Conv2DBackpropInput, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function conv2DBackpropInput(args) {
  const { backend, inputs, attrs } = args;
  const { dy, filter } = inputs;
  const { strides, pad, dataFormat, dimRoundingMode, inputShape } = attrs;
  const dilations = 1;
  const $dataFormat = backend_util.convertConv2DDataFormat(dataFormat);
  const convInfo = backend_util.computeConv2DInfo(
    inputShape,
    filter.shape,
    strides,
    dilations,
    pad,
    dimRoundingMode,
    false /* depthwise */,
    $dataFormat,
  );
  const {
    batchSize,
    filterHeight,
    filterWidth,
    inChannels,
    inHeight,
    inWidth,
    outChannels,
    outHeight,
    outWidth,
    strideHeight,
    strideWidth,
  } = convInfo;
  const topPad = filterHeight - 1 - convInfo.padInfo.top;
  const leftPad = filterWidth - 1 - convInfo.padInfo.left;
  const isChannelsLast = convInfo.dataFormat === 'channelsLast';
  const dxStrides = util.computeStrides(convInfo.inShape);
  const dyStrides = util.computeStrides(dy.shape);
  const [fltS0, fltS1, fltS2] = util.computeStrides(filter.shape);
  const xBatchStride = dxStrides[0];
  const xRowStride = isChannelsLast ? dxStrides[1] : dxStrides[2];
  const xColStride = isChannelsLast ? dxStrides[2] : 1;
  const xChannelStride = isChannelsLast ? 1 : dxStrides[1];
  const yBatchStride = dyStrides[0];
  const yRowStride = isChannelsLast ? dyStrides[1] : dyStrides[2];
  const yColStride = isChannelsLast ? dyStrides[2] : 1;
  const yChannelStride = isChannelsLast ? 1 : dyStrides[1];
  const out = backend.makeOutput(convInfo.inShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  const dyId = backend.dataIdMap.get(dy.dataId).id;
  const filterId = backend.dataIdMap.get(filter.dataId).id;
  wasmConv2DBackpropInput(
    dyId,
    filterId,
    batchSize,
    filterHeight,
    filterWidth,
    inHeight,
    inWidth,
    inChannels,
    outHeight,
    outWidth,
    outChannels,
    strideHeight,
    strideWidth,
    topPad,
    leftPad,
    fltS0,
    fltS1,
    fltS2,
    xBatchStride,
    xRowStride,
    xColStride,
    xChannelStride,
    yBatchStride,
    yRowStride,
    yColStride,
    yChannelStride,
    outId,
  );
  return out;
}
const conv2DBackpropInputConfig = {
  kernelName: Conv2DBackpropInput,
  backendName: 'wasm',
  setupFunc: setup$_,
  kernelFunc: conv2DBackpropInput,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmConv3D;
function setup$Z(backend) {
  wasmConv3D = backend.wasm.cwrap(Conv3D, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function conv3D(args) {
  const { inputs, backend, attrs } = args;
  const { x, filter } = inputs;
  const { strides, pad, dilations } = attrs;
  if (x.dtype !== 'float32') {
    throw new Error(`Tensor x must have dtype float32, got ${x.dtype}`);
  }
  if (filter.dtype !== 'float32') {
    throw new Error(`Tensor filter must have dtype float32, got ${filter.dtype}`);
  }
  const convInfo = backend_util.computeConv3DInfo(x.shape, filter.shape, strides, dilations, pad);
  const out = backend.makeOutput(convInfo.outShape, x.dtype);
  wasmConv3D(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(filter.dataId).id,
    backend.dataIdMap.get(out.dataId).id,
    convInfo.batchSize,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.inChannels,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.outChannels,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.filterDepth,
    convInfo.filterHeight,
    convInfo.filterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return out;
}
const conv3DConfig = {
  kernelName: Conv3D,
  backendName: 'wasm',
  setupFunc: setup$Z,
  kernelFunc: conv3D,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmConv3DBackpropFilterV2;
function setup$Y(backend) {
  wasmConv3DBackpropFilterV2 = backend.wasm.cwrap(Conv3DBackpropFilterV2, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function conv3DBackpropFilterV2(args) {
  const { inputs, backend, attrs } = args;
  const { x, dy } = inputs;
  const { strides, pad, filterShape } = attrs;
  if (x.dtype !== 'float32') {
    throw new Error(`Tensor dy must have dtype float32, got ${x.dtype}`);
  }
  if (dy.dtype !== 'float32') {
    throw new Error(`Tensor filter must have dtype float32, got ${dy.dtype}`);
  }
  const convInfo = backend_util.computeConv3DInfo(x.shape, filterShape, strides, /*dilations=*/ 1, pad);
  const dw = backend.makeOutput(convInfo.filterShape, dy.dtype);
  wasmConv3DBackpropFilterV2(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dw.dataId).id,
    convInfo.batchSize,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.inChannels,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.outChannels,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.filterDepth,
    convInfo.filterHeight,
    convInfo.filterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return dw;
}
const conv3DBackpropFilterV2Config = {
  kernelName: Conv3DBackpropFilterV2,
  backendName: 'wasm',
  setupFunc: setup$Y,
  kernelFunc: conv3DBackpropFilterV2,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmConv3DBackpropInputV2;
function setup$X(backend) {
  wasmConv3DBackpropInputV2 = backend.wasm.cwrap(Conv3DBackpropInputV2, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function conv3DBackpropInputV2(args) {
  const { inputs, backend, attrs } = args;
  const { dy, filter } = inputs;
  const { pad, strides, inputShape } = attrs;
  if (dy.dtype !== 'float32') {
    throw new Error(`Tensor dy must have dtype float32, got ${dy.dtype}`);
  }
  if (filter.dtype !== 'float32') {
    throw new Error(`Tensor filter must have dtype float32, got ${filter.dtype}`);
  }
  const convInfo = backend_util.computeConv3DInfo(inputShape, filter.shape, strides, /*dilations=*/ 1, pad);
  const dx = backend.makeOutput(convInfo.inShape, dy.dtype);
  wasmConv3DBackpropInputV2(
    backend.dataIdMap.get(filter.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    convInfo.batchSize,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.inChannels,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.outChannels,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.filterDepth,
    convInfo.filterHeight,
    convInfo.filterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return dx;
}
const conv3DBackpropInputV2Config = {
  kernelName: Conv3DBackpropInputV2,
  backendName: 'wasm',
  setupFunc: setup$X,
  kernelFunc: conv3DBackpropInputV2,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const cosConfig = createUnaryKernelConfig(Cos);

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const coshConfig = createUnaryKernelConfig(Cosh);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Must match enum in CropAndResize.cc
var InterpolationMethod;
(function (InterpolationMethod) {
  InterpolationMethod[(InterpolationMethod['bilinear'] = 0)] = 'bilinear';
  InterpolationMethod[(InterpolationMethod['nearest'] = 1)] = 'nearest';
})(InterpolationMethod || (InterpolationMethod = {}));
let wasmCropAndResize;
function setup$W(backend) {
  wasmCropAndResize = backend.wasm.cwrap(CropAndResize, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'array',
    'number',
    'number',
    'number',
    'number',
    'number', // out id
  ]);
}
function cropAndResize(args) {
  const { backend, inputs, attrs } = args;
  const { method, extrapolationValue, cropSize } = attrs;
  const { image, boxes, boxInd } = inputs;
  const numBoxes = boxes.shape[0];
  const [cropHeight, cropWidth] = cropSize;
  const outShape = [numBoxes, cropHeight, cropWidth, image.shape[3]];
  let imagesData = backend.dataIdMap.get(image.dataId);
  let castedData;
  if (image.dtype !== 'float32') {
    castedData = cast({ backend, inputs: { x: image }, attrs: { dtype: 'float32' } });
    imagesData = backend.dataIdMap.get(castedData.dataId);
  }
  const imagesId = imagesData.id;
  const boxesId = backend.dataIdMap.get(boxes.dataId).id;
  const boxIndId = backend.dataIdMap.get(boxInd.dataId).id;
  const out = backend.makeOutput(outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  const imagesShapeBytes = new Uint8Array(new Int32Array(image.shape).buffer);
  wasmCropAndResize(
    imagesId,
    boxesId,
    boxIndId,
    numBoxes,
    imagesShapeBytes,
    cropHeight,
    cropWidth,
    InterpolationMethod[method],
    extrapolationValue,
    outId,
  );
  if (castedData != null) {
    backend.disposeData(castedData.dataId);
  }
  return out;
}
const cropAndResizeConfig = {
  kernelName: CropAndResize,
  backendName: 'wasm',
  setupFunc: setup$W,
  kernelFunc: cropAndResize,
};

/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmCumprod;
function setup$V(backend) {
  wasmCumprod = backend.wasm.cwrap(Cumprod, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // dtype
  ]);
}
function cumprod(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { axis, exclusive, reverse } = attrs;
  const xRank = x.shape.length;
  util.assert(x.dtype === 'float32' || x.dtype === 'int32', () => `cumprod does not support ${x.dtype} tensors in the WASM backend`);
  // permute required axis to inner most axis
  const permutation = backend_util.getAxesPermutation([axis], xRank);
  let permutedX = x;
  if (permutation !== null) {
    permutedX = transpose({ inputs: { x }, attrs: { perm: permutation }, backend });
  }
  const permutedAxis = backend_util.getInnerMostAxes(1, xRank)[0];
  backend_util.assertAxesAreInnerMostDims('cumprod', [permutedAxis], xRank);
  const permutedOut = backend.makeOutput(permutedX.shape, permutedX.dtype);
  const finalDim = permutedX.shape[permutedAxis];
  const permutedXId = backend.dataIdMap.get(permutedX.dataId).id;
  const permutedOutId = backend.dataIdMap.get(permutedOut.dataId).id;
  wasmCumprod(permutedXId, exclusive ? 1 : 0, reverse ? 1 : 0, finalDim, permutedOutId, CppDType[x.dtype]);
  // transpose data back if permuted
  let out = permutedOut;
  if (permutation !== null) {
    const undoPermutation = backend_util.getUndoAxesPermutation(permutation);
    out = transpose({ inputs: { x: permutedOut }, attrs: { perm: undoPermutation }, backend });
    backend.disposeData(permutedX.dataId);
    backend.disposeData(permutedOut.dataId);
  }
  return out;
}
const cumprodConfig = {
  kernelName: Cumprod,
  backendName: 'wasm',
  setupFunc: setup$V,
  kernelFunc: cumprod,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmCumsum;
function setup$U(backend) {
  wasmCumsum = backend.wasm.cwrap(Cumsum, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // dtype
  ]);
}
function cumsum(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { axis, exclusive, reverse } = attrs;
  const xRank = x.shape.length;
  util.assert(x.dtype === 'float32' || x.dtype === 'int32', () => `cumsum does not support ${x.dtype} tensors in the WASM backend`);
  // permute required axis to inner most axis
  const permutation = backend_util.getAxesPermutation([axis], xRank);
  let permutedX = x;
  if (permutation !== null) {
    permutedX = transpose({ inputs: { x }, attrs: { perm: permutation }, backend });
  }
  const permutedAxis = backend_util.getInnerMostAxes(1, xRank)[0];
  backend_util.assertAxesAreInnerMostDims('cumsum', [permutedAxis], xRank);
  const permutedOut = backend.makeOutput(permutedX.shape, permutedX.dtype);
  const finalDim = permutedX.shape[permutedAxis];
  const permutedXId = backend.dataIdMap.get(permutedX.dataId).id;
  const permutedOutId = backend.dataIdMap.get(permutedOut.dataId).id;
  wasmCumsum(permutedXId, exclusive ? 1 : 0, reverse ? 1 : 0, finalDim, permutedOutId, CppDType[x.dtype]);
  // transpose data back if permuted
  let out = permutedOut;
  if (permutation !== null) {
    const undoPermutation = backend_util.getUndoAxesPermutation(permutation);
    out = transpose({ inputs: { x: permutedOut }, attrs: { perm: undoPermutation }, backend });
    backend.disposeData(permutedX.dataId);
    backend.disposeData(permutedOut.dataId);
  }
  return out;
}
const cumsumConfig = {
  kernelName: Cumsum,
  backendName: 'wasm',
  setupFunc: setup$U,
  kernelFunc: cumsum,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDenseBincount;
function setup$T(backend) {
  wasmDenseBincount = backend.wasm.cwrap('DenseBincount', null /*void*/, [
    'number',
    'array',
    'number',
    'number',
    'boolean',
    'number',
    'number',
    'boolean',
    'number', // outId
  ]);
}
function denseBincount(args) {
  const { backend, inputs, attrs } = args;
  const { x, weights } = inputs;
  const { size, binaryOutput } = attrs;
  const hasWeights = weights.shape.reduce((p, v) => p * v, 1) !== 0;
  const outShape = x.shape.length === 1 ? [size] : [x.shape[0], size];
  const out = backend.makeOutput(outShape, weights.dtype);
  function tensorId(x) {
    return backend.dataIdMap.get(x.dataId).id;
  }
  wasmDenseBincount(
    tensorId(x),
    new Uint8Array(new Int32Array(x.shape).buffer),
    x.shape.length,
    size,
    hasWeights,
    tensorId(weights),
    CppDType[weights.dtype],
    binaryOutput,
    tensorId(out),
  );
  return out;
}
const denseBincountConfig = {
  kernelName: DenseBincount,
  backendName: 'wasm',
  setupFunc: setup$T,
  kernelFunc: denseBincount,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDepthToSpace;
function setup$S(backend) {
  wasmDepthToSpace = backend.wasm.cwrap(DepthToSpace, null /*void*/, [
    'number',
    'number',
    'number',
    'array',
    'number',
    'array',
    'array',
    'number',
    'number', // outId
  ]);
}
function depthToSpace(args) {
  const { backend, inputs, attrs } = args;
  const { x } = inputs;
  const { blockSize, dataFormat } = attrs;
  const batchSize = x.shape[0];
  const inputHeight = dataFormat === 'NHWC' ? x.shape[1] : x.shape[2];
  const inputWidth = dataFormat === 'NHWC' ? x.shape[2] : x.shape[3];
  const inputDepth = dataFormat === 'NHWC' ? x.shape[3] : x.shape[1];
  const outputHeight = inputHeight * blockSize;
  const outputWidth = inputWidth * blockSize;
  const outputDepth = inputDepth / (blockSize * blockSize);
  const outputShape =
    dataFormat === 'NHWC' ? [batchSize, outputHeight, outputWidth, outputDepth] : [batchSize, outputDepth, outputHeight, outputWidth];
  const out = backend.makeOutput(outputShape, 'float32');
  const xData = backend.dataIdMap.get(x.dataId);
  const xId = xData.id;
  const xStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(x.shape)).buffer);
  const outputShapeBytes = new Uint8Array(new Int32Array(outputShape).buffer);
  const outStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(outputShape)).buffer);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const channelsLast = dataFormat === 'NHWC' ? 1 : 0;
  wasmDepthToSpace(
    xId,
    blockSize,
    channelsLast,
    xStridesBytes,
    x.shape.length - 1,
    outputShapeBytes,
    outStridesBytes,
    outputShape.length,
    outId,
  );
  return out;
}
const depthToSpaceConfig = {
  kernelName: DepthToSpace,
  backendName: 'wasm',
  setupFunc: setup$S,
  kernelFunc: depthToSpace,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDepthwiseConv2d;
function setup$R(backend) {
  wasmDepthwiseConv2d = backend.wasm.cwrap(DepthwiseConv2dNative, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function depthwiseConv2d(args) {
  const { inputs, attrs, backend } = args;
  const { x, filter } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const filterId = backend.dataIdMap.get(filter.dataId).id;
  const { strides, dilations, pad, dimRoundingMode } = attrs;
  const $dilations = dilations == null ? [1, 1] : dilations;
  const convInfo = backend_util.computeConv2DInfo(x.shape, filter.shape, strides, $dilations, pad, dimRoundingMode, true /* depthwise */);
  const filterHeight = convInfo.filterHeight;
  const filterWidth = convInfo.filterWidth;
  const padTop = convInfo.padInfo.top;
  const padRight = convInfo.padInfo.right;
  const padBottom = convInfo.padInfo.bottom;
  const padLeft = convInfo.padInfo.left;
  const dilationHeight = convInfo.dilationHeight;
  const dilationWidth = convInfo.dilationWidth;
  const strideHeight = convInfo.strideHeight;
  const strideWidth = convInfo.strideWidth;
  const inputChannels = convInfo.inChannels;
  const outputChannels = convInfo.outChannels;
  const isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
  if (convInfo.dataFormat !== 'channelsLast') {
    throw new Error(
      `wasm backend DepthwiseConv2dNative does not support dataFormat:'` + `${convInfo.dataFormat}'. Please use 'channelsLast'.`,
    );
  }
  const out = backend.makeOutput(convInfo.outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmDepthwiseConv2d(
    xId,
    x.shape[0],
    x.shape[1],
    x.shape[2],
    filterId,
    filterHeight,
    filterWidth,
    padTop,
    padRight,
    padBottom,
    padLeft,
    isSamePad,
    dilationHeight,
    dilationWidth,
    strideHeight,
    strideWidth,
    inputChannels,
    outputChannels,
    outId,
  );
  return out;
}
const depthwiseConv2dNativeConfig = {
  kernelName: DepthwiseConv2dNative,
  backendName: 'wasm',
  setupFunc: setup$R,
  kernelFunc: depthwiseConv2d,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDiag;
function setup$Q(backend) {
  wasmDiag = backend.wasm.cwrap('Diag', null, [
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function diag(args) {
  const { inputs, backend } = args;
  const { x } = inputs;
  const xSize = util.sizeFromShape(x.shape);
  const out = backend.makeOutput([...x.shape, ...x.shape], x.dtype);
  wasmDiag(backend.dataIdMap.get(x.dataId).id, CppDType[x.dtype], xSize, backend.dataIdMap.get(out.dataId).id);
  return out;
}
const diagConfig = {
  kernelName: Diag,
  backendName: 'wasm',
  setupFunc: setup$Q,
  kernelFunc: diag,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDilation2D;
function setup$P(backend) {
  wasmDilation2D = backend.wasm.cwrap(Dilation2D, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function dilation2D(args) {
  const { inputs, backend, attrs } = args;
  const { x, filter } = inputs;
  const { strides, pad, dilations } = attrs;
  if (x.dtype !== filter.dtype) {
    throw new Error(`Dilation2D error: x must have the same dtype as filter. Got ${x.dtype} and ${filter.dtype}`);
  }
  const dilationInfo = backend_util.computeDilation2DInfo(x.shape, filter.shape, strides, pad, /*dataFormat=*/ 'NHWC', dilations);
  const out = backend.makeOutput(dilationInfo.outShape, x.dtype);
  wasmDilation2D(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(filter.dataId).id,
    backend.dataIdMap.get(out.dataId).id,
    CppDType[x.dtype],
    dilationInfo.batchSize,
    /*depth=*/ dilationInfo.inChannels,
    dilationInfo.inHeight,
    dilationInfo.inWidth,
    dilationInfo.outHeight,
    dilationInfo.outWidth,
    dilationInfo.strideHeight,
    dilationInfo.strideWidth,
    dilationInfo.dilationHeight,
    dilationInfo.dilationWidth,
    dilationInfo.filterHeight,
    dilationInfo.filterWidth,
    dilationInfo.padInfo.top,
    dilationInfo.padInfo.left,
  );
  return out;
}
const dilation2DConfig = {
  kernelName: Dilation2D,
  backendName: 'wasm',
  setupFunc: setup$P,
  kernelFunc: dilation2D,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDilation2DBackpropFilter;
function setup$O(backend) {
  wasmDilation2DBackpropFilter = backend.wasm.cwrap(Dilation2DBackpropFilter, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function dilation2DBackpropFilter(args) {
  const { inputs, backend, attrs } = args;
  const { x, filter, dy } = inputs;
  const { strides, pad, dilations } = attrs;
  if (x.dtype !== filter.dtype || x.dtype !== dy.dtype) {
    throw new Error(
      `Dilation2DBackpropFilter error: x must have the same dtype as filter and dy. Got ${x.dtype}, ${filter.dtype}, and ${dy.dtype}`,
    );
  }
  const dilationInfo = backend_util.computeDilation2DInfo(x.shape, filter.shape, strides, pad, /*dataFormat=*/ 'NHWC', dilations);
  const gradients = backend.makeOutput(filter.shape, filter.dtype);
  wasmDilation2DBackpropFilter(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(filter.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(gradients.dataId).id,
    CppDType[x.dtype],
    dilationInfo.batchSize,
    /*depth=*/ dilationInfo.inChannels,
    dilationInfo.inHeight,
    dilationInfo.inWidth,
    dilationInfo.outHeight,
    dilationInfo.outWidth,
    dilationInfo.strideHeight,
    dilationInfo.strideWidth,
    dilationInfo.dilationHeight,
    dilationInfo.dilationWidth,
    dilationInfo.filterHeight,
    dilationInfo.filterWidth,
    dilationInfo.padInfo.top,
    dilationInfo.padInfo.left,
  );
  return gradients;
}
const dilation2DBackpropFilterConfig = {
  kernelName: Dilation2DBackpropFilter,
  backendName: 'wasm',
  setupFunc: setup$O,
  kernelFunc: dilation2DBackpropFilter,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmDilation2DBackpropInput;
function setup$N(backend) {
  wasmDilation2DBackpropInput = backend.wasm.cwrap(Dilation2DBackpropInput, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function dilation2DBackpropInput(args) {
  const { inputs, backend, attrs } = args;
  const { x, filter, dy } = inputs;
  const { strides, pad, dilations } = attrs;
  if (x.dtype !== filter.dtype || x.dtype !== dy.dtype) {
    throw new Error(
      `Dilation2DBackpropInput error: x must have the same dtype as filter and dy. Got ${x.dtype}, ${filter.dtype}, and ${dy.dtype}`,
    );
  }
  const dilationInfo = backend_util.computeDilation2DInfo(x.shape, filter.shape, strides, pad, /*dataFormat=*/ 'NHWC', dilations);
  const gradients = backend.makeOutput(x.shape, x.dtype);
  wasmDilation2DBackpropInput(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(filter.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(gradients.dataId).id,
    CppDType[x.dtype],
    dilationInfo.batchSize,
    /*depth=*/ dilationInfo.inChannels,
    dilationInfo.inHeight,
    dilationInfo.inWidth,
    dilationInfo.outHeight,
    dilationInfo.outWidth,
    dilationInfo.strideHeight,
    dilationInfo.strideWidth,
    dilationInfo.dilationHeight,
    dilationInfo.dilationWidth,
    dilationInfo.filterHeight,
    dilationInfo.filterWidth,
    dilationInfo.padInfo.top,
    dilationInfo.padInfo.left,
  );
  return gradients;
}
const dilation2DBackpropInputConfig = {
  kernelName: Dilation2DBackpropInput,
  backendName: 'wasm',
  setupFunc: setup$N,
  kernelFunc: dilation2DBackpropInput,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const eluConfig = createUnaryKernelConfig(Elu);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmEluGrad;
function setup$M(backend) {
  wasmEluGrad = backend.wasm.cwrap(EluGrad, null, [
    'number',
    'number',
    'number', // outId
  ]);
}
function eluGrad(args) {
  const { inputs, backend } = args;
  const { dy, y } = inputs;
  const out = backend.makeOutput(y.shape, 'float32');
  const tensorId = x => {
    return backend.dataIdMap.get(x.dataId).id;
  };
  wasmEluGrad(tensorId(y), tensorId(dy), tensorId(out));
  return out;
}
const eluGradConfig = {
  kernelName: EluGrad,
  backendName: 'wasm',
  setupFunc: setup$M,
  kernelFunc: eluGrad,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$8 = false;
const equalConfig = createBinaryKernelConfig(Equal, supportsFullBroadcast$8, 'bool');

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const erfConfig = createUnaryKernelConfig(Erf);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const expConfig = createUnaryKernelConfig(Exp, 'float32');

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function expandDims(args) {
  const { inputs, attrs, backend } = args;
  const { input } = inputs;
  const { dim } = attrs;
  const inputRank = input.shape.length;
  const newShape = input.shape.slice();
  let $dim = dim;
  if (dim < 0) {
    // Negative value is counted from the tail of rank.
    util.assert(-(inputRank + 1) <= dim, () => `Axis must be in the interval [${-(inputRank + 1)}, ${inputRank}]`);
    $dim = inputRank + dim + 1;
  }
  newShape.splice($dim, 0, 1);
  return reshape({ inputs: { x: input }, backend, attrs: { shape: newShape } });
}
const expandDimsConfig = {
  kernelName: ExpandDims,
  backendName: 'wasm',
  kernelFunc: expandDims,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const expm1Config = createUnaryKernelConfig(Expm1, 'float32');

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function fill(args) {
  const {
    attrs: { shape, value },
    backend,
  } = args;
  let {
    attrs: { dtype },
  } = args;
  dtype = dtype || util.inferDtype(value);
  const out = backend.makeOutput(shape, dtype);
  const outVals = backend.typedArrayFromHeap(out);
  outVals.fill(value);
  return out;
}
const fillConfig = {
  kernelName: Fill,
  backendName: 'wasm',
  kernelFunc: fill,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFlipLeftRight;
function setup$L(backend) {
  wasmFlipLeftRight = backend.wasm.cwrap(FlipLeftRight, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function flipLeftRight(args) {
  const { inputs, backend } = args;
  const { image } = inputs;
  const out = backend.makeOutput(image.shape, image.dtype);
  const imageId = backend.dataIdMap.get(image.dataId).id;
  const outId = backend.dataIdMap.get(out.dataId).id;
  const [batch, imageHeight, imageWidth, numChannels] = image.shape;
  wasmFlipLeftRight(imageId, batch, imageHeight, imageWidth, numChannels, outId);
  return out;
}
const flipLeftRightConfig = {
  kernelName: FlipLeftRight,
  backendName: 'wasm',
  kernelFunc: flipLeftRight,
  setupFunc: setup$L,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const floorConfig = createUnaryKernelConfig(Floor);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const floorDivConfig = createBinaryKernelConfig(FloorDiv);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmBatchNorm;
function setup$K(backend) {
  wasmBatchNorm = backend.wasm.cwrap(FusedBatchNorm, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
  ]);
}
function fusedBatchNorm(args) {
  const { backend, inputs, attrs } = args;
  const { varianceEpsilon } = attrs;
  const { x, mean, variance, offset, scale } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const meanId = backend.dataIdMap.get(mean.dataId).id;
  const varianceId = backend.dataIdMap.get(variance.dataId).id;
  const offsetId = offset != null ? backend.dataIdMap.get(offset.dataId).id : 0;
  const scaleId = scale != null ? backend.dataIdMap.get(scale.dataId).id : 0;
  const out = backend.makeOutput(x.shape, x.dtype);
  // Short-circuit zero-sized tensors.
  if (util.sizeFromShape(x.shape) === 0) {
    return out;
  }
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmBatchNorm(xId, meanId, varianceId, offsetId, scaleId, varianceEpsilon, outId);
  return out;
}
const fusedBatchNormConfig = {
  kernelName: FusedBatchNorm,
  backendName: 'wasm',
  setupFunc: setup$K,
  kernelFunc: fusedBatchNorm,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFusedConv2d;
function setup$J(backend) {
  wasmFusedConv2d = backend.wasm.cwrap(FusedConv2D, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function fusedConv2d(args) {
  const { inputs, attrs, backend } = args;
  const { x, filter, bias, preluActivationWeights } = inputs;
  const { strides, pad, dilations, dataFormat, dimRoundingMode, activation, leakyreluAlpha } = attrs;
  const convInfo = backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode);
  const fusedActivation = FusableActivation[activation];
  if (fusedActivation == null) {
    throw new Error(`${activation} activation not yet supported for FusedConv2D ` + `in the wasm backend.`);
  }
  const xId = backend.dataIdMap.get(x.dataId).id;
  const filterId = backend.dataIdMap.get(filter.dataId).id;
  const outputChannels = convInfo.outChannels;
  let biasId = 0;
  if (bias != null) {
    const biasData = backend.dataIdMap.get(bias.dataId);
    if (biasData.shape.length !== 1) {
      throw new Error(`FusedConv2D only supports rank-1 bias but got ` + `rank ${biasData.shape.length}.`);
    }
    if (biasData.shape[0] !== outputChannels) {
      throw new Error(`FusedConv2D bias shape (${biasData.shape}) does not ` + `match the number of output channels (${outputChannels})`);
    }
    biasId = biasData.id;
  }
  const filterHeight = convInfo.filterHeight;
  const filterWidth = convInfo.filterWidth;
  const padTop = convInfo.padInfo.top;
  const padRight = convInfo.padInfo.right;
  const padBottom = convInfo.padInfo.bottom;
  const padLeft = convInfo.padInfo.left;
  const dilationHeight = convInfo.dilationHeight;
  const dilationWidth = convInfo.dilationWidth;
  const strideHeight = convInfo.strideHeight;
  const strideWidth = convInfo.strideWidth;
  const inputChannels = convInfo.inChannels;
  const isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
  const batchSize = convInfo.batchSize;
  const inHeight = convInfo.inHeight;
  const inWidth = convInfo.inWidth;
  if (dataFormat !== 'NHWC') {
    throw new Error(`wasm backend FusedConv2D does not support dataFormat:'` + `${dataFormat}'. Please use 'NHWC'.`);
  }
  const out = backend.makeOutput(convInfo.outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  const preluActivationWeightsId = preluActivationWeights == null ? 0 : backend.dataIdMap.get(preluActivationWeights.dataId).id;
  wasmFusedConv2d(
    xId,
    batchSize,
    inHeight,
    inWidth,
    filterId,
    filterHeight,
    filterWidth,
    biasId,
    padTop,
    padRight,
    padBottom,
    padLeft,
    isSamePad,
    dilationHeight,
    dilationWidth,
    strideHeight,
    strideWidth,
    inputChannels,
    outputChannels,
    fusedActivation,
    preluActivationWeightsId,
    leakyreluAlpha || 0,
    outId,
  );
  return out;
}
const fusedConv2DConfig = {
  kernelName: FusedConv2D,
  backendName: 'wasm',
  setupFunc: setup$J,
  kernelFunc: fusedConv2d,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFusedDepthwiseConv2d;
function setup$I(backend) {
  wasmFusedDepthwiseConv2d = backend.wasm.cwrap(FusedDepthwiseConv2D, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function fusedDepthwiseConv2d(args) {
  const { inputs, attrs, backend } = args;
  const { x, filter, bias, preluActivationWeights } = inputs;
  const { strides, pad, dilations, dataFormat, dimRoundingMode, activation, leakyreluAlpha } = attrs;
  const convInfo = backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, true /* depthwise */);
  const fusedActivation = FusableActivation[activation];
  if (fusedActivation == null) {
    throw new Error(`${activation} activation not yet supported for FusedDepthwiseConv2D ` + `in the wasm backend.`);
  }
  const xId = backend.dataIdMap.get(x.dataId).id;
  const filterId = backend.dataIdMap.get(filter.dataId).id;
  const outputChannels = convInfo.outChannels;
  let biasId = 0;
  if (bias != null) {
    const biasData = backend.dataIdMap.get(bias.dataId);
    if (biasData.shape.length !== 1) {
      throw new Error(`FusedDepthwiseConv2D only supports rank-1 bias but got ` + `rank ${biasData.shape.length}.`);
    }
    if (biasData.shape[0] !== outputChannels) {
      throw new Error(
        `FusedDepthwiseConv2D bias shape (${biasData.shape}) does not ` + `match the number of output channels (${outputChannels})`,
      );
    }
    biasId = biasData.id;
  }
  const filterHeight = convInfo.filterHeight;
  const filterWidth = convInfo.filterWidth;
  const padTop = convInfo.padInfo.top;
  const padRight = convInfo.padInfo.right;
  const padBottom = convInfo.padInfo.bottom;
  const padLeft = convInfo.padInfo.left;
  const dilationHeight = convInfo.dilationHeight;
  const dilationWidth = convInfo.dilationWidth;
  const strideHeight = convInfo.strideHeight;
  const strideWidth = convInfo.strideWidth;
  const inputChannels = convInfo.inChannels;
  const isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
  const batchSize = convInfo.batchSize;
  const inHeight = convInfo.inHeight;
  const inWidth = convInfo.inWidth;
  if (dataFormat !== 'NHWC') {
    throw new Error(`wasm backend FusedDepthwiseConv2D does not support dataFormat:'` + `${dataFormat}'. Please use 'NHWC'.`);
  }
  const out = backend.makeOutput(convInfo.outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  const preluActivationWeightsId = preluActivationWeights == null ? 0 : backend.dataIdMap.get(preluActivationWeights.dataId).id;
  wasmFusedDepthwiseConv2d(
    xId,
    batchSize,
    inHeight,
    inWidth,
    filterId,
    filterHeight,
    filterWidth,
    biasId,
    padTop,
    padRight,
    padBottom,
    padLeft,
    isSamePad,
    dilationHeight,
    dilationWidth,
    strideHeight,
    strideWidth,
    inputChannels,
    outputChannels,
    fusedActivation,
    preluActivationWeightsId,
    leakyreluAlpha || 0,
    outId,
  );
  return out;
}
const fusedDepthwiseConv2DConfig = {
  kernelName: FusedDepthwiseConv2D,
  backendName: 'wasm',
  setupFunc: setup$I,
  kernelFunc: fusedDepthwiseConv2d,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmGatherNd;
function setup$H(backend) {
  wasmGatherNd = backend.wasm.cwrap(GatherNd, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'array',
    'number', // outId
  ]);
}
function gatherNd(args) {
  const { backend, inputs } = args;
  const { params, indices } = inputs;
  const [resultShape, numSlices, sliceSize, strides] = gather_util.prepareAndValidate(params, indices);
  const out = backend.makeOutput(resultShape, params.dtype);
  if (numSlices === 0) {
    return out;
  }
  const indicesShape = indices.shape;
  const sliceRank = indicesShape[indicesShape.length - 1];
  const xData = backend.dataIdMap.get(params.dataId);
  const xId = xData.id;
  const indicesData = backend.dataIdMap.get(indices.dataId);
  const indicesId = indicesData.id;
  const stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmGatherNd(xId, CppDType[params.dtype], indicesId, numSlices, sliceRank, sliceSize, stridesBytes, outId);
  return out;
}
const gatherNdConfig = {
  kernelName: GatherNd,
  backendName: 'wasm',
  setupFunc: setup$H,
  kernelFunc: gatherNd,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmGather;
function setup$G(backend) {
  wasmGather = backend.wasm.cwrap('Gather', null /*void*/, [
    'number',
    'number',
    'array',
    'number',
    'number',
    'number',
    'array',
    'number', // outId
  ]);
}
function gatherV2(args) {
  const { backend, inputs, attrs } = args;
  const { x, indices } = inputs;
  const { axis, batchDims } = attrs;
  // Throw error when any index is out of bound.
  const parsedAxis = util.parseAxisParam(axis, x.shape)[0];
  const indicesVals = backend.readSync(indices.dataId);
  const axisDim = x.shape[parsedAxis];
  for (let i = 0; i < indicesVals.length; ++i) {
    const index = indicesVals[i];
    util.assert(index <= axisDim - 1 && index >= 0, () => `GatherV2: the index value ${index} is not in [0, ${axisDim - 1}]`);
  }
  const shapeInfo = backend_util.segment_util.collectGatherOpShapeInfo(x, indices, parsedAxis, batchDims);
  const flattenX = reshape({
    inputs: { x },
    attrs: {
      shape: [shapeInfo.batchSize, shapeInfo.outerSize, shapeInfo.dimSize, shapeInfo.sliceSize],
    },
    backend,
  });
  const indicesSize = util.sizeFromShape(indices.shape);
  const flattenIndex = reshape({
    inputs: { x: indices },
    attrs: { shape: [shapeInfo.batchSize, indicesSize / shapeInfo.batchSize] },
    backend,
  });
  const flattenOutputShape = [shapeInfo.batchSize, shapeInfo.outerSize, indicesSize / shapeInfo.batchSize, shapeInfo.sliceSize];
  const out = backend.makeOutput(flattenOutputShape, x.dtype);
  if (util.sizeFromShape(x.shape) === 0) {
    return out;
  }
  const stridesSize = flattenX.shape.length - 1;
  const xData = backend.dataIdMap.get(flattenX.dataId);
  const xId = xData.id;
  const indicesData = backend.dataIdMap.get(flattenIndex.dataId);
  const indicesId = indicesData.id;
  const outId = backend.dataIdMap.get(out.dataId).id;
  const xStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(flattenX.shape)).buffer);
  const outStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(flattenOutputShape)).buffer);
  wasmGather(xId, CppDType[x.dtype], xStridesBytes, stridesSize, indicesId, shapeInfo.batchSize, outStridesBytes, outId);
  backend.disposeData(flattenX.dataId);
  backend.disposeData(flattenIndex.dataId);
  // reshape
  out.shape = shapeInfo.outputShape;
  return out;
}
const gatherV2Config = {
  kernelName: GatherV2,
  backendName: 'wasm',
  setupFunc: setup$G,
  kernelFunc: gatherV2,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$7 = false;
const greaterConfig = createBinaryKernelConfig(Greater, supportsFullBroadcast$7, 'bool');

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$6 = false;
const greaterEqualConfig = createBinaryKernelConfig(GreaterEqual, supportsFullBroadcast$6, 'bool');

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const isFiniteConfig = createUnaryKernelConfig(IsFinite, 'bool');

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const isInfConfig = createUnaryKernelConfig(IsInf, 'bool');

/**
 * @license
 * Copyright 2022 The TensorFlow Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const isNaNConfig = createUnaryKernelConfig(IsNan, 'bool');

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc$5;
function setupFunc(backend) {
  wasmFunc$5 = backend.wasm.cwrap(LeakyRelu, null /* void */, [
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function leakyRelu(args) {
  const {
    inputs: { x },
    attrs: { alpha },
    backend,
  } = args;
  const xId = backend.dataIdMap.get(x.dataId).id;
  // According to TF API, LeakyRelu returns float32 when input is either float32
  // or int32.
  const out = backend.makeOutput(x.shape, 'float32');
  if (util.sizeFromShape(x.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmFunc$5(xId, CppDType[x.dtype], alpha, outId);
  }
  return out;
}
const leakyReluConfig = {
  kernelName: LeakyRelu,
  backendName: 'wasm',
  setupFunc,
  kernelFunc: leakyRelu,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$5 = false;
const lessConfig = createBinaryKernelConfig(Less, supportsFullBroadcast$5, 'bool');

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$4 = false;
const lessEqualConfig = createBinaryKernelConfig(LessEqual, supportsFullBroadcast$4, 'bool');

/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmLinSpace;
function setup$F(backend) {
  wasmLinSpace = backend.wasm.cwrap(LinSpace, null, [
    'number',
    'number',
    'number',
    'number', // num
  ]);
}
function linSpace(args) {
  const { attrs, backend } = args;
  const { start, stop, num } = attrs;
  // TFJS Cpu backend supports num as a float and returns undetermined tensor in
  // that case. However, according to TensorFlow spec, num should be a integer.
  const numInt = Math.floor(num);
  const out = backend.makeOutput([numInt], 'float32');
  wasmLinSpace(backend.dataIdMap.get(out.dataId).id, start, stop, numInt);
  return out;
}
const linSpaceConfig = {
  kernelName: LinSpace,
  backendName: 'wasm',
  setupFunc: setup$F,
  kernelFunc: linSpace,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const logConfig = createUnaryKernelConfig(Log);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const log1pConfig = createUnaryKernelConfig(Log1p);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$3 = false;
const logicalAndConfig = createBinaryKernelConfig(LogicalAnd, supportsFullBroadcast$3, 'bool');

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const logicalNotConfig = createUnaryKernelConfig(LogicalNot);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$2 = false;
const logicalOrConfig = createBinaryKernelConfig(LogicalOr, supportsFullBroadcast$2, 'bool');

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast$1 = false;
const logicalXorConfig = createBinaryKernelConfig(LogicalXor, supportsFullBroadcast$1, 'bool');

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmLRN;
function setup$E(backend) {
  wasmLRN = backend.wasm.cwrap(LRN, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // beta
  ]);
}
function lrn(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { depthRadius, bias, alpha, beta } = attrs;
  if (x.dtype !== 'float32') {
    throw new Error('LRN error: x must have dtype float32');
  }
  const out = backend.makeOutput(x.shape, x.dtype);
  wasmLRN(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(out.dataId).id,
    /*channels=*/ x.shape[3],
    depthRadius,
    bias,
    alpha,
    beta,
  );
  return out;
}
const lrnConfig = {
  kernelName: LRN,
  backendName: 'wasm',
  setupFunc: setup$E,
  kernelFunc: lrn,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmLRNGrad;
function setup$D(backend) {
  wasmLRNGrad = backend.wasm.cwrap(LRNGrad, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // beta
  ]);
}
function lrnGrad(args) {
  const { inputs, backend, attrs } = args;
  const { x, y, dy } = inputs;
  const { depthRadius, bias, alpha, beta } = attrs;
  if (x.dtype !== 'float32' || y.dtype !== 'float32' || dy.dtype !== 'float32') {
    throw new Error('LRNGrad error: x, y, and dy must have dtype float32');
  }
  const dx = backend.makeOutput(x.shape, x.dtype);
  wasmLRNGrad(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(y.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    /*channels=*/ dy.shape[3],
    depthRadius,
    bias,
    alpha,
    beta,
  );
  return dx;
}
const lrnGradConfig = {
  kernelName: LRNGrad,
  backendName: 'wasm',
  setupFunc: setup$D,
  kernelFunc: lrnGrad,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMax;
function setup$C(backend) {
  wasmMax = backend.wasm.cwrap(Max, null /*void*/, [
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function max(args) {
  const { backend, inputs, attrs } = args;
  const { reductionIndices: axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    input = transposed;
    inputId = transposedId;
  }
  const inputRank = input.shape.length;
  backend_util.assertAxesAreInnerMostDims('max', axes, inputRank);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, axes);
  const reduceSize = util.sizeFromShape(reduceShape);
  const out = backend.makeOutput(outShape, x.dtype);
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmMax(inputId, CppDType[x.dtype], reduceSize, outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  return out;
}
const maxConfig = {
  kernelName: Max,
  backendName: 'wasm',
  setupFunc: setup$C,
  kernelFunc: max,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const maximumConfig = createBinaryKernelConfig(Maximum);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMaxPool;
function setup$B(backend) {
  wasmMaxPool = backend.wasm.cwrap(MaxPool, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function maxPool(args) {
  const { inputs, attrs, backend } = args;
  const x = inputs.x;
  const xId = backend.dataIdMap.get(x.dataId).id;
  // TF API supports int32 input. CPU and WebGL backend also support int32
  // input. WASM backend doesn't support it because it uses xnnpack which only
  // supports float32.
  //
  // Add the following assert only for the WASM backend instead of at core op
  // level.
  //
  // TODO: add support for int32 input.
  util.assert(x.dtype === 'float32', () => `Error in MaxPool: only float32 input is supported. Got ${x.dtype}.`);
  const { filterSize, strides, pad, dimRoundingMode } = attrs;
  const convInfo = backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad, dimRoundingMode);
  const filterHeight = convInfo.filterHeight;
  const filterWidth = convInfo.filterWidth;
  const padTop = convInfo.padInfo.top;
  const padRight = convInfo.padInfo.right;
  const padBottom = convInfo.padInfo.bottom;
  const padLeft = convInfo.padInfo.left;
  const dilationHeight = convInfo.dilationHeight;
  const dilationWidth = convInfo.dilationWidth;
  const strideHeight = convInfo.strideHeight;
  const strideWidth = convInfo.strideWidth;
  const inputChannels = convInfo.inChannels;
  const outputChannels = convInfo.outChannels;
  if (convInfo.dataFormat !== 'channelsLast') {
    throw new Error(`wasm backend does not support dataFormat:'` + `${convInfo.dataFormat}'. Please use 'channelsLast'.`);
  }
  const out = backend.makeOutput(convInfo.outShape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmMaxPool(
    xId,
    x.shape[0],
    x.shape[1],
    x.shape[2],
    filterHeight,
    filterWidth,
    padTop,
    padRight,
    padBottom,
    padLeft,
    dilationHeight,
    dilationWidth,
    strideHeight,
    strideWidth,
    inputChannels,
    outputChannels,
    outId,
  );
  return out;
}
const maxPoolConfig = {
  kernelName: MaxPool,
  backendName: 'wasm',
  setupFunc: setup$B,
  kernelFunc: maxPool,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMaxPool3D;
function setup$A(backend) {
  wasmMaxPool3D = backend.wasm.cwrap('MaxPool3D', null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function maxPool3D(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { filterSize, strides, pad, dimRoundingMode, dataFormat } = attrs;
  const convInfo = backend_util.computePool3DInfo(x.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode, dataFormat);
  const out = backend.makeOutput(convInfo.outShape, x.dtype);
  wasmMaxPool3D(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(out.dataId).id,
    convInfo.batchSize,
    // Since Pool3D ops (AvgPool3D and MaxPool3D) support 3D filter only, in
    // channels should always equal to out channels.
    /*channelSize=*/ convInfo.inChannels,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterDepth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return out;
}
const maxPool3DConfig = {
  kernelName: MaxPool3D,
  backendName: 'wasm',
  setupFunc: setup$A,
  kernelFunc: maxPool3D,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMaxPool3DGrad;
function setup$z(backend) {
  wasmMaxPool3DGrad = backend.wasm.cwrap('MaxPool3DGrad', null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function maxPool3DGrad(args) {
  const { inputs, backend, attrs } = args;
  const { dy, input } = inputs;
  const { filterSize, strides, pad, dimRoundingMode } = attrs;
  const convInfo = backend_util.computePool3DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode);
  const dx = backend.makeOutput(input.shape, input.dtype);
  wasmMaxPool3DGrad(
    backend.dataIdMap.get(input.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    convInfo.batchSize,
    // Since Pool3D ops (MaxPool3D and MaxPool3D) support 3D filter only, in
    // channels should always equal to out channels.
    /*channelSize=*/ convInfo.inChannels,
    convInfo.inDepth,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outDepth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideDepth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationDepth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterDepth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.front,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return dx;
}
const maxPool3DGradConfig = {
  kernelName: MaxPool3DGrad,
  backendName: 'wasm',
  setupFunc: setup$z,
  kernelFunc: maxPool3DGrad,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMaxPoolGrad;
function setup$y(backend) {
  wasmMaxPoolGrad = backend.wasm.cwrap('MaxPoolGrad', null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function maxPoolGrad(args) {
  const { inputs, backend, attrs } = args;
  const { dy, input } = inputs;
  const { filterSize, strides, pad, dimRoundingMode } = attrs;
  const convInfo = backend_util.computePool2DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode);
  const dx = backend.makeOutput(input.shape, input.dtype);
  wasmMaxPoolGrad(
    backend.dataIdMap.get(input.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    convInfo.batchSize,
    // Since Pool ops (MaxPool and MaxPool) support 2D filter only, in
    // channels should always equal to out channels.
    /*channelSize=*/ convInfo.inChannels,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return dx;
}
const maxPoolGradConfig = {
  kernelName: MaxPoolGrad,
  backendName: 'wasm',
  setupFunc: setup$y,
  kernelFunc: maxPoolGrad,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMaxPoolWithArgmax;
function setup$x(backend) {
  wasmMaxPoolWithArgmax = backend.wasm.cwrap('MaxPoolWithArgmax', null, [
    'number',
    'number',
    'number',
    'number',
    'boolean',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // padLeft
  ]);
}
function maxPoolWithArgmax(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { filterSize, strides, pad, includeBatchInIndex } = attrs;
  util.assert(x.shape.length === 4, () => `Error in maxPool: input must be rank 4 but got rank ${x.shape.length}.`);
  const dilations = [1, 1];
  util.assert(
    backend_util.eitherStridesOrDilationsAreOne(strides, dilations),
    () => 'Error in maxPool: Either strides or dilations must be 1. ' + `Got strides ${strides} and dilations '${dilations}'`,
  );
  const convInfo = backend_util.computePool2DInfo(x.shape, filterSize, strides, [1, 1], pad);
  const pooled = backend.makeOutput(convInfo.outShape, x.dtype);
  const indexes = backend.makeOutput(convInfo.outShape, 'int32');
  wasmMaxPoolWithArgmax(
    backend.dataIdMap.get(x.dataId).id,
    backend.dataIdMap.get(pooled.dataId).id,
    backend.dataIdMap.get(indexes.dataId).id,
    CppDType[x.dtype],
    includeBatchInIndex,
    convInfo.batchSize,
    convInfo.inChannels,
    convInfo.inHeight,
    convInfo.inWidth,
    convInfo.outHeight,
    convInfo.outWidth,
    convInfo.strideHeight,
    convInfo.strideWidth,
    convInfo.dilationHeight,
    convInfo.dilationWidth,
    convInfo.effectiveFilterHeight,
    convInfo.effectiveFilterWidth,
    convInfo.padInfo.top,
    convInfo.padInfo.left,
  );
  return [pooled, indexes];
}
const maxPoolWithArgmaxConfig = {
  kernelName: MaxPoolWithArgmax,
  backendName: 'wasm',
  setupFunc: setup$x,
  kernelFunc: maxPoolWithArgmax,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMean;
function setup$w(backend) {
  wasmMean = backend.wasm.cwrap(Mean, null /*void*/, ['number, number, number']);
}
function mean(args) {
  const { backend, inputs, attrs } = args;
  const { axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  let reductionAxes = axes;
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    if (transposedId !== xId) {
      // transpose was not a no-op. We will need to dispose of this
      // once we are done.
      input = transposed;
      inputId = transposedId;
      reductionAxes = backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
    }
  }
  backend_util.assertAxesAreInnerMostDims('mean', reductionAxes, input.shape.length);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, reductionAxes);
  const reduceSize = util.sizeFromShape(reduceShape);
  let castedInput = input;
  if (input.dtype !== 'float32') {
    castedInput = cast({ backend, inputs: { x: input }, attrs: { dtype: 'float32' } });
    inputId = backend.dataIdMap.get(castedInput.dataId).id;
  }
  const out = backend.makeOutput(outShape, 'float32');
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmMean(inputId, reduceSize, outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  if (input.dtype !== 'float32') {
    backend.disposeData(castedInput.dataId);
  }
  return out;
}
const meanConfig = {
  kernelName: Mean,
  backendName: 'wasm',
  setupFunc: setup$w,
  kernelFunc: mean,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMin;
function setup$v(backend) {
  wasmMin = backend.wasm.cwrap(Min, null /*void*/, [
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function min(args) {
  const { backend, inputs, attrs } = args;
  const { axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    if (transposedId !== xId) {
      // transpose was not a no-op. We will need to dispose of this
      // once we are done.
      input = transposed;
      inputId = transposedId;
    }
  }
  const inputRank = input.shape.length;
  backend_util.assertAxesAreInnerMostDims('min', axes, inputRank);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, axes);
  const reduceSize = util.sizeFromShape(reduceShape);
  const out = backend.makeOutput(outShape, input.dtype);
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmMin(inputId, CppDType[x.dtype], reduceSize, outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  return out;
}
const minConfig = {
  kernelName: Min,
  backendName: 'wasm',
  setupFunc: setup$v,
  kernelFunc: min,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const minimumConfig = createBinaryKernelConfig(Minimum);

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Must match enum in MirrorPad.cc
var MirrorPaddingMode;
(function (MirrorPaddingMode) {
  MirrorPaddingMode[(MirrorPaddingMode['reflect'] = 0)] = 'reflect';
  MirrorPaddingMode[(MirrorPaddingMode['symmetric'] = 1)] = 'symmetric';
})(MirrorPaddingMode || (MirrorPaddingMode = {}));
let wasmMirrorPad;
function setup$u(backend) {
  wasmMirrorPad = backend.wasm.cwrap(MirrorPad, null /* void */, [
    'number',
    'array',
    'number',
    'number',
    'array',
    'array',
    'number',
    'number', // outId
  ]);
}
function mirrorPad(args) {
  const {
    inputs: { x },
    backend,
    attrs: { paddings, mode },
  } = args;
  const outShape = paddings.map((p, i) => p[0] /* beforePad */ + x.shape[i] + p[1] /* afterPad */);
  const xId = backend.dataIdMap.get(x.dataId).id;
  const out = backend.makeOutput(outShape, x.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
  const prePaddingsFlat = paddings.map(padTuple => padTuple[0]);
  const postPaddingsFlat = paddings.map(padTuple => padTuple[1]);
  const prePaddingsBytes = new Uint8Array(new Int32Array(prePaddingsFlat).buffer);
  const postPaddingsBytes = new Uint8Array(new Int32Array(postPaddingsFlat).buffer);
  wasmMirrorPad(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], prePaddingsBytes, postPaddingsBytes, MirrorPaddingMode[mode], outId);
  return out;
}
const mirrorPadConfig = {
  kernelName: MirrorPad,
  backendName: 'wasm',
  kernelFunc: mirrorPad,
  setupFunc: setup$u,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc$4;
function setup$t(backend) {
  wasmFunc$4 = backend.wasm.cwrap(Softmax, null /* void */, [
    'number',
    'number',
    'number',
    'number', // batch
  ]);
}
function softmax(args) {
  const {
    backend,
    inputs: { logits },
    attrs: { dim },
  } = args;
  const xId = backend.dataIdMap.get(logits.dataId).id;
  const out = backend.makeOutput(logits.shape, logits.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const channels = logits.shape[dim];
  const batch = util.sizeFromShape(logits.shape) / channels;
  // Short-circuit zero-sized tensors.
  if (util.sizeFromShape(out.shape) === 0) {
    return out;
  }
  wasmFunc$4(xId, outId, channels, batch);
  return out;
}
const softmaxConfig = {
  kernelName: Softmax,
  backendName: 'wasm',
  setupFunc: setup$t,
  kernelFunc: softmax,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmMultinomial;
function setup$s(backend) {
  wasmMultinomial = backend.wasm.cwrap(Multinomial, null, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function multinomial(args) {
  const { inputs, backend, attrs } = args;
  const { logits } = inputs;
  const { numSamples, seed, normalized } = attrs;
  if (logits.dtype !== 'float32') {
    throw new Error(`Tensor logits must have dtype float32, got ${logits.dtype}`);
  }
  const probabilities = normalized
    ? logits
    : softmax({
        inputs: { logits },
        backend,
        attrs: { dim: logits.shape.length - 1 },
      });
  const [batchSize, numEvents] = probabilities.shape;
  const out = backend.makeOutput([batchSize, numSamples], 'int32');
  wasmMultinomial(
    backend.dataIdMap.get(probabilities.dataId).id,
    batchSize,
    numEvents,
    numSamples,
    seed,
    backend.dataIdMap.get(out.dataId).id,
  );
  if (!normalized) {
    backend.disposeData(probabilities.dataId);
  }
  return out;
}
const multinomialConfig = {
  kernelName: Multinomial,
  backendName: 'wasm',
  setupFunc: setup$s,
  kernelFunc: multinomial,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const modConfig = createBinaryKernelConfig(Mod);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const multiplyConfig = createBinaryKernelConfig(Multiply);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const negConfig = createUnaryKernelConfig(Neg);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/**
 * Parse the result of the c++ method, which has the shape equivalent to
 * `Result`.
 */
function parseResultStruct(backend, resOffset) {
  const result = new Int32Array(backend.wasm.HEAPU8.buffer, resOffset, 4);
  const pSelectedIndices = result[0];
  const selectedSize = result[1];
  const pSelectedScores = result[2];
  const pValidOutputs = result[3];
  // Since the result was allocated on the heap, we have to delete it.
  backend.wasm._free(resOffset);
  return { pSelectedIndices, selectedSize, pSelectedScores, pValidOutputs };
}

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc$3;
function setup$r(backend) {
  wasmFunc$3 = backend.wasm.cwrap(
    NonMaxSuppressionV3,
    'number', // Result*
    [
      'number',
      'number',
      'number',
      'number',
      'number', // scoreThreshold
    ],
  );
}
function kernelFunc$1(args) {
  const { backend, inputs, attrs } = args;
  const { iouThreshold, maxOutputSize, scoreThreshold } = attrs;
  const { boxes, scores } = inputs;
  const boxesId = backend.dataIdMap.get(boxes.dataId).id;
  const scoresId = backend.dataIdMap.get(scores.dataId).id;
  const resOffset = wasmFunc$3(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold);
  const { pSelectedIndices, selectedSize, pSelectedScores, pValidOutputs } = parseResultStruct(backend, resOffset);
  // Since we are not using scores for V3, we have to delete it from the heap.
  backend.wasm._free(pSelectedScores);
  backend.wasm._free(pValidOutputs);
  const selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
  return selectedIndicesTensor;
}
const nonMaxSuppressionV3Config = {
  kernelName: NonMaxSuppressionV3,
  backendName: 'wasm',
  setupFunc: setup$r,
  kernelFunc: kernelFunc$1,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc$2;
function setup$q(backend) {
  wasmFunc$2 = backend.wasm.cwrap(
    NonMaxSuppressionV4,
    'number', // Result*
    [
      'number',
      'number',
      'number',
      'number',
      'number',
      'bool', // padToMaxOutputSize
    ],
  );
}
function nonMaxSuppressionV4(args) {
  const { backend, inputs, attrs } = args;
  const { iouThreshold, maxOutputSize, scoreThreshold, padToMaxOutputSize } = attrs;
  const { boxes, scores } = inputs;
  const boxesId = backend.dataIdMap.get(boxes.dataId).id;
  const scoresId = backend.dataIdMap.get(scores.dataId).id;
  const resOffset = wasmFunc$2(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, padToMaxOutputSize);
  const { pSelectedIndices, selectedSize, pSelectedScores, pValidOutputs } = parseResultStruct(backend, resOffset);
  // Since we are not using scores for V4, we have to delete it from the heap.
  backend.wasm._free(pSelectedScores);
  const selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
  const validOutputsTensor = backend.makeOutput([], 'int32', pValidOutputs);
  return [selectedIndicesTensor, validOutputsTensor];
}
const nonMaxSuppressionV4Config = {
  kernelName: NonMaxSuppressionV4,
  backendName: 'wasm',
  setupFunc: setup$q,
  kernelFunc: nonMaxSuppressionV4,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc$1;
function setup$p(backend) {
  wasmFunc$1 = backend.wasm.cwrap(
    NonMaxSuppressionV5,
    'number', // Result*
    [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number', // softNmsSigma
    ],
  );
}
function kernelFunc(args) {
  const { backend, inputs, attrs } = args;
  const { iouThreshold, maxOutputSize, scoreThreshold, softNmsSigma } = attrs;
  const { boxes, scores } = inputs;
  const boxesId = backend.dataIdMap.get(boxes.dataId).id;
  const scoresId = backend.dataIdMap.get(scores.dataId).id;
  const resOffset = wasmFunc$1(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
  const { pSelectedIndices, selectedSize, pSelectedScores, pValidOutputs } = parseResultStruct(backend, resOffset);
  // Since we are not using validOutputs for V5, we have to delete it from the
  // heap.
  backend.wasm._free(pValidOutputs);
  const selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
  const selectedScoresTensor = backend.makeOutput([selectedSize], 'float32', pSelectedScores);
  return [selectedIndicesTensor, selectedScoresTensor];
}
const nonMaxSuppressionV5Config = {
  kernelName: NonMaxSuppressionV5,
  backendName: 'wasm',
  setupFunc: setup$p,
  kernelFunc: kernelFunc,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const supportsFullBroadcast = false;
const notEqualConfig = createBinaryKernelConfig(NotEqual, supportsFullBroadcast, 'bool');

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmOneHot;
function setup$o(backend) {
  wasmOneHot = backend.wasm.cwrap(OneHot, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function oneHot(args) {
  const { inputs, backend, attrs } = args;
  const { indices } = inputs;
  const { dtype, depth, onValue, offValue } = attrs;
  const out = backend.makeOutput([...indices.shape, depth], dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const indicesData = backend.dataIdMap.get(indices.dataId);
  const indicesId = indicesData.id;
  wasmOneHot(indicesId, depth, onValue, offValue, outId);
  return out;
}
const oneHotConfig = {
  kernelName: OneHot,
  backendName: 'wasm',
  setupFunc: setup$o,
  kernelFunc: oneHot,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function onesLike(args) {
  const {
    inputs: { x },
    backend,
  } = args;
  const out = backend.makeOutput(x.shape, x.dtype);
  const outVals = backend.typedArrayFromHeap(out);
  outVals.fill(1);
  return out;
}
const onesLikeConfig = {
  kernelName: OnesLike,
  backendName: 'wasm',
  kernelFunc: onesLike,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function pack(args) {
  const { inputs, backend, attrs } = args;
  const { axis } = attrs;
  if (inputs.length === 1) {
    return expandDims({ inputs: { input: inputs[0] }, backend, attrs: { dim: axis } });
  }
  const shape = inputs[0].shape;
  const dtype = inputs[0].dtype;
  inputs.forEach(t => {
    util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
    util.assert(dtype === t.dtype, () => 'All tensors passed to stack must have matching dtypes');
  });
  const intermediateTensorInfos = [];
  const expandedTensors = inputs.map(t => {
    const expandedT = expandDims({ inputs: { input: t }, backend, attrs: { dim: axis } });
    intermediateTensorInfos.push(expandedT);
    return expandedT;
  });
  const result = concat({ inputs: expandedTensors, backend, attrs: { axis } });
  intermediateTensorInfos.forEach(t => backend.disposeData(t.dataId));
  return result;
}
const packConfig = {
  kernelName: Pack,
  backendName: 'wasm',
  kernelFunc: pack,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmPadV2;
function setup$n(backend) {
  wasmPadV2 = backend.wasm.cwrap(PadV2, null /* void */, [
    'number',
    'array',
    'number',
    'number',
    'array',
    'array',
    'number',
    'number', // outId
  ]);
}
function pad(args) {
  const {
    inputs: { x },
    backend,
    attrs: { paddings, constantValue },
  } = args;
  const outShape = paddings.map((p, i) => p[0] /* beforePad */ + x.shape[i] + p[1] /* afterPad */);
  if (util.sizeFromShape(x.shape) === 0) {
    // Short-circuit the computation, since x doesn't have value, only
    // the shape is used to compute output shape to pad.
    return fill({
      backend,
      attrs: { shape: outShape, value: constantValue, dtype: x.dtype },
    });
  }
  const xId = backend.dataIdMap.get(x.dataId).id;
  const out = backend.makeOutput(outShape, x.dtype);
  const outTensorData = backend.dataIdMap.get(out.dataId);
  const outId = outTensorData.id;
  const xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
  const prePaddingsFlat = paddings.map(padTuple => padTuple[0]);
  const postPaddingsFlat = paddings.map(padTuple => padTuple[1]);
  const prePaddingsBytes = new Uint8Array(new Int32Array(prePaddingsFlat).buffer);
  const postPaddingsBytes = new Uint8Array(new Int32Array(postPaddingsFlat).buffer);
  wasmPadV2(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], prePaddingsBytes, postPaddingsBytes, constantValue, outId);
  return out;
}
const padV2Config = {
  kernelName: PadV2,
  backendName: 'wasm',
  kernelFunc: pad,
  setupFunc: setup$n,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const powConfig = createBinaryKernelConfig(Pow);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmPrelu;
function setup$m(backend) {
  wasmPrelu = backend.wasm.cwrap(Prelu, null /* void */, [
    'number',
    'number',
    'number', // out_id
  ]);
}
function prelu(args) {
  const { inputs, backend } = args;
  const { x, alpha } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const weightsId = backend.dataIdMap.get(alpha.dataId).id;
  let inputId = xId;
  const input = x;
  let castedInput = input;
  if (input.dtype !== 'float32') {
    castedInput = cast({ backend, inputs: { x }, attrs: { dtype: 'float32' } });
    inputId = backend.dataIdMap.get(castedInput.dataId).id;
  }
  const out = backend.makeOutput(x.shape, 'float32');
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmPrelu(inputId, weightsId, outId);
  if (input.dtype !== 'float32') {
    backend.disposeData(castedInput.dataId);
  }
  return out;
}
const preluConfig = {
  kernelName: Prelu,
  backendName: 'wasm',
  setupFunc: setup$m,
  kernelFunc: prelu,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmProd;
function setup$l(backend) {
  wasmProd = backend.wasm.cwrap(Prod, null /*void*/, ['number', 'number', 'number', 'number']);
}
function prod(args) {
  const { backend, inputs, attrs } = args;
  const { axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  let reductionAxes = axes;
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    if (transposedId !== xId) {
      // transpose was not a no-op. We will need to dispose of this
      // once we are done.
      input = transposed;
      inputId = transposedId;
      reductionAxes = backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
    }
  }
  backend_util.assertAxesAreInnerMostDims('prod', reductionAxes, input.shape.length);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, reductionAxes);
  const reduceSize = util.sizeFromShape(reduceShape);
  const out = backend.makeOutput(outShape, input.dtype);
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmProd(inputId, reduceSize, CppDType[out.dtype], outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  return out;
}
const prodConfig = {
  kernelName: Prod,
  backendName: 'wasm',
  setupFunc: setup$l,
  kernelFunc: prod,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const range = args => {
  const { backend, attrs } = args;
  const { start, stop, step, dtype } = attrs;
  const values = rangeImpl(start, stop, step, dtype);
  const out = backend.makeOutput([values.length], dtype);
  const outVals = backend.typedArrayFromHeap(out);
  outVals.set(values);
  return out;
};
const rangeConfig = {
  kernelName: Range,
  backendName: 'wasm',
  kernelFunc: range,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const realDivConfig = createBinaryKernelConfig(RealDiv);

/**
 * @license
 * Copyright 2022 The TensorFlow Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const reciprocalConfig = createUnaryKernelConfig(Reciprocal);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const reluConfig = createUnaryKernelConfig(Relu);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const relu6Config = createUnaryKernelConfig(Relu6);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmResizeBilinear;
function setup$k(backend) {
  wasmResizeBilinear = backend.wasm.cwrap(ResizeBilinear, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function resizeBilinear(args) {
  const { backend, inputs, attrs } = args;
  const { images } = inputs;
  const { alignCorners, halfPixelCenters, size } = attrs;
  const [newHeight, newWidth] = size;
  const [batch, oldHeight, oldWidth, numChannels] = images.shape;
  const outShape = [batch, newHeight, newWidth, numChannels];
  let xData = backend.dataIdMap.get(images.dataId);
  let castedData;
  if (xData.dtype !== 'float32') {
    castedData = cast({ backend, inputs: { x: images }, attrs: { dtype: 'float32' } });
    xData = backend.dataIdMap.get(castedData.dataId);
  }
  const xId = xData.id;
  const out = backend.makeOutput(outShape, 'float32');
  if (util.sizeFromShape(images.shape) === 0) {
    return out;
  }
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmResizeBilinear(
    xId,
    batch,
    oldHeight,
    oldWidth,
    numChannels,
    newHeight,
    newWidth,
    alignCorners ? 1 : 0,
    halfPixelCenters ? 1 : 0,
    outId,
  );
  if (castedData != null) {
    backend.disposeData(castedData.dataId);
  }
  return out;
}
const resizeBilinearConfig = {
  kernelName: ResizeBilinear,
  backendName: 'wasm',
  setupFunc: setup$k,
  kernelFunc: resizeBilinear,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmResizeBilinearGrad;
function setup$j(backend) {
  wasmResizeBilinearGrad = backend.wasm.cwrap(ResizeBilinearGrad, null /*void*/, [
    'number',
    'number',
    'number',
    'array',
    'array',
    'boolean', // alignCorners
  ]);
}
function resizeBilinearGrad(args) {
  const { inputs, backend, attrs } = args;
  const { images, dy } = inputs;
  const { alignCorners } = attrs;
  const dx = backend.makeOutput(images.shape, 'float32');
  let xData = backend.dataIdMap.get(images.dataId);
  let castedData;
  if (xData.dtype !== 'float32') {
    castedData = cast({
      backend,
      inputs: { x: images },
      attrs: { dtype: 'float32' },
    });
    xData = backend.dataIdMap.get(castedData.dataId);
  }
  wasmResizeBilinearGrad(
    backend.dataIdMap.get(images.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    new Uint8Array(new Int32Array(images.shape).buffer),
    new Uint8Array(new Int32Array(dy.shape).buffer),
    alignCorners,
  );
  if (castedData != null) {
    backend.disposeData(castedData.dataId);
  }
  return dx;
}
const resizeBilinearGradConfig = {
  kernelName: ResizeBilinearGrad,
  backendName: 'wasm',
  setupFunc: setup$j,
  kernelFunc: resizeBilinearGrad,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmResizeNearestNeighbor;
function setup$i(backend) {
  wasmResizeNearestNeighbor = backend.wasm.cwrap(ResizeNearestNeighbor, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function resizeNearestNeighbor(args) {
  const { backend, inputs, attrs } = args;
  const { images } = inputs;
  const { alignCorners, halfPixelCenters, size } = attrs;
  const [newHeight, newWidth] = size;
  const [batch, oldHeight, oldWidth, numChannels] = images.shape;
  const outShape = [batch, newHeight, newWidth, numChannels];
  const out = backend.makeOutput(outShape, 'float32');
  if (util.sizeFromShape(images.shape) === 0) {
    return out;
  }
  let xData = backend.dataIdMap.get(images.dataId);
  let castedData;
  if (xData.dtype !== 'float32') {
    castedData = cast({
      backend,
      inputs: { x: images },
      attrs: { dtype: 'float32' },
    });
    xData = backend.dataIdMap.get(castedData.dataId);
  }
  const xId = xData.id;
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmResizeNearestNeighbor(
    xId,
    batch,
    oldHeight,
    oldWidth,
    numChannels,
    newHeight,
    newWidth,
    alignCorners ? 1 : 0,
    halfPixelCenters ? 1 : 0,
    outId,
  );
  if (castedData != null) {
    backend.disposeData(castedData.dataId);
  }
  return out;
}
const resizeNearestNeighborConfig = {
  kernelName: ResizeNearestNeighbor,
  backendName: 'wasm',
  setupFunc: setup$i,
  kernelFunc: resizeNearestNeighbor,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmResizeNearestNeighborGrad;
function setup$h(backend) {
  wasmResizeNearestNeighborGrad = backend.wasm.cwrap(ResizeNearestNeighborGrad, null /*void*/, [
    'number',
    'number',
    'number',
    'array',
    'array',
    'boolean', // alignCorners
  ]);
}
function resizeNearestNeighborGrad(args) {
  const { inputs, backend, attrs } = args;
  const { images, dy } = inputs;
  const { alignCorners } = attrs;
  const dx = backend.makeOutput(images.shape, 'float32');
  let xData = backend.dataIdMap.get(images.dataId);
  let castedData;
  if (xData.dtype !== 'float32') {
    castedData = cast({
      backend,
      inputs: { x: images },
      attrs: { dtype: 'float32' },
    });
    xData = backend.dataIdMap.get(castedData.dataId);
  }
  wasmResizeNearestNeighborGrad(
    backend.dataIdMap.get(images.dataId).id,
    backend.dataIdMap.get(dy.dataId).id,
    backend.dataIdMap.get(dx.dataId).id,
    new Uint8Array(new Int32Array(images.shape).buffer),
    new Uint8Array(new Int32Array(dy.shape).buffer),
    alignCorners,
  );
  if (castedData != null) {
    backend.disposeData(castedData.dataId);
  }
  return dx;
}
const resizeNearestNeighborGradConfig = {
  kernelName: ResizeNearestNeighborGrad,
  backendName: 'wasm',
  setupFunc: setup$h,
  kernelFunc: resizeNearestNeighborGrad,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmReverse;
function setup$g(backend) {
  wasmReverse = backend.wasm.cwrap(Reverse, null, [
    'number',
    'array',
    'number',
    'array',
    'number',
    'number', // out_id
  ]);
}
function reverse(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { dims } = attrs;
  const axes = util.parseAxisParam(dims, x.shape);
  if (x.shape.length === 0) {
    return identity({ inputs: { x }, backend });
  }
  const out = backend.makeOutput(x.shape, x.dtype);
  const xId = backend.dataIdMap.get(x.dataId).id;
  const outId = backend.dataIdMap.get(out.dataId).id;
  const axesBytes = new Uint8Array(new Int32Array(axes).buffer);
  const outShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
  wasmReverse(xId, axesBytes, axes.length, outShapeBytes, x.shape.length, outId);
  const reshaped = reshape({ inputs: { x: out }, attrs: { shape: x.shape }, backend });
  backend.disposeData(out.dataId);
  return reshaped;
}
const reverseConfig = {
  kernelName: Reverse,
  backendName: 'wasm',
  kernelFunc: reverse,
  setupFunc: setup$g,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmRotate;
function setup$f(backend) {
  wasmRotate = backend.wasm.cwrap(RotateWithOffset, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'array',
    'number',
    'number', // outId
  ]);
}
function rotateWithOffset(args) {
  const { inputs, backend, attrs } = args;
  const { image } = inputs;
  const { radians, fillValue, center } = attrs;
  const out = backend.makeOutput(image.shape, image.dtype);
  const imageId = backend.dataIdMap.get(image.dataId).id;
  const outId = backend.dataIdMap.get(out.dataId).id;
  const [batch, imageHeight, imageWidth, numChannels] = image.shape;
  const [centerX, centerY] = backend_util.getImageCenter(center, imageHeight, imageWidth);
  const fillIsBlack = fillValue === 0;
  const fullOpacityValue = 255;
  const fillValues =
    typeof fillValue === 'number'
      ? [fillValue, fillValue, fillValue, fillIsBlack ? 0 : fullOpacityValue]
      : [...fillValue, fullOpacityValue];
  const fillBytes = new Uint8Array(new Int32Array(fillValues).buffer);
  wasmRotate(imageId, batch, imageHeight, imageWidth, numChannels, radians, centerX, centerY, fillBytes, fillValues.length, outId);
  return out;
}
const rotateWithOffsetConfig = {
  kernelName: RotateWithOffset,
  backendName: 'wasm',
  kernelFunc: rotateWithOffset,
  setupFunc: setup$f,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const roundConfig = createUnaryKernelConfig(Round);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const rsqrtConfig = createUnaryKernelConfig(Rsqrt);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmScatterNd;
function setup$e(backend) {
  wasmScatterNd = backend.wasm.cwrap(ScatterNd, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'array',
    'number',
    'number', // outId
  ]);
}
function scatterNd(args) {
  const { backend, inputs, attrs } = args;
  const { indices, updates } = inputs;
  const { shape } = attrs;
  const out = backend.makeOutput(shape, updates.dtype);
  if (util.sizeFromShape(shape) === 0) {
    return out;
  }
  const { sliceRank, numUpdates, sliceSize, strides, outputSize } = scatter_util.calculateShapes(updates, indices, shape);
  const indicesData = backend.dataIdMap.get(indices.dataId);
  const indicesId = indicesData.id;
  const updatesData = backend.dataIdMap.get(updates.dataId);
  const updatesId = updatesData.id;
  const stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmScatterNd(indicesId, updatesId, CppDType[updates.dtype], sliceRank, numUpdates, sliceSize, stridesBytes, outputSize, outId);
  return out;
}
const scatterNdConfig = {
  kernelName: ScatterNd,
  backendName: 'wasm',
  setupFunc: setup$e,
  kernelFunc: scatterNd,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSearchSorted;
function setup$d(backend) {
  wasmSearchSorted = backend.wasm.cwrap(SearchSorted, null /* void */, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'bool',
    'number', // outId
  ]);
}
function searchSorted(args) {
  const { inputs, backend, attrs } = args;
  const { sortedSequence, values } = inputs;
  const { side } = attrs;
  if (sortedSequence.dtype !== values.dtype) {
    throw new Error(
      `SearchSorted error: sorted_sequence must have the same dtype as values. Got ${sortedSequence.dtype} and ${values.dtype}`,
    );
  }
  const out = backend.makeOutput(values.shape, 'int32');
  function tensorId(x) {
    return backend.dataIdMap.get(x.dataId).id;
  }
  wasmSearchSorted(
    tensorId(sortedSequence),
    tensorId(values),
    /*batchSize=*/ sortedSequence.shape[0],
    /*sequenceSize=*/ sortedSequence.shape[1],
    /*valuesSize=*/ values.shape[1],
    /*dtype=*/ CppDType[sortedSequence.dtype],
    /*isSideLeft=*/ side === 'left',
    tensorId(out),
  );
  return out;
}
const searchSortedConfig = {
  kernelName: SearchSorted,
  backendName: 'wasm',
  setupFunc: setup$d,
  kernelFunc: searchSorted,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSelect;
function setup$c(backend) {
  wasmSelect = backend.wasm.cwrap('SelectV2', null, [
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function select(args) {
  const { inputs, backend } = args;
  const { condition, t, e } = inputs;
  const conditionId = backend.dataIdMap.get(condition.dataId).id;
  const tId = backend.dataIdMap.get(t.dataId).id;
  const eId = backend.dataIdMap.get(e.dataId).id;
  const out = backend.makeOutput(t.shape, t.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const cRank = condition.shape.length;
  const tRank = t.shape.length;
  const offset = cRank === 0 || cRank > 1 || tRank === 1 ? 1 : util.sizeFromShape(t.shape.slice(1));
  wasmSelect(conditionId, tId, eId, offset, outId);
  return out;
}
const selectConfig = {
  kernelName: Select,
  backendName: 'wasm',
  kernelFunc: select,
  setupFunc: setup$c,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const seluConfig = createUnaryKernelConfig(Selu);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmFunc;
function setup$b(backend) {
  wasmFunc = backend.wasm.cwrap(Sigmoid, null /* void */, ['number', 'number']);
}
function sigmoid(args) {
  const {
    backend,
    inputs: { x },
  } = args;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const out = backend.makeOutput(x.shape, x.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  // Short-circuit zero-sized tensors.
  if (util.sizeFromShape(out.shape) === 0) {
    return out;
  }
  wasmFunc(xId, outId);
  return out;
}
const sigmoidConfig = {
  kernelName: 'Sigmoid',
  backendName: 'wasm',
  setupFunc: setup$b,
  kernelFunc: sigmoid,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const signConfig = createUnaryKernelConfig(Sign);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const sinConfig = createUnaryKernelConfig(Sin);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const sinhConfig = createUnaryKernelConfig(Sinh);

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const softplusConfig = createUnaryKernelConfig(Softplus);

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function spaceToBatchND(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const { blockShape, paddings } = attrs;
  const prod = util.sizeFromShape(blockShape);
  const completePaddings = [[0, 0]];
  completePaddings.push(...paddings);
  for (let i = 1 + blockShape.length; i < x.shape.length; ++i) {
    completePaddings.push([0, 0]);
  }
  const paddedX = padV2Config.kernelFunc({
    inputs: { x },
    backend,
    attrs: { paddings: completePaddings, constantValue: 0 },
  });
  const reshapedPaddedShape = backend_util.getReshaped(paddedX.shape, blockShape, prod, false);
  const permutedReshapedPaddedPermutation = backend_util.getPermuted(reshapedPaddedShape.length, blockShape.length, false);
  const flattenShape = backend_util.getReshapedPermuted(paddedX.shape, blockShape, prod, false);
  const reshapeInputs = { x: paddedX };
  const reshapeAttrs = { shape: reshapedPaddedShape };
  const paddedXReshaped = reshape({ inputs: reshapeInputs, backend, attrs: reshapeAttrs });
  const transposeInputs = { x: paddedXReshaped };
  const transposeAttrs = { perm: permutedReshapedPaddedPermutation };
  const paddedXT = transpose({ inputs: transposeInputs, backend, attrs: transposeAttrs });
  const resultReshapeInputs = { x: paddedXT };
  const resultReshapeAttrs = { shape: flattenShape };
  const result = reshape({ inputs: resultReshapeInputs, backend, attrs: resultReshapeAttrs });
  backend.disposeData(paddedX.dataId);
  backend.disposeData(paddedXReshaped.dataId);
  backend.disposeData(paddedXT.dataId);
  return result;
}
const spaceToBatchNDConfig = {
  kernelName: SpaceToBatchND,
  backendName: 'wasm',
  kernelFunc: spaceToBatchND,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSparseFillEmptyRows;
function setup$a(backend) {
  wasmSparseFillEmptyRows = backend.wasm.cwrap('SparseFillEmptyRows', 'number', [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // exceptionValuesId
  ]);
}
function sparseFillEmptyRows(args) {
  const { backend, inputs } = args;
  const { indices, values, denseShape, defaultValue } = inputs;
  const indicesCount = indices.shape[0];
  const rank = indices.shape[1];
  const denseRows = backend.readSync(denseShape.dataId)[0];
  // Set output size to maximum possible and resize later (actual result
  // might be smaller).
  const maxOutputIndicesShape = [indicesCount + denseRows, rank];
  const indicesId = backend.dataIdMap.get(indices.dataId).id;
  const valuesId = backend.dataIdMap.get(values.dataId).id;
  const defaultValueId = backend.dataIdMap.get(defaultValue.dataId).id;
  const outputIndices = backend.makeOutput(maxOutputIndicesShape, indices.dtype);
  const outputIndicesId = backend.dataIdMap.get(outputIndices.dataId).id;
  const outputValues = backend.makeOutput(maxOutputIndicesShape.slice(0, 1), values.dtype);
  const outputValuesId = backend.dataIdMap.get(outputValues.dataId).id;
  const emptyRowIndicator = backend.makeOutput([denseRows], 'bool');
  const emptyRowIndicatorId = backend.dataIdMap.get(emptyRowIndicator.dataId).id;
  const reverseIndexMap = backend.makeOutput([indicesCount], indices.dtype);
  const reverseIndexMapId = backend.dataIdMap.get(reverseIndexMap.dataId).id;
  const exceptionValues = backend.makeOutput([4], 'int32');
  const exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
  const outputRows = wasmSparseFillEmptyRows(
    indicesId,
    valuesId,
    CppDType[values.dtype],
    indicesCount,
    denseRows,
    rank,
    defaultValueId,
    outputIndicesId,
    outputValuesId,
    emptyRowIndicatorId,
    reverseIndexMapId,
    exceptionValuesId,
  );
  const exceptionValuesArray = backend.readSync(exceptionValues.dataId);
  let exceptionMessage;
  switch (exceptionValuesArray[0]) {
    case 1: {
      exceptionMessage = backend_util.getSparseFillEmptyRowsIndicesDenseShapeMismatch(exceptionValuesArray[1]);
      break;
    }
    case 2: {
      exceptionMessage = backend_util.getSparseFillEmptyRowsNegativeIndexErrorMessage(exceptionValuesArray[1], exceptionValuesArray[2]);
      break;
    }
    case 3:
      exceptionMessage = backend_util.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(
        exceptionValuesArray[1],
        exceptionValuesArray[2],
        exceptionValuesArray[3],
      );
      break;
    default:
      exceptionMessage = '';
  }
  backend.disposeData(exceptionValues.dataId);
  if (exceptionMessage) {
    backend.disposeData(outputIndices.dataId);
    backend.disposeData(outputValues.dataId);
    backend.disposeData(emptyRowIndicator.dataId);
    backend.disposeData(reverseIndexMap.dataId);
    throw new Error(exceptionMessage);
  }
  let resizedIndices = outputIndices;
  let resizedValues = outputValues;
  // Overestimated output size.
  if (outputRows !== maxOutputIndicesShape[0]) {
    resizedIndices = slice({
      inputs: { x: outputIndices },
      attrs: { begin: 0, size: [outputRows, rank] },
      backend,
    });
    resizedValues = slice({
      inputs: { x: outputValues },
      attrs: { begin: 0, size: outputRows },
      backend,
    });
    backend.disposeData(outputIndices.dataId);
    backend.disposeData(outputValues.dataId);
  }
  return [resizedIndices, resizedValues, emptyRowIndicator, reverseIndexMap];
}
const sparseFillEmptyRowsConfig = {
  kernelName: SparseFillEmptyRows,
  backendName: 'wasm',
  setupFunc: setup$a,
  kernelFunc: sparseFillEmptyRows,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSparseReshape;
function setup$9(backend) {
  wasmSparseReshape = backend.wasm.cwrap(SparseReshape, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // exceptionValuesId
  ]);
}
function sparseReshape(args) {
  const { backend, inputs } = args;
  const { inputIndices, inputShape, newShape } = inputs;
  if (inputIndices.shape.length !== 2) {
    throw new Error(`Input indices should be a matrix but received shape
        ${inputIndices.shape}`);
  }
  if (inputShape.shape.length !== 1) {
    throw new Error(`Input shape should be a vector but received shape
        ${inputShape.shape}`);
  }
  if (newShape.shape.length !== 1) {
    throw new Error(`Target shape should be a vector but received shape ${newShape.shape}`);
  }
  const inputIndicesId = backend.dataIdMap.get(inputIndices.dataId).id;
  const inputShapeId = backend.dataIdMap.get(inputShape.dataId).id;
  const newShapeId = backend.dataIdMap.get(newShape.dataId).id;
  const nnz = inputIndices.shape[0];
  const outputRank = util.sizeFromShape(newShape.shape);
  const newIndices = backend.makeOutput([nnz, outputRank], inputIndices.dtype);
  const newIndicesId = backend.dataIdMap.get(newIndices.dataId).id;
  const outputShape = backend.makeOutput([outputRank], newShape.dtype);
  const outputShapeId = backend.dataIdMap.get(outputShape.dataId).id;
  const exceptionValues = backend.makeOutput([3], 'int32');
  const exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
  wasmSparseReshape(inputIndicesId, inputShapeId, newShapeId, nnz, newIndicesId, outputShapeId, exceptionValuesId);
  const exceptionValuesArray = backend.readSync(exceptionValues.dataId);
  let exceptionMessage;
  switch (exceptionValuesArray[0]) {
    case 0: {
      exceptionMessage = backend_util.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(
        exceptionValuesArray[1],
        exceptionValuesArray[2],
      );
      break;
    }
    case 1: {
      exceptionMessage = backend_util.getSparseReshapeNegativeOutputDimErrorMessage(exceptionValuesArray[1], exceptionValuesArray[2]);
      break;
    }
    case 2:
      exceptionMessage = backend_util.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage();
      break;
    case 3: {
      const inputShapeValues = Array.from(backend.readSync(inputShape.dataId)),
        outputShapeValues = Array.from(backend.readSync(outputShape.dataId));
      exceptionMessage = backend_util.getSparseReshapeInputOutputMultipleErrorMessage(inputShapeValues, outputShapeValues);
      break;
    }
    case 4: {
      const inputShapeValues = Array.from(backend.readSync(inputShape.dataId)),
        outputShapeValues = Array.from(backend.readSync(outputShape.dataId));
      exceptionMessage = backend_util.getSparseReshapeInputOutputMismatchErrorMessage(inputShapeValues, outputShapeValues);
      break;
    }
    default:
      exceptionMessage = '';
  }
  backend.disposeData(exceptionValues.dataId);
  if (exceptionMessage) {
    backend.disposeData(newIndices.dataId);
    backend.disposeData(outputShape.dataId);
    throw new Error(exceptionMessage);
  }
  return [newIndices, outputShape];
}
const sparseReshapeConfig = {
  kernelName: SparseReshape,
  backendName: 'wasm',
  setupFunc: setup$9,
  kernelFunc: sparseReshape,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSparseSegmentReduction;
function setup$8(backend) {
  wasmSparseSegmentReduction = backend.wasm.cwrap('SparseSegmentReduction', null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number', // defaultValue
  ]);
}
function sparseSegmentReduction(args, isMean) {
  const { backend, inputs } = args;
  const { data, indices, segmentIds } = inputs;
  const numIndices = indices.shape[0];
  const segmentIdsBack = backend.readSync(segmentIds.dataId, numIndices - 1, numIndices)[0];
  const lastSegmentIdPlusOne = numIndices > 0 ? segmentIdsBack + 1 : 0;
  const outputRows = lastSegmentIdPlusOne;
  if (outputRows < 0) {
    throw new Error(backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());
  }
  const outputShape = data.shape.slice();
  outputShape[0] = outputRows;
  const dataId = backend.dataIdMap.get(data.dataId).id;
  const indicesId = backend.dataIdMap.get(indices.dataId).id;
  const segmentIdsId = backend.dataIdMap.get(segmentIds.dataId).id;
  const output = backend.makeOutput(outputShape, data.dtype);
  const outputId = backend.dataIdMap.get(output.dataId).id;
  const exceptionValues = backend.makeOutput([4], 'int32');
  const exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
  wasmSparseSegmentReduction(dataId, CppDType[data.dtype], data.shape[0], indicesId, segmentIdsId, outputId, exceptionValuesId, isMean, 0);
  const exceptionValuesArray = backend.readSync(exceptionValues.dataId);
  let exceptionMessage;
  switch (exceptionValuesArray[0]) {
    case 0: {
      exceptionMessage = backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage();
      break;
    }
    case 1: {
      exceptionMessage = backend_util.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage();
      break;
    }
    case 2:
      exceptionMessage = backend_util.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(
        exceptionValuesArray[1],
        exceptionValuesArray[2],
      );
      break;
    case 3:
      exceptionMessage = backend_util.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(
        exceptionValuesArray[1],
        exceptionValuesArray[2],
        exceptionValuesArray[3],
      );
      break;
    default:
      exceptionMessage = '';
  }
  backend.disposeData(exceptionValues.dataId);
  if (exceptionMessage) {
    backend.disposeData(output.dataId);
    throw new Error(exceptionMessage);
  }
  return output;
}

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function sparseSegmentMean(args) {
  return sparseSegmentReduction(args, true);
}
const sparseSegmentMeanConfig = {
  kernelName: SparseSegmentMean,
  backendName: 'wasm',
  setupFunc: setup$8,
  kernelFunc: sparseSegmentMean,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function sparseSegmentSum(args) {
  return sparseSegmentReduction(args, false);
}
const sparseSegmentSumConfig = {
  kernelName: SparseSegmentSum,
  backendName: 'wasm',
  setupFunc: setup$8,
  kernelFunc: sparseSegmentSum,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSparseToDense;
function setup$7(backend) {
  wasmSparseToDense = backend.wasm.cwrap(SparseToDense, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'array',
    'number',
    'number', // outId
  ]);
}
function sparseToDense(args) {
  const { backend, inputs, attrs } = args;
  const { sparseIndices, sparseValues, defaultValue } = inputs;
  const { outputShape } = attrs;
  const out = backend.makeOutput(outputShape, defaultValue.dtype);
  if (util.sizeFromShape(outputShape) === 0) {
    return out;
  }
  const { sliceRank, numUpdates, sliceSize, strides, outputSize } = backend_util.calculateShapes(sparseValues, sparseIndices, outputShape);
  const sparseIndicesId = backend.dataIdMap.get(sparseIndices.dataId).id;
  const sparseValuesId = backend.dataIdMap.get(sparseValues.dataId).id;
  const defaultValueId = backend.dataIdMap.get(defaultValue.dataId).id;
  const stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmSparseToDense(
    sparseIndicesId,
    sparseValuesId,
    sparseValues.shape.length,
    defaultValueId,
    CppDType[defaultValue.dtype],
    sliceRank,
    numUpdates,
    sliceSize,
    stridesBytes,
    outputSize,
    outId,
  );
  return out;
}
const sparseToDenseConfig = {
  kernelName: SparseToDense,
  backendName: 'wasm',
  setupFunc: setup$7,
  kernelFunc: sparseToDense,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function splitV(args) {
  const { inputs, attrs, backend } = args;
  const { x } = inputs;
  const { numOrSizeSplits, axis } = attrs;
  const $axis = util.parseAxisParam(axis, x.shape)[0];
  const splitSizes = backend_util.prepareSplitSize(x, numOrSizeSplits, $axis);
  const begin = new Array(x.shape.length).fill(0);
  const size = x.shape.slice();
  return splitSizes.map(s => {
    const xSliceSize = [...size];
    xSliceSize[$axis] = s;
    const xSlice = slice({ inputs: { x }, attrs: { begin, size: xSliceSize }, backend });
    begin[$axis] += s;
    return xSlice;
  });
}
const splitVConfig = {
  kernelName: SplitV,
  backendName: 'wasm',
  kernelFunc: splitV,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const sqrtConfig = createUnaryKernelConfig(Sqrt);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const squareConfig = createUnaryKernelConfig(Square);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const squaredDifferenceConfig = createBinaryKernelConfig(SquaredDifference);

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmStep;
function setup$6(backend) {
  wasmStep = backend.wasm.cwrap(Step, null /*void*/, [
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function step(args) {
  const { backend, inputs, attrs } = args;
  const { alpha } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const out = backend.makeOutput(x.shape, x.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmStep(xId, alpha, CppDType[x.dtype], outId);
  return out;
}
const stepConfig = {
  kernelName: Step,
  backendName: 'wasm',
  setupFunc: setup$6,
  kernelFunc: step,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmStridedSlice;
function setup$5(backend) {
  wasmStridedSlice = backend.wasm.cwrap(StridedSlice, null /*void*/, [
    'number',
    'array',
    'number',
    'array',
    'array',
    'array',
    'array',
    'array',
    'number',
    'number', // outId
  ]);
}
function stridedSlice(args) {
  const { backend, inputs, attrs } = args;
  const { x } = inputs;
  const { begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask } = attrs;
  const {
    finalShapeSparse,
    finalShape,
    isIdentity,
    sliceDim0,
    isSimpleSlice,
    begin: $begin,
    end: $end,
    strides: $strides,
  } = slice_util.sliceInfo(x.shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask);
  let result;
  if (isIdentity) {
    // Optimization #1, slice is a no-op plus reshape
    result = reshape({ inputs: { x }, backend, attrs: { shape: finalShape } });
  } else if (sliceDim0 || isSimpleSlice) {
    // Optimization #2, slice is memory contiguous (only occurs in dim 0)
    util.assert(x.shape.length >= 1, () => `Input must have rank at least 1, got: ${x.shape.length}`);
    const size = slice_util.computeOutShape($begin, $end, $strides);
    // To tolerate begin[0] > end[0] (a 0-output slice), we min(begin, end).
    const sliced = slice({ inputs: { x }, backend, attrs: { begin: $begin, size } });
    result = reshape({ inputs: { x: sliced }, backend, attrs: { shape: finalShape } });
    backend.disposeData(sliced.dataId);
  } else {
    const out = backend.makeOutput(finalShapeSparse, 'float32');
    const xId = backend.dataIdMap.get(x.dataId).id;
    const xStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(x.shape)).buffer);
    const beginBytes = new Uint8Array(new Int32Array($begin).buffer);
    const endBytes = new Uint8Array(new Int32Array($end).buffer);
    const stridesBytes = new Uint8Array(new Int32Array($strides).buffer);
    const outputShapeBytes = new Uint8Array(new Int32Array(finalShapeSparse).buffer);
    const outStridesBytes = new Uint8Array(new Int32Array(util.computeStrides(finalShapeSparse)).buffer);
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmStridedSlice(
      xId,
      xStridesBytes,
      x.shape.length,
      beginBytes,
      endBytes,
      stridesBytes,
      outputShapeBytes,
      outStridesBytes,
      finalShapeSparse.length,
      outId,
    );
    result = reshape({ inputs: { x: out }, backend, attrs: { shape: finalShape } });
    backend.disposeData(out.dataId);
  }
  return result;
}
const stridedSliceConfig = {
  kernelName: StridedSlice,
  backendName: 'wasm',
  setupFunc: setup$5,
  kernelFunc: stridedSlice,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stringNGrams(args) {
  const { backend, inputs, attrs } = args;
  const { data, dataSplits } = inputs;
  const { separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences } = attrs;
  const $data = backend.readSync(data.dataId);
  const $dataSplits = backend.readSync(dataSplits.dataId);
  const [nGrams, nGramsSplits] = stringNGramsImpl(
    $data,
    $dataSplits,
    separator,
    nGramWidths,
    leftPad,
    rightPad,
    padWidth,
    preserveShortSequences,
  );
  const nGramsOut = backend.makeOutput([nGrams.length], 'string');
  const nGramsOutData = backend.dataIdMap.get(nGramsOut.dataId);
  nGramsOutData.stringBytes = nGrams;
  const nGramsSplitsOut = backend.makeOutput(dataSplits.shape, 'int32');
  const nGramsSplitsOutVals = backend.typedArrayFromHeap(nGramsSplitsOut);
  nGramsSplitsOutVals.set(nGramsSplits);
  return [nGramsOut, nGramsSplitsOut];
}
const stringNGramsConfig = {
  kernelName: StringNGrams,
  backendName: 'wasm',
  kernelFunc: stringNGrams,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stringSplit(args) {
  const { backend, inputs, attrs } = args;
  const { input, delimiter } = inputs;
  const { skipEmpty } = attrs;
  const inputVals = backend.readSync(input.dataId);
  const delimiterVals = backend.readSync(delimiter.dataId);
  const [indices, values, shape] = stringSplitImpl(inputVals, delimiterVals[0], skipEmpty);
  const outputSize = values.length;
  const indicesOut = backend.makeOutput([outputSize, 2], 'int32');
  const indicesOutVals = backend.typedArrayFromHeap(indicesOut);
  indicesOutVals.set(indices);
  const valuesOut = backend.makeOutput([outputSize], 'string');
  const valuesOutData = backend.dataIdMap.get(valuesOut.dataId);
  valuesOutData.stringBytes = values;
  const shapeOut = backend.makeOutput([2], 'int32');
  const shapeOutVals = backend.typedArrayFromHeap(shapeOut);
  shapeOutVals.set(shape);
  return [indicesOut, valuesOut, shapeOut];
}
const stringSplitConfig = {
  kernelName: StringSplit,
  backendName: 'wasm',
  kernelFunc: stringSplit,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function stringToHashBucketFast(args) {
  const { backend, inputs, attrs } = args;
  const { input } = inputs;
  const { numBuckets } = attrs;
  const inputVals = backend.readSync(input.dataId);
  const values = stringToHashBucketFastImpl(inputVals, numBuckets);
  const out = backend.makeOutput(input.shape, 'int32');
  const outVals = backend.typedArrayFromHeap(out);
  outVals.set(values);
  return out;
}
const stringToHashBucketFastConfig = {
  kernelName: StringToHashBucketFast,
  backendName: 'wasm',
  kernelFunc: stringToHashBucketFast,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const subConfig = createBinaryKernelConfig(Sub);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmSum;
function setup$4(backend) {
  wasmSum = backend.wasm.cwrap(Sum, null /*void*/, [
    'number',
    'number',
    'number',
    'number', // out_id
  ]);
}
function sum(args) {
  const { backend, inputs, attrs } = args;
  const { axis, keepDims } = attrs;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  let inputId = xId;
  let input = x;
  const { transposed, axes, originalAxes, inputWasTransposed } = permuteAxesAndTranspose(x, axis, backend);
  let reductionAxes = axes;
  if (inputWasTransposed) {
    const transposedId = backend.dataIdMap.get(transposed.dataId).id;
    if (transposedId !== xId) {
      // transpose was not a no-op. We will need to dispose of this
      // once we are done.
      input = transposed;
      inputId = transposedId;
      reductionAxes = backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
    }
  }
  backend_util.assertAxesAreInnerMostDims('sum', reductionAxes, input.shape.length);
  const [outShape, reduceShape] = backend_util.computeOutAndReduceShapes(input.shape, reductionAxes);
  const reduceSize = util.sizeFromShape(reduceShape);
  const out = backend.makeOutput(outShape, input.dtype);
  if (util.sizeFromShape(input.shape) !== 0) {
    const outId = backend.dataIdMap.get(out.dataId).id;
    wasmSum(inputId, reduceSize, CppDType[out.dtype], outId);
  }
  if (inputWasTransposed) {
    // dispose of the transposed tensor.
    backend.disposeData(transposed.dataId);
  }
  if (keepDims) {
    // reshape
    const newShape = backend_util.expandShapeToKeepDim(out.shape, originalAxes);
    out.shape = newShape;
  }
  return out;
}
const sumConfig = {
  kernelName: Sum,
  backendName: 'wasm',
  setupFunc: setup$4,
  kernelFunc: sum,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const tanConfig = createUnaryKernelConfig(Tan);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const tanhConfig = createUnaryKernelConfig(Tanh);

/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmTensorScatterUpdate;
function setup$3(backend) {
  wasmTensorScatterUpdate = backend.wasm.cwrap(TensorScatterUpdate, null /*void*/, [
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'array',
    'number',
    'number',
    'number', // tensorId
  ]);
}
function tensorScatterUpdate(args) {
  const { backend, inputs, attrs } = args;
  const { tensor, indices, updates } = inputs;
  const out = backend.makeOutput(tensor.shape, tensor.dtype);
  if (util.sizeFromShape(tensor.shape) === 0) {
    return out;
  }
  const { sliceRank, numUpdates, sliceSize, strides, outputSize } = scatter_util.calculateShapes(updates, indices, tensor.shape);
  const indicesData = backend.dataIdMap.get(indices.dataId);
  const indicesId = indicesData.id;
  const updatesData = backend.dataIdMap.get(updates.dataId);
  const updatesId = updatesData.id;
  const tensorData = backend.dataIdMap.get(tensor.dataId);
  const tensorId = tensorData.id;
  const stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmTensorScatterUpdate(
    indicesId,
    updatesId,
    CppDType[updates.dtype],
    sliceRank,
    numUpdates,
    sliceSize,
    stridesBytes,
    outputSize,
    outId,
    tensorId,
  );
  return out;
}
const tensorScatterUpdateConfig = {
  kernelName: TensorScatterUpdate,
  backendName: 'wasm',
  setupFunc: setup$3,
  kernelFunc: tensorScatterUpdate,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmTile;
function setup$2(backend) {
  wasmTile = backend.wasm.cwrap(Tile, null /* void */, [
    'number',
    'array',
    'number',
    'array',
    'number',
    'number', // out_id
  ]);
}
function tile(args) {
  const { inputs, backend, attrs } = args;
  const { x } = inputs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const { reps } = attrs;
  const newShape = new Array(x.shape.length);
  for (let i = 0; i < newShape.length; i++) {
    newShape[i] = x.shape[i] * reps[i];
  }
  const xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
  const newShapeBytes = new Uint8Array(new Int32Array(newShape).buffer);
  const out = backend.makeOutput(newShape, x.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  wasmTile(xId, xShapeBytes, x.shape.length, newShapeBytes, newShape.length, CppDType[out.dtype], outId);
  return out;
}
const tileConfig = {
  kernelName: Tile,
  backendName: 'wasm',
  setupFunc: setup$2,
  kernelFunc: tile,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmTopK;
function setup$1(backend) {
  wasmTopK = backend.wasm.cwrap(TopK, null /* void */, [
    'number',
    'array',
    'number',
    'number',
    'number',
    'bool',
    'number',
    'number', // outIndicesId
  ]);
}
const topk = ({ inputs, backend, attrs }) => {
  const { x } = inputs;
  const { k, sorted } = attrs;
  const xId = backend.dataIdMap.get(x.dataId).id;
  const xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
  const outputShape = x.shape.slice();
  outputShape[outputShape.length - 1] = k;
  const outValues = backend.makeOutput(outputShape, x.dtype);
  const outValuesId = backend.dataIdMap.get(outValues.dataId).id;
  const outIndices = backend.makeOutput(outputShape, 'int32');
  const outIndicesId = backend.dataIdMap.get(outIndices.dataId).id;
  wasmTopK(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], k, sorted, outValuesId, outIndicesId);
  return [outValues, outIndices];
};
const topKConfig = {
  kernelName: TopK,
  backendName: 'wasm',
  setupFunc: setup$1,
  kernelFunc: topk,
};

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
let wasmTransform;
function setup(backend) {
  wasmTransform = backend.wasm.cwrap(Transform, null /*void*/, [
    'number',
    'number',
    'bool',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'array',
    'number',
    'array',
    'number',
    'number',
    'number',
    'number',
    'number', // outId
  ]);
}
function transform(args) {
  const { backend, inputs, attrs } = args;
  const { image, transforms } = inputs;
  const { interpolation, fillMode, fillValue, outputShape } = attrs;
  const [batch, imageHeight, imageWidth, numChannels] = image.shape;
  const [outHeight, outWidth] = outputShape != null ? outputShape : [imageHeight, imageWidth];
  const outShape = [batch, outHeight, outWidth, numChannels];
  const inputStrides = new Uint8Array(new Int32Array(util.computeStrides(image.shape)).buffer);
  const outputStrides = new Uint8Array(new Int32Array(util.computeStrides(outShape)).buffer);
  const out = backend.makeOutput(outShape, image.dtype);
  const outId = backend.dataIdMap.get(out.dataId).id;
  const imageData = backend.dataIdMap.get(image.dataId);
  const imageId = imageData.id;
  const transformsData = backend.dataIdMap.get(transforms.dataId);
  const transformsId = transformsData.id;
  const interpolationModeId = interpolation === 'nearest' ? 1 : 2;
  let fillModeId;
  switch (fillMode) {
    case 'constant':
      fillModeId = 1;
      break;
    case 'reflect':
      fillModeId = 2;
      break;
    case 'wrap':
      fillModeId = 3;
      break;
    case 'nearest':
      fillModeId = 4;
      break;
    default:
      fillModeId = 1;
      break;
  }
  wasmTransform(
    imageId,
    transformsId,
    transforms.shape[0] > 1,
    batch,
    outHeight,
    outWidth,
    numChannels,
    imageWidth,
    imageHeight,
    inputStrides,
    image.shape.length - 1,
    outputStrides,
    outShape.length - 1,
    interpolationModeId,
    fillModeId,
    fillValue,
    outId,
  );
  return out;
}
const transformConfig = {
  kernelName: Transform,
  backendName: 'wasm',
  setupFunc: setup,
  kernelFunc: transform,
};

/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function unique(args) {
  const { inputs, attrs, backend } = args;
  const { axis } = attrs;
  const { x } = inputs;
  const { outputValues, outputShape, indices } = uniqueImpl(backend.readSync(x.dataId), axis, x.shape, x.dtype);
  return [
    backend.makeOutput(outputShape, x.dtype, /*memoryOffset=*/ undefined, outputValues),
    backend.makeOutput([indices.length], 'int32', /*memoryOffset=*/ undefined, indices),
  ];
}
const uniqueConfig = {
  kernelName: Unique,
  backendName: 'wasm',
  kernelFunc: unique,
};

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function unpack(args) {
  const { inputs, backend, attrs } = args;
  const { value } = inputs;
  let { axis } = attrs;
  if (axis < 0) {
    axis += value.shape.length;
  }
  const numOutputs = value.shape[axis];
  const rank = value.shape.length;
  const outShape = new Array(rank - 1);
  let outIndex = 0;
  for (let i = 0; i < rank; i++) {
    if (i !== axis) {
      outShape[outIndex++] = value.shape[i];
    }
  }
  const outs = new Array(numOutputs);
  const begin = new Array(rank).fill(0);
  const size = value.shape.slice();
  size[axis] = 1;
  for (let i = 0; i < outs.length; i++) {
    begin[axis] = i;
    outs[i] = slice({ inputs: { x: value }, attrs: { begin, size }, backend });
  }
  return outs.map(({ dataId, dtype }) => ({ dataId, dtype, shape: outShape }));
}
const unpackConfig = {
  kernelName: Unpack,
  backendName: 'wasm',
  kernelFunc: unpack,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
function zerosLike(args) {
  const {
    inputs: { x },
    backend,
  } = args;
  const out = backend.makeOutput(x.shape, x.dtype);
  const outVals = backend.typedArrayFromHeap(out);
  outVals.fill(0);
  return out;
}
const zerosLikeConfig = {
  kernelName: ZerosLike,
  backendName: 'wasm',
  kernelFunc: zerosLike,
};

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// List all kernel configs here
const kernelConfigs = [
  _fusedMatMulConfig,
  absConfig,
  acosConfig,
  acoshConfig,
  addConfig,
  addNConfig,
  allConfig,
  anyConfig,
  argMaxConfig,
  argMinConfig,
  asinConfig,
  asinhConfig,
  atanConfig,
  atan2Config,
  atanhConfig,
  avgPoolConfig,
  avgPoolGradConfig,
  avgPool3DConfig,
  avgPool3DGradConfig,
  batchMatMulConfig,
  batchToSpaceNDConfig,
  bincountConfig,
  bitwiseAndConfig,
  broadcastArgsConfig,
  castConfig,
  ceilConfig,
  clipByValueConfig,
  concatConfig,
  conv2DConfig,
  conv2DBackpropInputConfig,
  conv3DConfig,
  conv3DBackpropFilterV2Config,
  conv3DBackpropInputV2Config,
  cosConfig,
  coshConfig,
  cropAndResizeConfig,
  cumprodConfig,
  cumsumConfig,
  denseBincountConfig,
  depthToSpaceConfig,
  depthwiseConv2dNativeConfig,
  diagConfig,
  dilation2DConfig,
  dilation2DBackpropFilterConfig,
  dilation2DBackpropInputConfig,
  eluConfig,
  eluGradConfig,
  equalConfig,
  erfConfig,
  expConfig,
  expandDimsConfig,
  expm1Config,
  fillConfig,
  flipLeftRightConfig,
  floorConfig,
  floorDivConfig,
  fusedBatchNormConfig,
  fusedConv2DConfig,
  fusedDepthwiseConv2DConfig,
  gatherNdConfig,
  gatherV2Config,
  greaterConfig,
  greaterEqualConfig,
  identityConfig,
  isFiniteConfig,
  isInfConfig,
  isNaNConfig,
  leakyReluConfig,
  lessConfig,
  lessEqualConfig,
  linSpaceConfig,
  log1pConfig,
  logConfig,
  logicalAndConfig,
  logicalNotConfig,
  logicalOrConfig,
  logicalXorConfig,
  lrnConfig,
  lrnGradConfig,
  maxConfig,
  maximumConfig,
  maxPoolConfig,
  maxPool3DConfig,
  maxPool3DGradConfig,
  maxPoolGradConfig,
  maxPoolWithArgmaxConfig,
  meanConfig,
  minConfig,
  minimumConfig,
  mirrorPadConfig,
  multinomialConfig,
  modConfig,
  multiplyConfig,
  negConfig,
  nonMaxSuppressionV3Config,
  nonMaxSuppressionV4Config,
  nonMaxSuppressionV5Config,
  notEqualConfig,
  oneHotConfig,
  onesLikeConfig,
  packConfig,
  padV2Config,
  powConfig,
  preluConfig,
  prodConfig,
  rangeConfig,
  realDivConfig,
  reciprocalConfig,
  reluConfig,
  relu6Config,
  reshapeConfig,
  resizeBilinearConfig,
  resizeBilinearGradConfig,
  resizeNearestNeighborConfig,
  resizeNearestNeighborGradConfig,
  reverseConfig,
  rotateWithOffsetConfig,
  roundConfig,
  rsqrtConfig,
  scatterNdConfig,
  searchSortedConfig,
  selectConfig,
  seluConfig,
  sigmoidConfig,
  signConfig,
  sinConfig,
  sinhConfig,
  sliceConfig,
  softmaxConfig,
  softplusConfig,
  spaceToBatchNDConfig,
  sparseFillEmptyRowsConfig,
  sparseReshapeConfig,
  sparseSegmentMeanConfig,
  sparseSegmentSumConfig,
  sparseToDenseConfig,
  splitVConfig,
  sqrtConfig,
  squareConfig,
  squaredDifferenceConfig,
  stepConfig,
  stridedSliceConfig,
  stringNGramsConfig,
  stringSplitConfig,
  stringToHashBucketFastConfig,
  subConfig,
  sumConfig,
  tanConfig,
  tanhConfig,
  tensorScatterUpdateConfig,
  tileConfig,
  topKConfig,
  transformConfig,
  transposeConfig,
  uniqueConfig,
  unpackConfig,
  zerosLikeConfig,
];
for (const kernelConfig of kernelConfigs) {
  registerKernel(kernelConfig);
}

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const ENV = env();
/**
 * True if SIMD is supported.
 */
// From: https://github.com/GoogleChromeLabs/wasm-feature-detect
ENV.registerFlag('WASM_HAS_SIMD_SUPPORT', async () => {
  try {
    // This typed array passed in to WebAssembly.validate is WebAssembly binary
    // code. In this case it is a small program that contains SIMD
    // instructions.
    return WebAssembly.validate(
      new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11]),
    );
  } catch (e) {
    return false;
  }
});
/**
 * True if threads are supported.
 */
// From: https://github.com/GoogleChromeLabs/wasm-feature-detect
ENV.registerFlag('WASM_HAS_MULTITHREAD_SUPPORT', async () => {
  // TODO(annxingyuan): Enable node support once this is resolved:
  // https://github.com/tensorflow/tfjs/issues/3830
  if (ENV.get('IS_NODE')) {
    return false;
  }
  try {
    // Test for transferability of SABs (needed for Firefox)
    // https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ
    new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
    // This typed array is a WebAssembly program containing threaded
    // instructions.
    return WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11,
      ]),
    );
  } catch (e) {
    return false;
  }
});

var commonjsGlobal =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
    ? self
    : {};

function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var tfjsBackendWasmThreadedSimd$1 = { exports: {} };

(function (module, exports) {
  var WasmBackendModuleThreadedSimd = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return function (WasmBackendModuleThreadedSimd) {
      WasmBackendModuleThreadedSimd = WasmBackendModuleThreadedSimd || {};

      function GROWABLE_HEAP_I8() {
        if (wasmMemory.buffer != buffer) {
          updateGlobalBufferAndViews(wasmMemory.buffer);
        }
        return HEAP8;
      }
      function GROWABLE_HEAP_U8() {
        if (wasmMemory.buffer != buffer) {
          updateGlobalBufferAndViews(wasmMemory.buffer);
        }
        return HEAPU8;
      }
      function GROWABLE_HEAP_I32() {
        if (wasmMemory.buffer != buffer) {
          updateGlobalBufferAndViews(wasmMemory.buffer);
        }
        return HEAP32;
      }
      function GROWABLE_HEAP_U32() {
        if (wasmMemory.buffer != buffer) {
          updateGlobalBufferAndViews(wasmMemory.buffer);
        }
        return HEAPU32;
      }
      function GROWABLE_HEAP_F64() {
        if (wasmMemory.buffer != buffer) {
          updateGlobalBufferAndViews(wasmMemory.buffer);
        }
        return HEAPF64;
      }
      var Module = typeof WasmBackendModuleThreadedSimd != 'undefined' ? WasmBackendModuleThreadedSimd : {};
      var readyPromiseResolve, readyPromiseReject;
      Module['ready'] = new Promise(function (resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      var beforeListeners;
      if (typeof process !== 'undefined' && process.listeners) {
        beforeListeners = {
          uncaughtException: process.listeners('uncaughtException'),
          unhandledRejection: process.listeners('unhandledRejection'),
        };
      }
      var moduleOverrides = Object.assign({}, Module);
      var quit_ = (status, toThrow) => {
        throw toThrow;
      };
      var ENVIRONMENT_IS_WEB = typeof window == 'object';
      var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
      var ENVIRONMENT_IS_NODE =
        typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
      var ENVIRONMENT_IS_PTHREAD = Module['ENVIRONMENT_IS_PTHREAD'] || false;
      var scriptDirectory = '';
      function locateFile(path) {
        if (Module['locateFile']) {
          return Module['locateFile'](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }
      var read_, readAsync, readBinary;
      function logExceptionOnExit(e) {
        if (e instanceof ExitStatus) return;
        let toLog = e;
        err('exiting due to exception: ' + toLog);
      }
      if (ENVIRONMENT_IS_NODE) {
        var fs = require$$0;
        var nodePath = require$$1;
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = nodePath.dirname(scriptDirectory) + '/';
        } else {
          scriptDirectory = __dirname + '/';
        }
        read_ = (filename, binary) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
          return fs.readFileSync(filename, binary ? undefined : 'utf8');
        };
        readBinary = filename => {
          var ret = read_(filename, true);
          if (!ret.buffer) {
            ret = new Uint8Array(ret);
          }
          return ret;
        };
        readAsync = (filename, onload, onerror) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
          fs.readFile(filename, function (err, data) {
            if (err) onerror(err);
            else onload(data.buffer);
          });
        };
        if (process['argv'].length > 1) {
          process['argv'][1].replace(/\\/g, '/');
        }
        process['argv'].slice(2);
        process['on']('uncaughtException', function (ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex;
          }
        });
        process['on']('unhandledRejection', function (reason) {
          throw reason;
        });
        quit_ = (status, toThrow) => {
          if (keepRuntimeAlive()) {
            process['exitCode'] = status;
            throw toThrow;
          }
          logExceptionOnExit(toThrow);
          process['exit'](status);
        };
        Module['inspect'] = function () {
          return '[Emscripten Module object]';
        };
        let nodeWorkerThreads;
        try {
          nodeWorkerThreads = require('worker_threads');
        } catch (e) {
          console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?');
          throw e;
        }
        commonjsGlobal.Worker = nodeWorkerThreads.Worker;
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href;
        } else if (typeof document != 'undefined' && document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }
        if (typeof _scriptDir !== 'undefined' && _scriptDir) {
          scriptDirectory = _scriptDir;
        }
        if (scriptDirectory.indexOf('blob:') !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1);
        } else {
          scriptDirectory = '';
        }
        if (!ENVIRONMENT_IS_NODE) {
          read_ = url => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return xhr.responseText;
          };
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = url => {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.responseType = 'arraybuffer';
              xhr.send(null);
              return new Uint8Array(xhr.response);
            };
          }
          readAsync = (url, onload, onerror) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = () => {
              if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                onload(xhr.response);
                return;
              }
              onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
          };
        }
      } else;
      if (ENVIRONMENT_IS_NODE) {
        if (typeof performance == 'undefined') {
          commonjsGlobal.performance = require$$3.performance;
        }
      }
      var defaultPrint = console.log.bind(console);
      var defaultPrintErr = console.warn.bind(console);
      if (ENVIRONMENT_IS_NODE) {
        defaultPrint = str => fs.writeSync(1, str + '\n');
        defaultPrintErr = str => fs.writeSync(2, str + '\n');
      }
      var out = Module['print'] || defaultPrint;
      var err = Module['printErr'] || defaultPrintErr;
      Object.assign(Module, moduleOverrides);
      moduleOverrides = null;
      if (Module['arguments']) Module['arguments'];
      if (Module['thisProgram']) Module['thisProgram'];
      if (Module['quit']) quit_ = Module['quit'];
      var wasmBinary;
      if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
      var noExitRuntime = Module['noExitRuntime'] || true;
      if (typeof WebAssembly != 'object') {
        abort('no native wasm support detected');
      }
      var wasmMemory;
      var wasmModule;
      var ABORT = false;
      var EXITSTATUS;
      function assert(condition, text) {
        if (!condition) {
          abort(text);
        }
      }
      var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
      function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
        idx >>>= 0;
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(
            heapOrArray.buffer instanceof SharedArrayBuffer ? heapOrArray.slice(idx, endPtr) : heapOrArray.subarray(idx, endPtr),
          );
        }
        var str = '';
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
          } else {
            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
          }
        }
        return str;
      }
      function UTF8ToString(ptr, maxBytesToRead) {
        ptr >>>= 0;
        return ptr ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead) : '';
      }
      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        outIdx >>>= 0;
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
          }
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++ >>> 0] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++ >>> 0] = 192 | (u >> 6);
            heap[outIdx++ >>> 0] = 128 | (u & 63);
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++ >>> 0] = 224 | (u >> 12);
            heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
            heap[outIdx++ >>> 0] = 128 | (u & 63);
          } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++ >>> 0] = 240 | (u >> 18);
            heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
            heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
            heap[outIdx++ >>> 0] = 128 | (u & 63);
          }
        }
        heap[outIdx >>> 0] = 0;
        return outIdx - startIdx;
      }
      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, GROWABLE_HEAP_U8(), outPtr, maxBytesToWrite);
      }
      var buffer, HEAP8, HEAPU8, HEAP32, HEAPU32, HEAPF64;
      if (ENVIRONMENT_IS_PTHREAD) {
        buffer = Module['buffer'];
      }
      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module['HEAP8'] = HEAP8 = new Int8Array(buf);
        Module['HEAP16'] = new Int16Array(buf);
        Module['HEAP32'] = HEAP32 = new Int32Array(buf);
        Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
        Module['HEAPU16'] = new Uint16Array(buf);
        Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
        Module['HEAPF32'] = new Float32Array(buf);
        Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
      }
      var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;
      if (ENVIRONMENT_IS_PTHREAD) {
        wasmMemory = Module['wasmMemory'];
        buffer = Module['buffer'];
      } else {
        if (Module['wasmMemory']) {
          wasmMemory = Module['wasmMemory'];
        } else {
          wasmMemory = new WebAssembly.Memory({ initial: INITIAL_MEMORY / 65536, maximum: 4294967296 / 65536, shared: true });
          if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
            err(
              'requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag',
            );
            if (ENVIRONMENT_IS_NODE) {
              err('(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)');
            }
            throw Error('bad memory');
          }
        }
      }
      if (wasmMemory) {
        buffer = wasmMemory.buffer;
      }
      INITIAL_MEMORY = buffer.byteLength;
      updateGlobalBufferAndViews(buffer);
      var wasmTable;
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATPOSTRUN__ = [];
      function keepRuntimeAlive() {
        return noExitRuntime;
      }
      function preRun() {
        if (Module['preRun']) {
          if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
          while (Module['preRun'].length) {
            addOnPreRun(Module['preRun'].shift());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function initRuntime() {
        if (ENVIRONMENT_IS_PTHREAD) return;
        callRuntimeCallbacks(__ATINIT__);
      }
      function postRun() {
        if (ENVIRONMENT_IS_PTHREAD) return;
        if (Module['postRun']) {
          if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
          while (Module['postRun'].length) {
            addOnPostRun(Module['postRun'].shift());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }
      function addOnInit(cb) {
        __ATINIT__.unshift(cb);
      }
      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }
      var runDependencies = 0;
      var dependenciesFulfilled = null;
      function addRunDependency(id) {
        runDependencies++;
        if (Module['monitorRunDependencies']) {
          Module['monitorRunDependencies'](runDependencies);
        }
      }
      function removeRunDependency(id) {
        runDependencies--;
        if (Module['monitorRunDependencies']) {
          Module['monitorRunDependencies'](runDependencies);
        }
        if (runDependencies == 0) {
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      function abort(what) {
        if (Module['onAbort']) {
          Module['onAbort'](what);
        }
        what = 'Aborted(' + what + ')';
        err(what);
        ABORT = true;
        EXITSTATUS = 1;
        what += '. Build with -sASSERTIONS for more info.';
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }
      var dataURIPrefix = 'data:application/octet-stream;base64,';
      function isDataURI(filename) {
        return filename.startsWith(dataURIPrefix);
      }
      function isFileURI(filename) {
        return filename.startsWith('file://');
      }
      var wasmBinaryFile;
      wasmBinaryFile = 'tfjs-backend-wasm-threaded-simd.wasm';
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }
      function getBinary(file) {
        try {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw 'both async and sync fetching of the wasm failed';
        } catch (err) {
          abort(err);
        }
      }
      function getBinaryPromise() {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if (typeof fetch == 'function' && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' })
              .then(function (response) {
                if (!response['ok']) {
                  throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                }
                return response['arrayBuffer']();
              })
              .catch(function () {
                return getBinary(wasmBinaryFile);
              });
          } else {
            if (readAsync) {
              return new Promise(function (resolve, reject) {
                readAsync(
                  wasmBinaryFile,
                  function (response) {
                    resolve(new Uint8Array(response));
                  },
                  reject,
                );
              });
            }
          }
        }
        return Promise.resolve().then(function () {
          return getBinary(wasmBinaryFile);
        });
      }
      function createWasm() {
        var info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg };
        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module['asm'] = exports;
          registerTLSInit(Module['asm']['_emscripten_tls_init']);
          wasmTable = Module['asm']['__indirect_function_table'];
          addOnInit(Module['asm']['__wasm_call_ctors']);
          wasmModule = module;
          if (!ENVIRONMENT_IS_PTHREAD) {
            var numWorkersToLoad = PThread.unusedWorkers.length;
            PThread.unusedWorkers.forEach(function (w) {
              PThread.loadWasmModuleToWorker(w, function () {
                if (!--numWorkersToLoad) removeRunDependency();
              });
            });
          }
        }
        if (!ENVIRONMENT_IS_PTHREAD) {
          addRunDependency();
        }
        function receiveInstantiationResult(result) {
          receiveInstance(result['instance'], result['module']);
        }
        function instantiateArrayBuffer(receiver) {
          return getBinaryPromise()
            .then(function (binary) {
              return WebAssembly.instantiate(binary, info);
            })
            .then(function (instance) {
              return instance;
            })
            .then(receiver, function (reason) {
              err('failed to asynchronously prepare wasm: ' + reason);
              abort(reason);
            });
        }
        function instantiateAsync() {
          if (
            !wasmBinary &&
            typeof WebAssembly.instantiateStreaming == 'function' &&
            !isDataURI(wasmBinaryFile) &&
            !isFileURI(wasmBinaryFile) &&
            !ENVIRONMENT_IS_NODE &&
            typeof fetch == 'function'
          ) {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function (reason) {
                err('wasm streaming compile failed: ' + reason);
                err('falling back to ArrayBuffer instantiation');
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            });
          } else {
            return instantiateArrayBuffer(receiveInstantiationResult);
          }
        }
        if (Module['instantiateWasm']) {
          try {
            var exports = Module['instantiateWasm'](info, receiveInstance);
            return exports;
          } catch (e) {
            err('Module.instantiateWasm callback failed with error: ' + e);
            readyPromiseReject(e);
          }
        }
        instantiateAsync().catch(readyPromiseReject);
        return {};
      }
      var ASM_CONSTS = {};
      function ExitStatus(status) {
        this.name = 'ExitStatus';
        this.message = 'Program terminated with exit(' + status + ')';
        this.status = status;
      }
      function killThread(pthread_ptr) {
        var worker = PThread.pthreads[pthread_ptr];
        delete PThread.pthreads[pthread_ptr];
        worker.terminate();
        __emscripten_thread_free_data(pthread_ptr);
        PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
        worker.pthread_ptr = 0;
      }
      function cancelThread(pthread_ptr) {
        var worker = PThread.pthreads[pthread_ptr];
        worker.postMessage({ cmd: 'cancel' });
      }
      function cleanupThread(pthread_ptr) {
        var worker = PThread.pthreads[pthread_ptr];
        assert(worker);
        PThread.returnWorkerToPool(worker);
      }
      function spawnThread(threadParams) {
        var worker = PThread.getNewWorker();
        if (!worker) {
          return 6;
        }
        PThread.runningWorkers.push(worker);
        PThread.pthreads[threadParams.pthread_ptr] = worker;
        worker.pthread_ptr = threadParams.pthread_ptr;
        var msg = { cmd: 'run', start_routine: threadParams.startRoutine, arg: threadParams.arg, pthread_ptr: threadParams.pthread_ptr };
        worker.runPthread = () => {
          if (ENVIRONMENT_IS_NODE) {
            worker.ref();
          }
          worker.postMessage(msg, threadParams.transferList);
          delete worker.runPthread;
        };
        if (worker.loaded) {
          worker.runPthread();
        }
        return 0;
      }
      function _proc_exit(code) {
        if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(1, 1, code);
        EXITSTATUS = code;
        if (!keepRuntimeAlive()) {
          PThread.terminateAllThreads();
          if (Module['onExit']) Module['onExit'](code);
          ABORT = true;
        }
        quit_(code, new ExitStatus(code));
      }
      function exitJS(status, implicit) {
        EXITSTATUS = status;
        if (!implicit) {
          if (ENVIRONMENT_IS_PTHREAD) {
            exitOnMainThread(status);
            throw 'unwind';
          }
        }
        _proc_exit(status);
      }
      var _exit = exitJS;
      function handleException(e) {
        if (e instanceof ExitStatus || e == 'unwind') {
          return EXITSTATUS;
        }
        quit_(1, e);
      }
      var PThread = {
        unusedWorkers: [],
        runningWorkers: [],
        tlsInitFunctions: [],
        pthreads: {},
        init: function () {
          if (ENVIRONMENT_IS_PTHREAD) {
            PThread.initWorker();
          } else {
            PThread.initMainThread();
          }
        },
        initMainThread: function () {
          var pthreadPoolSize = 8;
          while (pthreadPoolSize--) {
            PThread.allocateUnusedWorker();
          }
        },
        initWorker: function () {
          noExitRuntime = false;
        },
        setExitStatus: function (status) {
          EXITSTATUS = status;
        },
        terminateAllThreads: function () {
          for (var worker of Object.values(PThread.pthreads)) {
            PThread.returnWorkerToPool(worker);
          }
          for (var worker of PThread.unusedWorkers) {
            worker.terminate();
          }
          PThread.unusedWorkers = [];
        },
        returnWorkerToPool: function (worker) {
          var pthread_ptr = worker.pthread_ptr;
          delete PThread.pthreads[pthread_ptr];
          PThread.unusedWorkers.push(worker);
          PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
          worker.pthread_ptr = 0;
          if (ENVIRONMENT_IS_NODE) {
            worker.unref();
          }
          __emscripten_thread_free_data(pthread_ptr);
        },
        receiveObjectTransfer: function (data) {},
        threadInitTLS: function () {
          PThread.tlsInitFunctions.forEach(f => f());
        },
        loadWasmModuleToWorker: function (worker, onFinishedLoading) {
          worker.onmessage = e => {
            var d = e['data'];
            var cmd = d['cmd'];
            if (worker.pthread_ptr) PThread.currentProxiedOperationCallerThread = worker.pthread_ptr;
            if (d['targetThread'] && d['targetThread'] != _pthread_self()) {
              var targetWorker = PThread.pthreads[d.targetThread];
              if (targetWorker) {
                targetWorker.postMessage(d, d['transferList']);
              } else {
                err(
                  'Internal error! Worker sent a message "' +
                    cmd +
                    '" to target pthread ' +
                    d['targetThread'] +
                    ', but that thread no longer exists!',
                );
              }
              PThread.currentProxiedOperationCallerThread = undefined;
              return;
            }
            if (cmd === 'processProxyingQueue') {
              executeNotifiedProxyingQueue(d['queue']);
            } else if (cmd === 'spawnThread') {
              spawnThread(d);
            } else if (cmd === 'cleanupThread') {
              cleanupThread(d['thread']);
            } else if (cmd === 'killThread') {
              killThread(d['thread']);
            } else if (cmd === 'cancelThread') {
              cancelThread(d['thread']);
            } else if (cmd === 'loaded') {
              worker.loaded = true;
              if (ENVIRONMENT_IS_NODE) {
                worker.unref();
              }
              if (onFinishedLoading) onFinishedLoading(worker);
              if (worker.runPthread) {
                worker.runPthread();
              }
            } else if (cmd === 'print') {
              out('Thread ' + d['threadId'] + ': ' + d['text']);
            } else if (cmd === 'printErr') {
              err('Thread ' + d['threadId'] + ': ' + d['text']);
            } else if (cmd === 'alert') {
              alert('Thread ' + d['threadId'] + ': ' + d['text']);
            } else if (d.target === 'setimmediate') {
              worker.postMessage(d);
            } else if (cmd === 'callHandler') {
              Module[d['handler']](...d['args']);
            } else if (cmd) {
              err('worker sent an unknown command ' + cmd);
            }
            PThread.currentProxiedOperationCallerThread = undefined;
          };
          worker.onerror = e => {
            var message = 'worker sent an error!';
            err(message + ' ' + e.filename + ':' + e.lineno + ': ' + e.message);
            throw e;
          };
          if (ENVIRONMENT_IS_NODE) {
            worker.on('message', function (data) {
              worker.onmessage({ data: data });
            });
            worker.on('error', function (e) {
              worker.onerror(e);
            });
            worker.on('detachedExit', function () {});
          }
          var handlers = [];
          var knownHandlers = ['onExit', 'onAbort', 'print', 'printErr'];
          for (var handler of knownHandlers) {
            if (Module.hasOwnProperty(handler)) {
              handlers.push(handler);
            }
          }
          worker.postMessage({
            cmd: 'load',
            handlers: handlers,
            urlOrBlob: Module['mainScriptUrlOrBlob'] || _scriptDir,
            wasmMemory: wasmMemory,
            wasmModule: wasmModule,
          });
        },
        allocateUnusedWorker: function () {
          var worker;
          var pthreadMainJs = locateFile('tfjs-backend-wasm-threaded-simd.worker.js');
          worker = new Worker(pthreadMainJs);
          PThread.unusedWorkers.push(worker);
        },
        getNewWorker: function () {
          if (PThread.unusedWorkers.length == 0) {
            PThread.allocateUnusedWorker();
            PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
          }
          return PThread.unusedWorkers.pop();
        },
      };
      Module['PThread'] = PThread;
      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          callbacks.shift()(Module);
        }
      }
      function establishStackSpace() {
        var pthread_ptr = _pthread_self();
        var stackTop = GROWABLE_HEAP_I32()[(pthread_ptr + 52) >>> 2];
        var stackSize = GROWABLE_HEAP_I32()[(pthread_ptr + 56) >>> 2];
        var stackMax = stackTop - stackSize;
        _emscripten_stack_set_limits(stackTop, stackMax);
        stackRestore(stackTop);
      }
      Module['establishStackSpace'] = establishStackSpace;
      function exitOnMainThread(returnCode) {
        if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(2, 0, returnCode);
        try {
          _exit(returnCode);
        } catch (e) {
          handleException(e);
        }
      }
      var wasmTableMirror = [];
      function getWasmTableEntry(funcPtr) {
        var func = wasmTableMirror[funcPtr];
        if (!func) {
          if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
          wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        }
        return func;
      }
      function invokeEntryPoint(ptr, arg) {
        var result = getWasmTableEntry(ptr)(arg);
        if (keepRuntimeAlive()) {
          PThread.setExitStatus(result);
        } else {
          __emscripten_thread_exit(result);
        }
      }
      Module['invokeEntryPoint'] = invokeEntryPoint;
      function registerTLSInit(tlsInitFunc) {
        PThread.tlsInitFunctions.push(tlsInitFunc);
      }
      function ___emscripten_init_main_thread_js(tb) {
        __emscripten_thread_init(tb, !ENVIRONMENT_IS_WORKER, 1, !ENVIRONMENT_IS_WEB);
        PThread.threadInitTLS();
      }
      function ___emscripten_thread_cleanup(thread) {
        if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);
        else postMessage({ cmd: 'cleanupThread', thread: thread });
      }
      function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
        if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(3, 1, pthread_ptr, attr, startRoutine, arg);
        return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
      }
      function ___pthread_create_js(pthread_ptr, attr, startRoutine, arg) {
        if (typeof SharedArrayBuffer == 'undefined') {
          err('Current environment does not support SharedArrayBuffer, pthreads are not available!');
          return 6;
        }
        var transferList = [];
        var error = 0;
        if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
          return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
        }
        var threadParams = { startRoutine: startRoutine, pthread_ptr: pthread_ptr, arg: arg, transferList: transferList };
        if (ENVIRONMENT_IS_PTHREAD) {
          threadParams.cmd = 'spawnThread';
          postMessage(threadParams, transferList);
          return 0;
        }
        return spawnThread(threadParams);
      }
      function __emscripten_default_pthread_stack_size() {
        return 65536;
      }
      var nowIsMonotonic = true;
      function __emscripten_get_now_is_monotonic() {
        return nowIsMonotonic;
      }
      function executeNotifiedProxyingQueue(queue) {
        Atomics.store(GROWABLE_HEAP_I32(), queue >> 2, 1);
        if (_pthread_self()) {
          __emscripten_proxy_execute_task_queue(queue);
        }
        Atomics.compareExchange(GROWABLE_HEAP_I32(), queue >> 2, 1, 0);
      }
      Module['executeNotifiedProxyingQueue'] = executeNotifiedProxyingQueue;
      function __emscripten_notify_task_queue(targetThreadId, currThreadId, mainThreadId, queue) {
        if (targetThreadId == currThreadId) {
          setTimeout(() => executeNotifiedProxyingQueue(queue));
        } else if (ENVIRONMENT_IS_PTHREAD) {
          postMessage({ targetThread: targetThreadId, cmd: 'processProxyingQueue', queue: queue });
        } else {
          var worker = PThread.pthreads[targetThreadId];
          if (!worker) {
            return;
          }
          worker.postMessage({ cmd: 'processProxyingQueue', queue: queue });
        }
        return 1;
      }
      function __emscripten_set_offscreencanvas_size(target, width, height) {
        return -1;
      }
      function _abort() {
        abort('');
      }
      function warnOnce(text) {
        if (!warnOnce.shown) warnOnce.shown = {};
        if (!warnOnce.shown[text]) {
          warnOnce.shown[text] = 1;
          if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
          err(text);
        }
      }
      function _emscripten_check_blocking_allowed() {
        if (ENVIRONMENT_IS_NODE) return;
        if (ENVIRONMENT_IS_WORKER) return;
        warnOnce(
          'Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread',
        );
      }
      function _emscripten_date_now() {
        return Date.now();
      }
      function getHeapMax() {
        return 4294901760;
      }
      function _emscripten_get_heap_max() {
        return getHeapMax();
      }
      var _emscripten_get_now;
      if (ENVIRONMENT_IS_NODE) {
        _emscripten_get_now = () => {
          var t = process['hrtime']();
          return t[0] * 1e3 + t[1] / 1e6;
        };
      } else _emscripten_get_now = () => performance.timeOrigin + performance.now();
      function _emscripten_memcpy_big(dest, src, num) {
        GROWABLE_HEAP_U8().copyWithin(dest >>> 0, src >>> 0, (src + num) >>> 0);
      }
      function _emscripten_num_logical_cores() {
        if (ENVIRONMENT_IS_NODE) return require$$4.cpus().length;
        return navigator['hardwareConcurrency'];
      }
      function withStackSave(f) {
        var stack = stackSave();
        var ret = f();
        stackRestore(stack);
        return ret;
      }
      function _emscripten_proxy_to_main_thread_js(index, sync) {
        var numCallArgs = arguments.length - 2;
        var outerArgs = arguments;
        return withStackSave(() => {
          var serializedNumCallArgs = numCallArgs;
          var args = stackAlloc(serializedNumCallArgs * 8);
          var b = args >> 3;
          for (var i = 0; i < numCallArgs; i++) {
            var arg = outerArgs[2 + i];
            GROWABLE_HEAP_F64()[(b + i) >>> 0] = arg;
          }
          return _emscripten_run_in_main_runtime_thread_js(index, serializedNumCallArgs, args, sync);
        });
      }
      var _emscripten_receive_on_main_thread_js_callArgs = [];
      function _emscripten_receive_on_main_thread_js(index, numCallArgs, args) {
        _emscripten_receive_on_main_thread_js_callArgs.length = numCallArgs;
        var b = args >> 3;
        for (var i = 0; i < numCallArgs; i++) {
          _emscripten_receive_on_main_thread_js_callArgs[i] = GROWABLE_HEAP_F64()[(b + i) >>> 0];
        }
        var isEmAsmConst = index < 0;
        var func = !isEmAsmConst ? proxiedFunctionTable[index] : ASM_CONSTS[-index - 1];
        return func.apply(null, _emscripten_receive_on_main_thread_js_callArgs);
      }
      function emscripten_realloc_buffer(size) {
        try {
          wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
          updateGlobalBufferAndViews(wasmMemory.buffer);
          return 1;
        } catch (e) {}
      }
      function _emscripten_resize_heap(requestedSize) {
        var oldSize = GROWABLE_HEAP_U8().length;
        requestedSize = requestedSize >>> 0;
        if (requestedSize <= oldSize) {
          return false;
        }
        var maxHeapSize = getHeapMax();
        if (requestedSize > maxHeapSize) {
          return false;
        }
        let alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
          var replacement = emscripten_realloc_buffer(newSize);
          if (replacement) {
            return true;
          }
        }
        return false;
      }
      function _emscripten_unwind_to_js_event_loop() {
        throw 'unwind';
      }
      function _fd_close(fd) {
        if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(4, 1, fd);
        return 52;
      }
      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(5, 1, fd, offset_low, offset_high, whence, newOffset);
        return 70;
      }
      var printCharBuffers = [null, [], []];
      function printChar(stream, curr) {
        var buffer = printCharBuffers[stream];
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      }
      function _fd_write(fd, iov, iovcnt, pnum) {
        if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(6, 1, fd, iov, iovcnt, pnum);
        var num = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = GROWABLE_HEAP_U32()[iov >>> 2];
          var len = GROWABLE_HEAP_U32()[(iov + 4) >>> 2];
          iov += 8;
          for (var j = 0; j < len; j++) {
            printChar(fd, GROWABLE_HEAP_U8()[(ptr + j) >>> 0]);
          }
          num += len;
        }
        GROWABLE_HEAP_U32()[pnum >>> 2] = num;
        return 0;
      }
      function getCFunc(ident) {
        var func = Module['_' + ident];
        return func;
      }
      function writeArrayToMemory(array, buffer) {
        GROWABLE_HEAP_I8().set(array, buffer >>> 0);
      }
      function ccall(ident, returnType, argTypes, args, opts) {
        var toC = {
          string: str => {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
              var len = (str.length << 2) + 1;
              ret = stackAlloc(len);
              stringToUTF8(str, ret, len);
            }
            return ret;
          },
          array: arr => {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret;
          },
        };
        function convertReturnValue(ret) {
          if (returnType === 'string') {
            return UTF8ToString(ret);
          }
          if (returnType === 'boolean') return Boolean(ret);
          return ret;
        }
        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        if (args) {
          for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
              if (stack === 0) stack = stackSave();
              cArgs[i] = converter(args[i]);
            } else {
              cArgs[i] = args[i];
            }
          }
        }
        var ret = func.apply(null, cArgs);
        function onDone(ret) {
          if (stack !== 0) stackRestore(stack);
          return convertReturnValue(ret);
        }
        ret = onDone(ret);
        return ret;
      }
      function cwrap(ident, returnType, argTypes, opts) {
        argTypes = argTypes || [];
        var numericArgs = argTypes.every(type => type === 'number' || type === 'boolean');
        var numericRet = returnType !== 'string';
        if (numericRet && numericArgs && !opts) {
          return getCFunc(ident);
        }
        return function () {
          return ccall(ident, returnType, argTypes, arguments);
        };
      }
      PThread.init();
      var proxiedFunctionTable = [null, _proc_exit, exitOnMainThread, pthreadCreateProxied, _fd_close, _fd_seek, _fd_write];
      var asmLibraryArg = {
        __emscripten_init_main_thread_js: ___emscripten_init_main_thread_js,
        __emscripten_thread_cleanup: ___emscripten_thread_cleanup,
        __pthread_create_js: ___pthread_create_js,
        _emscripten_default_pthread_stack_size: __emscripten_default_pthread_stack_size,
        _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
        _emscripten_notify_task_queue: __emscripten_notify_task_queue,
        _emscripten_set_offscreencanvas_size: __emscripten_set_offscreencanvas_size,
        abort: _abort,
        emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
        emscripten_date_now: _emscripten_date_now,
        emscripten_get_heap_max: _emscripten_get_heap_max,
        emscripten_get_now: _emscripten_get_now,
        emscripten_memcpy_big: _emscripten_memcpy_big,
        emscripten_num_logical_cores: _emscripten_num_logical_cores,
        emscripten_receive_on_main_thread_js: _emscripten_receive_on_main_thread_js,
        emscripten_resize_heap: _emscripten_resize_heap,
        emscripten_unwind_to_js_event_loop: _emscripten_unwind_to_js_event_loop,
        exit: _exit,
        fd_close: _fd_close,
        fd_seek: _fd_seek,
        fd_write: _fd_write,
        memory: wasmMemory || Module['wasmMemory'],
      };
      createWasm();
      Module['___wasm_call_ctors'] = function () {
        return (Module['___wasm_call_ctors'] = Module['asm']['__wasm_call_ctors']).apply(null, arguments);
      };
      Module['_init'] = function () {
        return (Module['_init'] = Module['asm']['init']).apply(null, arguments);
      };
      Module['_init_with_threads_count'] = function () {
        return (Module['_init_with_threads_count'] = Module['asm']['init_with_threads_count']).apply(null, arguments);
      };
      Module['_get_threads_count'] = function () {
        return (Module['_get_threads_count'] = Module['asm']['get_threads_count']).apply(null, arguments);
      };
      Module['_register_tensor'] = function () {
        return (Module['_register_tensor'] = Module['asm']['register_tensor']).apply(null, arguments);
      };
      Module['_dispose_data'] = function () {
        return (Module['_dispose_data'] = Module['asm']['dispose_data']).apply(null, arguments);
      };
      Module['_dispose'] = function () {
        return (Module['_dispose'] = Module['asm']['dispose']).apply(null, arguments);
      };
      Module['_Abs'] = function () {
        return (Module['_Abs'] = Module['asm']['Abs']).apply(null, arguments);
      };
      Module['_Acos'] = function () {
        return (Module['_Acos'] = Module['asm']['Acos']).apply(null, arguments);
      };
      Module['_Acosh'] = function () {
        return (Module['_Acosh'] = Module['asm']['Acosh']).apply(null, arguments);
      };
      Module['_Add'] = function () {
        return (Module['_Add'] = Module['asm']['Add']).apply(null, arguments);
      };
      Module['_AddN'] = function () {
        return (Module['_AddN'] = Module['asm']['AddN']).apply(null, arguments);
      };
      Module['_All'] = function () {
        return (Module['_All'] = Module['asm']['All']).apply(null, arguments);
      };
      Module['_Any'] = function () {
        return (Module['_Any'] = Module['asm']['Any']).apply(null, arguments);
      };
      Module['_ArgMax'] = function () {
        return (Module['_ArgMax'] = Module['asm']['ArgMax']).apply(null, arguments);
      };
      Module['_ArgMin'] = function () {
        return (Module['_ArgMin'] = Module['asm']['ArgMin']).apply(null, arguments);
      };
      Module['_Asin'] = function () {
        return (Module['_Asin'] = Module['asm']['Asin']).apply(null, arguments);
      };
      Module['_Asinh'] = function () {
        return (Module['_Asinh'] = Module['asm']['Asinh']).apply(null, arguments);
      };
      Module['_Atan'] = function () {
        return (Module['_Atan'] = Module['asm']['Atan']).apply(null, arguments);
      };
      Module['_Atan2'] = function () {
        return (Module['_Atan2'] = Module['asm']['Atan2']).apply(null, arguments);
      };
      Module['_Atanh'] = function () {
        return (Module['_Atanh'] = Module['asm']['Atanh']).apply(null, arguments);
      };
      Module['_AvgPool'] = function () {
        return (Module['_AvgPool'] = Module['asm']['AvgPool']).apply(null, arguments);
      };
      Module['_AvgPool3D'] = function () {
        return (Module['_AvgPool3D'] = Module['asm']['AvgPool3D']).apply(null, arguments);
      };
      Module['_AvgPool3DGrad'] = function () {
        return (Module['_AvgPool3DGrad'] = Module['asm']['AvgPool3DGrad']).apply(null, arguments);
      };
      Module['_AvgPoolGrad'] = function () {
        return (Module['_AvgPoolGrad'] = Module['asm']['AvgPoolGrad']).apply(null, arguments);
      };
      Module['_BatchMatMul'] = function () {
        return (Module['_BatchMatMul'] = Module['asm']['BatchMatMul']).apply(null, arguments);
      };
      Module['_Bincount'] = function () {
        return (Module['_Bincount'] = Module['asm']['Bincount']).apply(null, arguments);
      };
      Module['_BitwiseAnd'] = function () {
        return (Module['_BitwiseAnd'] = Module['asm']['BitwiseAnd']).apply(null, arguments);
      };
      Module['_Ceil'] = function () {
        return (Module['_Ceil'] = Module['asm']['Ceil']).apply(null, arguments);
      };
      Module['_ClipByValue'] = function () {
        return (Module['_ClipByValue'] = Module['asm']['ClipByValue']).apply(null, arguments);
      };
      Module['_Conv2D'] = function () {
        return (Module['_Conv2D'] = Module['asm']['Conv2D']).apply(null, arguments);
      };
      Module['_Conv2DBackpropInput'] = function () {
        return (Module['_Conv2DBackpropInput'] = Module['asm']['Conv2DBackpropInput']).apply(null, arguments);
      };
      Module['_Conv3D'] = function () {
        return (Module['_Conv3D'] = Module['asm']['Conv3D']).apply(null, arguments);
      };
      Module['_Conv3DBackpropFilterV2'] = function () {
        return (Module['_Conv3DBackpropFilterV2'] = Module['asm']['Conv3DBackpropFilterV2']).apply(null, arguments);
      };
      Module['_Conv3DBackpropInputV2'] = function () {
        return (Module['_Conv3DBackpropInputV2'] = Module['asm']['Conv3DBackpropInputV2']).apply(null, arguments);
      };
      Module['_Cos'] = function () {
        return (Module['_Cos'] = Module['asm']['Cos']).apply(null, arguments);
      };
      Module['_Cosh'] = function () {
        return (Module['_Cosh'] = Module['asm']['Cosh']).apply(null, arguments);
      };
      Module['_CropAndResize'] = function () {
        return (Module['_CropAndResize'] = Module['asm']['CropAndResize']).apply(null, arguments);
      };
      Module['_Cumprod'] = function () {
        return (Module['_Cumprod'] = Module['asm']['Cumprod']).apply(null, arguments);
      };
      Module['_Cumsum'] = function () {
        return (Module['_Cumsum'] = Module['asm']['Cumsum']).apply(null, arguments);
      };
      Module['_DenseBincount'] = function () {
        return (Module['_DenseBincount'] = Module['asm']['DenseBincount']).apply(null, arguments);
      };
      Module['_DepthToSpace'] = function () {
        return (Module['_DepthToSpace'] = Module['asm']['DepthToSpace']).apply(null, arguments);
      };
      Module['_DepthwiseConv2dNative'] = function () {
        return (Module['_DepthwiseConv2dNative'] = Module['asm']['DepthwiseConv2dNative']).apply(null, arguments);
      };
      Module['_Diag'] = function () {
        return (Module['_Diag'] = Module['asm']['Diag']).apply(null, arguments);
      };
      Module['_Dilation2D'] = function () {
        return (Module['_Dilation2D'] = Module['asm']['Dilation2D']).apply(null, arguments);
      };
      Module['_Dilation2DBackpropFilter'] = function () {
        return (Module['_Dilation2DBackpropFilter'] = Module['asm']['Dilation2DBackpropFilter']).apply(null, arguments);
      };
      Module['_Dilation2DBackpropInput'] = function () {
        return (Module['_Dilation2DBackpropInput'] = Module['asm']['Dilation2DBackpropInput']).apply(null, arguments);
      };
      Module['_Elu'] = function () {
        return (Module['_Elu'] = Module['asm']['Elu']).apply(null, arguments);
      };
      Module['_EluGrad'] = function () {
        return (Module['_EluGrad'] = Module['asm']['EluGrad']).apply(null, arguments);
      };
      Module['_Equal'] = function () {
        return (Module['_Equal'] = Module['asm']['Equal']).apply(null, arguments);
      };
      Module['_Erf'] = function () {
        return (Module['_Erf'] = Module['asm']['Erf']).apply(null, arguments);
      };
      Module['_Exp'] = function () {
        return (Module['_Exp'] = Module['asm']['Exp']).apply(null, arguments);
      };
      Module['_Expm1'] = function () {
        return (Module['_Expm1'] = Module['asm']['Expm1']).apply(null, arguments);
      };
      Module['_FlipLeftRight'] = function () {
        return (Module['_FlipLeftRight'] = Module['asm']['FlipLeftRight']).apply(null, arguments);
      };
      Module['_Floor'] = function () {
        return (Module['_Floor'] = Module['asm']['Floor']).apply(null, arguments);
      };
      Module['_FloorDiv'] = function () {
        return (Module['_FloorDiv'] = Module['asm']['FloorDiv']).apply(null, arguments);
      };
      Module['_FusedBatchNorm'] = function () {
        return (Module['_FusedBatchNorm'] = Module['asm']['FusedBatchNorm']).apply(null, arguments);
      };
      Module['_FusedConv2D'] = function () {
        return (Module['_FusedConv2D'] = Module['asm']['FusedConv2D']).apply(null, arguments);
      };
      Module['_FusedDepthwiseConv2D'] = function () {
        return (Module['_FusedDepthwiseConv2D'] = Module['asm']['FusedDepthwiseConv2D']).apply(null, arguments);
      };
      Module['_Gather'] = function () {
        return (Module['_Gather'] = Module['asm']['Gather']).apply(null, arguments);
      };
      Module['_GatherNd'] = function () {
        return (Module['_GatherNd'] = Module['asm']['GatherNd']).apply(null, arguments);
      };
      Module['_Greater'] = function () {
        return (Module['_Greater'] = Module['asm']['Greater']).apply(null, arguments);
      };
      Module['_GreaterEqual'] = function () {
        return (Module['_GreaterEqual'] = Module['asm']['GreaterEqual']).apply(null, arguments);
      };
      Module['_IsFinite'] = function () {
        return (Module['_IsFinite'] = Module['asm']['IsFinite']).apply(null, arguments);
      };
      Module['_IsInf'] = function () {
        return (Module['_IsInf'] = Module['asm']['IsInf']).apply(null, arguments);
      };
      Module['_IsNan'] = function () {
        return (Module['_IsNan'] = Module['asm']['IsNan']).apply(null, arguments);
      };
      Module['_LRN'] = function () {
        return (Module['_LRN'] = Module['asm']['LRN']).apply(null, arguments);
      };
      Module['_LRNGrad'] = function () {
        return (Module['_LRNGrad'] = Module['asm']['LRNGrad']).apply(null, arguments);
      };
      Module['_LeakyRelu'] = function () {
        return (Module['_LeakyRelu'] = Module['asm']['LeakyRelu']).apply(null, arguments);
      };
      Module['_Less'] = function () {
        return (Module['_Less'] = Module['asm']['Less']).apply(null, arguments);
      };
      Module['_LessEqual'] = function () {
        return (Module['_LessEqual'] = Module['asm']['LessEqual']).apply(null, arguments);
      };
      Module['_LinSpace'] = function () {
        return (Module['_LinSpace'] = Module['asm']['LinSpace']).apply(null, arguments);
      };
      Module['_Log'] = function () {
        return (Module['_Log'] = Module['asm']['Log']).apply(null, arguments);
      };
      Module['_Log1p'] = function () {
        return (Module['_Log1p'] = Module['asm']['Log1p']).apply(null, arguments);
      };
      Module['_LogicalAnd'] = function () {
        return (Module['_LogicalAnd'] = Module['asm']['LogicalAnd']).apply(null, arguments);
      };
      Module['_LogicalNot'] = function () {
        return (Module['_LogicalNot'] = Module['asm']['LogicalNot']).apply(null, arguments);
      };
      Module['_LogicalOr'] = function () {
        return (Module['_LogicalOr'] = Module['asm']['LogicalOr']).apply(null, arguments);
      };
      Module['_LogicalXor'] = function () {
        return (Module['_LogicalXor'] = Module['asm']['LogicalXor']).apply(null, arguments);
      };
      Module['_Max'] = function () {
        return (Module['_Max'] = Module['asm']['Max']).apply(null, arguments);
      };
      Module['_MaxPool'] = function () {
        return (Module['_MaxPool'] = Module['asm']['MaxPool']).apply(null, arguments);
      };
      Module['_MaxPool3D'] = function () {
        return (Module['_MaxPool3D'] = Module['asm']['MaxPool3D']).apply(null, arguments);
      };
      Module['_MaxPool3DGrad'] = function () {
        return (Module['_MaxPool3DGrad'] = Module['asm']['MaxPool3DGrad']).apply(null, arguments);
      };
      Module['_MaxPoolGrad'] = function () {
        return (Module['_MaxPoolGrad'] = Module['asm']['MaxPoolGrad']).apply(null, arguments);
      };
      Module['_MaxPoolWithArgmax'] = function () {
        return (Module['_MaxPoolWithArgmax'] = Module['asm']['MaxPoolWithArgmax']).apply(null, arguments);
      };
      Module['_Maximum'] = function () {
        return (Module['_Maximum'] = Module['asm']['Maximum']).apply(null, arguments);
      };
      Module['_Mean'] = function () {
        return (Module['_Mean'] = Module['asm']['Mean']).apply(null, arguments);
      };
      Module['_Min'] = function () {
        return (Module['_Min'] = Module['asm']['Min']).apply(null, arguments);
      };
      Module['_Minimum'] = function () {
        return (Module['_Minimum'] = Module['asm']['Minimum']).apply(null, arguments);
      };
      Module['_MirrorPad'] = function () {
        return (Module['_MirrorPad'] = Module['asm']['MirrorPad']).apply(null, arguments);
      };
      Module['_Mod'] = function () {
        return (Module['_Mod'] = Module['asm']['Mod']).apply(null, arguments);
      };
      Module['_Multinomial'] = function () {
        return (Module['_Multinomial'] = Module['asm']['Multinomial']).apply(null, arguments);
      };
      Module['_Multiply'] = function () {
        return (Module['_Multiply'] = Module['asm']['Multiply']).apply(null, arguments);
      };
      Module['_Neg'] = function () {
        return (Module['_Neg'] = Module['asm']['Neg']).apply(null, arguments);
      };
      Module['_NonMaxSuppressionV3'] = function () {
        return (Module['_NonMaxSuppressionV3'] = Module['asm']['NonMaxSuppressionV3']).apply(null, arguments);
      };
      Module['_NonMaxSuppressionV4'] = function () {
        return (Module['_NonMaxSuppressionV4'] = Module['asm']['NonMaxSuppressionV4']).apply(null, arguments);
      };
      Module['_NonMaxSuppressionV5'] = function () {
        return (Module['_NonMaxSuppressionV5'] = Module['asm']['NonMaxSuppressionV5']).apply(null, arguments);
      };
      Module['_NotEqual'] = function () {
        return (Module['_NotEqual'] = Module['asm']['NotEqual']).apply(null, arguments);
      };
      Module['_OneHot'] = function () {
        return (Module['_OneHot'] = Module['asm']['OneHot']).apply(null, arguments);
      };
      Module['_PadV2'] = function () {
        return (Module['_PadV2'] = Module['asm']['PadV2']).apply(null, arguments);
      };
      Module['_Pow'] = function () {
        return (Module['_Pow'] = Module['asm']['Pow']).apply(null, arguments);
      };
      Module['_Prelu'] = function () {
        return (Module['_Prelu'] = Module['asm']['Prelu']).apply(null, arguments);
      };
      Module['_Prod'] = function () {
        return (Module['_Prod'] = Module['asm']['Prod']).apply(null, arguments);
      };
      Module['_RealDiv'] = function () {
        return (Module['_RealDiv'] = Module['asm']['RealDiv']).apply(null, arguments);
      };
      Module['_Reciprocal'] = function () {
        return (Module['_Reciprocal'] = Module['asm']['Reciprocal']).apply(null, arguments);
      };
      Module['_Relu'] = function () {
        return (Module['_Relu'] = Module['asm']['Relu']).apply(null, arguments);
      };
      Module['_Relu6'] = function () {
        return (Module['_Relu6'] = Module['asm']['Relu6']).apply(null, arguments);
      };
      Module['_ResizeBilinear'] = function () {
        return (Module['_ResizeBilinear'] = Module['asm']['ResizeBilinear']).apply(null, arguments);
      };
      Module['_ResizeBilinearGrad'] = function () {
        return (Module['_ResizeBilinearGrad'] = Module['asm']['ResizeBilinearGrad']).apply(null, arguments);
      };
      Module['_ResizeNearestNeighbor'] = function () {
        return (Module['_ResizeNearestNeighbor'] = Module['asm']['ResizeNearestNeighbor']).apply(null, arguments);
      };
      Module['_ResizeNearestNeighborGrad'] = function () {
        return (Module['_ResizeNearestNeighborGrad'] = Module['asm']['ResizeNearestNeighborGrad']).apply(null, arguments);
      };
      Module['_Reverse'] = function () {
        return (Module['_Reverse'] = Module['asm']['Reverse']).apply(null, arguments);
      };
      Module['_RotateWithOffset'] = function () {
        return (Module['_RotateWithOffset'] = Module['asm']['RotateWithOffset']).apply(null, arguments);
      };
      Module['_Round'] = function () {
        return (Module['_Round'] = Module['asm']['Round']).apply(null, arguments);
      };
      Module['_Rsqrt'] = function () {
        return (Module['_Rsqrt'] = Module['asm']['Rsqrt']).apply(null, arguments);
      };
      Module['_ScatterNd'] = function () {
        return (Module['_ScatterNd'] = Module['asm']['ScatterNd']).apply(null, arguments);
      };
      Module['_SearchSorted'] = function () {
        return (Module['_SearchSorted'] = Module['asm']['SearchSorted']).apply(null, arguments);
      };
      Module['_SelectV2'] = function () {
        return (Module['_SelectV2'] = Module['asm']['SelectV2']).apply(null, arguments);
      };
      Module['_Selu'] = function () {
        return (Module['_Selu'] = Module['asm']['Selu']).apply(null, arguments);
      };
      Module['_Sigmoid'] = function () {
        return (Module['_Sigmoid'] = Module['asm']['Sigmoid']).apply(null, arguments);
      };
      Module['_Sign'] = function () {
        return (Module['_Sign'] = Module['asm']['Sign']).apply(null, arguments);
      };
      Module['_Sin'] = function () {
        return (Module['_Sin'] = Module['asm']['Sin']).apply(null, arguments);
      };
      Module['_Sinh'] = function () {
        return (Module['_Sinh'] = Module['asm']['Sinh']).apply(null, arguments);
      };
      Module['_Softmax'] = function () {
        return (Module['_Softmax'] = Module['asm']['Softmax']).apply(null, arguments);
      };
      Module['_Softplus'] = function () {
        return (Module['_Softplus'] = Module['asm']['Softplus']).apply(null, arguments);
      };
      Module['_SparseFillEmptyRows'] = function () {
        return (Module['_SparseFillEmptyRows'] = Module['asm']['SparseFillEmptyRows']).apply(null, arguments);
      };
      Module['_SparseReshape'] = function () {
        return (Module['_SparseReshape'] = Module['asm']['SparseReshape']).apply(null, arguments);
      };
      Module['_SparseSegmentReduction'] = function () {
        return (Module['_SparseSegmentReduction'] = Module['asm']['SparseSegmentReduction']).apply(null, arguments);
      };
      Module['_SparseToDense'] = function () {
        return (Module['_SparseToDense'] = Module['asm']['SparseToDense']).apply(null, arguments);
      };
      Module['_Sqrt'] = function () {
        return (Module['_Sqrt'] = Module['asm']['Sqrt']).apply(null, arguments);
      };
      Module['_Square'] = function () {
        return (Module['_Square'] = Module['asm']['Square']).apply(null, arguments);
      };
      Module['_SquaredDifference'] = function () {
        return (Module['_SquaredDifference'] = Module['asm']['SquaredDifference']).apply(null, arguments);
      };
      Module['_Step'] = function () {
        return (Module['_Step'] = Module['asm']['Step']).apply(null, arguments);
      };
      Module['_StridedSlice'] = function () {
        return (Module['_StridedSlice'] = Module['asm']['StridedSlice']).apply(null, arguments);
      };
      Module['_Sub'] = function () {
        return (Module['_Sub'] = Module['asm']['Sub']).apply(null, arguments);
      };
      Module['_Sum'] = function () {
        return (Module['_Sum'] = Module['asm']['Sum']).apply(null, arguments);
      };
      Module['_Tan'] = function () {
        return (Module['_Tan'] = Module['asm']['Tan']).apply(null, arguments);
      };
      Module['_Tanh'] = function () {
        return (Module['_Tanh'] = Module['asm']['Tanh']).apply(null, arguments);
      };
      Module['_TensorScatterUpdate'] = function () {
        return (Module['_TensorScatterUpdate'] = Module['asm']['TensorScatterUpdate']).apply(null, arguments);
      };
      Module['_Tile'] = function () {
        return (Module['_Tile'] = Module['asm']['Tile']).apply(null, arguments);
      };
      Module['_TopK'] = function () {
        return (Module['_TopK'] = Module['asm']['TopK']).apply(null, arguments);
      };
      Module['_Transform'] = function () {
        return (Module['_Transform'] = Module['asm']['Transform']).apply(null, arguments);
      };
      Module['_Transpose'] = function () {
        return (Module['_Transpose'] = Module['asm']['Transpose']).apply(null, arguments);
      };
      Module['__FusedMatMul'] = function () {
        return (Module['__FusedMatMul'] = Module['asm']['_FusedMatMul']).apply(null, arguments);
      };
      Module['_malloc'] = function () {
        return (Module['_malloc'] = Module['asm']['malloc']).apply(null, arguments);
      };
      Module['_free'] = function () {
        return (Module['_free'] = Module['asm']['free']).apply(null, arguments);
      };
      Module['__emscripten_tls_init'] = function () {
        return (Module['__emscripten_tls_init'] = Module['asm']['_emscripten_tls_init']).apply(null, arguments);
      };
      var _pthread_self = (Module['_pthread_self'] = function () {
        return (_pthread_self = Module['_pthread_self'] = Module['asm']['pthread_self']).apply(null, arguments);
      });
      Module['___errno_location'] = function () {
        return (Module['___errno_location'] = Module['asm']['__errno_location']).apply(null, arguments);
      };
      var __emscripten_thread_init = (Module['__emscripten_thread_init'] = function () {
        return (__emscripten_thread_init = Module['__emscripten_thread_init'] = Module['asm']['_emscripten_thread_init']).apply(
          null,
          arguments,
        );
      });
      Module['__emscripten_thread_crashed'] = function () {
        return (Module['__emscripten_thread_crashed'] = Module['asm']['_emscripten_thread_crashed']).apply(null, arguments);
      };
      Module['_emscripten_main_thread_process_queued_calls'] = function () {
        return (Module['_emscripten_main_thread_process_queued_calls'] =
          Module['asm']['emscripten_main_thread_process_queued_calls']).apply(null, arguments);
      };
      Module['_emscripten_main_browser_thread_id'] = function () {
        return (Module['_emscripten_main_browser_thread_id'] = Module['asm']['emscripten_main_browser_thread_id']).apply(null, arguments);
      };
      var _emscripten_run_in_main_runtime_thread_js = (Module['_emscripten_run_in_main_runtime_thread_js'] = function () {
        return (_emscripten_run_in_main_runtime_thread_js = Module['_emscripten_run_in_main_runtime_thread_js'] =
          Module['asm']['emscripten_run_in_main_runtime_thread_js']).apply(null, arguments);
      });
      Module['_emscripten_dispatch_to_thread_'] = function () {
        return (Module['_emscripten_dispatch_to_thread_'] = Module['asm']['emscripten_dispatch_to_thread_']).apply(null, arguments);
      };
      var __emscripten_proxy_execute_task_queue = (Module['__emscripten_proxy_execute_task_queue'] = function () {
        return (__emscripten_proxy_execute_task_queue = Module['__emscripten_proxy_execute_task_queue'] =
          Module['asm']['_emscripten_proxy_execute_task_queue']).apply(null, arguments);
      });
      var __emscripten_thread_free_data = (Module['__emscripten_thread_free_data'] = function () {
        return (__emscripten_thread_free_data = Module['__emscripten_thread_free_data'] =
          Module['asm']['_emscripten_thread_free_data']).apply(null, arguments);
      });
      var __emscripten_thread_exit = (Module['__emscripten_thread_exit'] = function () {
        return (__emscripten_thread_exit = Module['__emscripten_thread_exit'] = Module['asm']['_emscripten_thread_exit']).apply(
          null,
          arguments,
        );
      });
      var _emscripten_stack_set_limits = (Module['_emscripten_stack_set_limits'] = function () {
        return (_emscripten_stack_set_limits = Module['_emscripten_stack_set_limits'] = Module['asm']['emscripten_stack_set_limits']).apply(
          null,
          arguments,
        );
      });
      var stackSave = (Module['stackSave'] = function () {
        return (stackSave = Module['stackSave'] = Module['asm']['stackSave']).apply(null, arguments);
      });
      var stackRestore = (Module['stackRestore'] = function () {
        return (stackRestore = Module['stackRestore'] = Module['asm']['stackRestore']).apply(null, arguments);
      });
      var stackAlloc = (Module['stackAlloc'] = function () {
        return (stackAlloc = Module['stackAlloc'] = Module['asm']['stackAlloc']).apply(null, arguments);
      });
      Module['dynCall_iijjiiii'] = function () {
        return (Module['dynCall_iijjiiii'] = Module['asm']['dynCall_iijjiiii']).apply(null, arguments);
      };
      Module['dynCall_jiji'] = function () {
        return (Module['dynCall_jiji'] = Module['asm']['dynCall_jiji']).apply(null, arguments);
      };
      Module['keepRuntimeAlive'] = keepRuntimeAlive;
      Module['wasmMemory'] = wasmMemory;
      Module['cwrap'] = cwrap;
      Module['ExitStatus'] = ExitStatus;
      Module['PThread'] = PThread;
      var calledRun;
      dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller;
      };
      function run(args) {
        if (runDependencies > 0) {
          return;
        }
        if (ENVIRONMENT_IS_PTHREAD) {
          readyPromiseResolve(Module);
          initRuntime();
          startWorker(Module);
          return;
        }
        preRun();
        if (runDependencies > 0) {
          return;
        }
        function doRun() {
          if (calledRun) return;
          calledRun = true;
          Module['calledRun'] = true;
          if (ABORT) return;
          initRuntime();
          readyPromiseResolve(Module);
          if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
          postRun();
        }
        if (Module['setStatus']) {
          Module['setStatus']('Running...');
          setTimeout(function () {
            setTimeout(function () {
              Module['setStatus']('');
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
      }
      if (Module['preInit']) {
        if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
        while (Module['preInit'].length > 0) {
          Module['preInit'].pop()();
        }
      }
      run();
      var listenersAdded;
      if (beforeListeners) {
        listenersAdded = {
          uncaughtException: process.listeners('uncaughtException').filter(function (listener) {
            return !beforeListeners.uncaughtException.indexOf(listener) > -1;
          }),
          unhandledRejection: process.listeners('unhandledRejection').filter(function (listener) {
            return !beforeListeners.unhandledRejection.indexOf(listener) > -1;
          }),
        };
      }
      var actualModule;
      if (typeof WasmBackendModule !== 'undefined') {
        actualModule = WasmBackendModule;
      } else if (typeof WasmBackendModuleThreadedSimd !== 'undefined') {
        actualModule = WasmBackendModuleThreadedSimd;
      } else {
        throw new Error('Could not find wasm module in post.js');
      }
      if (listenersAdded) {
        var tmpDispose = actualModule['_dispose'];
        actualModule['_dispose'] = function () {
          tmpDispose();
          listenersAdded.uncaughtException.forEach(function (listener) {
            process.removeListener('uncaughtException', listener);
          });
          listenersAdded.unhandledRejection.forEach(function (listener) {
            process.removeListener('unhandledRejection', listener);
          });
        };
      }

      return WasmBackendModuleThreadedSimd.ready;
    };
  })();
  module.exports = WasmBackendModuleThreadedSimd;
})(tfjsBackendWasmThreadedSimd$1);

var tfjsBackendWasmThreadedSimdExports = tfjsBackendWasmThreadedSimd$1.exports;
var tfjsBackendWasmThreadedSimd = /*@__PURE__*/ getDefaultExportFromCjs(tfjsBackendWasmThreadedSimdExports);

var wasmFactoryThreadedSimd_import = /*#__PURE__*/ _mergeNamespaces(
  {
    __proto__: null,
    default: tfjsBackendWasmThreadedSimd,
  },
  [tfjsBackendWasmThreadedSimdExports],
);

var wasmWorkerContents = `"use strict";var Module={};var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads");var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",data=>onmessage({data:data}));var fs=require("fs");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,"utf8")+"//# sourceURL="+f)},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}var initializedJS=false;var pendingNotifiedProxyingQueues=[];function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+"\n");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=(info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports};self.onunhandledrejection=e=>{throw e.reason??e};self.startWorker=instance=>{Module=instance;postMessage({"cmd":"loaded"})};self.onmessage=e=>{try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;for(const handler of e.data.handlers){Module[handler]=function(){postMessage({cmd:"callHandler",handler:handler,args:[...arguments]})}}Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob=="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module)}else if(e.data.cmd==="run"){Module["__emscripten_thread_init"](e.data.pthread_ptr,0,0,1);Module["establishStackSpace"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInitTLS();if(!initializedJS){pendingNotifiedProxyingQueues.forEach(queue=>{Module["executeNotifiedProxyingQueue"](queue)});pendingNotifiedProxyingQueues=[];initializedJS=true}try{Module["invokeEntryPoint"](e.data.start_routine,e.data.arg)}catch(ex){if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else{Module["__emscripten_thread_exit"](ex.status)}}else{throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["__emscripten_thread_exit"](-1)}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processProxyingQueue"){if(initializedJS){Module["executeNotifiedProxyingQueue"](e.data.queue)}else{pendingNotifiedProxyingQueues.push(e.data.queue)}}else if(e.data.cmd){err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){if(Module["__emscripten_thread_crashed"]){Module["__emscripten_thread_crashed"]()}throw ex}};`;

var tfjsBackendWasm$1 = { exports: {} };

(function (module, exports) {
  var WasmBackendModule = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return function (WasmBackendModule) {
      WasmBackendModule = WasmBackendModule || {};

      var Module = typeof WasmBackendModule != 'undefined' ? WasmBackendModule : {};
      var readyPromiseResolve, readyPromiseReject;
      Module['ready'] = new Promise(function (resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      var beforeListeners;
      if (typeof process !== 'undefined' && process.listeners) {
        beforeListeners = {
          uncaughtException: process.listeners('uncaughtException'),
          unhandledRejection: process.listeners('unhandledRejection'),
        };
      }
      var moduleOverrides = Object.assign({}, Module);
      var ENVIRONMENT_IS_WEB = typeof window == 'object';
      var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
      var ENVIRONMENT_IS_NODE =
        typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
      var scriptDirectory = '';
      function locateFile(path) {
        if (Module['locateFile']) {
          return Module['locateFile'](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }
      var read_, readAsync, readBinary;
      if (ENVIRONMENT_IS_NODE) {
        var fs = require$$0;
        var nodePath = require$$1;
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = nodePath.dirname(scriptDirectory) + '/';
        } else {
          scriptDirectory = __dirname + '/';
        }
        read_ = (filename, binary) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
          return fs.readFileSync(filename, binary ? undefined : 'utf8');
        };
        readBinary = filename => {
          var ret = read_(filename, true);
          if (!ret.buffer) {
            ret = new Uint8Array(ret);
          }
          return ret;
        };
        readAsync = (filename, onload, onerror) => {
          filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
          fs.readFile(filename, function (err, data) {
            if (err) onerror(err);
            else onload(data.buffer);
          });
        };
        if (process['argv'].length > 1) {
          process['argv'][1].replace(/\\/g, '/');
        }
        process['argv'].slice(2);
        process['on']('uncaughtException', function (ex) {
          if (!(ex instanceof ExitStatus)) {
            throw ex;
          }
        });
        process['on']('unhandledRejection', function (reason) {
          throw reason;
        });
        Module['inspect'] = function () {
          return '[Emscripten Module object]';
        };
      } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href;
        } else if (typeof document != 'undefined' && document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }
        if (_scriptDir) {
          scriptDirectory = _scriptDir;
        }
        if (scriptDirectory.indexOf('blob:') !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1);
        } else {
          scriptDirectory = '';
        }
        {
          read_ = url => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);
            return xhr.responseText;
          };
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = url => {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.responseType = 'arraybuffer';
              xhr.send(null);
              return new Uint8Array(xhr.response);
            };
          }
          readAsync = (url, onload, onerror) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = () => {
              if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                onload(xhr.response);
                return;
              }
              onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
          };
        }
      } else;
      var out = Module['print'] || console.log.bind(console);
      var err = Module['printErr'] || console.warn.bind(console);
      Object.assign(Module, moduleOverrides);
      moduleOverrides = null;
      if (Module['arguments']) Module['arguments'];
      if (Module['thisProgram']) Module['thisProgram'];
      if (Module['quit']) Module['quit'];
      var wasmBinary;
      if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
      Module['noExitRuntime'] || true;
      if (typeof WebAssembly != 'object') {
        abort('no native wasm support detected');
      }
      var wasmMemory;
      var ABORT = false;
      var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
      function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
        idx >>>= 0;
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        }
        var str = '';
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
          } else {
            u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
          }
        }
        return str;
      }
      function UTF8ToString(ptr, maxBytesToRead) {
        ptr >>>= 0;
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
      }
      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        outIdx >>>= 0;
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
          }
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++ >>> 0] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++ >>> 0] = 192 | (u >> 6);
            heap[outIdx++ >>> 0] = 128 | (u & 63);
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++ >>> 0] = 224 | (u >> 12);
            heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
            heap[outIdx++ >>> 0] = 128 | (u & 63);
          } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++ >>> 0] = 240 | (u >> 18);
            heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
            heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
            heap[outIdx++ >>> 0] = 128 | (u & 63);
          }
        }
        heap[outIdx >>> 0] = 0;
        return outIdx - startIdx;
      }
      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }
      var buffer, HEAP8, HEAPU8, HEAPU32;
      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module['HEAP8'] = HEAP8 = new Int8Array(buf);
        Module['HEAP16'] = new Int16Array(buf);
        Module['HEAP32'] = new Int32Array(buf);
        Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
        Module['HEAPU16'] = new Uint16Array(buf);
        Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
        Module['HEAPF32'] = new Float32Array(buf);
        Module['HEAPF64'] = new Float64Array(buf);
      }
      Module['INITIAL_MEMORY'] || 16777216;
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATPOSTRUN__ = [];
      function preRun() {
        if (Module['preRun']) {
          if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
          while (Module['preRun'].length) {
            addOnPreRun(Module['preRun'].shift());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function initRuntime() {
        callRuntimeCallbacks(__ATINIT__);
      }
      function postRun() {
        if (Module['postRun']) {
          if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
          while (Module['postRun'].length) {
            addOnPostRun(Module['postRun'].shift());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }
      function addOnInit(cb) {
        __ATINIT__.unshift(cb);
      }
      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }
      var runDependencies = 0;
      var dependenciesFulfilled = null;
      function addRunDependency(id) {
        runDependencies++;
        if (Module['monitorRunDependencies']) {
          Module['monitorRunDependencies'](runDependencies);
        }
      }
      function removeRunDependency(id) {
        runDependencies--;
        if (Module['monitorRunDependencies']) {
          Module['monitorRunDependencies'](runDependencies);
        }
        if (runDependencies == 0) {
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      function abort(what) {
        if (Module['onAbort']) {
          Module['onAbort'](what);
        }
        what = 'Aborted(' + what + ')';
        err(what);
        ABORT = true;
        what += '. Build with -sASSERTIONS for more info.';
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }
      var dataURIPrefix = 'data:application/octet-stream;base64,';
      function isDataURI(filename) {
        return filename.startsWith(dataURIPrefix);
      }
      function isFileURI(filename) {
        return filename.startsWith('file://');
      }
      var wasmBinaryFile;
      wasmBinaryFile = 'tfjs-backend-wasm.wasm';
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }
      function getBinary(file) {
        try {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw 'both async and sync fetching of the wasm failed';
        } catch (err) {
          abort(err);
        }
      }
      function getBinaryPromise() {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if (typeof fetch == 'function' && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' })
              .then(function (response) {
                if (!response['ok']) {
                  throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                }
                return response['arrayBuffer']();
              })
              .catch(function () {
                return getBinary(wasmBinaryFile);
              });
          } else {
            if (readAsync) {
              return new Promise(function (resolve, reject) {
                readAsync(
                  wasmBinaryFile,
                  function (response) {
                    resolve(new Uint8Array(response));
                  },
                  reject,
                );
              });
            }
          }
        }
        return Promise.resolve().then(function () {
          return getBinary(wasmBinaryFile);
        });
      }
      function createWasm() {
        var info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg };
        function receiveInstance(instance, module) {
          var exports = instance.exports;
          Module['asm'] = exports;
          wasmMemory = Module['asm']['memory'];
          updateGlobalBufferAndViews(wasmMemory.buffer);
          Module['asm']['__indirect_function_table'];
          addOnInit(Module['asm']['__wasm_call_ctors']);
          removeRunDependency();
        }
        addRunDependency();
        function receiveInstantiationResult(result) {
          receiveInstance(result['instance']);
        }
        function instantiateArrayBuffer(receiver) {
          return getBinaryPromise()
            .then(function (binary) {
              return WebAssembly.instantiate(binary, info);
            })
            .then(function (instance) {
              return instance;
            })
            .then(receiver, function (reason) {
              err('failed to asynchronously prepare wasm: ' + reason);
              abort(reason);
            });
        }
        function instantiateAsync() {
          if (
            !wasmBinary &&
            typeof WebAssembly.instantiateStreaming == 'function' &&
            !isDataURI(wasmBinaryFile) &&
            !isFileURI(wasmBinaryFile) &&
            !ENVIRONMENT_IS_NODE &&
            typeof fetch == 'function'
          ) {
            return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function (reason) {
                err('wasm streaming compile failed: ' + reason);
                err('falling back to ArrayBuffer instantiation');
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            });
          } else {
            return instantiateArrayBuffer(receiveInstantiationResult);
          }
        }
        if (Module['instantiateWasm']) {
          try {
            var exports = Module['instantiateWasm'](info, receiveInstance);
            return exports;
          } catch (e) {
            err('Module.instantiateWasm callback failed with error: ' + e);
            readyPromiseReject(e);
          }
        }
        instantiateAsync().catch(readyPromiseReject);
        return {};
      }
      function ExitStatus(status) {
        this.name = 'ExitStatus';
        this.message = 'Program terminated with exit(' + status + ')';
        this.status = status;
      }
      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          callbacks.shift()(Module);
        }
      }
      function _abort() {
        abort('');
      }
      function getHeapMax() {
        return 4294901760;
      }
      function _emscripten_get_heap_max() {
        return getHeapMax();
      }
      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest >>> 0, src >>> 0, (src + num) >>> 0);
      }
      function emscripten_realloc_buffer(size) {
        try {
          wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
          updateGlobalBufferAndViews(wasmMemory.buffer);
          return 1;
        } catch (e) {}
      }
      function _emscripten_resize_heap(requestedSize) {
        var oldSize = HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        var maxHeapSize = getHeapMax();
        if (requestedSize > maxHeapSize) {
          return false;
        }
        let alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
          var replacement = emscripten_realloc_buffer(newSize);
          if (replacement) {
            return true;
          }
        }
        return false;
      }
      function _fd_close(fd) {
        return 52;
      }
      function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
        return 70;
      }
      var printCharBuffers = [null, [], []];
      function printChar(stream, curr) {
        var buffer = printCharBuffers[stream];
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      }
      function _fd_write(fd, iov, iovcnt, pnum) {
        var num = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAPU32[iov >>> 2];
          var len = HEAPU32[(iov + 4) >>> 2];
          iov += 8;
          for (var j = 0; j < len; j++) {
            printChar(fd, HEAPU8[(ptr + j) >>> 0]);
          }
          num += len;
        }
        HEAPU32[pnum >>> 2] = num;
        return 0;
      }
      function getCFunc(ident) {
        var func = Module['_' + ident];
        return func;
      }
      function writeArrayToMemory(array, buffer) {
        HEAP8.set(array, buffer >>> 0);
      }
      function ccall(ident, returnType, argTypes, args, opts) {
        var toC = {
          string: str => {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
              var len = (str.length << 2) + 1;
              ret = stackAlloc(len);
              stringToUTF8(str, ret, len);
            }
            return ret;
          },
          array: arr => {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret;
          },
        };
        function convertReturnValue(ret) {
          if (returnType === 'string') {
            return UTF8ToString(ret);
          }
          if (returnType === 'boolean') return Boolean(ret);
          return ret;
        }
        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        if (args) {
          for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
              if (stack === 0) stack = stackSave();
              cArgs[i] = converter(args[i]);
            } else {
              cArgs[i] = args[i];
            }
          }
        }
        var ret = func.apply(null, cArgs);
        function onDone(ret) {
          if (stack !== 0) stackRestore(stack);
          return convertReturnValue(ret);
        }
        ret = onDone(ret);
        return ret;
      }
      function cwrap(ident, returnType, argTypes, opts) {
        argTypes = argTypes || [];
        var numericArgs = argTypes.every(type => type === 'number' || type === 'boolean');
        var numericRet = returnType !== 'string';
        if (numericRet && numericArgs && !opts) {
          return getCFunc(ident);
        }
        return function () {
          return ccall(ident, returnType, argTypes, arguments);
        };
      }
      var asmLibraryArg = {
        abort: _abort,
        emscripten_get_heap_max: _emscripten_get_heap_max,
        emscripten_memcpy_big: _emscripten_memcpy_big,
        emscripten_resize_heap: _emscripten_resize_heap,
        fd_close: _fd_close,
        fd_seek: _fd_seek,
        fd_write: _fd_write,
      };
      createWasm();
      Module['___wasm_call_ctors'] = function () {
        return (Module['___wasm_call_ctors'] = Module['asm']['__wasm_call_ctors']).apply(null, arguments);
      };
      Module['_init'] = function () {
        return (Module['_init'] = Module['asm']['init']).apply(null, arguments);
      };
      Module['_init_with_threads_count'] = function () {
        return (Module['_init_with_threads_count'] = Module['asm']['init_with_threads_count']).apply(null, arguments);
      };
      Module['_get_threads_count'] = function () {
        return (Module['_get_threads_count'] = Module['asm']['get_threads_count']).apply(null, arguments);
      };
      Module['_register_tensor'] = function () {
        return (Module['_register_tensor'] = Module['asm']['register_tensor']).apply(null, arguments);
      };
      Module['_dispose_data'] = function () {
        return (Module['_dispose_data'] = Module['asm']['dispose_data']).apply(null, arguments);
      };
      Module['_dispose'] = function () {
        return (Module['_dispose'] = Module['asm']['dispose']).apply(null, arguments);
      };
      Module['_Abs'] = function () {
        return (Module['_Abs'] = Module['asm']['Abs']).apply(null, arguments);
      };
      Module['_Acos'] = function () {
        return (Module['_Acos'] = Module['asm']['Acos']).apply(null, arguments);
      };
      Module['_Acosh'] = function () {
        return (Module['_Acosh'] = Module['asm']['Acosh']).apply(null, arguments);
      };
      Module['_Add'] = function () {
        return (Module['_Add'] = Module['asm']['Add']).apply(null, arguments);
      };
      Module['_AddN'] = function () {
        return (Module['_AddN'] = Module['asm']['AddN']).apply(null, arguments);
      };
      Module['_All'] = function () {
        return (Module['_All'] = Module['asm']['All']).apply(null, arguments);
      };
      Module['_Any'] = function () {
        return (Module['_Any'] = Module['asm']['Any']).apply(null, arguments);
      };
      Module['_ArgMax'] = function () {
        return (Module['_ArgMax'] = Module['asm']['ArgMax']).apply(null, arguments);
      };
      Module['_ArgMin'] = function () {
        return (Module['_ArgMin'] = Module['asm']['ArgMin']).apply(null, arguments);
      };
      Module['_Asin'] = function () {
        return (Module['_Asin'] = Module['asm']['Asin']).apply(null, arguments);
      };
      Module['_Asinh'] = function () {
        return (Module['_Asinh'] = Module['asm']['Asinh']).apply(null, arguments);
      };
      Module['_Atan'] = function () {
        return (Module['_Atan'] = Module['asm']['Atan']).apply(null, arguments);
      };
      Module['_Atan2'] = function () {
        return (Module['_Atan2'] = Module['asm']['Atan2']).apply(null, arguments);
      };
      Module['_Atanh'] = function () {
        return (Module['_Atanh'] = Module['asm']['Atanh']).apply(null, arguments);
      };
      Module['_AvgPool'] = function () {
        return (Module['_AvgPool'] = Module['asm']['AvgPool']).apply(null, arguments);
      };
      Module['_AvgPool3D'] = function () {
        return (Module['_AvgPool3D'] = Module['asm']['AvgPool3D']).apply(null, arguments);
      };
      Module['_AvgPool3DGrad'] = function () {
        return (Module['_AvgPool3DGrad'] = Module['asm']['AvgPool3DGrad']).apply(null, arguments);
      };
      Module['_AvgPoolGrad'] = function () {
        return (Module['_AvgPoolGrad'] = Module['asm']['AvgPoolGrad']).apply(null, arguments);
      };
      Module['_BatchMatMul'] = function () {
        return (Module['_BatchMatMul'] = Module['asm']['BatchMatMul']).apply(null, arguments);
      };
      Module['_Bincount'] = function () {
        return (Module['_Bincount'] = Module['asm']['Bincount']).apply(null, arguments);
      };
      Module['_BitwiseAnd'] = function () {
        return (Module['_BitwiseAnd'] = Module['asm']['BitwiseAnd']).apply(null, arguments);
      };
      Module['_Ceil'] = function () {
        return (Module['_Ceil'] = Module['asm']['Ceil']).apply(null, arguments);
      };
      Module['_ClipByValue'] = function () {
        return (Module['_ClipByValue'] = Module['asm']['ClipByValue']).apply(null, arguments);
      };
      Module['_Conv2D'] = function () {
        return (Module['_Conv2D'] = Module['asm']['Conv2D']).apply(null, arguments);
      };
      Module['_Conv2DBackpropInput'] = function () {
        return (Module['_Conv2DBackpropInput'] = Module['asm']['Conv2DBackpropInput']).apply(null, arguments);
      };
      Module['_Conv3D'] = function () {
        return (Module['_Conv3D'] = Module['asm']['Conv3D']).apply(null, arguments);
      };
      Module['_Conv3DBackpropFilterV2'] = function () {
        return (Module['_Conv3DBackpropFilterV2'] = Module['asm']['Conv3DBackpropFilterV2']).apply(null, arguments);
      };
      Module['_Conv3DBackpropInputV2'] = function () {
        return (Module['_Conv3DBackpropInputV2'] = Module['asm']['Conv3DBackpropInputV2']).apply(null, arguments);
      };
      Module['_Cos'] = function () {
        return (Module['_Cos'] = Module['asm']['Cos']).apply(null, arguments);
      };
      Module['_Cosh'] = function () {
        return (Module['_Cosh'] = Module['asm']['Cosh']).apply(null, arguments);
      };
      Module['_CropAndResize'] = function () {
        return (Module['_CropAndResize'] = Module['asm']['CropAndResize']).apply(null, arguments);
      };
      Module['_Cumprod'] = function () {
        return (Module['_Cumprod'] = Module['asm']['Cumprod']).apply(null, arguments);
      };
      Module['_Cumsum'] = function () {
        return (Module['_Cumsum'] = Module['asm']['Cumsum']).apply(null, arguments);
      };
      Module['_DenseBincount'] = function () {
        return (Module['_DenseBincount'] = Module['asm']['DenseBincount']).apply(null, arguments);
      };
      Module['_DepthToSpace'] = function () {
        return (Module['_DepthToSpace'] = Module['asm']['DepthToSpace']).apply(null, arguments);
      };
      Module['_DepthwiseConv2dNative'] = function () {
        return (Module['_DepthwiseConv2dNative'] = Module['asm']['DepthwiseConv2dNative']).apply(null, arguments);
      };
      Module['_Diag'] = function () {
        return (Module['_Diag'] = Module['asm']['Diag']).apply(null, arguments);
      };
      Module['_Dilation2D'] = function () {
        return (Module['_Dilation2D'] = Module['asm']['Dilation2D']).apply(null, arguments);
      };
      Module['_Dilation2DBackpropFilter'] = function () {
        return (Module['_Dilation2DBackpropFilter'] = Module['asm']['Dilation2DBackpropFilter']).apply(null, arguments);
      };
      Module['_Dilation2DBackpropInput'] = function () {
        return (Module['_Dilation2DBackpropInput'] = Module['asm']['Dilation2DBackpropInput']).apply(null, arguments);
      };
      Module['_Elu'] = function () {
        return (Module['_Elu'] = Module['asm']['Elu']).apply(null, arguments);
      };
      Module['_EluGrad'] = function () {
        return (Module['_EluGrad'] = Module['asm']['EluGrad']).apply(null, arguments);
      };
      Module['_Equal'] = function () {
        return (Module['_Equal'] = Module['asm']['Equal']).apply(null, arguments);
      };
      Module['_Erf'] = function () {
        return (Module['_Erf'] = Module['asm']['Erf']).apply(null, arguments);
      };
      Module['_Exp'] = function () {
        return (Module['_Exp'] = Module['asm']['Exp']).apply(null, arguments);
      };
      Module['_Expm1'] = function () {
        return (Module['_Expm1'] = Module['asm']['Expm1']).apply(null, arguments);
      };
      Module['_FlipLeftRight'] = function () {
        return (Module['_FlipLeftRight'] = Module['asm']['FlipLeftRight']).apply(null, arguments);
      };
      Module['_Floor'] = function () {
        return (Module['_Floor'] = Module['asm']['Floor']).apply(null, arguments);
      };
      Module['_FloorDiv'] = function () {
        return (Module['_FloorDiv'] = Module['asm']['FloorDiv']).apply(null, arguments);
      };
      Module['_FusedBatchNorm'] = function () {
        return (Module['_FusedBatchNorm'] = Module['asm']['FusedBatchNorm']).apply(null, arguments);
      };
      Module['_FusedConv2D'] = function () {
        return (Module['_FusedConv2D'] = Module['asm']['FusedConv2D']).apply(null, arguments);
      };
      Module['_FusedDepthwiseConv2D'] = function () {
        return (Module['_FusedDepthwiseConv2D'] = Module['asm']['FusedDepthwiseConv2D']).apply(null, arguments);
      };
      Module['_Gather'] = function () {
        return (Module['_Gather'] = Module['asm']['Gather']).apply(null, arguments);
      };
      Module['_GatherNd'] = function () {
        return (Module['_GatherNd'] = Module['asm']['GatherNd']).apply(null, arguments);
      };
      Module['_Greater'] = function () {
        return (Module['_Greater'] = Module['asm']['Greater']).apply(null, arguments);
      };
      Module['_GreaterEqual'] = function () {
        return (Module['_GreaterEqual'] = Module['asm']['GreaterEqual']).apply(null, arguments);
      };
      Module['_IsFinite'] = function () {
        return (Module['_IsFinite'] = Module['asm']['IsFinite']).apply(null, arguments);
      };
      Module['_IsInf'] = function () {
        return (Module['_IsInf'] = Module['asm']['IsInf']).apply(null, arguments);
      };
      Module['_IsNan'] = function () {
        return (Module['_IsNan'] = Module['asm']['IsNan']).apply(null, arguments);
      };
      Module['_LRN'] = function () {
        return (Module['_LRN'] = Module['asm']['LRN']).apply(null, arguments);
      };
      Module['_LRNGrad'] = function () {
        return (Module['_LRNGrad'] = Module['asm']['LRNGrad']).apply(null, arguments);
      };
      Module['_LeakyRelu'] = function () {
        return (Module['_LeakyRelu'] = Module['asm']['LeakyRelu']).apply(null, arguments);
      };
      Module['_Less'] = function () {
        return (Module['_Less'] = Module['asm']['Less']).apply(null, arguments);
      };
      Module['_LessEqual'] = function () {
        return (Module['_LessEqual'] = Module['asm']['LessEqual']).apply(null, arguments);
      };
      Module['_LinSpace'] = function () {
        return (Module['_LinSpace'] = Module['asm']['LinSpace']).apply(null, arguments);
      };
      Module['_Log'] = function () {
        return (Module['_Log'] = Module['asm']['Log']).apply(null, arguments);
      };
      Module['_Log1p'] = function () {
        return (Module['_Log1p'] = Module['asm']['Log1p']).apply(null, arguments);
      };
      Module['_LogicalAnd'] = function () {
        return (Module['_LogicalAnd'] = Module['asm']['LogicalAnd']).apply(null, arguments);
      };
      Module['_LogicalNot'] = function () {
        return (Module['_LogicalNot'] = Module['asm']['LogicalNot']).apply(null, arguments);
      };
      Module['_LogicalOr'] = function () {
        return (Module['_LogicalOr'] = Module['asm']['LogicalOr']).apply(null, arguments);
      };
      Module['_LogicalXor'] = function () {
        return (Module['_LogicalXor'] = Module['asm']['LogicalXor']).apply(null, arguments);
      };
      Module['_Max'] = function () {
        return (Module['_Max'] = Module['asm']['Max']).apply(null, arguments);
      };
      Module['_MaxPool'] = function () {
        return (Module['_MaxPool'] = Module['asm']['MaxPool']).apply(null, arguments);
      };
      Module['_MaxPool3D'] = function () {
        return (Module['_MaxPool3D'] = Module['asm']['MaxPool3D']).apply(null, arguments);
      };
      Module['_MaxPool3DGrad'] = function () {
        return (Module['_MaxPool3DGrad'] = Module['asm']['MaxPool3DGrad']).apply(null, arguments);
      };
      Module['_MaxPoolGrad'] = function () {
        return (Module['_MaxPoolGrad'] = Module['asm']['MaxPoolGrad']).apply(null, arguments);
      };
      Module['_MaxPoolWithArgmax'] = function () {
        return (Module['_MaxPoolWithArgmax'] = Module['asm']['MaxPoolWithArgmax']).apply(null, arguments);
      };
      Module['_Maximum'] = function () {
        return (Module['_Maximum'] = Module['asm']['Maximum']).apply(null, arguments);
      };
      Module['_Mean'] = function () {
        return (Module['_Mean'] = Module['asm']['Mean']).apply(null, arguments);
      };
      Module['_Min'] = function () {
        return (Module['_Min'] = Module['asm']['Min']).apply(null, arguments);
      };
      Module['_Minimum'] = function () {
        return (Module['_Minimum'] = Module['asm']['Minimum']).apply(null, arguments);
      };
      Module['_MirrorPad'] = function () {
        return (Module['_MirrorPad'] = Module['asm']['MirrorPad']).apply(null, arguments);
      };
      Module['_Mod'] = function () {
        return (Module['_Mod'] = Module['asm']['Mod']).apply(null, arguments);
      };
      Module['_Multinomial'] = function () {
        return (Module['_Multinomial'] = Module['asm']['Multinomial']).apply(null, arguments);
      };
      Module['_Multiply'] = function () {
        return (Module['_Multiply'] = Module['asm']['Multiply']).apply(null, arguments);
      };
      Module['_Neg'] = function () {
        return (Module['_Neg'] = Module['asm']['Neg']).apply(null, arguments);
      };
      Module['_NonMaxSuppressionV3'] = function () {
        return (Module['_NonMaxSuppressionV3'] = Module['asm']['NonMaxSuppressionV3']).apply(null, arguments);
      };
      Module['_NonMaxSuppressionV4'] = function () {
        return (Module['_NonMaxSuppressionV4'] = Module['asm']['NonMaxSuppressionV4']).apply(null, arguments);
      };
      Module['_NonMaxSuppressionV5'] = function () {
        return (Module['_NonMaxSuppressionV5'] = Module['asm']['NonMaxSuppressionV5']).apply(null, arguments);
      };
      Module['_NotEqual'] = function () {
        return (Module['_NotEqual'] = Module['asm']['NotEqual']).apply(null, arguments);
      };
      Module['_OneHot'] = function () {
        return (Module['_OneHot'] = Module['asm']['OneHot']).apply(null, arguments);
      };
      Module['_PadV2'] = function () {
        return (Module['_PadV2'] = Module['asm']['PadV2']).apply(null, arguments);
      };
      Module['_Pow'] = function () {
        return (Module['_Pow'] = Module['asm']['Pow']).apply(null, arguments);
      };
      Module['_Prelu'] = function () {
        return (Module['_Prelu'] = Module['asm']['Prelu']).apply(null, arguments);
      };
      Module['_Prod'] = function () {
        return (Module['_Prod'] = Module['asm']['Prod']).apply(null, arguments);
      };
      Module['_RealDiv'] = function () {
        return (Module['_RealDiv'] = Module['asm']['RealDiv']).apply(null, arguments);
      };
      Module['_Reciprocal'] = function () {
        return (Module['_Reciprocal'] = Module['asm']['Reciprocal']).apply(null, arguments);
      };
      Module['_Relu'] = function () {
        return (Module['_Relu'] = Module['asm']['Relu']).apply(null, arguments);
      };
      Module['_Relu6'] = function () {
        return (Module['_Relu6'] = Module['asm']['Relu6']).apply(null, arguments);
      };
      Module['_ResizeBilinear'] = function () {
        return (Module['_ResizeBilinear'] = Module['asm']['ResizeBilinear']).apply(null, arguments);
      };
      Module['_ResizeBilinearGrad'] = function () {
        return (Module['_ResizeBilinearGrad'] = Module['asm']['ResizeBilinearGrad']).apply(null, arguments);
      };
      Module['_ResizeNearestNeighbor'] = function () {
        return (Module['_ResizeNearestNeighbor'] = Module['asm']['ResizeNearestNeighbor']).apply(null, arguments);
      };
      Module['_ResizeNearestNeighborGrad'] = function () {
        return (Module['_ResizeNearestNeighborGrad'] = Module['asm']['ResizeNearestNeighborGrad']).apply(null, arguments);
      };
      Module['_Reverse'] = function () {
        return (Module['_Reverse'] = Module['asm']['Reverse']).apply(null, arguments);
      };
      Module['_RotateWithOffset'] = function () {
        return (Module['_RotateWithOffset'] = Module['asm']['RotateWithOffset']).apply(null, arguments);
      };
      Module['_Round'] = function () {
        return (Module['_Round'] = Module['asm']['Round']).apply(null, arguments);
      };
      Module['_Rsqrt'] = function () {
        return (Module['_Rsqrt'] = Module['asm']['Rsqrt']).apply(null, arguments);
      };
      Module['_ScatterNd'] = function () {
        return (Module['_ScatterNd'] = Module['asm']['ScatterNd']).apply(null, arguments);
      };
      Module['_SearchSorted'] = function () {
        return (Module['_SearchSorted'] = Module['asm']['SearchSorted']).apply(null, arguments);
      };
      Module['_SelectV2'] = function () {
        return (Module['_SelectV2'] = Module['asm']['SelectV2']).apply(null, arguments);
      };
      Module['_Selu'] = function () {
        return (Module['_Selu'] = Module['asm']['Selu']).apply(null, arguments);
      };
      Module['_Sigmoid'] = function () {
        return (Module['_Sigmoid'] = Module['asm']['Sigmoid']).apply(null, arguments);
      };
      Module['_Sign'] = function () {
        return (Module['_Sign'] = Module['asm']['Sign']).apply(null, arguments);
      };
      Module['_Sin'] = function () {
        return (Module['_Sin'] = Module['asm']['Sin']).apply(null, arguments);
      };
      Module['_Sinh'] = function () {
        return (Module['_Sinh'] = Module['asm']['Sinh']).apply(null, arguments);
      };
      Module['_Softmax'] = function () {
        return (Module['_Softmax'] = Module['asm']['Softmax']).apply(null, arguments);
      };
      Module['_Softplus'] = function () {
        return (Module['_Softplus'] = Module['asm']['Softplus']).apply(null, arguments);
      };
      Module['_SparseFillEmptyRows'] = function () {
        return (Module['_SparseFillEmptyRows'] = Module['asm']['SparseFillEmptyRows']).apply(null, arguments);
      };
      Module['_SparseReshape'] = function () {
        return (Module['_SparseReshape'] = Module['asm']['SparseReshape']).apply(null, arguments);
      };
      Module['_SparseSegmentReduction'] = function () {
        return (Module['_SparseSegmentReduction'] = Module['asm']['SparseSegmentReduction']).apply(null, arguments);
      };
      Module['_SparseToDense'] = function () {
        return (Module['_SparseToDense'] = Module['asm']['SparseToDense']).apply(null, arguments);
      };
      Module['_Sqrt'] = function () {
        return (Module['_Sqrt'] = Module['asm']['Sqrt']).apply(null, arguments);
      };
      Module['_Square'] = function () {
        return (Module['_Square'] = Module['asm']['Square']).apply(null, arguments);
      };
      Module['_SquaredDifference'] = function () {
        return (Module['_SquaredDifference'] = Module['asm']['SquaredDifference']).apply(null, arguments);
      };
      Module['_Step'] = function () {
        return (Module['_Step'] = Module['asm']['Step']).apply(null, arguments);
      };
      Module['_StridedSlice'] = function () {
        return (Module['_StridedSlice'] = Module['asm']['StridedSlice']).apply(null, arguments);
      };
      Module['_Sub'] = function () {
        return (Module['_Sub'] = Module['asm']['Sub']).apply(null, arguments);
      };
      Module['_Sum'] = function () {
        return (Module['_Sum'] = Module['asm']['Sum']).apply(null, arguments);
      };
      Module['_Tan'] = function () {
        return (Module['_Tan'] = Module['asm']['Tan']).apply(null, arguments);
      };
      Module['_Tanh'] = function () {
        return (Module['_Tanh'] = Module['asm']['Tanh']).apply(null, arguments);
      };
      Module['_TensorScatterUpdate'] = function () {
        return (Module['_TensorScatterUpdate'] = Module['asm']['TensorScatterUpdate']).apply(null, arguments);
      };
      Module['_Tile'] = function () {
        return (Module['_Tile'] = Module['asm']['Tile']).apply(null, arguments);
      };
      Module['_TopK'] = function () {
        return (Module['_TopK'] = Module['asm']['TopK']).apply(null, arguments);
      };
      Module['_Transform'] = function () {
        return (Module['_Transform'] = Module['asm']['Transform']).apply(null, arguments);
      };
      Module['_Transpose'] = function () {
        return (Module['_Transpose'] = Module['asm']['Transpose']).apply(null, arguments);
      };
      Module['__FusedMatMul'] = function () {
        return (Module['__FusedMatMul'] = Module['asm']['_FusedMatMul']).apply(null, arguments);
      };
      Module['_malloc'] = function () {
        return (Module['_malloc'] = Module['asm']['malloc']).apply(null, arguments);
      };
      Module['_free'] = function () {
        return (Module['_free'] = Module['asm']['free']).apply(null, arguments);
      };
      Module['___errno_location'] = function () {
        return (Module['___errno_location'] = Module['asm']['__errno_location']).apply(null, arguments);
      };
      var stackSave = (Module['stackSave'] = function () {
        return (stackSave = Module['stackSave'] = Module['asm']['stackSave']).apply(null, arguments);
      });
      var stackRestore = (Module['stackRestore'] = function () {
        return (stackRestore = Module['stackRestore'] = Module['asm']['stackRestore']).apply(null, arguments);
      });
      var stackAlloc = (Module['stackAlloc'] = function () {
        return (stackAlloc = Module['stackAlloc'] = Module['asm']['stackAlloc']).apply(null, arguments);
      });
      Module['dynCall_iijjiiii'] = function () {
        return (Module['dynCall_iijjiiii'] = Module['asm']['dynCall_iijjiiii']).apply(null, arguments);
      };
      Module['dynCall_jiji'] = function () {
        return (Module['dynCall_jiji'] = Module['asm']['dynCall_jiji']).apply(null, arguments);
      };
      Module['cwrap'] = cwrap;
      var calledRun;
      dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller;
      };
      function run(args) {
        if (runDependencies > 0) {
          return;
        }
        preRun();
        if (runDependencies > 0) {
          return;
        }
        function doRun() {
          if (calledRun) return;
          calledRun = true;
          Module['calledRun'] = true;
          if (ABORT) return;
          initRuntime();
          readyPromiseResolve(Module);
          if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
          postRun();
        }
        if (Module['setStatus']) {
          Module['setStatus']('Running...');
          setTimeout(function () {
            setTimeout(function () {
              Module['setStatus']('');
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
      }
      if (Module['preInit']) {
        if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
        while (Module['preInit'].length > 0) {
          Module['preInit'].pop()();
        }
      }
      run();
      var listenersAdded;
      if (beforeListeners) {
        listenersAdded = {
          uncaughtException: process.listeners('uncaughtException').filter(function (listener) {
            return !beforeListeners.uncaughtException.indexOf(listener) > -1;
          }),
          unhandledRejection: process.listeners('unhandledRejection').filter(function (listener) {
            return !beforeListeners.unhandledRejection.indexOf(listener) > -1;
          }),
        };
      }
      var actualModule;
      if (typeof WasmBackendModule !== 'undefined') {
        actualModule = WasmBackendModule;
      } else if (typeof WasmBackendModuleThreadedSimd !== 'undefined') {
        actualModule = WasmBackendModuleThreadedSimd;
      } else {
        throw new Error('Could not find wasm module in post.js');
      }
      if (listenersAdded) {
        var tmpDispose = actualModule['_dispose'];
        actualModule['_dispose'] = function () {
          tmpDispose();
          listenersAdded.uncaughtException.forEach(function (listener) {
            process.removeListener('uncaughtException', listener);
          });
          listenersAdded.unhandledRejection.forEach(function (listener) {
            process.removeListener('unhandledRejection', listener);
          });
        };
      }

      return WasmBackendModule.ready;
    };
  })();
  module.exports = WasmBackendModule;
})(tfjsBackendWasm$1);

var tfjsBackendWasmExports = tfjsBackendWasm$1.exports;
var tfjsBackendWasm = /*@__PURE__*/ getDefaultExportFromCjs(tfjsBackendWasmExports);

var wasmFactory_import = /*#__PURE__*/ _mergeNamespaces(
  {
    __proto__: null,
    default: tfjsBackendWasm,
  },
  [tfjsBackendWasmExports],
);

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// This workaround is required for importing in Node.js without using
// the node bundle (for testing). This would not be necessary if we
// flipped esModuleInterop to true, but we likely can't do that since
// google3 does not use it.
const wasmFactoryThreadedSimd = tfjsBackendWasmThreadedSimd || wasmFactoryThreadedSimd_import;
const wasmFactory = tfjsBackendWasm || wasmFactory_import;
class BackendWasm extends KernelBackend {
  constructor(wasm) {
    super();
    this.wasm = wasm;
    // 0 is reserved for null data ids.
    this.dataIdNextNumber = 1;
    this.wasm.tfjs.initWithThreadsCount(threadsCount);
    actualThreadsCount = this.wasm.tfjs.getThreadsCount();
    this.dataIdMap = new DataStorage(this, engine());
  }
  write(values, shape, dtype) {
    const dataId = { id: this.dataIdNextNumber++ };
    this.move(dataId, values, shape, dtype, 1);
    return dataId;
  }
  numDataIds() {
    return this.dataIdMap.numDataIds();
  }
  async time(f) {
    const start = util.now();
    f();
    const kernelMs = util.now() - start;
    return { kernelMs };
  }
  move(dataId, values, shape, dtype, refCount) {
    const id = this.dataIdNextNumber++;
    if (dtype === 'string') {
      const stringBytes = values;
      this.dataIdMap.set(dataId, { id, stringBytes, shape, dtype, memoryOffset: null, refCount });
      return;
    }
    const size = util.sizeFromShape(shape);
    const numBytes = size * util.bytesPerElement(dtype);
    // `>>> 0` is needed for above 2GB allocations because wasm._malloc returns
    // a signed int32 instead of an unsigned int32.
    // https://v8.dev/blog/4gb-wasm-memory
    const memoryOffset = this.wasm._malloc(numBytes) >>> 0;
    this.dataIdMap.set(dataId, { id, memoryOffset, shape, dtype, refCount });
    this.wasm.tfjs.registerTensor(id, size, memoryOffset);
    if (values != null) {
      this.wasm.HEAPU8.set(new Uint8Array(values.buffer, values.byteOffset, numBytes), memoryOffset);
    }
  }
  async read(dataId) {
    return this.readSync(dataId);
  }
  readSync(dataId, start, end) {
    const { memoryOffset, dtype, shape, stringBytes } = this.dataIdMap.get(dataId);
    if (dtype === 'string') {
      // Slice all elements.
      if ((start == null || start === 0) && (end == null || end >= stringBytes.length)) {
        return stringBytes;
      }
      return stringBytes.slice(start, end);
    }
    start = start || 0;
    end = end || util.sizeFromShape(shape);
    const bytesPerElement = util.bytesPerElement(dtype);
    const bytes = this.wasm.HEAPU8.slice(memoryOffset + start * bytesPerElement, memoryOffset + end * bytesPerElement);
    return typedArrayFromBuffer(bytes.buffer, dtype);
  }
  /**
   * Dispose the memory if the dataId has 0 refCount. Return true if the memory
   * is released, false otherwise.
   * @param dataId
   * @oaram force Optional, remove the data regardless of refCount
   */
  disposeData(dataId, force = false) {
    if (this.dataIdMap.has(dataId)) {
      const data = this.dataIdMap.get(dataId);
      data.refCount--;
      if (!force && data.refCount > 0) {
        return false;
      }
      this.wasm._free(data.memoryOffset);
      this.wasm.tfjs.disposeData(data.id);
      this.dataIdMap.delete(dataId);
    }
    return true;
  }
  /** Return refCount of a `TensorData`. */
  refCount(dataId) {
    if (this.dataIdMap.has(dataId)) {
      const tensorData = this.dataIdMap.get(dataId);
      return tensorData.refCount;
    }
    return 0;
  }
  incRef(dataId) {
    const data = this.dataIdMap.get(dataId);
    if (data != null) {
      data.refCount++;
    }
  }
  floatPrecision() {
    return 32;
  }
  // Returns the memory offset of a tensor. Useful for debugging and unit
  // testing.
  getMemoryOffset(dataId) {
    return this.dataIdMap.get(dataId).memoryOffset;
  }
  dispose() {
    this.wasm.tfjs.dispose();
    if ('PThread' in this.wasm) {
      this.wasm.PThread.terminateAllThreads();
    }
    this.wasm = null;
  }
  memory() {
    return { unreliable: false };
  }
  /**
   * Make a tensor info for the output of an op. If `memoryOffset` is not
   * present, this method allocates memory on the WASM heap. If `memoryOffset`
   * is present, the memory was allocated elsewhere (in c++) and we just record
   * the pointer where that memory lives.
   */
  makeOutput(shape, dtype, memoryOffset, values) {
    let dataId;
    if (memoryOffset == null) {
      dataId = this.write(values !== null && values !== void 0 ? values : null, shape, dtype);
    } else {
      const id = this.dataIdNextNumber++;
      dataId = { id };
      this.dataIdMap.set(dataId, { id, memoryOffset, shape, dtype, refCount: 1 });
      const size = util.sizeFromShape(shape);
      this.wasm.tfjs.registerTensor(id, size, memoryOffset);
    }
    return { dataId, shape, dtype };
  }
  typedArrayFromHeap({ shape, dtype, dataId }) {
    const buffer = this.wasm.HEAPU8.buffer;
    const { memoryOffset } = this.dataIdMap.get(dataId);
    const size = util.sizeFromShape(shape);
    switch (dtype) {
      case 'float32':
        return new Float32Array(buffer, memoryOffset, size);
      case 'int32':
        return new Int32Array(buffer, memoryOffset, size);
      case 'bool':
        return new Uint8Array(buffer, memoryOffset, size);
      default:
        throw new Error(`Unknown dtype ${dtype}`);
    }
  }
}
function createInstantiateWasmFunc(path) {
  // this will be replace by rollup plugin patchWechatWebAssembly in
  // minprogram's output.
  // tslint:disable-next-line:no-any
  return (imports, callback) => {
    util.fetch(path, { credentials: 'same-origin' }).then(response => {
      if (!response['ok']) {
        imports.env.a(`failed to load wasm binary file at '${path}'`);
      }
      response.arrayBuffer().then(binary => {
        WebAssembly.instantiate(binary, imports).then(output => {
          callback(output.instance, output.module);
        });
      });
    });
    return {};
  };
}
/**
 * Returns the path of the WASM binary.
 * @param simdSupported whether SIMD is supported
 * @param threadsSupported whether multithreading is supported
 * @param wasmModuleFolder the directory containing the WASM binaries.
 */
function getPathToWasmBinary(simdSupported, threadsSupported, wasmModuleFolder) {
  if (wasmPath != null) {
    // If wasmPath is defined, the user has supplied a full path to
    // the vanilla .wasm binary.
    return wasmPath;
  }
  let path = 'tfjs-backend-wasm.wasm';
  if (simdSupported && threadsSupported) {
    path = 'tfjs-backend-wasm-threaded-simd.wasm';
  } else if (simdSupported) {
    path = 'tfjs-backend-wasm-simd.wasm';
  }
  if (wasmFileMap != null) {
    if (wasmFileMap[path] != null) {
      return wasmFileMap[path];
    }
  }
  return wasmModuleFolder + path;
}
/**
 * Initializes the wasm module and creates the js <--> wasm bridge.
 *
 * NOTE: We wrap the wasm module in a object with property 'wasm' instead of
 * returning Promise<BackendWasmModule> to avoid freezing Chrome (last tested
 * in Chrome 76).
 */
async function init() {
  const [simdSupported, threadsSupported] = await Promise.all([
    env().getAsync('WASM_HAS_SIMD_SUPPORT'),
    env().getAsync('WASM_HAS_MULTITHREAD_SUPPORT'),
  ]);
  return new Promise((resolve, reject) => {
    const factoryConfig = {};
    /**
     * This function overrides the Emscripten module locateFile utility.
     * @param path The relative path to the file that needs to be loaded.
     * @param prefix The path to the main JavaScript file's directory.
     */
    factoryConfig.locateFile = (path, prefix) => {
      if (path.endsWith('.worker.js')) {
        // Escape '\n' because Blob will turn it into a newline.
        // There should be a setting for this, but 'endings: "native"' does
        // not seem to work.
        const response = wasmWorkerContents.replace(/\n/g, '\\n');
        const blob = new Blob([response], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
      }
      if (path.endsWith('.wasm')) {
        return getPathToWasmBinary(simdSupported, threadsSupported, wasmPathPrefix != null ? wasmPathPrefix : prefix);
      }
      return prefix + path;
    };
    // Use the instantiateWasm override when system fetch is not available.
    // Reference:
    // https://github.com/emscripten-core/emscripten/blob/2bca083cbbd5a4133db61fbd74d04f7feecfa907/tests/manual_wasm_instantiate.html#L170
    if (customFetch) {
      factoryConfig.instantiateWasm = createInstantiateWasmFunc(
        getPathToWasmBinary(simdSupported, threadsSupported, wasmPathPrefix != null ? wasmPathPrefix : ''),
      );
    }
    let initialized = false;
    factoryConfig.onAbort = () => {
      if (initialized) {
        // Emscripten already called console.warn so no need to double log.
        return;
      }
      if (initAborted) {
        // Emscripten calls `onAbort` twice, resulting in double error
        // messages.
        return;
      }
      initAborted = true;
      const rejectMsg =
        'Make sure the server can serve the `.wasm` file relative to the ' +
        'bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers';
      reject({ message: rejectMsg });
    };
    let wasm;
    // If `wasmPath` has been defined we must initialize the vanilla module.
    if (threadsSupported && simdSupported && wasmPath == null) {
      factoryConfig.mainScriptUrlOrBlob = new Blob([`var WasmBackendModuleThreadedSimd = ` + wasmFactoryThreadedSimd.toString()], {
        type: 'text/javascript',
      });
      wasm = wasmFactoryThreadedSimd(factoryConfig);
    } else {
      // The wasmFactory works for both vanilla and SIMD binaries.
      wasm = wasmFactory(factoryConfig);
    }
    // The `wasm` promise will resolve to the WASM module created by
    // the factory, but it might have had errors during creation. Most
    // errors are caught by the onAbort callback defined above.
    // However, some errors, such as those occurring from a
    // failed fetch, result in this promise being rejected. These are
    // caught and re-rejected below.
    wasm
      .then(module => {
        initialized = true;
        initAborted = false;
        const voidReturnType = null;
        // Using the tfjs namespace to avoid conflict with emscripten's API.
        module.tfjs = {
          init: module.cwrap('init', null, []),
          initWithThreadsCount: module.cwrap('init_with_threads_count', null, ['number']),
          getThreadsCount: module.cwrap('get_threads_count', 'number', []),
          registerTensor: module.cwrap('register_tensor', null, [
            'number',
            'number',
            'number', // memoryOffset
          ]),
          disposeData: module.cwrap('dispose_data', voidReturnType, ['number']),
          dispose: module.cwrap('dispose', voidReturnType, []),
        };
        resolve({ wasm: module });
      })
      .catch(reject);
  });
}
function typedArrayFromBuffer(buffer, dtype) {
  switch (dtype) {
    case 'float32':
      return new Float32Array(buffer);
    case 'int32':
      return new Int32Array(buffer);
    case 'bool':
      return new Uint8Array(buffer);
    default:
      throw new Error(`Unknown dtype ${dtype}`);
  }
}
const wasmBinaryNames = ['tfjs-backend-wasm.wasm', 'tfjs-backend-wasm-simd.wasm', 'tfjs-backend-wasm-threaded-simd.wasm'];
let wasmPath = null;
let wasmPathPrefix = null;
let wasmFileMap = {};
let initAborted = false;
let customFetch = false;
/**
 * @deprecated Use `setWasmPaths` instead.
 * Sets the path to the `.wasm` file which will be fetched when the wasm
 * backend is initialized. See
 * https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers
 * for more details.
 * @param path wasm file path or url
 * @param usePlatformFetch optional boolean to use platform fetch to download
 *     the wasm file, default to false.
 *
 * @doc {heading: 'Environment', namespace: 'wasm'}
 */
function setWasmPath(path, usePlatformFetch = false) {
  deprecationWarn('setWasmPath has been deprecated in favor of setWasmPaths and' + ' will be removed in a future release.');
  if (initAborted) {
    throw new Error(
      'The WASM backend was already initialized. Make sure you call ' + '`setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`',
    );
  }
  wasmPath = path;
  customFetch = usePlatformFetch;
}
/**
 * Configures the locations of the WASM binaries.
 *
 * ```js
 * setWasmPaths({
 *  'tfjs-backend-wasm.wasm': 'renamed.wasm',
 *  'tfjs-backend-wasm-simd.wasm': 'renamed-simd.wasm',
 *  'tfjs-backend-wasm-threaded-simd.wasm': 'renamed-threaded-simd.wasm'
 * });
 * tf.setBackend('wasm');
 * ```
 *
 * @param prefixOrFileMap This can be either a string or object:
 *  - (string) The path to the directory where the WASM binaries are located.
 *     Note that this prefix will be used to load each binary (vanilla,
 *     SIMD-enabled, threading-enabled, etc.).
 *  - (object) Mapping from names of WASM binaries to custom
 *     full paths specifying the locations of those binaries. This is useful if
 *     your WASM binaries are not all located in the same directory, or if your
 *     WASM binaries have been renamed.
 * @param usePlatformFetch optional boolean to use platform fetch to download
 *     the wasm file, default to false.
 *
 * @doc {heading: 'Environment', namespace: 'wasm'}
 */
function setWasmPaths(prefixOrFileMap, usePlatformFetch = false) {
  if (initAborted) {
    throw new Error(
      'The WASM backend was already initialized. Make sure you call ' +
        '`setWasmPaths()` before you call `tf.setBackend()` or ' +
        '`tf.ready()`',
    );
  }
  if (typeof prefixOrFileMap === 'string') {
    wasmPathPrefix = prefixOrFileMap;
  } else {
    wasmFileMap = prefixOrFileMap;
    const missingPaths = wasmBinaryNames.filter(name => wasmFileMap[name] == null);
    if (missingPaths.length > 0) {
      throw new Error(
        `There were no entries found for the following binaries: ` +
          `${missingPaths.join(',')}. Please either call setWasmPaths with a ` +
          `map providing a path for each binary, or with a string indicating ` +
          `the directory where all the binaries can be found.`,
      );
    }
  }
  customFetch = usePlatformFetch;
}
let threadsCount = -1;
let actualThreadsCount = -1;
/**
 * Sets the number of threads that will be used by XNNPACK to create
 * threadpool (default to the number of logical CPU cores).
 *
 * This must be called before calling `tf.setBackend('wasm')`.
 */
function setThreadsCount(numThreads) {
  threadsCount = numThreads;
}
/**
 * Gets the actual threads count that is used by XNNPACK.
 *
 * It is set after the backend is intialized.
 */
function getThreadsCount() {
  if (actualThreadsCount === -1) {
    throw new Error(`WASM backend not initialized.`);
  }
  return actualThreadsCount;
}

/** @license See the LICENSE file. */
// This code is auto-generated, do not modify this file!
const version = '4.13.0';

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const WASM_PRIORITY = 2;
registerBackend(
  'wasm',
  async () => {
    const { wasm } = await init();
    return new BackendWasm(wasm);
  },
  WASM_PRIORITY,
);

export { BackendWasm, getThreadsCount, setThreadsCount, setWasmPath, setWasmPaths, version as version_wasm };
//# sourceMappingURL=tf-backend-wasm.fesm.js.map
