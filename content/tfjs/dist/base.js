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
import './flags_wasm';
import { registerBackend } from '@tensorflow/tfjs-core';
import { BackendWasm, init } from './backend_wasm';
export { BackendWasm, getThreadsCount, setThreadsCount, setWasmPath, setWasmPaths } from './backend_wasm';
export { version as version_wasm } from './version';
const WASM_PRIORITY = 2;
registerBackend(
  'wasm',
  async () => {
    const { wasm } = await init();
    return new BackendWasm(wasm);
  },
  WASM_PRIORITY,
);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sY0FBYyxDQUFDO0FBRXRCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWpELE9BQU8sRUFBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEcsT0FBTyxFQUFDLE9BQU8sSUFBSSxZQUFZLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDakMsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDNUIsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAnLi9mbGFnc193YXNtJztcblxuaW1wb3J0IHtyZWdpc3RlckJhY2tlbmR9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc20sIGluaXR9IGZyb20gJy4vYmFja2VuZF93YXNtJztcblxuZXhwb3J0IHtCYWNrZW5kV2FzbSwgZ2V0VGhyZWFkc0NvdW50LCBzZXRUaHJlYWRzQ291bnQsIHNldFdhc21QYXRoLCBzZXRXYXNtUGF0aHN9IGZyb20gJy4vYmFja2VuZF93YXNtJztcbmV4cG9ydCB7dmVyc2lvbiBhcyB2ZXJzaW9uX3dhc219IGZyb20gJy4vdmVyc2lvbic7XG5cbmNvbnN0IFdBU01fUFJJT1JJVFkgPSAyO1xucmVnaXN0ZXJCYWNrZW5kKCd3YXNtJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCB7d2FzbX0gPSBhd2FpdCBpbml0KCk7XG4gIHJldHVybiBuZXcgQmFja2VuZFdhc20od2FzbSk7XG59LCBXQVNNX1BSSU9SSVRZKTtcbiJdfQ==
