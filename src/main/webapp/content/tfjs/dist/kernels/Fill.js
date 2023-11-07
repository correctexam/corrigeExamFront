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
import { util } from '@tensorflow/tfjs-core';
import { Fill } from '@tensorflow/tfjs-core';
export function fill(args) {
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
export const fillConfig = {
  kernelName: Fill,
  backendName: 'wasm',
  kernelFunc: fill,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9rZXJuZWxzL0ZpbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUEyQixJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRSxPQUFPLEVBQUMsSUFBSSxFQUFZLE1BQU0sdUJBQXVCLENBQUM7QUFJdEQsTUFBTSxVQUFVLElBQUksQ0FBQyxJQUE4QztJQUNqRSxNQUFNLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztJQUM5QyxJQUFJLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFFNUIsS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXhDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQWUsQ0FBQyxDQUFDO0lBQzlCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBaUI7SUFDdEMsVUFBVSxFQUFFLElBQUk7SUFDaEIsV0FBVyxFQUFFLE1BQU07SUFDbkIsVUFBVSxFQUFFLElBQTZCO0NBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtGaWxsLCBGaWxsQXR0cnN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc219IGZyb20gJy4uL2JhY2tlbmRfd2FzbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxsKGFyZ3M6IHthdHRyczogRmlsbEF0dHJzLCBiYWNrZW5kOiBCYWNrZW5kV2FzbX0pIHtcbiAgY29uc3Qge2F0dHJzOiB7c2hhcGUsIHZhbHVlfSwgYmFja2VuZH0gPSBhcmdzO1xuICBsZXQge2F0dHJzOiB7ZHR5cGV9fSA9IGFyZ3M7XG5cbiAgZHR5cGUgPSBkdHlwZSB8fCB1dGlsLmluZmVyRHR5cGUodmFsdWUpO1xuXG4gIGNvbnN0IG91dCA9IGJhY2tlbmQubWFrZU91dHB1dChzaGFwZSwgZHR5cGUpO1xuICBjb25zdCBvdXRWYWxzID0gYmFja2VuZC50eXBlZEFycmF5RnJvbUhlYXAob3V0KTtcbiAgb3V0VmFscy5maWxsKHZhbHVlIGFzIG51bWJlcik7XG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBjb25zdCBmaWxsQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IEZpbGwsXG4gIGJhY2tlbmROYW1lOiAnd2FzbScsXG4gIGtlcm5lbEZ1bmM6IGZpbGwgYXMgdW5rbm93biBhcyBLZXJuZWxGdW5jLFxufTtcbiJdfQ==
