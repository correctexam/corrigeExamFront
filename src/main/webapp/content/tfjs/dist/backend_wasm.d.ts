/// <amd-module name="@tensorflow/tfjs-backend-wasm/dist/backend_wasm" />
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
import './flags_wasm';
import { backend_util, BackendTimingInfo, DataStorage, DataType, KernelBackend, TensorInfo } from '@tensorflow/tfjs-core';
import { BackendWasmModule } from '../wasm-out/tfjs-backend-wasm';
import { BackendWasmThreadedSimdModule } from '../wasm-out/tfjs-backend-wasm-threaded-simd';
interface TensorData {
  id: number;
  memoryOffset: number;
  shape: number[];
  dtype: DataType;
  refCount: number;
  /** Only used for string tensors, storing encoded bytes. */
  stringBytes?: Uint8Array[];
}
export type DataId = object;
export declare class BackendWasm extends KernelBackend {
  wasm: BackendWasmModule | BackendWasmThreadedSimdModule;
  private dataIdNextNumber;
  dataIdMap: DataStorage<TensorData>;
  constructor(wasm: BackendWasmModule | BackendWasmThreadedSimdModule);
  write(values: backend_util.BackendValues | null, shape: number[], dtype: DataType): DataId;
  numDataIds(): number;
  time(f: () => void): Promise<BackendTimingInfo>;
  move(dataId: DataId, values: backend_util.BackendValues | null, shape: number[], dtype: DataType, refCount: number): void;
  read(dataId: DataId): Promise<backend_util.BackendValues>;
  readSync(dataId: DataId, start?: number, end?: number): backend_util.BackendValues;
  /**
   * Dispose the memory if the dataId has 0 refCount. Return true if the memory
   * is released, false otherwise.
   * @param dataId
   * @oaram force Optional, remove the data regardless of refCount
   */
  disposeData(dataId: DataId, force?: boolean): boolean;
  /** Return refCount of a `TensorData`. */
  refCount(dataId: DataId): number;
  incRef(dataId: DataId): void;
  floatPrecision(): 32;
  getMemoryOffset(dataId: DataId): number;
  dispose(): void;
  memory(): {
    unreliable: boolean;
  };
  /**
   * Make a tensor info for the output of an op. If `memoryOffset` is not
   * present, this method allocates memory on the WASM heap. If `memoryOffset`
   * is present, the memory was allocated elsewhere (in c++) and we just record
   * the pointer where that memory lives.
   */
  makeOutput(shape: number[], dtype: DataType, memoryOffset?: number, values?: backend_util.BackendValues): TensorInfo;
  typedArrayFromHeap({ shape, dtype, dataId }: TensorInfo): backend_util.TypedArray;
}
/**
 * Initializes the wasm module and creates the js <--> wasm bridge.
 *
 * NOTE: We wrap the wasm module in a object with property 'wasm' instead of
 * returning Promise<BackendWasmModule> to avoid freezing Chrome (last tested
 * in Chrome 76).
 */
export declare function init(): Promise<{
  wasm: BackendWasmModule;
}>;
declare const wasmBinaryNames: readonly ['tfjs-backend-wasm.wasm', 'tfjs-backend-wasm-simd.wasm', 'tfjs-backend-wasm-threaded-simd.wasm'];
type WasmBinaryName = (typeof wasmBinaryNames)[number];
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
export declare function setWasmPath(path: string, usePlatformFetch?: boolean): void;
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
export declare function setWasmPaths(
  prefixOrFileMap:
    | string
    | {
        [key in WasmBinaryName]?: string;
      },
  usePlatformFetch?: boolean,
): void;
/** Used in unit tests. */
export declare function resetWasmPath(): void;
/**
 * Sets the number of threads that will be used by XNNPACK to create
 * threadpool (default to the number of logical CPU cores).
 *
 * This must be called before calling `tf.setBackend('wasm')`.
 */
export declare function setThreadsCount(numThreads: number): void;
/**
 * Gets the actual threads count that is used by XNNPACK.
 *
 * It is set after the backend is intialized.
 */
export declare function getThreadsCount(): number;
export {};
