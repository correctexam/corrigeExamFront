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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('@tensorflow/tfjs-core'), require('fs'), require('path'), require('perf_hooks'), require('os'))
    : typeof define === 'function' && define.amd
    ? define(['exports', '@tensorflow/tfjs-core', 'fs', 'path', 'perf_hooks', 'os'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory(
        ((global.tf = global.tf || {}), (global.tf.wasm = global.tf.wasm || {})),
        global.tf,
        global.fs,
        global.path,
        global.perf_hooks,
        global.require$$4,
      ));
})(this, function (exports, tfjsCore, require$$0, require$$1, require$$3, require$$4) {
  'use strict';

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

  /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
  /* global Reflect, Promise */
  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== 'function' && b !== null) throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
  }
  function __read(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
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

  var wasmFusedMatMul;
  function setup$1a(backend) {
    wasmFusedMatMul = backend.wasm.cwrap(tfjsCore._FusedMatMul, null /* void */, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var a = inputs.a,
      b = inputs.b,
      bias = inputs.bias,
      preluActivationWeights = inputs.preluActivationWeights;
    if (a.dtype !== 'float32' || b.dtype !== 'float32') {
      throw new Error('_FusedMatMul for non non-float32 tensors not yet supported.');
    }
    var transposeA = attrs.transposeA,
      transposeB = attrs.transposeB,
      activation = attrs.activation,
      leakyreluAlpha = attrs.leakyreluAlpha;
    var aId = backend.dataIdMap.get(a.dataId).id;
    var bId = backend.dataIdMap.get(b.dataId).id;
    var biasId = 0;
    if (bias != null) {
      var biasData = backend.dataIdMap.get(bias.dataId);
      if (biasData.shape.length !== 1) {
        throw new Error('_FusedMatMul only supports rank-1 bias but got ' + 'rank '.concat(biasData.shape.length, '.'));
      }
      biasId = biasData.id;
    }
    var preluActivationWeightsId = preluActivationWeights == null ? 0 : backend.dataIdMap.get(preluActivationWeights.dataId).id;
    var fusedActivation = FusableActivation[activation];
    if (fusedActivation == null) {
      throw new Error(''.concat(activation, ' activation not yet supported for FusedConv2D ') + 'in the wasm backend.');
    }
    var leftDim = transposeA ? a.shape[2] : a.shape[1];
    var rightDim = transposeB ? b.shape[1] : b.shape[2];
    var batchDims = tfjsCore.broadcast_util.assertAndGetBroadcastShape(a.shape.slice(0, -2), b.shape.slice(0, -2));
    var out = backend.makeOutput(__spreadArray(__spreadArray([], __read(batchDims), false), [leftDim, rightDim], false), a.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
    var bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
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
  var _fusedMatMulConfig = {
    kernelName: tfjsCore._FusedMatMul,
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
    var wasmFunc;
    function setupFunc(backend) {
      wasmFunc = backend.wasm.cwrap(kernelName, null /* void */, [
        'number',
        'number',
        'number', // out_id
      ]);
    }
    function kernelFunc(args) {
      var backend = args.backend,
        x = args.inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(x.shape, outType || x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      // Short-circuit zero-sized tensors.
      if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
        return out;
      }
      wasmFunc(xId, CppDType[x.dtype], outId);
      return out;
    }
    return { kernelName: kernelName, backendName: 'wasm', setupFunc: setupFunc, kernelFunc: kernelFunc };
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
  var absConfig = createUnaryKernelConfig(tfjsCore.Abs);

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
  var acosConfig = createUnaryKernelConfig(tfjsCore.Acos);

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
  var acoshConfig = createUnaryKernelConfig(tfjsCore.Acosh);

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
    var wasmFunc;
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
      var backend = args.backend,
        inputs = args.inputs;
      var a = inputs.a,
        b = inputs.b;
      var aId = backend.dataIdMap.get(a.dataId).id;
      var bId = backend.dataIdMap.get(b.dataId).id;
      var outputType = dtype != null ? dtype : a.dtype;
      var newShape = tfjsCore.backend_util.assertAndGetBroadcastShape(a.shape, b.shape);
      var out = backend.makeOutput(newShape, outputType);
      // Short-circuit zero-sized tensors.
      if (tfjsCore.util.sizeFromShape(newShape) === 0) {
        return out;
      }
      var aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
      var bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var kernelFunc = function () {
        return wasmFunc(aId, aShapeBytes, a.shape.length, bId, bShapeBytes, b.shape.length, CppDType[a.dtype], outId);
      };
      kernelFunc();
      return out;
    }
    return { kernelName: kernelName, backendName: 'wasm', setupFunc: setupFunc, kernelFunc: kernelFunc };
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
  var addConfig = createBinaryKernelConfig(tfjsCore.Add);

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
  var wasmFunc$6;
  function setupFunc$1(backend) {
    wasmFunc$6 = backend.wasm.cwrap(tfjsCore.AddN, null /* void */, [
      'array',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function addn(args) {
    var inputs = args.inputs,
      backend = args.backend;
    var out = backend.makeOutput(inputs[0].shape, inputs[0].dtype);
    // Short-circuit zero-sized tensors.
    if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
      return out;
    }
    var inputIds = inputs.map(function (x) {
      return backend.dataIdMap.get(x.dataId).id;
    });
    var inputIdsBytes = new Uint8Array(new Int32Array(inputIds).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmFunc$6(inputIdsBytes, inputIds.length, CppDType[out.dtype], outId);
    return out;
  }
  var addNConfig = {
    kernelName: tfjsCore.AddN,
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
    var x = args.inputs.x,
      backend = args.backend;
    if (x.dtype === 'string') {
      return tfjsCore.tensor(backend.readSync(x.dataId), x.shape, x.dtype);
    }
    var out = backend.makeOutput(x.shape, x.dtype);
    var inVals = backend.typedArrayFromHeap(x);
    var outVals = backend.typedArrayFromHeap(out);
    outVals.set(inVals);
    return out;
  }
  var identityConfig = {
    kernelName: tfjsCore.Identity,
    backendName: 'wasm',
    kernelFunc: identity,
  };

  var wasmTranspose;
  function setup$19(backend) {
    wasmTranspose = backend.wasm.cwrap(tfjsCore.Transpose, null /* void */, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    // Reduce any dimensions with size one. Lower-rank transpose kernel performs
    // better due to simpler memory access pattern.
    var _a = __read(removeOneSizeDims(inputs.x.shape, attrs.perm), 2),
      reducedShape = _a[0],
      perm = _a[1];
    var permIsNoOp = true;
    for (var i = 0; i < perm.length; i++) {
      if (perm[i] !== i) {
        permIsNoOp = false;
      }
    }
    var outShape = computeOutShape(inputs.x.shape, attrs.perm);
    var x = {
      dataId: inputs.x.dataId,
      shape: reducedShape,
      dtype: inputs.x.dtype,
    };
    if (permIsNoOp) {
      var cloned = identity({ inputs: inputs, backend: backend });
      cloned.shape = outShape;
      return cloned;
    }
    var out = backend.makeOutput(outShape, x.dtype);
    var xId = backend.dataIdMap.get(x.dataId).id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var permBytes = new Uint8Array(new Int32Array(perm).buffer);
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    wasmTranspose(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], outId, permBytes, perm.length);
    return out;
  }
  function computeOutShape(inShape, perm) {
    var outShape = new Array(inShape.length);
    for (var i = 0; i < outShape.length; i++) {
      outShape[i] = inShape[perm[i]];
    }
    return outShape;
  }
  function removeOneSizeDims(shape, perm) {
    var newShape = [];
    var newPerm = [];
    for (var i = 0; i < shape.length; ++i) {
      if (shape[i] !== 1) {
        newShape.push(shape[i]);
      }
      if (shape[perm[i]] !== 1) {
        newPerm.push(perm[i]);
      }
    }
    for (var i = 0; i < newPerm.length; ++i) {
      var minValIdx = -1;
      for (var j = 0; j < newPerm.length; ++j) {
        if (newPerm[j] >= i && (minValIdx === -1 || newPerm[minValIdx] > newPerm[j])) {
          minValIdx = j;
        }
      }
      newPerm[minValIdx] = i;
    }
    return [newShape, newPerm];
  }
  var transposeConfig = {
    kernelName: tfjsCore.Transpose,
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
    var xShape = x.shape;
    var xRank = x.shape.length;
    var originalAxes = tfjsCore.util.parseAxisParam(axis, xShape);
    var axes = originalAxes;
    var permutedAxes = tfjsCore.backend_util.getAxesPermutation(axes, xRank);
    var xTransposed = null;
    var inputWasTransposed = false;
    if (permutedAxes != null) {
      var newShape = new Array(xRank);
      for (var i = 0; i < newShape.length; i++) {
        newShape[i] = xShape[permutedAxes[i]];
      }
      axes = tfjsCore.backend_util.getInnerMostAxes(axes.length, xRank);
      xTransposed = transpose({ inputs: { x: x }, attrs: { perm: permutedAxes }, backend: backend });
      var xId = backend.dataIdMap.get(x.dataId).id;
      var transposedId = backend.dataIdMap.get(xTransposed.dataId).id;
      if (transposedId !== xId) {
        inputWasTransposed = true;
      }
    }
    return { transposed: xTransposed, originalAxes: originalAxes, axes: axes, inputWasTransposed: inputWasTransposed };
  }

  var wasmAll;
  function setup$18(backend) {
    wasmAll = backend.wasm.cwrap(tfjsCore.All, null /*void*/, ['number, number, number']);
  }
  function all(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.axis,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      input = transposed;
      inputId = transposedId;
    }
    var inputRank = input.shape.length;
    tfjsCore.backend_util.assertAxesAreInnerMostDims('all', axes, inputRank);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, x.dtype);
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmAll(inputId, reduceSize, outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    return out;
  }
  var allConfig = {
    kernelName: tfjsCore.All,
    backendName: 'wasm',
    setupFunc: setup$18,
    kernelFunc: all,
  };

  var wasmAny;
  function setup$17(backend) {
    wasmAny = backend.wasm.cwrap(tfjsCore.Any, null /*void*/, ['number, number, number']);
  }
  function any(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.axis,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      input = transposed;
      inputId = transposedId;
    }
    var inputRank = input.shape.length;
    tfjsCore.backend_util.assertAxesAreInnerMostDims('any', axes, inputRank);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, x.dtype);
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmAny(inputId, reduceSize, outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    return out;
  }
  var anyConfig = {
    kernelName: tfjsCore.Any,
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
    var wasmFunc;
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
      var backend = args.backend,
        inputs = args.inputs,
        attrs = args.attrs;
      var axis = attrs.axis;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend),
        transposed = _a.transposed,
        axes = _a.axes,
        inputWasTransposed = _a.inputWasTransposed;
      if (inputWasTransposed) {
        var transposedId = backend.dataIdMap.get(transposed.dataId).id;
        if (transposedId !== xId) {
          // transpose was not a no-op. We will need to dispose of this
          // once we are done.
          input = transposed;
          inputId = transposedId;
        }
      }
      var outShape = input.shape.slice(0, -1);
      var out = backend.makeOutput(outShape, 'int32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var outerSize = tfjsCore.util.sizeFromShape(out.shape);
      var innerSize = input.shape[axes[0]];
      wasmFunc(inputId, CppDType[input.dtype], outerSize, innerSize, outId);
      if (inputWasTransposed) {
        // dispose of the transposed tensor.
        backend.disposeData(transposed.dataId);
      }
      return out;
    }
    return {
      kernelName: kernelName,
      backendName: 'wasm',
      setupFunc: setupFunc,
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
  var argMaxConfig = createArgMinMaxKernelConfig(tfjsCore.ArgMax);

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
  var argMinConfig = createArgMinMaxKernelConfig(tfjsCore.ArgMin);

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
  var asinConfig = createUnaryKernelConfig(tfjsCore.Asin);

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
  var asinhConfig = createUnaryKernelConfig(tfjsCore.Asinh);

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
  var atanConfig = createUnaryKernelConfig(tfjsCore.Atan);

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
  var atan2Config = createBinaryKernelConfig(tfjsCore.Atan2);

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
  var atanhConfig = createUnaryKernelConfig(tfjsCore.Atanh);

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
  var wasmAvgPool;
  function setup$16(backend) {
    wasmAvgPool = backend.wasm.cwrap(tfjsCore.AvgPool, null /* void */, [
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode;
    var convInfo = tfjsCore.backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad, dimRoundingMode);
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var channels = convInfo.inChannels;
    if (convInfo.dataFormat !== 'channelsLast') {
      throw new Error("wasm backend does not support dataFormat:'" + ''.concat(convInfo.dataFormat, "'. Please use 'channelsLast'."));
    }
    if (convInfo.dilationWidth !== 1 || convInfo.dilationHeight !== 1) {
      throw new Error(
        'was backend only supports average pooling with dilation = [1, 1], ' +
          'got ['.concat(convInfo.dilationHeight, ', ').concat(convInfo.dilationWidth, '].'),
      );
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var avgPoolConfig = {
    kernelName: tfjsCore.AvgPool,
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
  var wasmAvgPool3D;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode,
      dataFormat = attrs.dataFormat;
    var convInfo = tfjsCore.backend_util.computePool3DInfo(
      x.shape,
      filterSize,
      strides,
      /*dilations=*/ 1,
      pad,
      dimRoundingMode,
      dataFormat,
    );
    var out = backend.makeOutput(convInfo.outShape, x.dtype);
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
  var avgPool3DConfig = {
    kernelName: tfjsCore.AvgPool3D,
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
  var wasmAvgPool3DGrad;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var dy = inputs.dy,
      input = inputs.input;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode;
    var convInfo = tfjsCore.backend_util.computePool3DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode);
    var dx = backend.makeOutput(input.shape, input.dtype);
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
  var avgPool3DGradConfig = {
    kernelName: tfjsCore.AvgPool3DGrad,
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
  var wasmAvgPoolGrad;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var dy = inputs.dy,
      input = inputs.input;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad;
    var convInfo = tfjsCore.backend_util.computePool2DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad);
    var dx = backend.makeOutput(input.shape, input.dtype);
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
  var avgPoolGradConfig = {
    kernelName: tfjsCore.AvgPoolGrad,
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
    var inputs = args.inputs,
      attrs = args.attrs;
    var x = inputs.x;
    var shape = attrs.shape;
    var xSize = tfjsCore.util.sizeFromShape(x.shape);
    var $shape = tfjsCore.util.inferFromImplicitShape(shape, xSize);
    tfjsCore.util.assert(xSize === tfjsCore.util.sizeFromShape($shape), function () {
      return (
        'new shape: '.concat($shape, ', old shape: ').concat(x.shape, '. New shape and old ') +
        'shape must have the same number of elements.'
      );
    });
    // Backend needs to track refCount for the dataId for reshape op
    args.backend.incRef(x.dataId);
    return { dataId: x.dataId, shape: $shape, dtype: x.dtype };
  }
  var reshapeConfig = {
    kernelName: tfjsCore.Reshape,
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
  var wasmBatchMatMul;
  function setup$12(backend) {
    wasmBatchMatMul = backend.wasm.cwrap(tfjsCore.BatchMatMul, null /* void */, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var a = inputs.a,
      b = inputs.b;
    var transposeA = attrs.transposeA,
      transposeB = attrs.transposeB;
    if (a.dtype !== 'float32' || b.dtype !== 'float32') {
      throw new Error('BatchMatMul for non non-float32 tensors not yet supported.');
    }
    var aRank = a.shape.length;
    var bRank = b.shape.length;
    var innerShapeA = transposeA ? a.shape[aRank - 2] : a.shape[aRank - 1];
    var innerShapeB = transposeB ? b.shape[bRank - 1] : b.shape[bRank - 2];
    var outerShapeA = transposeA ? a.shape[aRank - 1] : a.shape[aRank - 2];
    var outerShapeB = transposeB ? b.shape[bRank - 2] : b.shape[bRank - 1];
    var outerDimsA = a.shape.slice(0, -2);
    var outerDimsB = b.shape.slice(0, -2);
    var batchDimA = tfjsCore.util.sizeFromShape(outerDimsA);
    var batchDimB = tfjsCore.util.sizeFromShape(outerDimsB);
    var outShapeOuterDims = tfjsCore.broadcast_util.assertAndGetBroadcastShape(a.shape.slice(0, -2), b.shape.slice(0, -2));
    var outShape = outShapeOuterDims.concat([outerShapeA, outerShapeB]);
    tfjsCore.util.assert(innerShapeA === innerShapeB, function () {
      return (
        'Error in matMul: inner shapes ('.concat(innerShapeA, ') and (') +
        ''.concat(innerShapeB, ') of Tensors with shapes ').concat(a.shape, ' and ') +
        ''.concat(b.shape, ' and transposeA=').concat(transposeA) +
        ' and transposeB='.concat(transposeB, ' must match.')
      );
    });
    var a3dShape = transposeA ? [batchDimA, innerShapeA, outerShapeA] : [batchDimA, outerShapeA, innerShapeA];
    var b3dShape = transposeB ? [batchDimB, outerShapeB, innerShapeB] : [batchDimB, innerShapeB, outerShapeB];
    // The rest of the implementation is designed to operate on rank-3 tensors
    var a3d = reshape({ inputs: { x: a }, backend: backend, attrs: { shape: a3dShape } });
    var b3d = reshape({ inputs: { x: b }, backend: backend, attrs: { shape: b3dShape } });
    var a3dId = backend.dataIdMap.get(a3d.dataId).id;
    var b3dId = backend.dataIdMap.get(b3d.dataId).id;
    var leftDim = transposeA ? a3d.shape[2] : a3d.shape[1];
    var rightDim = transposeB ? b3d.shape[1] : b3d.shape[2];
    var batchDim = Math.max(batchDimA, batchDimB);
    var out = backend.makeOutput([batchDim, leftDim, rightDim], a3d.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var aShapeBytes = new Uint8Array(new Int32Array(a3d.shape).buffer);
    var bShapeBytes = new Uint8Array(new Int32Array(b3d.shape).buffer);
    wasmBatchMatMul(a3dId, aShapeBytes, a3d.shape.length, b3dId, bShapeBytes, b3d.shape.length, transposeA, transposeB, outId);
    backend.disposeData(a3d.dataId);
    backend.disposeData(b3d.dataId);
    out.shape = outShape;
    return out;
  }
  var batchMatMulConfig = {
    kernelName: tfjsCore.BatchMatMul,
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
    var outVals = tfjsCore.util.getArrayFromDType(dtype, tfjsCore.util.sizeFromShape(outShape));
    if (simplyConcat && dtype !== 'string') {
      // Use built-in TypedArray.set() method for speed.
      var offset_1 = 0;
      inputs.forEach(function (input) {
        var size = tfjsCore.util.sizeFromShape(input.shape);
        outVals.set(input.vals, offset_1);
        offset_1 += size;
      });
    } else {
      var colOffset_1 = 0;
      inputs.forEach(function (input) {
        var decodedData = dtype === 'string' ? tfjsCore.backend_util.fromUint8ToStringArray(input.vals) : input.vals;
        var tIdx = 0;
        for (var row = 0; row < input.shape[0]; ++row) {
          var resIdx = row * outShape[1] + colOffset_1;
          for (var col = 0; col < input.shape[1]; ++col) {
            outVals[resIdx + col] = decodedData[tIdx++];
          }
        }
        colOffset_1 += input.shape[1];
      });
    }
    return outVals;
  }

  tfjsCore.backend_util.RowPartitionType;

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
    var sameStartStop = start === stop;
    var increasingRangeNegativeStep = start < stop && step < 0;
    var decreasingRangePositiveStep = stop < start && step > 1;
    if (sameStartStop || increasingRangeNegativeStep || decreasingRangePositiveStep) {
      return tfjsCore.util.makeZerosTypedArray(0, dtype);
    }
    var numElements = Math.abs(Math.ceil((stop - start) / step));
    var values = tfjsCore.util.makeZerosTypedArray(numElements, dtype);
    if (stop < start && step === 1) {
      // Auto adjust the step's sign if it hasn't been set
      // (or was set to 1)
      step = -1;
    }
    values[0] = start;
    for (var i = 1; i < values.length; i++) {
      values[i] = values[i - 1] + step;
    }
    return values;
  }

  function sliceImpl(vals, begin, size, shape, dtype) {
    var isContinous = tfjsCore.slice_util.isSliceContinous(shape, begin, size);
    var length = tfjsCore.util.sizeFromShape(size);
    var xStrides = tfjsCore.util.computeStrides(shape);
    if (isContinous) {
      var flatOffset = tfjsCore.slice_util.computeFlatOffset(begin, xStrides);
      if (dtype === 'string') {
        return vals.slice(flatOffset, flatOffset + length);
      }
      return vals.subarray(flatOffset, flatOffset + length);
    }
    var decodedData = dtype === 'string' ? tfjsCore.backend_util.fromUint8ToStringArray(vals) : vals;
    var inBuf = tfjsCore.buffer(shape, dtype, decodedData);
    var outBuf = tfjsCore.buffer(size, dtype);
    for (var i = 0; i < outBuf.size; ++i) {
      var outLoc = outBuf.indexToLoc(i);
      var inLoc = outLoc.map(function (idx, j) {
        return idx + begin[j];
      });
      outBuf.set.apply(outBuf, __spreadArray([inBuf.get.apply(inBuf, __spreadArray([], __read(inLoc), false))], __read(outLoc), false));
    }
    if (dtype === 'string') {
      return tfjsCore.backend_util.fromStringArrayToUint8(outBuf.values);
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
  var StringNGramsOp = /** @class */ (function () {
    function StringNGramsOp(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
      this.separator = tfjsCore.util.encodeString(separator);
      this.nGramWidths = nGramWidths;
      this.leftPad = tfjsCore.util.encodeString(leftPad);
      this.rightPad = tfjsCore.util.encodeString(rightPad);
      this.padWidth = padWidth;
      this.preserveShort = preserveShortSequences;
    }
    StringNGramsOp.prototype.getPadWidth = function (nGramWidth) {
      // Ngrams can be padded with either a fixed pad width or a dynamic pad
      // width depending on the 'padWidth' arg, but in no case should the padding
      // ever be wider than 'nGramWidth' - 1.
      return Math.min(this.padWidth < 0 ? nGramWidth - 1 : this.padWidth, nGramWidth - 1);
    };
    StringNGramsOp.prototype.getNumNGrams = function (length, nGramWidth) {
      var padWidth = this.getPadWidth(nGramWidth);
      return Math.max(0, length + 2 * padWidth - nGramWidth + 1);
    };
    StringNGramsOp.prototype.createNGrams = function (data, splitIndex, output, outputStartIndex, numNGrams, nGramWidth) {
      var _loop_1 = function (nGramIndex) {
        var padWidth = this_1.getPadWidth(nGramWidth);
        var leftPadding = Math.max(0, padWidth - nGramIndex);
        var rightPadding = Math.max(0, padWidth - (numNGrams - (nGramIndex + 1)));
        var numTokens = nGramWidth - (leftPadding + rightPadding);
        var dataStartIndex = splitIndex + (leftPadding > 0 ? 0 : nGramIndex - padWidth);
        // Calculate the total expected size of the nGram so we can reserve the
        // correct amount of space in the string.
        var nGramSize = 0;
        // Size of the left padding.
        nGramSize += leftPadding * this_1.leftPad.length;
        // Size of the tokens.
        for (var n = 0; n < numTokens; ++n) {
          nGramSize += data[dataStartIndex + n].length;
        }
        // Size of the right padding.
        nGramSize += rightPadding * this_1.rightPad.length;
        // Size of the separators.
        var numSeparators = leftPadding + rightPadding + numTokens - 1;
        nGramSize += numSeparators * this_1.separator.length;
        // Build the nGram.
        output[outputStartIndex + nGramIndex] = new Uint8Array(nGramSize);
        var nGram = output[outputStartIndex + nGramIndex];
        var nextNGramIndex = 0;
        var appendToNGram = function (str) {
          return str.forEach(function (value) {
            return (nGram[nextNGramIndex++] = value);
          });
        };
        for (var n = 0; n < leftPadding; ++n) {
          appendToNGram(this_1.leftPad);
          appendToNGram(this_1.separator);
        }
        // Only output first numTokens - 1 pairs of data and separator
        for (var n = 0; n < numTokens - 1; ++n) {
          appendToNGram(data[dataStartIndex + n]);
          appendToNGram(this_1.separator);
        }
        // Handle case when there are no tokens or no right padding as these
        // can result in consecutive separators.
        if (numTokens > 0) {
          // If we have tokens, then output last and then pair each separator
          // with the right padding that follows, to ensure nGram ends either with
          // the token or with the right pad.
          appendToNGram(data[dataStartIndex + numTokens - 1]);
          for (var n = 0; n < rightPadding; ++n) {
            appendToNGram(this_1.separator);
            appendToNGram(this_1.rightPad);
          }
        } else {
          // If we don't have tokens, then the last item inserted into the nGram
          // has been the separator from the left padding loop above. Hence,
          // output right pad and separator and make sure to finish with a
          // padding, not a separator.
          for (var n = 0; n < rightPadding - 1; ++n) {
            appendToNGram(this_1.rightPad);
            appendToNGram(this_1.separator);
          }
          appendToNGram(this_1.rightPad);
        }
      };
      var this_1 = this;
      for (var nGramIndex = 0; nGramIndex < numNGrams; ++nGramIndex) {
        _loop_1(nGramIndex);
      }
    };
    // Data and splits together form the definition of the ragged tensor,
    // where data is 1 dimensional and contains the values of the tensor
    // and splits denotes the indices at which each row starts.
    StringNGramsOp.prototype.compute = function (data, splits) {
      var _this = this;
      // Validate that the splits are valid indices into data, only if there are
      // splits specified.
      var inputDataSize = data.length;
      var splitsSize = splits.length;
      if (splitsSize > 0) {
        var prevSplit = splits[0];
        if (prevSplit !== 0) {
          throw new Error('First split value must be 0, got '.concat(prevSplit));
        }
        for (var i = 1; i < splitsSize; ++i) {
          var validSplits = splits[i] >= prevSplit;
          validSplits = validSplits && splits[i] <= inputDataSize;
          if (!validSplits) {
            throw new Error('Invalid split value '.concat(splits[i], ', must be in [').concat(prevSplit, ', ').concat(inputDataSize, ']'));
          }
          prevSplit = splits[i];
        }
        if (prevSplit !== inputDataSize) {
          throw new Error('Last split value must be data size. Expected '.concat(inputDataSize, ', got ').concat(prevSplit));
        }
      }
      var numBatchItems = splitsSize - 1;
      var nGramsSplits = tfjsCore.util.getArrayFromDType('int32', splitsSize);
      // If there is no data or size, return an empty ragged tensor.
      if (inputDataSize === 0 || splitsSize === 0) {
        var empty = new Array(inputDataSize);
        for (var i = 0; i <= numBatchItems; ++i) {
          nGramsSplits[i] = 0;
        }
        return [empty, nGramsSplits];
      }
      nGramsSplits[0] = 0;
      var _loop_2 = function (i) {
        var length = splits[i] - splits[i - 1];
        var numNGrams = 0;
        this_2.nGramWidths.forEach(function (nGramWidth) {
          numNGrams += _this.getNumNGrams(length, nGramWidth);
        });
        if (this_2.preserveShort && length > 0 && numNGrams === 0) {
          numNGrams = 1;
        }
        nGramsSplits[i] = nGramsSplits[i - 1] + numNGrams;
      };
      var this_2 = this;
      for (var i = 1; i <= numBatchItems; ++i) {
        _loop_2(i);
      }
      var nGrams = new Array(nGramsSplits[numBatchItems]);
      var _loop_3 = function (i) {
        var splitIndex = splits[i];
        var outputStartIdx = nGramsSplits[i];
        this_3.nGramWidths.forEach(function (nGramWidth) {
          var length = splits[i + 1] - splits[i];
          var numNGrams = _this.getNumNGrams(length, nGramWidth);
          _this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
          outputStartIdx += numNGrams;
        });
        // If we're preserving short sequences, check to see if no sequence was
        // generated by comparing the current output start idx to the original
        // one (nGramSplitsdata). If no ngrams were generated, then they will
        // be equal (since we increment outputStartIdx by numNGrams every
        // time we create a set of ngrams.)
        if (this_3.preserveShort && outputStartIdx === nGramsSplits[i]) {
          var dataLength = splits[i + 1] - splits[i];
          // One legitimate reason to not have any ngrams when this.preserveShort
          // is true is if the sequence itself is empty. In that case, move on.
          if (dataLength === 0) {
            return 'continue';
          }
          // We don't have to worry about dynamic padding sizes here: if padding
          // was dynamic, every sequence would have had sufficient padding to
          // generate at least one nGram.
          var nGramWidth = dataLength + 2 * this_3.padWidth;
          var numNGrams = 1;
          this_3.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
        }
      };
      var this_3 = this;
      for (var i = 0; i < numBatchItems; ++i) {
        _loop_3(i);
      }
      return [nGrams, nGramsSplits];
    };
    return StringNGramsOp;
  })();
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
      for (var i = 0; i < str.length; ++i) {
        result.push(str.subarray(i, i + 1));
      }
      return;
    }
    // When there is one delimiter, the input is split only at that delimiter.
    if (delimiters.length === 1) {
      var delimiter = delimiters[0];
      var f = str.indexOf(delimiter);
      while (f !== -1) {
        var token = str.subarray(0, f);
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
    var tokenStart = 0;
    for (var i = 0; i < str.length + 1; i++) {
      if (i === str.length || delimiters.indexOf(str[i]) !== -1) {
        var token = str.subarray(tokenStart, i);
        if (!skipEmpty || token.length !== 0) {
          result.push(token);
        }
        tokenStart = i + 1;
      }
    }
  }
  function stringSplitImpl(input, delimiter, skipEmpty) {
    var batchSize = input.length;
    // Empty delimiter means split the input character by character.
    var tokens = [];
    var outputSize = 0;
    var maxNumEntries = 0;
    var numIndices = new Array(batchSize);
    for (var i = 0; i < batchSize; ++i) {
      var prevTokensLength = tokens.length;
      split(input[i], delimiter, skipEmpty, tokens);
      var nEntries = tokens.length - prevTokensLength;
      numIndices[i] = nEntries;
      outputSize += nEntries;
      maxNumEntries = Math.max(maxNumEntries, nEntries);
    }
    var indices = tfjsCore.util.getArrayFromDType('int32', outputSize * 2);
    var values = new Array(outputSize);
    var shape = [batchSize, maxNumEntries];
    var c = 0;
    for (var i = 0; i < batchSize; ++i) {
      for (var j = 0; j < numIndices[i]; ++j) {
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
    var output = tfjsCore.util.getArrayFromDType('int32', input.length);
    for (var i = 0; i < input.length; ++i) {
      output[i] = tfjsCore.util.fingerPrint64(input[i]).modulo(numBuckets).getLowBitsUnsigned();
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
    var $axis = tfjsCore.util.parseAxisParam(axis, shape)[0];
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
    var newShape = [1, shape[0], 1];
    for (var i = 0; i < $axis; i++) {
      newShape[0] *= shape[i];
    }
    newShape[1] = shape[$axis];
    for (var i = $axis + 1; i < shape.length; i++) {
      newShape[2] *= shape[i];
    }
    // A map from unique elements (their string representations) to their values
    // in "indices" (below).
    var uniqueElements = new Map();
    // The indices of each unique element in the original tensor along the given
    // axis. It is 1D and has the same size as the given axis.
    var indices = new Int32Array(shape[$axis]);
    // Create a buffer so we can easily extract value at a given location.
    var inputBuffer = new tfjsCore.TensorBuffer(newShape, dtype, values);
    // The indices along the given axis that have unique elements. This is a
    // de-duped version of "indices" above.
    var uniqueIndices = [];
    var is1DTensor = newShape[0] === 1 && newShape[2] === 1;
    for (var i = 0; i < shape[$axis]; i++) {
      // Extract values along the axis.
      var element = void 0;
      if (is1DTensor) {
        // Fast path for 1D tensor input.
        element = values[i].toString();
      } else {
        var axisValues = [];
        for (var m = 0; m < newShape[0]; m++) {
          for (var n = 0; n < newShape[2]; n++) {
            axisValues.push(inputBuffer.get(m, i, n));
          }
        }
        element = axisValues.join(',');
      }
      // Dedup and update various indices.
      var existingIndex = uniqueElements.get(element);
      if (existingIndex != null) {
        indices[i] = existingIndex;
      } else {
        var uniqueIndex = uniqueElements.size;
        uniqueElements.set(element, uniqueIndex);
        indices[i] = uniqueIndex;
        uniqueIndices.push(i);
      }
    }
    // Now we know where each of the unique elements are located along the axis
    // (uniqueIndices). Extract them from input buffer and store them in the
    // output buffer.
    var outputTmpShape = newShape.slice();
    outputTmpShape[1] = uniqueElements.size;
    var outputBuffer = new tfjsCore.TensorBuffer(outputTmpShape, dtype);
    uniqueIndices.forEach(function (uniqueElementIndex, i) {
      for (var m = 0; m < newShape[0]; m++) {
        for (var n = 0; n < newShape[2]; n++) {
          outputBuffer.set(inputBuffer.get(m, uniqueElementIndex, n), m, i, n);
        }
      }
    });
    // The output shape can be calculated from the input shape with the size of
    // the given axis replaced by the number of unique elements along that axis.
    var outputShape = shape.slice();
    outputShape[$axis] = outputTmpShape[1];
    return {
      outputValues: outputBuffer.values,
      outputShape: outputShape,
      indices: indices,
    };
  }

  function slice(args) {
    var x = args.inputs.x,
      _a = args.attrs,
      begin = _a.begin,
      size = _a.size,
      backend = args.backend;
    var _b = __read(tfjsCore.slice_util.parseSliceParams(x, begin, size), 2),
      begin_ = _b[0],
      size_ = _b[1];
    var isContinous = tfjsCore.slice_util.isSliceContinous(x.shape, begin_, size_);
    var xVals = backend.readSync(x.dataId);
    var out = backend.makeOutput(size_, x.dtype);
    var xStrides = tfjsCore.util.computeStrides(x.shape);
    var outData = backend.dataIdMap.get(out.dataId);
    if (isContinous) {
      var flatOffset = tfjsCore.slice_util.computeFlatOffset(begin_, xStrides);
      if (x.dtype === 'string') {
        outData.stringBytes = xVals.slice(flatOffset, flatOffset + tfjsCore.util.sizeFromShape(size_));
      } else {
        var outVals_1 = backend.typedArrayFromHeap(out);
        outVals_1.set(xVals.subarray(flatOffset, flatOffset + tfjsCore.util.sizeFromShape(size_)));
      }
      return out;
    }
    if (x.dtype === 'string') {
      var res = sliceImpl(xVals, begin_, size_, x.shape, x.dtype);
      outData.stringBytes = res;
      return out;
    }
    var outVals = backend.typedArrayFromHeap(out);
    var rank = x.shape.length;
    if (rank === 2) {
      slice2d(xVals, xStrides[0], outVals, begin_, size_);
    } else if (rank === 3) {
      slice3d(xVals, xStrides[0], xStrides[1], outVals, begin_, size_);
    } else if (rank === 4) {
      slice4d(xVals, xStrides[0], xStrides[1], xStrides[2], outVals, begin_, size_);
    } else {
      var res = sliceImpl(xVals, begin_, size_, x.shape, x.dtype);
      outVals.set(res);
    }
    return out;
  }
  function slice2d(xVals, xStride, outVals, begin, size) {
    var outOffset = 0;
    var beginI = begin[0];
    var beginJ = begin[1];
    var endI = beginI + size[0];
    for (var i = beginI; i < endI; i++) {
      var xOffset = i * xStride + beginJ;
      outVals.set(xVals.subarray(xOffset, xOffset + size[1]), outOffset);
      outOffset += size[1];
    }
  }
  function slice3d(xVals, xStride1, xStride2, outVals, begin, size) {
    var outOffset = 0;
    var beginI = begin[0];
    var beginJ = begin[1];
    var beginK = begin[2];
    var endI = beginI + size[0];
    var endJ = beginJ + size[1];
    for (var i = beginI; i < endI; i++) {
      for (var j = beginJ; j < endJ; j++) {
        var xOffset = i * xStride1 + j * xStride2 + beginK;
        outVals.set(xVals.subarray(xOffset, xOffset + size[2]), outOffset);
        outOffset += size[2];
      }
    }
  }
  function slice4d(xVals, xStride1, xStride2, xStride3, outVals, begin, size) {
    var outOffset = 0;
    var beginI = begin[0];
    var beginJ = begin[1];
    var beginK = begin[2];
    var endI = beginI + size[0];
    var endJ = beginJ + size[1];
    var endK = beginK + size[2];
    var beginL = begin[3];
    for (var i = beginI; i < endI; i++) {
      for (var j = beginJ; j < endJ; j++) {
        for (var k = beginK; k < endK; k++) {
          var xOffset = i * xStride1 + j * xStride2 + k * xStride3 + beginL;
          outVals.set(xVals.subarray(xOffset, xOffset + size[3]), outOffset);
          outOffset += size[3];
        }
      }
    }
  }
  var sliceConfig = {
    kernelName: tfjsCore.Slice,
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var blockShape = attrs.blockShape,
      crops = attrs.crops;
    var prod = blockShape.reduce(function (a, b) {
      return a * b;
    });
    var reshaped = tfjsCore.backend_util.getReshaped(x.shape, blockShape, prod);
    var permuted = tfjsCore.backend_util.getPermuted(reshaped.length, blockShape.length);
    var reshapedPermuted = tfjsCore.backend_util.getReshapedPermuted(x.shape, blockShape, prod);
    var sliceBeginCoords = tfjsCore.backend_util.getSliceBeginCoords(crops, blockShape.length);
    var sliceSize = tfjsCore.backend_util.getSliceSize(reshapedPermuted, crops, blockShape.length);
    var xReshaped = reshape({ inputs: { x: x }, backend: backend, attrs: { shape: reshaped } });
    var xTransposed = transpose({ inputs: { x: xReshaped }, backend: backend, attrs: { perm: permuted } });
    var xTransposedReshaped = reshape({ inputs: { x: xTransposed }, backend: backend, attrs: { shape: reshapedPermuted } });
    var result = slice({
      inputs: { x: xTransposedReshaped },
      backend: backend,
      attrs: { begin: sliceBeginCoords, size: sliceSize },
    });
    backend.disposeData(xReshaped.dataId);
    backend.disposeData(xTransposed.dataId);
    backend.disposeData(xTransposedReshaped.dataId);
    return result;
  }
  var batchToSpaceNDConfig = {
    kernelName: tfjsCore.BatchToSpaceND,
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
  var wasmBincount;
  function setup$11(backend) {
    wasmBincount = backend.wasm.cwrap(tfjsCore.Bincount, null /*void*/, [
      'number',
      'number',
      'boolean',
      'number',
      'number',
      'number', // outId
    ]);
  }
  function bincount(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var x = inputs.x,
      weights = inputs.weights;
    var size = attrs.size;
    var hasWeights =
      weights.shape.reduce(function (p, v) {
        return p * v;
      }, 1) !== 0;
    var outShape = x.shape.length === 1 ? [size] : [x.shape[0], size];
    var out = backend.makeOutput(outShape, weights.dtype);
    function tensorId(x) {
      return backend.dataIdMap.get(x.dataId).id;
    }
    wasmBincount(tensorId(x), size, hasWeights, tensorId(weights), CppDType[weights.dtype], tensorId(out));
    return out;
  }
  var bincountConfig = {
    kernelName: tfjsCore.Bincount,
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
  var bitwiseAndConfig = createBinaryKernelConfig(tfjsCore.BitwiseAnd);

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
    var inputs = args.inputs,
      backend = args.backend;
    var s0 = inputs.s0,
      s1 = inputs.s1;
    var s0Vals = backend.typedArrayFromHeap(s0);
    var s1Vals = backend.typedArrayFromHeap(s1);
    var broadcastShape = tfjsCore.backend_util.assertAndGetBroadcastShape(Array.from(s0Vals), Array.from(s1Vals));
    return backend.makeOutput([broadcastShape.length], 'int32', /*memoryOffset=*/ undefined, /*values=*/ new Int32Array(broadcastShape));
  }
  var broadcastArgsConfig = {
    kernelName: tfjsCore.BroadcastArgs,
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
    var x = args.inputs.x,
      dtype = args.attrs.dtype,
      backend = args.backend;
    var out = backend.makeOutput(x.shape, dtype);
    var inVals = backend.typedArrayFromHeap(x);
    var outVals = backend.typedArrayFromHeap(out);
    outVals.set(inVals);
    return out;
  }
  var castConfig = {
    kernelName: tfjsCore.Cast,
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
  var ceilConfig = createUnaryKernelConfig(tfjsCore.Ceil);

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
  var wasmClip;
  function setup$10(backend) {
    wasmClip = backend.wasm.cwrap(tfjsCore.ClipByValue, null /* void */, [
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function clip(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var clipValueMin = attrs.clipValueMin,
      clipValueMax = attrs.clipValueMax;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(x.shape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmClip(xId, clipValueMin, clipValueMax, outId);
    return out;
  }
  var clipByValueConfig = {
    kernelName: tfjsCore.ClipByValue,
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
    var inputs = args.inputs,
      backend = args.backend;
    var axis = tfjsCore.util.parseAxisParam(args.attrs.axis, inputs[0].shape)[0];
    var shapes = inputs.map(function (t) {
      return t.shape;
    });
    tfjsCore.backend_util.assertParamsConsistent(shapes, axis);
    var outShape = tfjsCore.backend_util.computeOutShape(
      inputs.map(function (t) {
        return t.shape;
      }),
      axis,
    );
    // Keep only non-empty tensors (ignore tensors with 0 in their shape).
    var $inputs = inputs.filter(function (t) {
      return tfjsCore.util.sizeFromShape(t.shape) > 0;
    });
    if ($inputs.length === 1) {
      return identity({ inputs: { x: $inputs[0] }, backend: backend });
    }
    var out = backend.makeOutput(outShape, inputs[0].dtype);
    if (tfjsCore.util.sizeFromShape(outShape) === 0) {
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
      var inputs2D = $inputs.map(function (t) {
        var innerSize = tfjsCore.util.sizeFromShape(t.shape.slice(axis));
        var shape = [-1, innerSize];
        return reshape({ inputs: { x: t }, backend: backend, attrs: { shape: shape } });
      });
      var inputsValShapes = inputs2D.map(function (t) {
        return { vals: backend.readSync(t.dataId), shape: t.shape };
      });
      // Concats 2d tensors along axis=1.
      outShape = tfjsCore.backend_util.computeOutShape(
        inputs2D.map(function (t) {
          return t.shape;
        }),
        1 /* axis */,
      );
      var simplyConcat = inputs2D[0].shape[0] === 1;
      var outVals_1 = concatImpl(inputsValShapes, outShape, inputs[0].dtype, simplyConcat);
      var finalOutShape = tfjsCore.backend_util.computeOutShape(
        $inputs.map(function (t) {
          return t.shape;
        }),
        axis,
      );
      out.shape = finalOutShape;
      var outData = backend.dataIdMap.get(out.dataId);
      outData.stringBytes = tfjsCore.backend_util.fromStringArrayToUint8(outVals_1);
      inputs2D.forEach(function (t) {
        return backend.disposeData(t.dataId);
      });
      return out;
    }
    var batchDim = tfjsCore.util.sizeFromShape($inputs[0].shape.slice(0, axis));
    var sumInnerDims = 0;
    var innerDims = $inputs.map(function (input) {
      var innerDim = tfjsCore.util.sizeFromShape(input.shape.slice(axis));
      sumInnerDims += innerDim;
      return innerDim;
    });
    var inVals = $inputs.map(function (input) {
      return backend.typedArrayFromHeap(input);
    });
    var outVals = backend.typedArrayFromHeap(out);
    for (var b = 0; b < batchDim; b++) {
      var outOffset = b * sumInnerDims;
      for (var i = 0; i < inVals.length; i++) {
        var innerDim = innerDims[i];
        var inOffset = b * innerDim;
        var vals = inVals[i].subarray(inOffset, inOffset + innerDim);
        outVals.set(vals, outOffset);
        outOffset += innerDim;
      }
    }
    return out;
  }
  var concatConfig = {
    kernelName: tfjsCore.Concat,
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
  var wasmConv2d;
  function setup$$(backend) {
    wasmConv2d = backend.wasm.cwrap(tfjsCore.Conv2D, null /* void */, [
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x,
      filter = inputs.filter;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
    var strides = attrs.strides,
      dilations = attrs.dilations,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode,
      dataFormat = attrs.dataFormat;
    var $dataFormat = tfjsCore.backend_util.convertConv2DDataFormat(dataFormat);
    var convInfo = tfjsCore.backend_util.computeConv2DInfo(
      x.shape,
      filter.shape,
      strides,
      dilations,
      pad,
      dimRoundingMode,
      false,
      $dataFormat,
    );
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var dilationHeight = convInfo.dilationHeight;
    var dilationWidth = convInfo.dilationWidth;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var inputChannels = convInfo.inChannels;
    var outputChannels = convInfo.outChannels;
    var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    if (convInfo.dataFormat !== 'channelsLast') {
      throw new Error(
        "wasm backend Conv2D does not support dataFormat:'" + ''.concat(convInfo.dataFormat, "'. Please use 'channelsLast'."),
      );
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var conv2DConfig = {
    kernelName: tfjsCore.Conv2D,
    backendName: 'wasm',
    setupFunc: setup$$,
    kernelFunc: conv2d,
  };

  var wasmConv2DBackpropInput;
  function setup$_(backend) {
    wasmConv2DBackpropInput = backend.wasm.cwrap(tfjsCore.Conv2DBackpropInput, null, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var dy = inputs.dy,
      filter = inputs.filter;
    var strides = attrs.strides,
      pad = attrs.pad,
      dataFormat = attrs.dataFormat,
      dimRoundingMode = attrs.dimRoundingMode,
      inputShape = attrs.inputShape;
    var dilations = 1;
    var $dataFormat = tfjsCore.backend_util.convertConv2DDataFormat(dataFormat);
    var convInfo = tfjsCore.backend_util.computeConv2DInfo(
      inputShape,
      filter.shape,
      strides,
      dilations,
      pad,
      dimRoundingMode,
      false /* depthwise */,
      $dataFormat,
    );
    var batchSize = convInfo.batchSize,
      filterHeight = convInfo.filterHeight,
      filterWidth = convInfo.filterWidth,
      inChannels = convInfo.inChannels,
      inHeight = convInfo.inHeight,
      inWidth = convInfo.inWidth,
      outChannels = convInfo.outChannels,
      outHeight = convInfo.outHeight,
      outWidth = convInfo.outWidth,
      strideHeight = convInfo.strideHeight,
      strideWidth = convInfo.strideWidth;
    var topPad = filterHeight - 1 - convInfo.padInfo.top;
    var leftPad = filterWidth - 1 - convInfo.padInfo.left;
    var isChannelsLast = convInfo.dataFormat === 'channelsLast';
    var dxStrides = tfjsCore.util.computeStrides(convInfo.inShape);
    var dyStrides = tfjsCore.util.computeStrides(dy.shape);
    var _a = __read(tfjsCore.util.computeStrides(filter.shape), 3),
      fltS0 = _a[0],
      fltS1 = _a[1],
      fltS2 = _a[2];
    var xBatchStride = dxStrides[0];
    var xRowStride = isChannelsLast ? dxStrides[1] : dxStrides[2];
    var xColStride = isChannelsLast ? dxStrides[2] : 1;
    var xChannelStride = isChannelsLast ? 1 : dxStrides[1];
    var yBatchStride = dyStrides[0];
    var yRowStride = isChannelsLast ? dyStrides[1] : dyStrides[2];
    var yColStride = isChannelsLast ? dyStrides[2] : 1;
    var yChannelStride = isChannelsLast ? 1 : dyStrides[1];
    var out = backend.makeOutput(convInfo.inShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    var dyId = backend.dataIdMap.get(dy.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
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
  var conv2DBackpropInputConfig = {
    kernelName: tfjsCore.Conv2DBackpropInput,
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
  var wasmConv3D;
  function setup$Z(backend) {
    wasmConv3D = backend.wasm.cwrap(tfjsCore.Conv3D, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x,
      filter = inputs.filter;
    var strides = attrs.strides,
      pad = attrs.pad,
      dilations = attrs.dilations;
    if (x.dtype !== 'float32') {
      throw new Error('Tensor x must have dtype float32, got '.concat(x.dtype));
    }
    if (filter.dtype !== 'float32') {
      throw new Error('Tensor filter must have dtype float32, got '.concat(filter.dtype));
    }
    var convInfo = tfjsCore.backend_util.computeConv3DInfo(x.shape, filter.shape, strides, dilations, pad);
    var out = backend.makeOutput(convInfo.outShape, x.dtype);
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
  var conv3DConfig = {
    kernelName: tfjsCore.Conv3D,
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
  var wasmConv3DBackpropFilterV2;
  function setup$Y(backend) {
    wasmConv3DBackpropFilterV2 = backend.wasm.cwrap(tfjsCore.Conv3DBackpropFilterV2, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x,
      dy = inputs.dy;
    var strides = attrs.strides,
      pad = attrs.pad,
      filterShape = attrs.filterShape;
    if (x.dtype !== 'float32') {
      throw new Error('Tensor dy must have dtype float32, got '.concat(x.dtype));
    }
    if (dy.dtype !== 'float32') {
      throw new Error('Tensor filter must have dtype float32, got '.concat(dy.dtype));
    }
    var convInfo = tfjsCore.backend_util.computeConv3DInfo(x.shape, filterShape, strides, /*dilations=*/ 1, pad);
    var dw = backend.makeOutput(convInfo.filterShape, dy.dtype);
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
  var conv3DBackpropFilterV2Config = {
    kernelName: tfjsCore.Conv3DBackpropFilterV2,
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
  var wasmConv3DBackpropInputV2;
  function setup$X(backend) {
    wasmConv3DBackpropInputV2 = backend.wasm.cwrap(tfjsCore.Conv3DBackpropInputV2, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var dy = inputs.dy,
      filter = inputs.filter;
    var pad = attrs.pad,
      strides = attrs.strides,
      inputShape = attrs.inputShape;
    if (dy.dtype !== 'float32') {
      throw new Error('Tensor dy must have dtype float32, got '.concat(dy.dtype));
    }
    if (filter.dtype !== 'float32') {
      throw new Error('Tensor filter must have dtype float32, got '.concat(filter.dtype));
    }
    var convInfo = tfjsCore.backend_util.computeConv3DInfo(inputShape, filter.shape, strides, /*dilations=*/ 1, pad);
    var dx = backend.makeOutput(convInfo.inShape, dy.dtype);
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
  var conv3DBackpropInputV2Config = {
    kernelName: tfjsCore.Conv3DBackpropInputV2,
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
  var cosConfig = createUnaryKernelConfig(tfjsCore.Cos);

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
  var coshConfig = createUnaryKernelConfig(tfjsCore.Cosh);

  // Must match enum in CropAndResize.cc
  var InterpolationMethod;
  (function (InterpolationMethod) {
    InterpolationMethod[(InterpolationMethod['bilinear'] = 0)] = 'bilinear';
    InterpolationMethod[(InterpolationMethod['nearest'] = 1)] = 'nearest';
  })(InterpolationMethod || (InterpolationMethod = {}));
  var wasmCropAndResize;
  function setup$W(backend) {
    wasmCropAndResize = backend.wasm.cwrap(tfjsCore.CropAndResize, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var method = attrs.method,
      extrapolationValue = attrs.extrapolationValue,
      cropSize = attrs.cropSize;
    var image = inputs.image,
      boxes = inputs.boxes,
      boxInd = inputs.boxInd;
    var numBoxes = boxes.shape[0];
    var _a = __read(cropSize, 2),
      cropHeight = _a[0],
      cropWidth = _a[1];
    var outShape = [numBoxes, cropHeight, cropWidth, image.shape[3]];
    var imagesData = backend.dataIdMap.get(image.dataId);
    var castedData;
    if (image.dtype !== 'float32') {
      castedData = cast({ backend: backend, inputs: { x: image }, attrs: { dtype: 'float32' } });
      imagesData = backend.dataIdMap.get(castedData.dataId);
    }
    var imagesId = imagesData.id;
    var boxesId = backend.dataIdMap.get(boxes.dataId).id;
    var boxIndId = backend.dataIdMap.get(boxInd.dataId).id;
    var out = backend.makeOutput(outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    var imagesShapeBytes = new Uint8Array(new Int32Array(image.shape).buffer);
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
  var cropAndResizeConfig = {
    kernelName: tfjsCore.CropAndResize,
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
  var wasmCumprod;
  function setup$V(backend) {
    wasmCumprod = backend.wasm.cwrap(tfjsCore.Cumprod, null /* void */, [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number', // dtype
    ]);
  }
  function cumprod(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis,
      exclusive = attrs.exclusive,
      reverse = attrs.reverse;
    var xRank = x.shape.length;
    tfjsCore.util.assert(x.dtype === 'float32' || x.dtype === 'int32', function () {
      return 'cumprod does not support '.concat(x.dtype, ' tensors in the WASM backend');
    });
    // permute required axis to inner most axis
    var permutation = tfjsCore.backend_util.getAxesPermutation([axis], xRank);
    var permutedX = x;
    if (permutation !== null) {
      permutedX = transpose({ inputs: { x: x }, attrs: { perm: permutation }, backend: backend });
    }
    var permutedAxis = tfjsCore.backend_util.getInnerMostAxes(1, xRank)[0];
    tfjsCore.backend_util.assertAxesAreInnerMostDims('cumprod', [permutedAxis], xRank);
    var permutedOut = backend.makeOutput(permutedX.shape, permutedX.dtype);
    var finalDim = permutedX.shape[permutedAxis];
    var permutedXId = backend.dataIdMap.get(permutedX.dataId).id;
    var permutedOutId = backend.dataIdMap.get(permutedOut.dataId).id;
    wasmCumprod(permutedXId, exclusive ? 1 : 0, reverse ? 1 : 0, finalDim, permutedOutId, CppDType[x.dtype]);
    // transpose data back if permuted
    var out = permutedOut;
    if (permutation !== null) {
      var undoPermutation = tfjsCore.backend_util.getUndoAxesPermutation(permutation);
      out = transpose({ inputs: { x: permutedOut }, attrs: { perm: undoPermutation }, backend: backend });
      backend.disposeData(permutedX.dataId);
      backend.disposeData(permutedOut.dataId);
    }
    return out;
  }
  var cumprodConfig = {
    kernelName: tfjsCore.Cumprod,
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
  var wasmCumsum;
  function setup$U(backend) {
    wasmCumsum = backend.wasm.cwrap(tfjsCore.Cumsum, null /* void */, [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number', // dtype
    ]);
  }
  function cumsum(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var axis = attrs.axis,
      exclusive = attrs.exclusive,
      reverse = attrs.reverse;
    var xRank = x.shape.length;
    tfjsCore.util.assert(x.dtype === 'float32' || x.dtype === 'int32', function () {
      return 'cumsum does not support '.concat(x.dtype, ' tensors in the WASM backend');
    });
    // permute required axis to inner most axis
    var permutation = tfjsCore.backend_util.getAxesPermutation([axis], xRank);
    var permutedX = x;
    if (permutation !== null) {
      permutedX = transpose({ inputs: { x: x }, attrs: { perm: permutation }, backend: backend });
    }
    var permutedAxis = tfjsCore.backend_util.getInnerMostAxes(1, xRank)[0];
    tfjsCore.backend_util.assertAxesAreInnerMostDims('cumsum', [permutedAxis], xRank);
    var permutedOut = backend.makeOutput(permutedX.shape, permutedX.dtype);
    var finalDim = permutedX.shape[permutedAxis];
    var permutedXId = backend.dataIdMap.get(permutedX.dataId).id;
    var permutedOutId = backend.dataIdMap.get(permutedOut.dataId).id;
    wasmCumsum(permutedXId, exclusive ? 1 : 0, reverse ? 1 : 0, finalDim, permutedOutId, CppDType[x.dtype]);
    // transpose data back if permuted
    var out = permutedOut;
    if (permutation !== null) {
      var undoPermutation = tfjsCore.backend_util.getUndoAxesPermutation(permutation);
      out = transpose({ inputs: { x: permutedOut }, attrs: { perm: undoPermutation }, backend: backend });
      backend.disposeData(permutedX.dataId);
      backend.disposeData(permutedOut.dataId);
    }
    return out;
  }
  var cumsumConfig = {
    kernelName: tfjsCore.Cumsum,
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
  var wasmDenseBincount;
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var x = inputs.x,
      weights = inputs.weights;
    var size = attrs.size,
      binaryOutput = attrs.binaryOutput;
    var hasWeights =
      weights.shape.reduce(function (p, v) {
        return p * v;
      }, 1) !== 0;
    var outShape = x.shape.length === 1 ? [size] : [x.shape[0], size];
    var out = backend.makeOutput(outShape, weights.dtype);
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
  var denseBincountConfig = {
    kernelName: tfjsCore.DenseBincount,
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
  var wasmDepthToSpace;
  function setup$S(backend) {
    wasmDepthToSpace = backend.wasm.cwrap(tfjsCore.DepthToSpace, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var x = inputs.x;
    var blockSize = attrs.blockSize,
      dataFormat = attrs.dataFormat;
    var batchSize = x.shape[0];
    var inputHeight = dataFormat === 'NHWC' ? x.shape[1] : x.shape[2];
    var inputWidth = dataFormat === 'NHWC' ? x.shape[2] : x.shape[3];
    var inputDepth = dataFormat === 'NHWC' ? x.shape[3] : x.shape[1];
    var outputHeight = inputHeight * blockSize;
    var outputWidth = inputWidth * blockSize;
    var outputDepth = inputDepth / (blockSize * blockSize);
    var outputShape =
      dataFormat === 'NHWC' ? [batchSize, outputHeight, outputWidth, outputDepth] : [batchSize, outputDepth, outputHeight, outputWidth];
    var out = backend.makeOutput(outputShape, 'float32');
    var xData = backend.dataIdMap.get(x.dataId);
    var xId = xData.id;
    var xStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(x.shape)).buffer);
    var outputShapeBytes = new Uint8Array(new Int32Array(outputShape).buffer);
    var outStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(outputShape)).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var channelsLast = dataFormat === 'NHWC' ? 1 : 0;
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
  var depthToSpaceConfig = {
    kernelName: tfjsCore.DepthToSpace,
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
  var wasmDepthwiseConv2d;
  function setup$R(backend) {
    wasmDepthwiseConv2d = backend.wasm.cwrap(tfjsCore.DepthwiseConv2dNative, null /* void */, [
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x,
      filter = inputs.filter;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
    var strides = attrs.strides,
      dilations = attrs.dilations,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode;
    var $dilations = dilations == null ? [1, 1] : dilations;
    var convInfo = tfjsCore.backend_util.computeConv2DInfo(
      x.shape,
      filter.shape,
      strides,
      $dilations,
      pad,
      dimRoundingMode,
      true /* depthwise */,
    );
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var dilationHeight = convInfo.dilationHeight;
    var dilationWidth = convInfo.dilationWidth;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var inputChannels = convInfo.inChannels;
    var outputChannels = convInfo.outChannels;
    var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    if (convInfo.dataFormat !== 'channelsLast') {
      throw new Error(
        "wasm backend DepthwiseConv2dNative does not support dataFormat:'" +
          ''.concat(convInfo.dataFormat, "'. Please use 'channelsLast'."),
      );
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var depthwiseConv2dNativeConfig = {
    kernelName: tfjsCore.DepthwiseConv2dNative,
    backendName: 'wasm',
    setupFunc: setup$R,
    kernelFunc: depthwiseConv2d,
  };

  var wasmDiag;
  function setup$Q(backend) {
    wasmDiag = backend.wasm.cwrap('Diag', null, [
      'number',
      'number',
      'number',
      'number', // outId
    ]);
  }
  function diag(args) {
    var inputs = args.inputs,
      backend = args.backend;
    var x = inputs.x;
    var xSize = tfjsCore.util.sizeFromShape(x.shape);
    var out = backend.makeOutput(__spreadArray(__spreadArray([], __read(x.shape), false), __read(x.shape), false), x.dtype);
    wasmDiag(backend.dataIdMap.get(x.dataId).id, CppDType[x.dtype], xSize, backend.dataIdMap.get(out.dataId).id);
    return out;
  }
  var diagConfig = {
    kernelName: tfjsCore.Diag,
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
  var wasmDilation2D;
  function setup$P(backend) {
    wasmDilation2D = backend.wasm.cwrap(tfjsCore.Dilation2D, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x,
      filter = inputs.filter;
    var strides = attrs.strides,
      pad = attrs.pad,
      dilations = attrs.dilations;
    if (x.dtype !== filter.dtype) {
      throw new Error('Dilation2D error: x must have the same dtype as filter. Got '.concat(x.dtype, ' and ').concat(filter.dtype));
    }
    var dilationInfo = tfjsCore.backend_util.computeDilation2DInfo(x.shape, filter.shape, strides, pad, /*dataFormat=*/ 'NHWC', dilations);
    var out = backend.makeOutput(dilationInfo.outShape, x.dtype);
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
  var dilation2DConfig = {
    kernelName: tfjsCore.Dilation2D,
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
  var wasmDilation2DBackpropFilter;
  function setup$O(backend) {
    wasmDilation2DBackpropFilter = backend.wasm.cwrap(tfjsCore.Dilation2DBackpropFilter, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x,
      filter = inputs.filter,
      dy = inputs.dy;
    var strides = attrs.strides,
      pad = attrs.pad,
      dilations = attrs.dilations;
    if (x.dtype !== filter.dtype || x.dtype !== dy.dtype) {
      throw new Error(
        'Dilation2DBackpropFilter error: x must have the same dtype as filter and dy. Got '
          .concat(x.dtype, ', ')
          .concat(filter.dtype, ', and ')
          .concat(dy.dtype),
      );
    }
    var dilationInfo = tfjsCore.backend_util.computeDilation2DInfo(x.shape, filter.shape, strides, pad, /*dataFormat=*/ 'NHWC', dilations);
    var gradients = backend.makeOutput(filter.shape, filter.dtype);
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
  var dilation2DBackpropFilterConfig = {
    kernelName: tfjsCore.Dilation2DBackpropFilter,
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
  var wasmDilation2DBackpropInput;
  function setup$N(backend) {
    wasmDilation2DBackpropInput = backend.wasm.cwrap(tfjsCore.Dilation2DBackpropInput, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x,
      filter = inputs.filter,
      dy = inputs.dy;
    var strides = attrs.strides,
      pad = attrs.pad,
      dilations = attrs.dilations;
    if (x.dtype !== filter.dtype || x.dtype !== dy.dtype) {
      throw new Error(
        'Dilation2DBackpropInput error: x must have the same dtype as filter and dy. Got '
          .concat(x.dtype, ', ')
          .concat(filter.dtype, ', and ')
          .concat(dy.dtype),
      );
    }
    var dilationInfo = tfjsCore.backend_util.computeDilation2DInfo(x.shape, filter.shape, strides, pad, /*dataFormat=*/ 'NHWC', dilations);
    var gradients = backend.makeOutput(x.shape, x.dtype);
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
  var dilation2DBackpropInputConfig = {
    kernelName: tfjsCore.Dilation2DBackpropInput,
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
  var eluConfig = createUnaryKernelConfig(tfjsCore.Elu);

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
  var wasmEluGrad;
  function setup$M(backend) {
    wasmEluGrad = backend.wasm.cwrap(tfjsCore.EluGrad, null, [
      'number',
      'number',
      'number', // outId
    ]);
  }
  function eluGrad(args) {
    var inputs = args.inputs,
      backend = args.backend;
    var dy = inputs.dy,
      y = inputs.y;
    var out = backend.makeOutput(y.shape, 'float32');
    var tensorId = function (x) {
      return backend.dataIdMap.get(x.dataId).id;
    };
    wasmEluGrad(tensorId(y), tensorId(dy), tensorId(out));
    return out;
  }
  var eluGradConfig = {
    kernelName: tfjsCore.EluGrad,
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
  var supportsFullBroadcast$8 = false;
  var equalConfig = createBinaryKernelConfig(tfjsCore.Equal, supportsFullBroadcast$8, 'bool');

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
  var erfConfig = createUnaryKernelConfig(tfjsCore.Erf);

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
  var expConfig = createUnaryKernelConfig(tfjsCore.Exp, 'float32');

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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var input = inputs.input;
    var dim = attrs.dim;
    var inputRank = input.shape.length;
    var newShape = input.shape.slice();
    var $dim = dim;
    if (dim < 0) {
      // Negative value is counted from the tail of rank.
      tfjsCore.util.assert(-(inputRank + 1) <= dim, function () {
        return 'Axis must be in the interval ['.concat(-(inputRank + 1), ', ').concat(inputRank, ']');
      });
      $dim = inputRank + dim + 1;
    }
    newShape.splice($dim, 0, 1);
    return reshape({ inputs: { x: input }, backend: backend, attrs: { shape: newShape } });
  }
  var expandDimsConfig = {
    kernelName: tfjsCore.ExpandDims,
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
  var expm1Config = createUnaryKernelConfig(tfjsCore.Expm1, 'float32');

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
    var _a = args.attrs,
      shape = _a.shape,
      value = _a.value,
      backend = args.backend;
    var dtype = args.attrs.dtype;
    dtype = dtype || tfjsCore.util.inferDtype(value);
    var out = backend.makeOutput(shape, dtype);
    var outVals = backend.typedArrayFromHeap(out);
    outVals.fill(value);
    return out;
  }
  var fillConfig = {
    kernelName: tfjsCore.Fill,
    backendName: 'wasm',
    kernelFunc: fill,
  };

  var wasmFlipLeftRight;
  function setup$L(backend) {
    wasmFlipLeftRight = backend.wasm.cwrap(tfjsCore.FlipLeftRight, null /* void */, [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number', // outId
    ]);
  }
  function flipLeftRight(args) {
    var inputs = args.inputs,
      backend = args.backend;
    var image = inputs.image;
    var out = backend.makeOutput(image.shape, image.dtype);
    var imageId = backend.dataIdMap.get(image.dataId).id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var _a = __read(image.shape, 4),
      batch = _a[0],
      imageHeight = _a[1],
      imageWidth = _a[2],
      numChannels = _a[3];
    wasmFlipLeftRight(imageId, batch, imageHeight, imageWidth, numChannels, outId);
    return out;
  }
  var flipLeftRightConfig = {
    kernelName: tfjsCore.FlipLeftRight,
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
  var floorConfig = createUnaryKernelConfig(tfjsCore.Floor);

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
  var floorDivConfig = createBinaryKernelConfig(tfjsCore.FloorDiv);

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
  var wasmBatchNorm;
  function setup$K(backend) {
    wasmBatchNorm = backend.wasm.cwrap(tfjsCore.FusedBatchNorm, null /* void */, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var varianceEpsilon = attrs.varianceEpsilon;
    var x = inputs.x,
      mean = inputs.mean,
      variance = inputs.variance,
      offset = inputs.offset,
      scale = inputs.scale;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var meanId = backend.dataIdMap.get(mean.dataId).id;
    var varianceId = backend.dataIdMap.get(variance.dataId).id;
    var offsetId = offset != null ? backend.dataIdMap.get(offset.dataId).id : 0;
    var scaleId = scale != null ? backend.dataIdMap.get(scale.dataId).id : 0;
    var out = backend.makeOutput(x.shape, x.dtype);
    // Short-circuit zero-sized tensors.
    if (tfjsCore.util.sizeFromShape(x.shape) === 0) {
      return out;
    }
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmBatchNorm(xId, meanId, varianceId, offsetId, scaleId, varianceEpsilon, outId);
    return out;
  }
  var fusedBatchNormConfig = {
    kernelName: tfjsCore.FusedBatchNorm,
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
  var wasmFusedConv2d;
  function setup$J(backend) {
    wasmFusedConv2d = backend.wasm.cwrap(tfjsCore.FusedConv2D, null /* void */, [
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x,
      filter = inputs.filter,
      bias = inputs.bias,
      preluActivationWeights = inputs.preluActivationWeights;
    var strides = attrs.strides,
      pad = attrs.pad,
      dilations = attrs.dilations,
      dataFormat = attrs.dataFormat,
      dimRoundingMode = attrs.dimRoundingMode,
      activation = attrs.activation,
      leakyreluAlpha = attrs.leakyreluAlpha;
    var convInfo = tfjsCore.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode);
    var fusedActivation = FusableActivation[activation];
    if (fusedActivation == null) {
      throw new Error(''.concat(activation, ' activation not yet supported for FusedConv2D ') + 'in the wasm backend.');
    }
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
    var outputChannels = convInfo.outChannels;
    var biasId = 0;
    if (bias != null) {
      var biasData = backend.dataIdMap.get(bias.dataId);
      if (biasData.shape.length !== 1) {
        throw new Error('FusedConv2D only supports rank-1 bias but got ' + 'rank '.concat(biasData.shape.length, '.'));
      }
      if (biasData.shape[0] !== outputChannels) {
        throw new Error(
          'FusedConv2D bias shape ('.concat(biasData.shape, ') does not ') +
            'match the number of output channels ('.concat(outputChannels, ')'),
        );
      }
      biasId = biasData.id;
    }
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var dilationHeight = convInfo.dilationHeight;
    var dilationWidth = convInfo.dilationWidth;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var inputChannels = convInfo.inChannels;
    var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    var batchSize = convInfo.batchSize;
    var inHeight = convInfo.inHeight;
    var inWidth = convInfo.inWidth;
    if (dataFormat !== 'NHWC') {
      throw new Error("wasm backend FusedConv2D does not support dataFormat:'" + ''.concat(dataFormat, "'. Please use 'NHWC'."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    var preluActivationWeightsId = preluActivationWeights == null ? 0 : backend.dataIdMap.get(preluActivationWeights.dataId).id;
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
  var fusedConv2DConfig = {
    kernelName: tfjsCore.FusedConv2D,
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
  var wasmFusedDepthwiseConv2d;
  function setup$I(backend) {
    wasmFusedDepthwiseConv2d = backend.wasm.cwrap(tfjsCore.FusedDepthwiseConv2D, null /* void */, [
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x,
      filter = inputs.filter,
      bias = inputs.bias,
      preluActivationWeights = inputs.preluActivationWeights;
    var strides = attrs.strides,
      pad = attrs.pad,
      dilations = attrs.dilations,
      dataFormat = attrs.dataFormat,
      dimRoundingMode = attrs.dimRoundingMode,
      activation = attrs.activation,
      leakyreluAlpha = attrs.leakyreluAlpha;
    var convInfo = tfjsCore.backend_util.computeConv2DInfo(
      x.shape,
      filter.shape,
      strides,
      dilations,
      pad,
      dimRoundingMode,
      true /* depthwise */,
    );
    var fusedActivation = FusableActivation[activation];
    if (fusedActivation == null) {
      throw new Error(''.concat(activation, ' activation not yet supported for FusedDepthwiseConv2D ') + 'in the wasm backend.');
    }
    var xId = backend.dataIdMap.get(x.dataId).id;
    var filterId = backend.dataIdMap.get(filter.dataId).id;
    var outputChannels = convInfo.outChannels;
    var biasId = 0;
    if (bias != null) {
      var biasData = backend.dataIdMap.get(bias.dataId);
      if (biasData.shape.length !== 1) {
        throw new Error('FusedDepthwiseConv2D only supports rank-1 bias but got ' + 'rank '.concat(biasData.shape.length, '.'));
      }
      if (biasData.shape[0] !== outputChannels) {
        throw new Error(
          'FusedDepthwiseConv2D bias shape ('.concat(biasData.shape, ') does not ') +
            'match the number of output channels ('.concat(outputChannels, ')'),
        );
      }
      biasId = biasData.id;
    }
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var dilationHeight = convInfo.dilationHeight;
    var dilationWidth = convInfo.dilationWidth;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var inputChannels = convInfo.inChannels;
    var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
    var batchSize = convInfo.batchSize;
    var inHeight = convInfo.inHeight;
    var inWidth = convInfo.inWidth;
    if (dataFormat !== 'NHWC') {
      throw new Error("wasm backend FusedDepthwiseConv2D does not support dataFormat:'" + ''.concat(dataFormat, "'. Please use 'NHWC'."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    var preluActivationWeightsId = preluActivationWeights == null ? 0 : backend.dataIdMap.get(preluActivationWeights.dataId).id;
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
  var fusedDepthwiseConv2DConfig = {
    kernelName: tfjsCore.FusedDepthwiseConv2D,
    backendName: 'wasm',
    setupFunc: setup$I,
    kernelFunc: fusedDepthwiseConv2d,
  };

  var wasmGatherNd;
  function setup$H(backend) {
    wasmGatherNd = backend.wasm.cwrap(tfjsCore.GatherNd, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs;
    var params = inputs.params,
      indices = inputs.indices;
    var _a = __read(tfjsCore.gather_util.prepareAndValidate(params, indices), 4),
      resultShape = _a[0],
      numSlices = _a[1],
      sliceSize = _a[2],
      strides = _a[3];
    var out = backend.makeOutput(resultShape, params.dtype);
    if (numSlices === 0) {
      return out;
    }
    var indicesShape = indices.shape;
    var sliceRank = indicesShape[indicesShape.length - 1];
    var xData = backend.dataIdMap.get(params.dataId);
    var xId = xData.id;
    var indicesData = backend.dataIdMap.get(indices.dataId);
    var indicesId = indicesData.id;
    var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmGatherNd(xId, CppDType[params.dtype], indicesId, numSlices, sliceRank, sliceSize, stridesBytes, outId);
    return out;
  }
  var gatherNdConfig = {
    kernelName: tfjsCore.GatherNd,
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
  var wasmGather;
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var x = inputs.x,
      indices = inputs.indices;
    var axis = attrs.axis,
      batchDims = attrs.batchDims;
    // Throw error when any index is out of bound.
    var parsedAxis = tfjsCore.util.parseAxisParam(axis, x.shape)[0];
    var indicesVals = backend.readSync(indices.dataId);
    var axisDim = x.shape[parsedAxis];
    var _loop_1 = function (i) {
      var index = indicesVals[i];
      tfjsCore.util.assert(index <= axisDim - 1 && index >= 0, function () {
        return 'GatherV2: the index value '.concat(index, ' is not in [0, ').concat(axisDim - 1, ']');
      });
    };
    for (var i = 0; i < indicesVals.length; ++i) {
      _loop_1(i);
    }
    var shapeInfo = tfjsCore.backend_util.segment_util.collectGatherOpShapeInfo(x, indices, parsedAxis, batchDims);
    var flattenX = reshape({
      inputs: { x: x },
      attrs: {
        shape: [shapeInfo.batchSize, shapeInfo.outerSize, shapeInfo.dimSize, shapeInfo.sliceSize],
      },
      backend: backend,
    });
    var indicesSize = tfjsCore.util.sizeFromShape(indices.shape);
    var flattenIndex = reshape({
      inputs: { x: indices },
      attrs: { shape: [shapeInfo.batchSize, indicesSize / shapeInfo.batchSize] },
      backend: backend,
    });
    var flattenOutputShape = [shapeInfo.batchSize, shapeInfo.outerSize, indicesSize / shapeInfo.batchSize, shapeInfo.sliceSize];
    var out = backend.makeOutput(flattenOutputShape, x.dtype);
    if (tfjsCore.util.sizeFromShape(x.shape) === 0) {
      return out;
    }
    var stridesSize = flattenX.shape.length - 1;
    var xData = backend.dataIdMap.get(flattenX.dataId);
    var xId = xData.id;
    var indicesData = backend.dataIdMap.get(flattenIndex.dataId);
    var indicesId = indicesData.id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var xStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(flattenX.shape)).buffer);
    var outStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(flattenOutputShape)).buffer);
    wasmGather(xId, CppDType[x.dtype], xStridesBytes, stridesSize, indicesId, shapeInfo.batchSize, outStridesBytes, outId);
    backend.disposeData(flattenX.dataId);
    backend.disposeData(flattenIndex.dataId);
    // reshape
    out.shape = shapeInfo.outputShape;
    return out;
  }
  var gatherV2Config = {
    kernelName: tfjsCore.GatherV2,
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
  var supportsFullBroadcast$7 = false;
  var greaterConfig = createBinaryKernelConfig(tfjsCore.Greater, supportsFullBroadcast$7, 'bool');

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
  var supportsFullBroadcast$6 = false;
  var greaterEqualConfig = createBinaryKernelConfig(tfjsCore.GreaterEqual, supportsFullBroadcast$6, 'bool');

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
  var isFiniteConfig = createUnaryKernelConfig(tfjsCore.IsFinite, 'bool');

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
  var isInfConfig = createUnaryKernelConfig(tfjsCore.IsInf, 'bool');

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
  var isNaNConfig = createUnaryKernelConfig(tfjsCore.IsNan, 'bool');

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
  var wasmFunc$5;
  function setupFunc(backend) {
    wasmFunc$5 = backend.wasm.cwrap(tfjsCore.LeakyRelu, null /* void */, [
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function leakyRelu(args) {
    var x = args.inputs.x,
      alpha = args.attrs.alpha,
      backend = args.backend;
    var xId = backend.dataIdMap.get(x.dataId).id;
    // According to TF API, LeakyRelu returns float32 when input is either float32
    // or int32.
    var out = backend.makeOutput(x.shape, 'float32');
    if (tfjsCore.util.sizeFromShape(x.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmFunc$5(xId, CppDType[x.dtype], alpha, outId);
    }
    return out;
  }
  var leakyReluConfig = {
    kernelName: tfjsCore.LeakyRelu,
    backendName: 'wasm',
    setupFunc: setupFunc,
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
  var supportsFullBroadcast$5 = false;
  var lessConfig = createBinaryKernelConfig(tfjsCore.Less, supportsFullBroadcast$5, 'bool');

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
  var supportsFullBroadcast$4 = false;
  var lessEqualConfig = createBinaryKernelConfig(tfjsCore.LessEqual, supportsFullBroadcast$4, 'bool');

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
  var wasmLinSpace;
  function setup$F(backend) {
    wasmLinSpace = backend.wasm.cwrap(tfjsCore.LinSpace, null, [
      'number',
      'number',
      'number',
      'number', // num
    ]);
  }
  function linSpace(args) {
    var attrs = args.attrs,
      backend = args.backend;
    var start = attrs.start,
      stop = attrs.stop,
      num = attrs.num;
    // TFJS Cpu backend supports num as a float and returns undetermined tensor in
    // that case. However, according to TensorFlow spec, num should be a integer.
    var numInt = Math.floor(num);
    var out = backend.makeOutput([numInt], 'float32');
    wasmLinSpace(backend.dataIdMap.get(out.dataId).id, start, stop, numInt);
    return out;
  }
  var linSpaceConfig = {
    kernelName: tfjsCore.LinSpace,
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
  var logConfig = createUnaryKernelConfig(tfjsCore.Log);

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
  var log1pConfig = createUnaryKernelConfig(tfjsCore.Log1p);

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
  var supportsFullBroadcast$3 = false;
  var logicalAndConfig = createBinaryKernelConfig(tfjsCore.LogicalAnd, supportsFullBroadcast$3, 'bool');

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
  var logicalNotConfig = createUnaryKernelConfig(tfjsCore.LogicalNot);

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
  var supportsFullBroadcast$2 = false;
  var logicalOrConfig = createBinaryKernelConfig(tfjsCore.LogicalOr, supportsFullBroadcast$2, 'bool');

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
  var supportsFullBroadcast$1 = false;
  var logicalXorConfig = createBinaryKernelConfig(tfjsCore.LogicalXor, supportsFullBroadcast$1, 'bool');

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
  var wasmLRN;
  function setup$E(backend) {
    wasmLRN = backend.wasm.cwrap(tfjsCore.LRN, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var depthRadius = attrs.depthRadius,
      bias = attrs.bias,
      alpha = attrs.alpha,
      beta = attrs.beta;
    if (x.dtype !== 'float32') {
      throw new Error('LRN error: x must have dtype float32');
    }
    var out = backend.makeOutput(x.shape, x.dtype);
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
  var lrnConfig = {
    kernelName: tfjsCore.LRN,
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
  var wasmLRNGrad;
  function setup$D(backend) {
    wasmLRNGrad = backend.wasm.cwrap(tfjsCore.LRNGrad, null, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x,
      y = inputs.y,
      dy = inputs.dy;
    var depthRadius = attrs.depthRadius,
      bias = attrs.bias,
      alpha = attrs.alpha,
      beta = attrs.beta;
    if (x.dtype !== 'float32' || y.dtype !== 'float32' || dy.dtype !== 'float32') {
      throw new Error('LRNGrad error: x, y, and dy must have dtype float32');
    }
    var dx = backend.makeOutput(x.shape, x.dtype);
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
  var lrnGradConfig = {
    kernelName: tfjsCore.LRNGrad,
    backendName: 'wasm',
    setupFunc: setup$D,
    kernelFunc: lrnGrad,
  };

  var wasmMax;
  function setup$C(backend) {
    wasmMax = backend.wasm.cwrap(tfjsCore.Max, null /*void*/, [
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function max(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.reductionIndices,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      input = transposed;
      inputId = transposedId;
    }
    var inputRank = input.shape.length;
    tfjsCore.backend_util.assertAxesAreInnerMostDims('max', axes, inputRank);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, x.dtype);
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmMax(inputId, CppDType[x.dtype], reduceSize, outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    return out;
  }
  var maxConfig = {
    kernelName: tfjsCore.Max,
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
  var maximumConfig = createBinaryKernelConfig(tfjsCore.Maximum);

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
  var wasmMaxPool;
  function setup$B(backend) {
    wasmMaxPool = backend.wasm.cwrap(tfjsCore.MaxPool, null /* void */, [
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    // TF API supports int32 input. CPU and WebGL backend also support int32
    // input. WASM backend doesn't support it because it uses xnnpack which only
    // supports float32.
    //
    // Add the following assert only for the WASM backend instead of at core op
    // level.
    //
    // TODO: add support for int32 input.
    tfjsCore.util.assert(x.dtype === 'float32', function () {
      return 'Error in MaxPool: only float32 input is supported. Got '.concat(x.dtype, '.');
    });
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode;
    var convInfo = tfjsCore.backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad, dimRoundingMode);
    var filterHeight = convInfo.filterHeight;
    var filterWidth = convInfo.filterWidth;
    var padTop = convInfo.padInfo.top;
    var padRight = convInfo.padInfo.right;
    var padBottom = convInfo.padInfo.bottom;
    var padLeft = convInfo.padInfo.left;
    var dilationHeight = convInfo.dilationHeight;
    var dilationWidth = convInfo.dilationWidth;
    var strideHeight = convInfo.strideHeight;
    var strideWidth = convInfo.strideWidth;
    var inputChannels = convInfo.inChannels;
    var outputChannels = convInfo.outChannels;
    if (convInfo.dataFormat !== 'channelsLast') {
      throw new Error("wasm backend does not support dataFormat:'" + ''.concat(convInfo.dataFormat, "'. Please use 'channelsLast'."));
    }
    var out = backend.makeOutput(convInfo.outShape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var maxPoolConfig = {
    kernelName: tfjsCore.MaxPool,
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
  var wasmMaxPool3D;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode,
      dataFormat = attrs.dataFormat;
    var convInfo = tfjsCore.backend_util.computePool3DInfo(
      x.shape,
      filterSize,
      strides,
      /*dilations=*/ 1,
      pad,
      dimRoundingMode,
      dataFormat,
    );
    var out = backend.makeOutput(convInfo.outShape, x.dtype);
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
  var maxPool3DConfig = {
    kernelName: tfjsCore.MaxPool3D,
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
  var wasmMaxPool3DGrad;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var dy = inputs.dy,
      input = inputs.input;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode;
    var convInfo = tfjsCore.backend_util.computePool3DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode);
    var dx = backend.makeOutput(input.shape, input.dtype);
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
  var maxPool3DGradConfig = {
    kernelName: tfjsCore.MaxPool3DGrad,
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
  var wasmMaxPoolGrad;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var dy = inputs.dy,
      input = inputs.input;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      dimRoundingMode = attrs.dimRoundingMode;
    var convInfo = tfjsCore.backend_util.computePool2DInfo(input.shape, filterSize, strides, /*dilations=*/ 1, pad, dimRoundingMode);
    var dx = backend.makeOutput(input.shape, input.dtype);
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
  var maxPoolGradConfig = {
    kernelName: tfjsCore.MaxPoolGrad,
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
  var wasmMaxPoolWithArgmax;
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var filterSize = attrs.filterSize,
      strides = attrs.strides,
      pad = attrs.pad,
      includeBatchInIndex = attrs.includeBatchInIndex;
    tfjsCore.util.assert(x.shape.length === 4, function () {
      return 'Error in maxPool: input must be rank 4 but got rank '.concat(x.shape.length, '.');
    });
    var dilations = [1, 1];
    tfjsCore.util.assert(tfjsCore.backend_util.eitherStridesOrDilationsAreOne(strides, dilations), function () {
      return (
        'Error in maxPool: Either strides or dilations must be 1. ' +
        'Got strides '.concat(strides, " and dilations '").concat(dilations, "'")
      );
    });
    var convInfo = tfjsCore.backend_util.computePool2DInfo(x.shape, filterSize, strides, [1, 1], pad);
    var pooled = backend.makeOutput(convInfo.outShape, x.dtype);
    var indexes = backend.makeOutput(convInfo.outShape, 'int32');
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
  var maxPoolWithArgmaxConfig = {
    kernelName: tfjsCore.MaxPoolWithArgmax,
    backendName: 'wasm',
    setupFunc: setup$x,
    kernelFunc: maxPoolWithArgmax,
  };

  var wasmMean;
  function setup$w(backend) {
    wasmMean = backend.wasm.cwrap(tfjsCore.Mean, null /*void*/, ['number, number, number']);
  }
  function mean(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.axis,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    var reductionAxes = axes;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      if (transposedId !== xId) {
        // transpose was not a no-op. We will need to dispose of this
        // once we are done.
        input = transposed;
        inputId = transposedId;
        reductionAxes = tfjsCore.backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
      }
    }
    tfjsCore.backend_util.assertAxesAreInnerMostDims('mean', reductionAxes, input.shape.length);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, reductionAxes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var castedInput = input;
    if (input.dtype !== 'float32') {
      castedInput = cast({ backend: backend, inputs: { x: input }, attrs: { dtype: 'float32' } });
      inputId = backend.dataIdMap.get(castedInput.dataId).id;
    }
    var out = backend.makeOutput(outShape, 'float32');
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmMean(inputId, reduceSize, outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    if (input.dtype !== 'float32') {
      backend.disposeData(castedInput.dataId);
    }
    return out;
  }
  var meanConfig = {
    kernelName: tfjsCore.Mean,
    backendName: 'wasm',
    setupFunc: setup$w,
    kernelFunc: mean,
  };

  var wasmMin;
  function setup$v(backend) {
    wasmMin = backend.wasm.cwrap(tfjsCore.Min, null /*void*/, [
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function min(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.axis,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      if (transposedId !== xId) {
        // transpose was not a no-op. We will need to dispose of this
        // once we are done.
        input = transposed;
        inputId = transposedId;
      }
    }
    var inputRank = input.shape.length;
    tfjsCore.backend_util.assertAxesAreInnerMostDims('min', axes, inputRank);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, input.dtype);
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmMin(inputId, CppDType[x.dtype], reduceSize, outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    return out;
  }
  var minConfig = {
    kernelName: tfjsCore.Min,
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
  var minimumConfig = createBinaryKernelConfig(tfjsCore.Minimum);

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
  var wasmMirrorPad;
  function setup$u(backend) {
    wasmMirrorPad = backend.wasm.cwrap(tfjsCore.MirrorPad, null /* void */, [
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
    var x = args.inputs.x,
      backend = args.backend,
      _a = args.attrs,
      paddings = _a.paddings,
      mode = _a.mode;
    var outShape = paddings.map(
      function (p, i) {
        return p[0] /* beforePad */ + x.shape[i] + p[1];
      } /* afterPad */,
    );
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(outShape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    var prePaddingsFlat = paddings.map(function (padTuple) {
      return padTuple[0];
    });
    var postPaddingsFlat = paddings.map(function (padTuple) {
      return padTuple[1];
    });
    var prePaddingsBytes = new Uint8Array(new Int32Array(prePaddingsFlat).buffer);
    var postPaddingsBytes = new Uint8Array(new Int32Array(postPaddingsFlat).buffer);
    wasmMirrorPad(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], prePaddingsBytes, postPaddingsBytes, MirrorPaddingMode[mode], outId);
    return out;
  }
  var mirrorPadConfig = {
    kernelName: tfjsCore.MirrorPad,
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
  var wasmFunc$4;
  function setup$t(backend) {
    wasmFunc$4 = backend.wasm.cwrap(tfjsCore.Softmax, null /* void */, [
      'number',
      'number',
      'number',
      'number', // batch
    ]);
  }
  function softmax(args) {
    var backend = args.backend,
      logits = args.inputs.logits,
      dim = args.attrs.dim;
    var xId = backend.dataIdMap.get(logits.dataId).id;
    var out = backend.makeOutput(logits.shape, logits.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var channels = logits.shape[dim];
    var batch = tfjsCore.util.sizeFromShape(logits.shape) / channels;
    // Short-circuit zero-sized tensors.
    if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
      return out;
    }
    wasmFunc$4(xId, outId, channels, batch);
    return out;
  }
  var softmaxConfig = {
    kernelName: tfjsCore.Softmax,
    backendName: 'wasm',
    setupFunc: setup$t,
    kernelFunc: softmax,
  };

  var wasmMultinomial;
  function setup$s(backend) {
    wasmMultinomial = backend.wasm.cwrap(tfjsCore.Multinomial, null, [
      'number',
      'number',
      'number',
      'number',
      'number',
      'number', // outId
    ]);
  }
  function multinomial(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var logits = inputs.logits;
    var numSamples = attrs.numSamples,
      seed = attrs.seed,
      normalized = attrs.normalized;
    if (logits.dtype !== 'float32') {
      throw new Error('Tensor logits must have dtype float32, got '.concat(logits.dtype));
    }
    var probabilities = normalized
      ? logits
      : softmax({
          inputs: { logits: logits },
          backend: backend,
          attrs: { dim: logits.shape.length - 1 },
        });
    var _a = __read(probabilities.shape, 2),
      batchSize = _a[0],
      numEvents = _a[1];
    var out = backend.makeOutput([batchSize, numSamples], 'int32');
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
  var multinomialConfig = {
    kernelName: tfjsCore.Multinomial,
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
  var modConfig = createBinaryKernelConfig(tfjsCore.Mod);

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
  var multiplyConfig = createBinaryKernelConfig(tfjsCore.Multiply);

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
  var negConfig = createUnaryKernelConfig(tfjsCore.Neg);

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
    var result = new Int32Array(backend.wasm.HEAPU8.buffer, resOffset, 4);
    var pSelectedIndices = result[0];
    var selectedSize = result[1];
    var pSelectedScores = result[2];
    var pValidOutputs = result[3];
    // Since the result was allocated on the heap, we have to delete it.
    backend.wasm._free(resOffset);
    return {
      pSelectedIndices: pSelectedIndices,
      selectedSize: selectedSize,
      pSelectedScores: pSelectedScores,
      pValidOutputs: pValidOutputs,
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
  var wasmFunc$3;
  function setup$r(backend) {
    wasmFunc$3 = backend.wasm.cwrap(
      tfjsCore.NonMaxSuppressionV3,
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var iouThreshold = attrs.iouThreshold,
      maxOutputSize = attrs.maxOutputSize,
      scoreThreshold = attrs.scoreThreshold;
    var boxes = inputs.boxes,
      scores = inputs.scores;
    var boxesId = backend.dataIdMap.get(boxes.dataId).id;
    var scoresId = backend.dataIdMap.get(scores.dataId).id;
    var resOffset = wasmFunc$3(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold);
    var _a = parseResultStruct(backend, resOffset),
      pSelectedIndices = _a.pSelectedIndices,
      selectedSize = _a.selectedSize,
      pSelectedScores = _a.pSelectedScores,
      pValidOutputs = _a.pValidOutputs;
    // Since we are not using scores for V3, we have to delete it from the heap.
    backend.wasm._free(pSelectedScores);
    backend.wasm._free(pValidOutputs);
    var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
    return selectedIndicesTensor;
  }
  var nonMaxSuppressionV3Config = {
    kernelName: tfjsCore.NonMaxSuppressionV3,
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
  var wasmFunc$2;
  function setup$q(backend) {
    wasmFunc$2 = backend.wasm.cwrap(
      tfjsCore.NonMaxSuppressionV4,
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var iouThreshold = attrs.iouThreshold,
      maxOutputSize = attrs.maxOutputSize,
      scoreThreshold = attrs.scoreThreshold,
      padToMaxOutputSize = attrs.padToMaxOutputSize;
    var boxes = inputs.boxes,
      scores = inputs.scores;
    var boxesId = backend.dataIdMap.get(boxes.dataId).id;
    var scoresId = backend.dataIdMap.get(scores.dataId).id;
    var resOffset = wasmFunc$2(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, padToMaxOutputSize);
    var _a = parseResultStruct(backend, resOffset),
      pSelectedIndices = _a.pSelectedIndices,
      selectedSize = _a.selectedSize,
      pSelectedScores = _a.pSelectedScores,
      pValidOutputs = _a.pValidOutputs;
    // Since we are not using scores for V4, we have to delete it from the heap.
    backend.wasm._free(pSelectedScores);
    var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
    var validOutputsTensor = backend.makeOutput([], 'int32', pValidOutputs);
    return [selectedIndicesTensor, validOutputsTensor];
  }
  var nonMaxSuppressionV4Config = {
    kernelName: tfjsCore.NonMaxSuppressionV4,
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
  var wasmFunc$1;
  function setup$p(backend) {
    wasmFunc$1 = backend.wasm.cwrap(
      tfjsCore.NonMaxSuppressionV5,
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var iouThreshold = attrs.iouThreshold,
      maxOutputSize = attrs.maxOutputSize,
      scoreThreshold = attrs.scoreThreshold,
      softNmsSigma = attrs.softNmsSigma;
    var boxes = inputs.boxes,
      scores = inputs.scores;
    var boxesId = backend.dataIdMap.get(boxes.dataId).id;
    var scoresId = backend.dataIdMap.get(scores.dataId).id;
    var resOffset = wasmFunc$1(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
    var _a = parseResultStruct(backend, resOffset),
      pSelectedIndices = _a.pSelectedIndices,
      selectedSize = _a.selectedSize,
      pSelectedScores = _a.pSelectedScores,
      pValidOutputs = _a.pValidOutputs;
    // Since we are not using validOutputs for V5, we have to delete it from the
    // heap.
    backend.wasm._free(pValidOutputs);
    var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
    var selectedScoresTensor = backend.makeOutput([selectedSize], 'float32', pSelectedScores);
    return [selectedIndicesTensor, selectedScoresTensor];
  }
  var nonMaxSuppressionV5Config = {
    kernelName: tfjsCore.NonMaxSuppressionV5,
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
  var supportsFullBroadcast = false;
  var notEqualConfig = createBinaryKernelConfig(tfjsCore.NotEqual, supportsFullBroadcast, 'bool');

  var wasmOneHot;
  function setup$o(backend) {
    wasmOneHot = backend.wasm.cwrap(tfjsCore.OneHot, null /* void */, [
      'number',
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function oneHot(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var indices = inputs.indices;
    var dtype = attrs.dtype,
      depth = attrs.depth,
      onValue = attrs.onValue,
      offValue = attrs.offValue;
    var out = backend.makeOutput(__spreadArray(__spreadArray([], __read(indices.shape), false), [depth], false), dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var indicesData = backend.dataIdMap.get(indices.dataId);
    var indicesId = indicesData.id;
    wasmOneHot(indicesId, depth, onValue, offValue, outId);
    return out;
  }
  var oneHotConfig = {
    kernelName: tfjsCore.OneHot,
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
    var x = args.inputs.x,
      backend = args.backend;
    var out = backend.makeOutput(x.shape, x.dtype);
    var outVals = backend.typedArrayFromHeap(out);
    outVals.fill(1);
    return out;
  }
  var onesLikeConfig = {
    kernelName: tfjsCore.OnesLike,
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var axis = attrs.axis;
    if (inputs.length === 1) {
      return expandDims({ inputs: { input: inputs[0] }, backend: backend, attrs: { dim: axis } });
    }
    var shape = inputs[0].shape;
    var dtype = inputs[0].dtype;
    inputs.forEach(function (t) {
      tfjsCore.util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
      tfjsCore.util.assert(dtype === t.dtype, function () {
        return 'All tensors passed to stack must have matching dtypes';
      });
    });
    var intermediateTensorInfos = [];
    var expandedTensors = inputs.map(function (t) {
      var expandedT = expandDims({ inputs: { input: t }, backend: backend, attrs: { dim: axis } });
      intermediateTensorInfos.push(expandedT);
      return expandedT;
    });
    var result = concat({ inputs: expandedTensors, backend: backend, attrs: { axis: axis } });
    intermediateTensorInfos.forEach(function (t) {
      return backend.disposeData(t.dataId);
    });
    return result;
  }
  var packConfig = {
    kernelName: tfjsCore.Pack,
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
  var wasmPadV2;
  function setup$n(backend) {
    wasmPadV2 = backend.wasm.cwrap(tfjsCore.PadV2, null /* void */, [
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
    var x = args.inputs.x,
      backend = args.backend,
      _a = args.attrs,
      paddings = _a.paddings,
      constantValue = _a.constantValue;
    var outShape = paddings.map(
      function (p, i) {
        return p[0] /* beforePad */ + x.shape[i] + p[1];
      } /* afterPad */,
    );
    if (tfjsCore.util.sizeFromShape(x.shape) === 0) {
      // Short-circuit the computation, since x doesn't have value, only
      // the shape is used to compute output shape to pad.
      return fill({
        backend: backend,
        attrs: { shape: outShape, value: constantValue, dtype: x.dtype },
      });
    }
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(outShape, x.dtype);
    var outTensorData = backend.dataIdMap.get(out.dataId);
    var outId = outTensorData.id;
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    var prePaddingsFlat = paddings.map(function (padTuple) {
      return padTuple[0];
    });
    var postPaddingsFlat = paddings.map(function (padTuple) {
      return padTuple[1];
    });
    var prePaddingsBytes = new Uint8Array(new Int32Array(prePaddingsFlat).buffer);
    var postPaddingsBytes = new Uint8Array(new Int32Array(postPaddingsFlat).buffer);
    wasmPadV2(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], prePaddingsBytes, postPaddingsBytes, constantValue, outId);
    return out;
  }
  var padV2Config = {
    kernelName: tfjsCore.PadV2,
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
  var powConfig = createBinaryKernelConfig(tfjsCore.Pow);

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
  var wasmPrelu;
  function setup$m(backend) {
    wasmPrelu = backend.wasm.cwrap(tfjsCore.Prelu, null /* void */, [
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function prelu(args) {
    var inputs = args.inputs,
      backend = args.backend;
    var x = inputs.x,
      alpha = inputs.alpha;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var weightsId = backend.dataIdMap.get(alpha.dataId).id;
    var inputId = xId;
    var input = x;
    var castedInput = input;
    if (input.dtype !== 'float32') {
      castedInput = cast({ backend: backend, inputs: { x: x }, attrs: { dtype: 'float32' } });
      inputId = backend.dataIdMap.get(castedInput.dataId).id;
    }
    var out = backend.makeOutput(x.shape, 'float32');
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmPrelu(inputId, weightsId, outId);
    if (input.dtype !== 'float32') {
      backend.disposeData(castedInput.dataId);
    }
    return out;
  }
  var preluConfig = {
    kernelName: tfjsCore.Prelu,
    backendName: 'wasm',
    setupFunc: setup$m,
    kernelFunc: prelu,
  };

  var wasmProd;
  function setup$l(backend) {
    wasmProd = backend.wasm.cwrap(tfjsCore.Prod, null /*void*/, ['number', 'number', 'number', 'number']);
  }
  function prod(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.axis,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    var reductionAxes = axes;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      if (transposedId !== xId) {
        // transpose was not a no-op. We will need to dispose of this
        // once we are done.
        input = transposed;
        inputId = transposedId;
        reductionAxes = tfjsCore.backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
      }
    }
    tfjsCore.backend_util.assertAxesAreInnerMostDims('prod', reductionAxes, input.shape.length);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, reductionAxes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, input.dtype);
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmProd(inputId, reduceSize, CppDType[out.dtype], outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    return out;
  }
  var prodConfig = {
    kernelName: tfjsCore.Prod,
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
  var range = function (args) {
    var backend = args.backend,
      attrs = args.attrs;
    var start = attrs.start,
      stop = attrs.stop,
      step = attrs.step,
      dtype = attrs.dtype;
    var values = rangeImpl(start, stop, step, dtype);
    var out = backend.makeOutput([values.length], dtype);
    var outVals = backend.typedArrayFromHeap(out);
    outVals.set(values);
    return out;
  };
  var rangeConfig = {
    kernelName: tfjsCore.Range,
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
  var realDivConfig = createBinaryKernelConfig(tfjsCore.RealDiv);

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
  var reciprocalConfig = createUnaryKernelConfig(tfjsCore.Reciprocal);

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
  var reluConfig = createUnaryKernelConfig(tfjsCore.Relu);

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
  var relu6Config = createUnaryKernelConfig(tfjsCore.Relu6);

  var wasmResizeBilinear;
  function setup$k(backend) {
    wasmResizeBilinear = backend.wasm.cwrap(tfjsCore.ResizeBilinear, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var images = inputs.images;
    var alignCorners = attrs.alignCorners,
      halfPixelCenters = attrs.halfPixelCenters,
      size = attrs.size;
    var _a = __read(size, 2),
      newHeight = _a[0],
      newWidth = _a[1];
    var _b = __read(images.shape, 4),
      batch = _b[0],
      oldHeight = _b[1],
      oldWidth = _b[2],
      numChannels = _b[3];
    var outShape = [batch, newHeight, newWidth, numChannels];
    var xData = backend.dataIdMap.get(images.dataId);
    var castedData;
    if (xData.dtype !== 'float32') {
      castedData = cast({ backend: backend, inputs: { x: images }, attrs: { dtype: 'float32' } });
      xData = backend.dataIdMap.get(castedData.dataId);
    }
    var xId = xData.id;
    var out = backend.makeOutput(outShape, 'float32');
    if (tfjsCore.util.sizeFromShape(images.shape) === 0) {
      return out;
    }
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var resizeBilinearConfig = {
    kernelName: tfjsCore.ResizeBilinear,
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
  var wasmResizeBilinearGrad;
  function setup$j(backend) {
    wasmResizeBilinearGrad = backend.wasm.cwrap(tfjsCore.ResizeBilinearGrad, null /*void*/, [
      'number',
      'number',
      'number',
      'array',
      'array',
      'boolean', // alignCorners
    ]);
  }
  function resizeBilinearGrad(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var images = inputs.images,
      dy = inputs.dy;
    var alignCorners = attrs.alignCorners;
    var dx = backend.makeOutput(images.shape, 'float32');
    var xData = backend.dataIdMap.get(images.dataId);
    var castedData;
    if (xData.dtype !== 'float32') {
      castedData = cast({
        backend: backend,
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
  var resizeBilinearGradConfig = {
    kernelName: tfjsCore.ResizeBilinearGrad,
    backendName: 'wasm',
    setupFunc: setup$j,
    kernelFunc: resizeBilinearGrad,
  };

  var wasmResizeNearestNeighbor;
  function setup$i(backend) {
    wasmResizeNearestNeighbor = backend.wasm.cwrap(tfjsCore.ResizeNearestNeighbor, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var images = inputs.images;
    var alignCorners = attrs.alignCorners,
      halfPixelCenters = attrs.halfPixelCenters,
      size = attrs.size;
    var _a = __read(size, 2),
      newHeight = _a[0],
      newWidth = _a[1];
    var _b = __read(images.shape, 4),
      batch = _b[0],
      oldHeight = _b[1],
      oldWidth = _b[2],
      numChannels = _b[3];
    var outShape = [batch, newHeight, newWidth, numChannels];
    var out = backend.makeOutput(outShape, 'float32');
    if (tfjsCore.util.sizeFromShape(images.shape) === 0) {
      return out;
    }
    var xData = backend.dataIdMap.get(images.dataId);
    var castedData;
    if (xData.dtype !== 'float32') {
      castedData = cast({
        backend: backend,
        inputs: { x: images },
        attrs: { dtype: 'float32' },
      });
      xData = backend.dataIdMap.get(castedData.dataId);
    }
    var xId = xData.id;
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var resizeNearestNeighborConfig = {
    kernelName: tfjsCore.ResizeNearestNeighbor,
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
  var wasmResizeNearestNeighborGrad;
  function setup$h(backend) {
    wasmResizeNearestNeighborGrad = backend.wasm.cwrap(tfjsCore.ResizeNearestNeighborGrad, null /*void*/, [
      'number',
      'number',
      'number',
      'array',
      'array',
      'boolean', // alignCorners
    ]);
  }
  function resizeNearestNeighborGrad(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var images = inputs.images,
      dy = inputs.dy;
    var alignCorners = attrs.alignCorners;
    var dx = backend.makeOutput(images.shape, 'float32');
    var xData = backend.dataIdMap.get(images.dataId);
    var castedData;
    if (xData.dtype !== 'float32') {
      castedData = cast({
        backend: backend,
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
  var resizeNearestNeighborGradConfig = {
    kernelName: tfjsCore.ResizeNearestNeighborGrad,
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
  var wasmReverse;
  function setup$g(backend) {
    wasmReverse = backend.wasm.cwrap(tfjsCore.Reverse, null, [
      'number',
      'array',
      'number',
      'array',
      'number',
      'number', // out_id
    ]);
  }
  function reverse(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var dims = attrs.dims;
    var axes = tfjsCore.util.parseAxisParam(dims, x.shape);
    if (x.shape.length === 0) {
      return identity({ inputs: { x: x }, backend: backend });
    }
    var out = backend.makeOutput(x.shape, x.dtype);
    var xId = backend.dataIdMap.get(x.dataId).id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var axesBytes = new Uint8Array(new Int32Array(axes).buffer);
    var outShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    wasmReverse(xId, axesBytes, axes.length, outShapeBytes, x.shape.length, outId);
    var reshaped = reshape({ inputs: { x: out }, attrs: { shape: x.shape }, backend: backend });
    backend.disposeData(out.dataId);
    return reshaped;
  }
  var reverseConfig = {
    kernelName: tfjsCore.Reverse,
    backendName: 'wasm',
    kernelFunc: reverse,
    setupFunc: setup$g,
  };

  var wasmRotate;
  function setup$f(backend) {
    wasmRotate = backend.wasm.cwrap(tfjsCore.RotateWithOffset, null /* void */, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var image = inputs.image;
    var radians = attrs.radians,
      fillValue = attrs.fillValue,
      center = attrs.center;
    var out = backend.makeOutput(image.shape, image.dtype);
    var imageId = backend.dataIdMap.get(image.dataId).id;
    var outId = backend.dataIdMap.get(out.dataId).id;
    var _a = __read(image.shape, 4),
      batch = _a[0],
      imageHeight = _a[1],
      imageWidth = _a[2],
      numChannels = _a[3];
    var _b = __read(tfjsCore.backend_util.getImageCenter(center, imageHeight, imageWidth), 2),
      centerX = _b[0],
      centerY = _b[1];
    var fillIsBlack = fillValue === 0;
    var fullOpacityValue = 255;
    var fillValues =
      typeof fillValue === 'number'
        ? [fillValue, fillValue, fillValue, fillIsBlack ? 0 : fullOpacityValue]
        : __spreadArray(__spreadArray([], __read(fillValue), false), [fullOpacityValue], false);
    var fillBytes = new Uint8Array(new Int32Array(fillValues).buffer);
    wasmRotate(imageId, batch, imageHeight, imageWidth, numChannels, radians, centerX, centerY, fillBytes, fillValues.length, outId);
    return out;
  }
  var rotateWithOffsetConfig = {
    kernelName: tfjsCore.RotateWithOffset,
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
  var roundConfig = createUnaryKernelConfig(tfjsCore.Round);

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
  var rsqrtConfig = createUnaryKernelConfig(tfjsCore.Rsqrt);

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
  var wasmScatterNd;
  function setup$e(backend) {
    wasmScatterNd = backend.wasm.cwrap(tfjsCore.ScatterNd, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var indices = inputs.indices,
      updates = inputs.updates;
    var shape = attrs.shape;
    var out = backend.makeOutput(shape, updates.dtype);
    if (tfjsCore.util.sizeFromShape(shape) === 0) {
      return out;
    }
    var _a = tfjsCore.scatter_util.calculateShapes(updates, indices, shape),
      sliceRank = _a.sliceRank,
      numUpdates = _a.numUpdates,
      sliceSize = _a.sliceSize,
      strides = _a.strides,
      outputSize = _a.outputSize;
    var indicesData = backend.dataIdMap.get(indices.dataId);
    var indicesId = indicesData.id;
    var updatesData = backend.dataIdMap.get(updates.dataId);
    var updatesId = updatesData.id;
    var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmScatterNd(indicesId, updatesId, CppDType[updates.dtype], sliceRank, numUpdates, sliceSize, stridesBytes, outputSize, outId);
    return out;
  }
  var scatterNdConfig = {
    kernelName: tfjsCore.ScatterNd,
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
  var wasmSearchSorted;
  function setup$d(backend) {
    wasmSearchSorted = backend.wasm.cwrap(tfjsCore.SearchSorted, null /* void */, [
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var sortedSequence = inputs.sortedSequence,
      values = inputs.values;
    var side = attrs.side;
    if (sortedSequence.dtype !== values.dtype) {
      throw new Error(
        'SearchSorted error: sorted_sequence must have the same dtype as values. Got '
          .concat(sortedSequence.dtype, ' and ')
          .concat(values.dtype),
      );
    }
    var out = backend.makeOutput(values.shape, 'int32');
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
  var searchSortedConfig = {
    kernelName: tfjsCore.SearchSorted,
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
  var wasmSelect;
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
    var inputs = args.inputs,
      backend = args.backend;
    var condition = inputs.condition,
      t = inputs.t,
      e = inputs.e;
    var conditionId = backend.dataIdMap.get(condition.dataId).id;
    var tId = backend.dataIdMap.get(t.dataId).id;
    var eId = backend.dataIdMap.get(e.dataId).id;
    var out = backend.makeOutput(t.shape, t.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var cRank = condition.shape.length;
    var tRank = t.shape.length;
    var offset = cRank === 0 || cRank > 1 || tRank === 1 ? 1 : tfjsCore.util.sizeFromShape(t.shape.slice(1));
    wasmSelect(conditionId, tId, eId, offset, outId);
    return out;
  }
  var selectConfig = {
    kernelName: tfjsCore.Select,
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
  var seluConfig = createUnaryKernelConfig(tfjsCore.Selu);

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
  var wasmFunc;
  function setup$b(backend) {
    wasmFunc = backend.wasm.cwrap(tfjsCore.Sigmoid, null /* void */, ['number', 'number']);
  }
  function sigmoid(args) {
    var backend = args.backend,
      x = args.inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(x.shape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    // Short-circuit zero-sized tensors.
    if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
      return out;
    }
    wasmFunc(xId, outId);
    return out;
  }
  var sigmoidConfig = {
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
  var signConfig = createUnaryKernelConfig(tfjsCore.Sign);

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
  var sinConfig = createUnaryKernelConfig(tfjsCore.Sin);

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
  var sinhConfig = createUnaryKernelConfig(tfjsCore.Sinh);

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
  var softplusConfig = createUnaryKernelConfig(tfjsCore.Softplus);

  function spaceToBatchND(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var blockShape = attrs.blockShape,
      paddings = attrs.paddings;
    var prod = tfjsCore.util.sizeFromShape(blockShape);
    var completePaddings = [[0, 0]];
    completePaddings.push.apply(completePaddings, __spreadArray([], __read(paddings), false));
    for (var i = 1 + blockShape.length; i < x.shape.length; ++i) {
      completePaddings.push([0, 0]);
    }
    var paddedX = padV2Config.kernelFunc({
      inputs: { x: x },
      backend: backend,
      attrs: { paddings: completePaddings, constantValue: 0 },
    });
    var reshapedPaddedShape = tfjsCore.backend_util.getReshaped(paddedX.shape, blockShape, prod, false);
    var permutedReshapedPaddedPermutation = tfjsCore.backend_util.getPermuted(reshapedPaddedShape.length, blockShape.length, false);
    var flattenShape = tfjsCore.backend_util.getReshapedPermuted(paddedX.shape, blockShape, prod, false);
    var reshapeInputs = { x: paddedX };
    var reshapeAttrs = { shape: reshapedPaddedShape };
    var paddedXReshaped = reshape({ inputs: reshapeInputs, backend: backend, attrs: reshapeAttrs });
    var transposeInputs = { x: paddedXReshaped };
    var transposeAttrs = { perm: permutedReshapedPaddedPermutation };
    var paddedXT = transpose({ inputs: transposeInputs, backend: backend, attrs: transposeAttrs });
    var resultReshapeInputs = { x: paddedXT };
    var resultReshapeAttrs = { shape: flattenShape };
    var result = reshape({ inputs: resultReshapeInputs, backend: backend, attrs: resultReshapeAttrs });
    backend.disposeData(paddedX.dataId);
    backend.disposeData(paddedXReshaped.dataId);
    backend.disposeData(paddedXT.dataId);
    return result;
  }
  var spaceToBatchNDConfig = {
    kernelName: tfjsCore.SpaceToBatchND,
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
  var wasmSparseFillEmptyRows;
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
    var backend = args.backend,
      inputs = args.inputs;
    var indices = inputs.indices,
      values = inputs.values,
      denseShape = inputs.denseShape,
      defaultValue = inputs.defaultValue;
    var indicesCount = indices.shape[0];
    var rank = indices.shape[1];
    var denseRows = backend.readSync(denseShape.dataId)[0];
    // Set output size to maximum possible and resize later (actual result
    // might be smaller).
    var maxOutputIndicesShape = [indicesCount + denseRows, rank];
    var indicesId = backend.dataIdMap.get(indices.dataId).id;
    var valuesId = backend.dataIdMap.get(values.dataId).id;
    var defaultValueId = backend.dataIdMap.get(defaultValue.dataId).id;
    var outputIndices = backend.makeOutput(maxOutputIndicesShape, indices.dtype);
    var outputIndicesId = backend.dataIdMap.get(outputIndices.dataId).id;
    var outputValues = backend.makeOutput(maxOutputIndicesShape.slice(0, 1), values.dtype);
    var outputValuesId = backend.dataIdMap.get(outputValues.dataId).id;
    var emptyRowIndicator = backend.makeOutput([denseRows], 'bool');
    var emptyRowIndicatorId = backend.dataIdMap.get(emptyRowIndicator.dataId).id;
    var reverseIndexMap = backend.makeOutput([indicesCount], indices.dtype);
    var reverseIndexMapId = backend.dataIdMap.get(reverseIndexMap.dataId).id;
    var exceptionValues = backend.makeOutput([4], 'int32');
    var exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
    var outputRows = wasmSparseFillEmptyRows(
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
    var exceptionValuesArray = backend.readSync(exceptionValues.dataId);
    var exceptionMessage;
    switch (exceptionValuesArray[0]) {
      case 1: {
        exceptionMessage = tfjsCore.backend_util.getSparseFillEmptyRowsIndicesDenseShapeMismatch(exceptionValuesArray[1]);
        break;
      }
      case 2: {
        exceptionMessage = tfjsCore.backend_util.getSparseFillEmptyRowsNegativeIndexErrorMessage(
          exceptionValuesArray[1],
          exceptionValuesArray[2],
        );
        break;
      }
      case 3:
        exceptionMessage = tfjsCore.backend_util.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(
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
    var resizedIndices = outputIndices;
    var resizedValues = outputValues;
    // Overestimated output size.
    if (outputRows !== maxOutputIndicesShape[0]) {
      resizedIndices = slice({
        inputs: { x: outputIndices },
        attrs: { begin: 0, size: [outputRows, rank] },
        backend: backend,
      });
      resizedValues = slice({
        inputs: { x: outputValues },
        attrs: { begin: 0, size: outputRows },
        backend: backend,
      });
      backend.disposeData(outputIndices.dataId);
      backend.disposeData(outputValues.dataId);
    }
    return [resizedIndices, resizedValues, emptyRowIndicator, reverseIndexMap];
  }
  var sparseFillEmptyRowsConfig = {
    kernelName: tfjsCore.SparseFillEmptyRows,
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
  var wasmSparseReshape;
  function setup$9(backend) {
    wasmSparseReshape = backend.wasm.cwrap(tfjsCore.SparseReshape, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs;
    var inputIndices = inputs.inputIndices,
      inputShape = inputs.inputShape,
      newShape = inputs.newShape;
    if (inputIndices.shape.length !== 2) {
      throw new Error('Input indices should be a matrix but received shape\n        '.concat(inputIndices.shape));
    }
    if (inputShape.shape.length !== 1) {
      throw new Error('Input shape should be a vector but received shape\n        '.concat(inputShape.shape));
    }
    if (newShape.shape.length !== 1) {
      throw new Error('Target shape should be a vector but received shape '.concat(newShape.shape));
    }
    var inputIndicesId = backend.dataIdMap.get(inputIndices.dataId).id;
    var inputShapeId = backend.dataIdMap.get(inputShape.dataId).id;
    var newShapeId = backend.dataIdMap.get(newShape.dataId).id;
    var nnz = inputIndices.shape[0];
    var outputRank = tfjsCore.util.sizeFromShape(newShape.shape);
    var newIndices = backend.makeOutput([nnz, outputRank], inputIndices.dtype);
    var newIndicesId = backend.dataIdMap.get(newIndices.dataId).id;
    var outputShape = backend.makeOutput([outputRank], newShape.dtype);
    var outputShapeId = backend.dataIdMap.get(outputShape.dataId).id;
    var exceptionValues = backend.makeOutput([3], 'int32');
    var exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
    wasmSparseReshape(inputIndicesId, inputShapeId, newShapeId, nnz, newIndicesId, outputShapeId, exceptionValuesId);
    var exceptionValuesArray = backend.readSync(exceptionValues.dataId);
    var exceptionMessage;
    switch (exceptionValuesArray[0]) {
      case 0: {
        exceptionMessage = tfjsCore.backend_util.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(
          exceptionValuesArray[1],
          exceptionValuesArray[2],
        );
        break;
      }
      case 1: {
        exceptionMessage = tfjsCore.backend_util.getSparseReshapeNegativeOutputDimErrorMessage(
          exceptionValuesArray[1],
          exceptionValuesArray[2],
        );
        break;
      }
      case 2:
        exceptionMessage = tfjsCore.backend_util.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage();
        break;
      case 3: {
        var inputShapeValues = Array.from(backend.readSync(inputShape.dataId)),
          outputShapeValues = Array.from(backend.readSync(outputShape.dataId));
        exceptionMessage = tfjsCore.backend_util.getSparseReshapeInputOutputMultipleErrorMessage(inputShapeValues, outputShapeValues);
        break;
      }
      case 4: {
        var inputShapeValues = Array.from(backend.readSync(inputShape.dataId)),
          outputShapeValues = Array.from(backend.readSync(outputShape.dataId));
        exceptionMessage = tfjsCore.backend_util.getSparseReshapeInputOutputMismatchErrorMessage(inputShapeValues, outputShapeValues);
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
  var sparseReshapeConfig = {
    kernelName: tfjsCore.SparseReshape,
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
  var wasmSparseSegmentReduction;
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
    var backend = args.backend,
      inputs = args.inputs;
    var data = inputs.data,
      indices = inputs.indices,
      segmentIds = inputs.segmentIds;
    var numIndices = indices.shape[0];
    var segmentIdsBack = backend.readSync(segmentIds.dataId, numIndices - 1, numIndices)[0];
    var lastSegmentIdPlusOne = numIndices > 0 ? segmentIdsBack + 1 : 0;
    var outputRows = lastSegmentIdPlusOne;
    if (outputRows < 0) {
      throw new Error(tfjsCore.backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());
    }
    var outputShape = data.shape.slice();
    outputShape[0] = outputRows;
    var dataId = backend.dataIdMap.get(data.dataId).id;
    var indicesId = backend.dataIdMap.get(indices.dataId).id;
    var segmentIdsId = backend.dataIdMap.get(segmentIds.dataId).id;
    var output = backend.makeOutput(outputShape, data.dtype);
    var outputId = backend.dataIdMap.get(output.dataId).id;
    var exceptionValues = backend.makeOutput([4], 'int32');
    var exceptionValuesId = backend.dataIdMap.get(exceptionValues.dataId).id;
    wasmSparseSegmentReduction(
      dataId,
      CppDType[data.dtype],
      data.shape[0],
      indicesId,
      segmentIdsId,
      outputId,
      exceptionValuesId,
      isMean,
      0,
    );
    var exceptionValuesArray = backend.readSync(exceptionValues.dataId);
    var exceptionMessage;
    switch (exceptionValuesArray[0]) {
      case 0: {
        exceptionMessage = tfjsCore.backend_util.getSparseSegmentReductionNegativeSegmentIdsErrorMessage();
        break;
      }
      case 1: {
        exceptionMessage = tfjsCore.backend_util.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage();
        break;
      }
      case 2:
        exceptionMessage = tfjsCore.backend_util.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(
          exceptionValuesArray[1],
          exceptionValuesArray[2],
        );
        break;
      case 3:
        exceptionMessage = tfjsCore.backend_util.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(
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
  var sparseSegmentMeanConfig = {
    kernelName: tfjsCore.SparseSegmentMean,
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
  var sparseSegmentSumConfig = {
    kernelName: tfjsCore.SparseSegmentSum,
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
  var wasmSparseToDense;
  function setup$7(backend) {
    wasmSparseToDense = backend.wasm.cwrap(tfjsCore.SparseToDense, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var sparseIndices = inputs.sparseIndices,
      sparseValues = inputs.sparseValues,
      defaultValue = inputs.defaultValue;
    var outputShape = attrs.outputShape;
    var out = backend.makeOutput(outputShape, defaultValue.dtype);
    if (tfjsCore.util.sizeFromShape(outputShape) === 0) {
      return out;
    }
    var _a = tfjsCore.backend_util.calculateShapes(sparseValues, sparseIndices, outputShape),
      sliceRank = _a.sliceRank,
      numUpdates = _a.numUpdates,
      sliceSize = _a.sliceSize,
      strides = _a.strides,
      outputSize = _a.outputSize;
    var sparseIndicesId = backend.dataIdMap.get(sparseIndices.dataId).id;
    var sparseValuesId = backend.dataIdMap.get(sparseValues.dataId).id;
    var defaultValueId = backend.dataIdMap.get(defaultValue.dataId).id;
    var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var sparseToDenseConfig = {
    kernelName: tfjsCore.SparseToDense,
    backendName: 'wasm',
    setupFunc: setup$7,
    kernelFunc: sparseToDense,
  };

  function splitV(args) {
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var x = inputs.x;
    var numOrSizeSplits = attrs.numOrSizeSplits,
      axis = attrs.axis;
    var $axis = tfjsCore.util.parseAxisParam(axis, x.shape)[0];
    var splitSizes = tfjsCore.backend_util.prepareSplitSize(x, numOrSizeSplits, $axis);
    var begin = new Array(x.shape.length).fill(0);
    var size = x.shape.slice();
    return splitSizes.map(function (s) {
      var xSliceSize = __spreadArray([], __read(size), false);
      xSliceSize[$axis] = s;
      var xSlice = slice({ inputs: { x: x }, attrs: { begin: begin, size: xSliceSize }, backend: backend });
      begin[$axis] += s;
      return xSlice;
    });
  }
  var splitVConfig = {
    kernelName: tfjsCore.SplitV,
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
  var sqrtConfig = createUnaryKernelConfig(tfjsCore.Sqrt);

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
  var squareConfig = createUnaryKernelConfig(tfjsCore.Square);

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
  var squaredDifferenceConfig = createBinaryKernelConfig(tfjsCore.SquaredDifference);

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
  var wasmStep;
  function setup$6(backend) {
    wasmStep = backend.wasm.cwrap(tfjsCore.Step, null /*void*/, [
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function step(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var alpha = attrs.alpha;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var out = backend.makeOutput(x.shape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmStep(xId, alpha, CppDType[x.dtype], outId);
    return out;
  }
  var stepConfig = {
    kernelName: tfjsCore.Step,
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
  var wasmStridedSlice;
  function setup$5(backend) {
    wasmStridedSlice = backend.wasm.cwrap(tfjsCore.StridedSlice, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var x = inputs.x;
    var begin = attrs.begin,
      end = attrs.end,
      strides = attrs.strides,
      beginMask = attrs.beginMask,
      endMask = attrs.endMask,
      ellipsisMask = attrs.ellipsisMask,
      newAxisMask = attrs.newAxisMask,
      shrinkAxisMask = attrs.shrinkAxisMask;
    var _a = tfjsCore.slice_util.sliceInfo(x.shape, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask),
      finalShapeSparse = _a.finalShapeSparse,
      finalShape = _a.finalShape,
      isIdentity = _a.isIdentity,
      sliceDim0 = _a.sliceDim0,
      isSimpleSlice = _a.isSimpleSlice,
      $begin = _a.begin,
      $end = _a.end,
      $strides = _a.strides;
    var result;
    if (isIdentity) {
      // Optimization #1, slice is a no-op plus reshape
      result = reshape({ inputs: { x: x }, backend: backend, attrs: { shape: finalShape } });
    } else if (sliceDim0 || isSimpleSlice) {
      // Optimization #2, slice is memory contiguous (only occurs in dim 0)
      tfjsCore.util.assert(x.shape.length >= 1, function () {
        return 'Input must have rank at least 1, got: '.concat(x.shape.length);
      });
      var size = tfjsCore.slice_util.computeOutShape($begin, $end, $strides);
      // To tolerate begin[0] > end[0] (a 0-output slice), we min(begin, end).
      var sliced = slice({ inputs: { x: x }, backend: backend, attrs: { begin: $begin, size: size } });
      result = reshape({ inputs: { x: sliced }, backend: backend, attrs: { shape: finalShape } });
      backend.disposeData(sliced.dataId);
    } else {
      var out = backend.makeOutput(finalShapeSparse, 'float32');
      var xId = backend.dataIdMap.get(x.dataId).id;
      var xStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(x.shape)).buffer);
      var beginBytes = new Uint8Array(new Int32Array($begin).buffer);
      var endBytes = new Uint8Array(new Int32Array($end).buffer);
      var stridesBytes = new Uint8Array(new Int32Array($strides).buffer);
      var outputShapeBytes = new Uint8Array(new Int32Array(finalShapeSparse).buffer);
      var outStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(finalShapeSparse)).buffer);
      var outId = backend.dataIdMap.get(out.dataId).id;
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
      result = reshape({ inputs: { x: out }, backend: backend, attrs: { shape: finalShape } });
      backend.disposeData(out.dataId);
    }
    return result;
  }
  var stridedSliceConfig = {
    kernelName: tfjsCore.StridedSlice,
    backendName: 'wasm',
    setupFunc: setup$5,
    kernelFunc: stridedSlice,
  };

  function stringNGrams(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var data = inputs.data,
      dataSplits = inputs.dataSplits;
    var separator = attrs.separator,
      nGramWidths = attrs.nGramWidths,
      leftPad = attrs.leftPad,
      rightPad = attrs.rightPad,
      padWidth = attrs.padWidth,
      preserveShortSequences = attrs.preserveShortSequences;
    var $data = backend.readSync(data.dataId);
    var $dataSplits = backend.readSync(dataSplits.dataId);
    var _a = __read(stringNGramsImpl($data, $dataSplits, separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences), 2),
      nGrams = _a[0],
      nGramsSplits = _a[1];
    var nGramsOut = backend.makeOutput([nGrams.length], 'string');
    var nGramsOutData = backend.dataIdMap.get(nGramsOut.dataId);
    nGramsOutData.stringBytes = nGrams;
    var nGramsSplitsOut = backend.makeOutput(dataSplits.shape, 'int32');
    var nGramsSplitsOutVals = backend.typedArrayFromHeap(nGramsSplitsOut);
    nGramsSplitsOutVals.set(nGramsSplits);
    return [nGramsOut, nGramsSplitsOut];
  }
  var stringNGramsConfig = {
    kernelName: tfjsCore.StringNGrams,
    backendName: 'wasm',
    kernelFunc: stringNGrams,
  };

  function stringSplit(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var input = inputs.input,
      delimiter = inputs.delimiter;
    var skipEmpty = attrs.skipEmpty;
    var inputVals = backend.readSync(input.dataId);
    var delimiterVals = backend.readSync(delimiter.dataId);
    var _a = __read(stringSplitImpl(inputVals, delimiterVals[0], skipEmpty), 3),
      indices = _a[0],
      values = _a[1],
      shape = _a[2];
    var outputSize = values.length;
    var indicesOut = backend.makeOutput([outputSize, 2], 'int32');
    var indicesOutVals = backend.typedArrayFromHeap(indicesOut);
    indicesOutVals.set(indices);
    var valuesOut = backend.makeOutput([outputSize], 'string');
    var valuesOutData = backend.dataIdMap.get(valuesOut.dataId);
    valuesOutData.stringBytes = values;
    var shapeOut = backend.makeOutput([2], 'int32');
    var shapeOutVals = backend.typedArrayFromHeap(shapeOut);
    shapeOutVals.set(shape);
    return [indicesOut, valuesOut, shapeOut];
  }
  var stringSplitConfig = {
    kernelName: tfjsCore.StringSplit,
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var input = inputs.input;
    var numBuckets = attrs.numBuckets;
    var inputVals = backend.readSync(input.dataId);
    var values = stringToHashBucketFastImpl(inputVals, numBuckets);
    var out = backend.makeOutput(input.shape, 'int32');
    var outVals = backend.typedArrayFromHeap(out);
    outVals.set(values);
    return out;
  }
  var stringToHashBucketFastConfig = {
    kernelName: tfjsCore.StringToHashBucketFast,
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
  var subConfig = createBinaryKernelConfig(tfjsCore.Sub);

  var wasmSum;
  function setup$4(backend) {
    wasmSum = backend.wasm.cwrap(tfjsCore.Sum, null /*void*/, [
      'number',
      'number',
      'number',
      'number', // out_id
    ]);
  }
  function sum(args) {
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var axis = attrs.axis,
      keepDims = attrs.keepDims;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var inputId = xId;
    var input = x;
    var _a = permuteAxesAndTranspose(x, axis, backend),
      transposed = _a.transposed,
      axes = _a.axes,
      originalAxes = _a.originalAxes,
      inputWasTransposed = _a.inputWasTransposed;
    var reductionAxes = axes;
    if (inputWasTransposed) {
      var transposedId = backend.dataIdMap.get(transposed.dataId).id;
      if (transposedId !== xId) {
        // transpose was not a no-op. We will need to dispose of this
        // once we are done.
        input = transposed;
        inputId = transposedId;
        reductionAxes = tfjsCore.backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
      }
    }
    tfjsCore.backend_util.assertAxesAreInnerMostDims('sum', reductionAxes, input.shape.length);
    var _b = __read(tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, reductionAxes), 2),
      outShape = _b[0],
      reduceShape = _b[1];
    var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
    var out = backend.makeOutput(outShape, input.dtype);
    if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmSum(inputId, reduceSize, CppDType[out.dtype], outId);
    }
    if (inputWasTransposed) {
      // dispose of the transposed tensor.
      backend.disposeData(transposed.dataId);
    }
    if (keepDims) {
      // reshape
      var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
      out.shape = newShape;
    }
    return out;
  }
  var sumConfig = {
    kernelName: tfjsCore.Sum,
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
  var tanConfig = createUnaryKernelConfig(tfjsCore.Tan);

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
  var tanhConfig = createUnaryKernelConfig(tfjsCore.Tanh);

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
  var wasmTensorScatterUpdate;
  function setup$3(backend) {
    wasmTensorScatterUpdate = backend.wasm.cwrap(tfjsCore.TensorScatterUpdate, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs;
    args.attrs;
    var tensor = inputs.tensor,
      indices = inputs.indices,
      updates = inputs.updates;
    var out = backend.makeOutput(tensor.shape, tensor.dtype);
    if (tfjsCore.util.sizeFromShape(tensor.shape) === 0) {
      return out;
    }
    var _b = tfjsCore.scatter_util.calculateShapes(updates, indices, tensor.shape),
      sliceRank = _b.sliceRank,
      numUpdates = _b.numUpdates,
      sliceSize = _b.sliceSize,
      strides = _b.strides,
      outputSize = _b.outputSize;
    var indicesData = backend.dataIdMap.get(indices.dataId);
    var indicesId = indicesData.id;
    var updatesData = backend.dataIdMap.get(updates.dataId);
    var updatesId = updatesData.id;
    var tensorData = backend.dataIdMap.get(tensor.dataId);
    var tensorId = tensorData.id;
    var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
    var outId = backend.dataIdMap.get(out.dataId).id;
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
  var tensorScatterUpdateConfig = {
    kernelName: tfjsCore.TensorScatterUpdate,
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
  var wasmTile;
  function setup$2(backend) {
    wasmTile = backend.wasm.cwrap(tfjsCore.Tile, null /* void */, [
      'number',
      'array',
      'number',
      'array',
      'number',
      'number', // out_id
    ]);
  }
  function tile(args) {
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var x = inputs.x;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var reps = attrs.reps;
    var newShape = new Array(x.shape.length);
    for (var i = 0; i < newShape.length; i++) {
      newShape[i] = x.shape[i] * reps[i];
    }
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    var newShapeBytes = new Uint8Array(new Int32Array(newShape).buffer);
    var out = backend.makeOutput(newShape, x.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    wasmTile(xId, xShapeBytes, x.shape.length, newShapeBytes, newShape.length, CppDType[out.dtype], outId);
    return out;
  }
  var tileConfig = {
    kernelName: tfjsCore.Tile,
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
  var wasmTopK;
  function setup$1(backend) {
    wasmTopK = backend.wasm.cwrap(tfjsCore.TopK, null /* void */, [
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
  var topk = function (_a) {
    var inputs = _a.inputs,
      backend = _a.backend,
      attrs = _a.attrs;
    var x = inputs.x;
    var k = attrs.k,
      sorted = attrs.sorted;
    var xId = backend.dataIdMap.get(x.dataId).id;
    var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
    var outputShape = x.shape.slice();
    outputShape[outputShape.length - 1] = k;
    var outValues = backend.makeOutput(outputShape, x.dtype);
    var outValuesId = backend.dataIdMap.get(outValues.dataId).id;
    var outIndices = backend.makeOutput(outputShape, 'int32');
    var outIndicesId = backend.dataIdMap.get(outIndices.dataId).id;
    wasmTopK(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], k, sorted, outValuesId, outIndicesId);
    return [outValues, outIndices];
  };
  var topKConfig = {
    kernelName: tfjsCore.TopK,
    backendName: 'wasm',
    setupFunc: setup$1,
    kernelFunc: topk,
  };

  var wasmTransform;
  function setup(backend) {
    wasmTransform = backend.wasm.cwrap(tfjsCore.Transform, null /*void*/, [
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
    var backend = args.backend,
      inputs = args.inputs,
      attrs = args.attrs;
    var image = inputs.image,
      transforms = inputs.transforms;
    var interpolation = attrs.interpolation,
      fillMode = attrs.fillMode,
      fillValue = attrs.fillValue,
      outputShape = attrs.outputShape;
    var _a = __read(image.shape, 4),
      batch = _a[0],
      imageHeight = _a[1],
      imageWidth = _a[2],
      numChannels = _a[3];
    var _b = __read(outputShape != null ? outputShape : [imageHeight, imageWidth], 2),
      outHeight = _b[0],
      outWidth = _b[1];
    var outShape = [batch, outHeight, outWidth, numChannels];
    var inputStrides = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(image.shape)).buffer);
    var outputStrides = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(outShape)).buffer);
    var out = backend.makeOutput(outShape, image.dtype);
    var outId = backend.dataIdMap.get(out.dataId).id;
    var imageData = backend.dataIdMap.get(image.dataId);
    var imageId = imageData.id;
    var transformsData = backend.dataIdMap.get(transforms.dataId);
    var transformsId = transformsData.id;
    var interpolationModeId = interpolation === 'nearest' ? 1 : 2;
    var fillModeId;
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
  var transformConfig = {
    kernelName: tfjsCore.Transform,
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
    var inputs = args.inputs,
      attrs = args.attrs,
      backend = args.backend;
    var axis = attrs.axis;
    var x = inputs.x;
    var _a = uniqueImpl(backend.readSync(x.dataId), axis, x.shape, x.dtype),
      outputValues = _a.outputValues,
      outputShape = _a.outputShape,
      indices = _a.indices;
    return [
      backend.makeOutput(outputShape, x.dtype, /*memoryOffset=*/ undefined, outputValues),
      backend.makeOutput([indices.length], 'int32', /*memoryOffset=*/ undefined, indices),
    ];
  }
  var uniqueConfig = {
    kernelName: tfjsCore.Unique,
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
    var inputs = args.inputs,
      backend = args.backend,
      attrs = args.attrs;
    var value = inputs.value;
    var axis = attrs.axis;
    if (axis < 0) {
      axis += value.shape.length;
    }
    var numOutputs = value.shape[axis];
    var rank = value.shape.length;
    var outShape = new Array(rank - 1);
    var outIndex = 0;
    for (var i = 0; i < rank; i++) {
      if (i !== axis) {
        outShape[outIndex++] = value.shape[i];
      }
    }
    var outs = new Array(numOutputs);
    var begin = new Array(rank).fill(0);
    var size = value.shape.slice();
    size[axis] = 1;
    for (var i = 0; i < outs.length; i++) {
      begin[axis] = i;
      outs[i] = slice({ inputs: { x: value }, attrs: { begin: begin, size: size }, backend: backend });
    }
    return outs.map(function (_a) {
      var dataId = _a.dataId,
        dtype = _a.dtype;
      return { dataId: dataId, dtype: dtype, shape: outShape };
    });
  }
  var unpackConfig = {
    kernelName: tfjsCore.Unpack,
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
    var x = args.inputs.x,
      backend = args.backend;
    var out = backend.makeOutput(x.shape, x.dtype);
    var outVals = backend.typedArrayFromHeap(out);
    outVals.fill(0);
    return out;
  }
  var zerosLikeConfig = {
    kernelName: tfjsCore.ZerosLike,
    backendName: 'wasm',
    kernelFunc: zerosLike,
  };

  var e_1, _a;
  // List all kernel configs here
  var kernelConfigs = [
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
  try {
    for (
      var kernelConfigs_1 = __values(kernelConfigs), kernelConfigs_1_1 = kernelConfigs_1.next();
      !kernelConfigs_1_1.done;
      kernelConfigs_1_1 = kernelConfigs_1.next()
    ) {
      var kernelConfig = kernelConfigs_1_1.value;
      tfjsCore.registerKernel(kernelConfig);
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (kernelConfigs_1_1 && !kernelConfigs_1_1.done && (_a = kernelConfigs_1.return)) _a.call(kernelConfigs_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  var ENV = tfjsCore.env();
  /**
   * True if SIMD is supported.
   */
  // From: https://github.com/GoogleChromeLabs/wasm-feature-detect
  ENV.registerFlag('WASM_HAS_SIMD_SUPPORT', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        try {
          // This typed array passed in to WebAssembly.validate is WebAssembly binary
          // code. In this case it is a small program that contains SIMD
          // instructions.
          return [
            2 /*return*/,
            WebAssembly.validate(
              new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11]),
            ),
          ];
        } catch (e) {
          return [2 /*return*/, false];
        }
        return [2 /*return*/];
      });
    });
  });
  /**
   * True if threads are supported.
   */
  // From: https://github.com/GoogleChromeLabs/wasm-feature-detect
  ENV.registerFlag('WASM_HAS_MULTITHREAD_SUPPORT', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        // TODO(annxingyuan): Enable node support once this is resolved:
        // https://github.com/tensorflow/tfjs/issues/3830
        if (ENV.get('IS_NODE')) {
          return [2 /*return*/, false];
        }
        try {
          // Test for transferability of SABs (needed for Firefox)
          // https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ
          new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
          // This typed array is a WebAssembly program containing threaded
          // instructions.
          return [
            2 /*return*/,
            WebAssembly.validate(
              new Uint8Array([
                0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11,
              ]),
            ),
          ];
        } catch (e) {
          return [2 /*return*/, false];
        }
        return [2 /*return*/];
      });
    });
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
    var WasmBackendModuleThreadedSimd = (function () {
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
        var quit_ = function (status, toThrow) {
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
          var toLog = e;
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
          read_ = function (filename, binary) {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? undefined : 'utf8');
          };
          readBinary = function (filename) {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            return ret;
          };
          readAsync = function (filename, onload, onerror) {
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
          quit_ = function (status, toThrow) {
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
          var nodeWorkerThreads = void 0;
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
            read_ = function (url) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = function (url) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = function (url, onload, onerror) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, true);
              xhr.responseType = 'arraybuffer';
              xhr.onload = function () {
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
          defaultPrint = function (str) {
            return fs.writeSync(1, str + '\n');
          };
          defaultPrintErr = function (str) {
            return fs.writeSync(2, str + '\n');
          };
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
          worker.runPthread = function () {
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
            var e_1, _a, e_2, _b;
            try {
              for (var _c = __values(Object.values(PThread.pthreads)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var worker = _d.value;
                PThread.returnWorkerToPool(worker);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
            try {
              for (var _e = __values(PThread.unusedWorkers), _f = _e.next(); !_f.done; _f = _e.next()) {
                var worker = _f.value;
                worker.terminate();
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
              } finally {
                if (e_2) throw e_2.error;
              }
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
            PThread.tlsInitFunctions.forEach(function (f) {
              return f();
            });
          },
          loadWasmModuleToWorker: function (worker, onFinishedLoading) {
            var e_3, _a;
            worker.onmessage = function (e) {
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
                Module[d['handler']].apply(Module, __spreadArray([], __read(d['args']), false));
              } else if (cmd) {
                err('worker sent an unknown command ' + cmd);
              }
              PThread.currentProxiedOperationCallerThread = undefined;
            };
            worker.onerror = function (e) {
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
            try {
              for (
                var knownHandlers_1 = __values(knownHandlers), knownHandlers_1_1 = knownHandlers_1.next();
                !knownHandlers_1_1.done;
                knownHandlers_1_1 = knownHandlers_1.next()
              ) {
                var handler = knownHandlers_1_1.value;
                if (Module.hasOwnProperty(handler)) {
                  handlers.push(handler);
                }
              }
            } catch (e_3_1) {
              e_3 = { error: e_3_1 };
            } finally {
              try {
                if (knownHandlers_1_1 && !knownHandlers_1_1.done && (_a = knownHandlers_1.return)) _a.call(knownHandlers_1);
              } finally {
                if (e_3) throw e_3.error;
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
            setTimeout(function () {
              return executeNotifiedProxyingQueue(queue);
            });
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
          _emscripten_get_now = function () {
            var t = process['hrtime']();
            return t[0] * 1e3 + t[1] / 1e6;
          };
        } else
          _emscripten_get_now = function () {
            return performance.timeOrigin + performance.now();
          };
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
          return withStackSave(function () {
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
          var alignUp = function (x, multiple) {
            return x + ((multiple - (x % multiple)) % multiple);
          };
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
            string: function (str) {
              var ret = 0;
              if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len);
              }
              return ret;
            },
            array: function (arr) {
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
          var numericArgs = argTypes.every(function (type) {
            return type === 'number' || type === 'boolean';
          });
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
          return (_emscripten_stack_set_limits = Module['_emscripten_stack_set_limits'] =
            Module['asm']['emscripten_stack_set_limits']).apply(null, arguments);
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

  var wasmWorkerContents =
    '"use strict";var Module={};var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads");var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",data=>onmessage({data:data}));var fs=require("fs");Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(f){(0,eval)(fs.readFileSync(f,"utf8")+"//# sourceURL="+f)},postMessage:function(msg){parentPort.postMessage(msg)},performance:global.performance||{now:function(){return Date.now()}}})}var initializedJS=false;var pendingNotifiedProxyingQueues=[];function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,text+"\n");return}console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=(info,receiveInstance)=>{var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports};self.onunhandledrejection=e=>{throw e.reason??e};self.startWorker=instance=>{Module=instance;postMessage({"cmd":"loaded"})};self.onmessage=e=>{try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;for(const handler of e.data.handlers){Module[handler]=function(){postMessage({cmd:"callHandler",handler:handler,args:[...arguments]})}}Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob=="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module)}else if(e.data.cmd==="run"){Module["__emscripten_thread_init"](e.data.pthread_ptr,0,0,1);Module["establishStackSpace"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInitTLS();if(!initializedJS){pendingNotifiedProxyingQueues.forEach(queue=>{Module["executeNotifiedProxyingQueue"](queue)});pendingNotifiedProxyingQueues=[];initializedJS=true}try{Module["invokeEntryPoint"](e.data.start_routine,e.data.arg)}catch(ex){if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else{Module["__emscripten_thread_exit"](ex.status)}}else{throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["__emscripten_thread_exit"](-1)}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processProxyingQueue"){if(initializedJS){Module["executeNotifiedProxyingQueue"](e.data.queue)}else{pendingNotifiedProxyingQueues.push(e.data.queue)}}else if(e.data.cmd){err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){if(Module["__emscripten_thread_crashed"]){Module["__emscripten_thread_crashed"]()}throw ex}};';

  var tfjsBackendWasm$1 = { exports: {} };

  (function (module, exports) {
    var WasmBackendModule = (function () {
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
          read_ = function (filename, binary) {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? undefined : 'utf8');
          };
          readBinary = function (filename) {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            return ret;
          };
          readAsync = function (filename, onload, onerror) {
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
            read_ = function (url) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = function (url) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = function (url, onload, onerror) {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, true);
              xhr.responseType = 'arraybuffer';
              xhr.onload = function () {
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
          var alignUp = function (x, multiple) {
            return x + ((multiple - (x % multiple)) % multiple);
          };
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
            string: function (str) {
              var ret = 0;
              if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = stackAlloc(len);
                stringToUTF8(str, ret, len);
              }
              return ret;
            },
            array: function (arr) {
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
          var numericArgs = argTypes.every(function (type) {
            return type === 'number' || type === 'boolean';
          });
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

  // This workaround is required for importing in Node.js without using
  // the node bundle (for testing). This would not be necessary if we
  // flipped esModuleInterop to true, but we likely can't do that since
  // google3 does not use it.
  var wasmFactoryThreadedSimd = tfjsBackendWasmThreadedSimd || wasmFactoryThreadedSimd_import;
  var wasmFactory = tfjsBackendWasm || wasmFactory_import;
  var BackendWasm = /** @class */ (function (_super) {
    __extends(BackendWasm, _super);
    function BackendWasm(wasm) {
      var _this = _super.call(this) || this;
      _this.wasm = wasm;
      // 0 is reserved for null data ids.
      _this.dataIdNextNumber = 1;
      _this.wasm.tfjs.initWithThreadsCount(threadsCount);
      actualThreadsCount = _this.wasm.tfjs.getThreadsCount();
      _this.dataIdMap = new tfjsCore.DataStorage(_this, tfjsCore.engine());
      return _this;
    }
    BackendWasm.prototype.write = function (values, shape, dtype) {
      var dataId = { id: this.dataIdNextNumber++ };
      this.move(dataId, values, shape, dtype, 1);
      return dataId;
    };
    BackendWasm.prototype.numDataIds = function () {
      return this.dataIdMap.numDataIds();
    };
    BackendWasm.prototype.time = function (f) {
      return __awaiter(this, void 0, void 0, function () {
        var start, kernelMs;
        return __generator(this, function (_a) {
          start = tfjsCore.util.now();
          f();
          kernelMs = tfjsCore.util.now() - start;
          return [2 /*return*/, { kernelMs: kernelMs }];
        });
      });
    };
    BackendWasm.prototype.move = function (dataId, values, shape, dtype, refCount) {
      var id = this.dataIdNextNumber++;
      if (dtype === 'string') {
        var stringBytes = values;
        this.dataIdMap.set(dataId, {
          id: id,
          stringBytes: stringBytes,
          shape: shape,
          dtype: dtype,
          memoryOffset: null,
          refCount: refCount,
        });
        return;
      }
      var size = tfjsCore.util.sizeFromShape(shape);
      var numBytes = size * tfjsCore.util.bytesPerElement(dtype);
      // `>>> 0` is needed for above 2GB allocations because wasm._malloc returns
      // a signed int32 instead of an unsigned int32.
      // https://v8.dev/blog/4gb-wasm-memory
      var memoryOffset = this.wasm._malloc(numBytes) >>> 0;
      this.dataIdMap.set(dataId, { id: id, memoryOffset: memoryOffset, shape: shape, dtype: dtype, refCount: refCount });
      this.wasm.tfjs.registerTensor(id, size, memoryOffset);
      if (values != null) {
        this.wasm.HEAPU8.set(new Uint8Array(values.buffer, values.byteOffset, numBytes), memoryOffset);
      }
    };
    BackendWasm.prototype.read = function (dataId) {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [2 /*return*/, this.readSync(dataId)];
        });
      });
    };
    BackendWasm.prototype.readSync = function (dataId, start, end) {
      var _a = this.dataIdMap.get(dataId),
        memoryOffset = _a.memoryOffset,
        dtype = _a.dtype,
        shape = _a.shape,
        stringBytes = _a.stringBytes;
      if (dtype === 'string') {
        // Slice all elements.
        if ((start == null || start === 0) && (end == null || end >= stringBytes.length)) {
          return stringBytes;
        }
        return stringBytes.slice(start, end);
      }
      start = start || 0;
      end = end || tfjsCore.util.sizeFromShape(shape);
      var bytesPerElement = tfjsCore.util.bytesPerElement(dtype);
      var bytes = this.wasm.HEAPU8.slice(memoryOffset + start * bytesPerElement, memoryOffset + end * bytesPerElement);
      return typedArrayFromBuffer(bytes.buffer, dtype);
    };
    /**
     * Dispose the memory if the dataId has 0 refCount. Return true if the memory
     * is released, false otherwise.
     * @param dataId
     * @oaram force Optional, remove the data regardless of refCount
     */
    BackendWasm.prototype.disposeData = function (dataId, force) {
      if (force === void 0) {
        force = false;
      }
      if (this.dataIdMap.has(dataId)) {
        var data = this.dataIdMap.get(dataId);
        data.refCount--;
        if (!force && data.refCount > 0) {
          return false;
        }
        this.wasm._free(data.memoryOffset);
        this.wasm.tfjs.disposeData(data.id);
        this.dataIdMap.delete(dataId);
      }
      return true;
    };
    /** Return refCount of a `TensorData`. */
    BackendWasm.prototype.refCount = function (dataId) {
      if (this.dataIdMap.has(dataId)) {
        var tensorData = this.dataIdMap.get(dataId);
        return tensorData.refCount;
      }
      return 0;
    };
    BackendWasm.prototype.incRef = function (dataId) {
      var data = this.dataIdMap.get(dataId);
      if (data != null) {
        data.refCount++;
      }
    };
    BackendWasm.prototype.floatPrecision = function () {
      return 32;
    };
    // Returns the memory offset of a tensor. Useful for debugging and unit
    // testing.
    BackendWasm.prototype.getMemoryOffset = function (dataId) {
      return this.dataIdMap.get(dataId).memoryOffset;
    };
    BackendWasm.prototype.dispose = function () {
      this.wasm.tfjs.dispose();
      if ('PThread' in this.wasm) {
        this.wasm.PThread.terminateAllThreads();
      }
      this.wasm = null;
    };
    BackendWasm.prototype.memory = function () {
      return { unreliable: false };
    };
    /**
     * Make a tensor info for the output of an op. If `memoryOffset` is not
     * present, this method allocates memory on the WASM heap. If `memoryOffset`
     * is present, the memory was allocated elsewhere (in c++) and we just record
     * the pointer where that memory lives.
     */
    BackendWasm.prototype.makeOutput = function (shape, dtype, memoryOffset, values) {
      var dataId;
      if (memoryOffset == null) {
        dataId = this.write(values !== null && values !== void 0 ? values : null, shape, dtype);
      } else {
        var id = this.dataIdNextNumber++;
        dataId = { id: id };
        this.dataIdMap.set(dataId, { id: id, memoryOffset: memoryOffset, shape: shape, dtype: dtype, refCount: 1 });
        var size = tfjsCore.util.sizeFromShape(shape);
        this.wasm.tfjs.registerTensor(id, size, memoryOffset);
      }
      return { dataId: dataId, shape: shape, dtype: dtype };
    };
    BackendWasm.prototype.typedArrayFromHeap = function (_a) {
      var shape = _a.shape,
        dtype = _a.dtype,
        dataId = _a.dataId;
      var buffer = this.wasm.HEAPU8.buffer;
      var memoryOffset = this.dataIdMap.get(dataId).memoryOffset;
      var size = tfjsCore.util.sizeFromShape(shape);
      switch (dtype) {
        case 'float32':
          return new Float32Array(buffer, memoryOffset, size);
        case 'int32':
          return new Int32Array(buffer, memoryOffset, size);
        case 'bool':
          return new Uint8Array(buffer, memoryOffset, size);
        default:
          throw new Error('Unknown dtype '.concat(dtype));
      }
    };
    return BackendWasm;
  })(tfjsCore.KernelBackend);
  function createInstantiateWasmFunc(path) {
    // this will be replace by rollup plugin patchWechatWebAssembly in
    // minprogram's output.
    // tslint:disable-next-line:no-any
    return function (imports, callback) {
      tfjsCore.util.fetch(path, { credentials: 'same-origin' }).then(function (response) {
        if (!response['ok']) {
          imports.env.a("failed to load wasm binary file at '".concat(path, "'"));
        }
        response.arrayBuffer().then(function (binary) {
          WebAssembly.instantiate(binary, imports).then(function (output) {
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
    var path = 'tfjs-backend-wasm.wasm';
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
  function init() {
    return __awaiter(this, void 0, void 0, function () {
      var _a, simdSupported, threadsSupported;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              Promise.all([tfjsCore.env().getAsync('WASM_HAS_SIMD_SUPPORT'), tfjsCore.env().getAsync('WASM_HAS_MULTITHREAD_SUPPORT')]),
            ];
          case 1:
            (_a = __read.apply(void 0, [_b.sent(), 2])), (simdSupported = _a[0]), (threadsSupported = _a[1]);
            return [
              2 /*return*/,
              new Promise(function (resolve, reject) {
                var factoryConfig = {};
                /**
                 * This function overrides the Emscripten module locateFile utility.
                 * @param path The relative path to the file that needs to be loaded.
                 * @param prefix The path to the main JavaScript file's directory.
                 */
                factoryConfig.locateFile = function (path, prefix) {
                  if (path.endsWith('.worker.js')) {
                    // Escape '\n' because Blob will turn it into a newline.
                    // There should be a setting for this, but 'endings: "native"' does
                    // not seem to work.
                    var response = wasmWorkerContents.replace(/\n/g, '\\n');
                    var blob = new Blob([response], { type: 'application/javascript' });
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
                var initialized = false;
                factoryConfig.onAbort = function () {
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
                  var rejectMsg =
                    'Make sure the server can serve the `.wasm` file relative to the ' +
                    'bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers';
                  reject({ message: rejectMsg });
                };
                var wasm;
                // If `wasmPath` has been defined we must initialize the vanilla module.
                if (threadsSupported && simdSupported && wasmPath == null) {
                  factoryConfig.mainScriptUrlOrBlob = new Blob(
                    ['var WasmBackendModuleThreadedSimd = ' + wasmFactoryThreadedSimd.toString()],
                    { type: 'text/javascript' },
                  );
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
                  .then(function (module) {
                    initialized = true;
                    initAborted = false;
                    var voidReturnType = null;
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
              }),
            ];
        }
      });
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
        throw new Error('Unknown dtype '.concat(dtype));
    }
  }
  var wasmBinaryNames = ['tfjs-backend-wasm.wasm', 'tfjs-backend-wasm-simd.wasm', 'tfjs-backend-wasm-threaded-simd.wasm'];
  var wasmPath = null;
  var wasmPathPrefix = null;
  var wasmFileMap = {};
  var initAborted = false;
  var customFetch = false;
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
  function setWasmPath(path, usePlatformFetch) {
    if (usePlatformFetch === void 0) {
      usePlatformFetch = false;
    }
    tfjsCore.deprecationWarn('setWasmPath has been deprecated in favor of setWasmPaths and' + ' will be removed in a future release.');
    if (initAborted) {
      throw new Error(
        'The WASM backend was already initialized. Make sure you call ' +
          '`setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`',
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
  function setWasmPaths(prefixOrFileMap, usePlatformFetch) {
    if (usePlatformFetch === void 0) {
      usePlatformFetch = false;
    }
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
      var missingPaths = wasmBinaryNames.filter(function (name) {
        return wasmFileMap[name] == null;
      });
      if (missingPaths.length > 0) {
        throw new Error(
          'There were no entries found for the following binaries: ' +
            ''.concat(missingPaths.join(','), '. Please either call setWasmPaths with a ') +
            'map providing a path for each binary, or with a string indicating ' +
            'the directory where all the binaries can be found.',
        );
      }
    }
    customFetch = usePlatformFetch;
  }
  var threadsCount = -1;
  var actualThreadsCount = -1;
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
      throw new Error('WASM backend not initialized.');
    }
    return actualThreadsCount;
  }

  /** @license See the LICENSE file. */
  // This code is auto-generated, do not modify this file!
  var version = '4.13.0';

  var WASM_PRIORITY = 2;
  tfjsCore.registerBackend(
    'wasm',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wasm;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, init()];
            case 1:
              wasm = _a.sent().wasm;
              return [2 /*return*/, new BackendWasm(wasm)];
          }
        });
      });
    },
    WASM_PRIORITY,
  );

  exports.BackendWasm = BackendWasm;
  exports.getThreadsCount = getThreadsCount;
  exports.setThreadsCount = setThreadsCount;
  exports.setWasmPath = setWasmPath;
  exports.setWasmPaths = setWasmPaths;
  exports.version_wasm = version;
});
//# sourceMappingURL=tf-backend-wasm.js.map
