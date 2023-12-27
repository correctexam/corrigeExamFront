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
/// <amd-module name="@tensorflow/tfjs-backend-wasm/dist/kernels/MaxPool3D" />
import { KernelConfig, MaxPool3DAttrs, MaxPool3DInputs, TensorInfo } from '@tensorflow/tfjs-core';
import { BackendWasm } from '../backend_wasm';
export declare function maxPool3D(args: { inputs: MaxPool3DInputs; attrs: MaxPool3DAttrs; backend: BackendWasm }): TensorInfo;
export declare const maxPool3DConfig: KernelConfig;
