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
import { ZerosLike } from '@tensorflow/tfjs-core';
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
export const zerosLikeConfig = {
  kernelName: ZerosLike,
  backendName: 'wasm',
  kernelFunc: zerosLike,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWmVyb3NMaWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdhc20vc3JjL2tlcm5lbHMvWmVyb3NMaWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBMkIsU0FBUyxFQUFrQixNQUFNLHVCQUF1QixDQUFDO0FBSTNGLFNBQVMsU0FBUyxDQUFDLElBQXFEO0lBQ3RFLE1BQU0sRUFBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDcEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQixPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQWlCO0lBQzNDLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFVBQVUsRUFBRSxTQUFrQztDQUMvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0tlcm5lbENvbmZpZywgS2VybmVsRnVuYywgWmVyb3NMaWtlLCBaZXJvc0xpa2VJbnB1dHN9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc219IGZyb20gJy4uL2JhY2tlbmRfd2FzbSc7XG5cbmZ1bmN0aW9uIHplcm9zTGlrZShhcmdzOiB7aW5wdXRzOiBaZXJvc0xpa2VJbnB1dHMsIGJhY2tlbmQ6IEJhY2tlbmRXYXNtfSkge1xuICBjb25zdCB7aW5wdXRzOiB7eH0sIGJhY2tlbmR9ID0gYXJncztcbiAgY29uc3Qgb3V0ID0gYmFja2VuZC5tYWtlT3V0cHV0KHguc2hhcGUsIHguZHR5cGUpO1xuICBjb25zdCBvdXRWYWxzID0gYmFja2VuZC50eXBlZEFycmF5RnJvbUhlYXAob3V0KTtcbiAgb3V0VmFscy5maWxsKDApO1xuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgY29uc3QgemVyb3NMaWtlQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFplcm9zTGlrZSxcbiAgYmFja2VuZE5hbWU6ICd3YXNtJyxcbiAga2VybmVsRnVuYzogemVyb3NMaWtlIGFzIHVua25vd24gYXMgS2VybmVsRnVuYyxcbn07XG4iXX0=
