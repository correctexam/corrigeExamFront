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
import { backend_util, GatherV2, util } from '@tensorflow/tfjs-core';
import { reshape } from './Reshape';
import { CppDType } from './types';
let wasmGather;
function setup(backend) {
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
export const gatherV2Config = {
  kernelName: GatherV2,
  backendName: 'wasm',
  setupFunc: setup,
  kernelFunc: gatherV2,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2F0aGVyVjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2FzbS9zcmMva2VybmVscy9HYXRoZXJWMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFFLFFBQVEsRUFBMkYsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFJNUosT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNsQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRWpDLElBQUksVUFHc0IsQ0FBQztBQUUzQixTQUFTLEtBQUssQ0FBQyxPQUFvQjtJQUNqQyxVQUFVLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDdkQsUUFBUTtRQUNSLFFBQVE7UUFDUixPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRO1FBQ1IsT0FBTztRQUNQLFFBQVEsQ0FBRyxRQUFRO0tBQ3BCLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FDYixJQUEwRTtJQUU1RSxNQUFNLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDdEMsTUFBTSxFQUFDLENBQUMsRUFBRSxPQUFPLEVBQUMsR0FBRyxNQUFNLENBQUM7SUFDNUIsTUFBTSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsR0FBRyxLQUFLLENBQUM7SUFFaEMsOENBQThDO0lBQzlDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FB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LENBQUMsQ0FBQztJQUVwRSxVQUFVLENBQ04sR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQzdELFNBQVMsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWpELE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXpDLFVBQVU7SUFDVixHQUFHLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7SUFDbEMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFpQjtJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixXQUFXLEVBQUUsTUFBTTtJQUNuQixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUsUUFBaUM7Q0FDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIEdhdGhlclYyLCBHYXRoZXJWMkF0dHJzLCBHYXRoZXJWMklucHV0cywgS2VybmVsQ29uZmlnLCBLZXJuZWxGdW5jLCBUZW5zb3IsIFRlbnNvckluZm8sIFR5cGVkQXJyYXksIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc219IGZyb20gJy4uL2JhY2tlbmRfd2FzbSc7XG5cbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9SZXNoYXBlJztcbmltcG9ydCB7Q3BwRFR5cGV9IGZyb20gJy4vdHlwZXMnO1xuXG5sZXQgd2FzbUdhdGhlcjogKFxuICAgIHhJZDogbnVtYmVyLCBkdHlwZTogQ3BwRFR5cGUsIHhTdHJpZGVzOiBVaW50OEFycmF5LCBzdHJpZGVzU2l6ZTogbnVtYmVyLFxuICAgIGluZGljZXNJZDogbnVtYmVyLCBiYXRjaFNpemU6IG51bWJlciwgb3V0U3RyaWRlczogVWludDhBcnJheSxcbiAgICBvdXRJZDogbnVtYmVyKSA9PiB2b2lkO1xuXG5mdW5jdGlvbiBzZXR1cChiYWNrZW5kOiBCYWNrZW5kV2FzbSk6IHZvaWQge1xuICB3YXNtR2F0aGVyID0gYmFja2VuZC53YXNtLmN3cmFwKCdHYXRoZXInLCBudWxsIC8qdm9pZCovLCBbXG4gICAgJ251bWJlcicsICAvLyB4SWRcbiAgICAnbnVtYmVyJywgIC8vIGR0eXBlXG4gICAgJ2FycmF5JywgICAvLyB4U3RyaWRlc1xuICAgICdudW1iZXInLCAgLy8gc3RyaWRlc1NpemVcbiAgICAnbnVtYmVyJywgIC8vIGluZGljZXNJZFxuICAgICdudW1iZXInLCAgLy8gYmF0Y2hTaXplXG4gICAgJ2FycmF5JywgICAvLyBvdXRTdHJpZGVzXG4gICAgJ251bWJlcicgICAvLyBvdXRJZFxuICBdKTtcbn1cblxuZnVuY3Rpb24gZ2F0aGVyVjIoXG4gICAgYXJnczoge2JhY2tlbmQ6IEJhY2tlbmRXYXNtLCBpbnB1dHM6IEdhdGhlclYySW5wdXRzLCBhdHRyczogR2F0aGVyVjJBdHRyc30pOlxuICAgIFRlbnNvckluZm8ge1xuICBjb25zdCB7YmFja2VuZCwgaW5wdXRzLCBhdHRyc30gPSBhcmdzO1xuICBjb25zdCB7eCwgaW5kaWNlc30gPSBpbnB1dHM7XG4gIGNvbnN0IHtheGlzLCBiYXRjaERpbXN9ID0gYXR0cnM7XG5cbiAgLy8gVGhyb3cgZXJyb3Igd2hlbiBhbnkgaW5kZXggaXMgb3V0IG9mIGJvdW5kLlxuICBjb25zdCBwYXJzZWRBeGlzID0gdXRpbC5wYXJzZUF4aXNQYXJhbShheGlzLCB4LnNoYXBlKVswXTtcbiAgY29uc3QgaW5kaWNlc1ZhbHMgPSBiYWNrZW5kLnJlYWRTeW5jKGluZGljZXMuZGF0YUlkKSBhcyBUeXBlZEFycmF5O1xuICBjb25zdCBheGlzRGltID0geC5zaGFwZVtwYXJzZWRBeGlzXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzVmFscy5sZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IGluZGV4ID0gaW5kaWNlc1ZhbHNbaV07XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgIGluZGV4IDw9IGF4aXNEaW0gLSAxICYmIGluZGV4ID49IDAsXG4gICAgICAgICgpID0+XG4gICAgICAgICAgICBgR2F0aGVyVjI6IHRoZSBpbmRleCB2YWx1ZSAke2luZGV4fSBpcyBub3QgaW4gWzAsICR7YXhpc0RpbSAtIDF9XWApO1xuICB9XG5cbiAgY29uc3Qgc2hhcGVJbmZvID0gYmFja2VuZF91dGlsLnNlZ21lbnRfdXRpbC5jb2xsZWN0R2F0aGVyT3BTaGFwZUluZm8oXG4gICAgICB4IGFzIFRlbnNvciwgaW5kaWNlcyBhcyBUZW5zb3IsIHBhcnNlZEF4aXMsIGJhdGNoRGltcyk7XG5cbiAgY29uc3QgZmxhdHRlblggPSByZXNoYXBlKHtcbiAgICBpbnB1dHM6IHt4fSxcbiAgICBhdHRyczoge1xuICAgICAgc2hhcGU6IFtcbiAgICAgICAgc2hhcGVJbmZvLmJhdGNoU2l6ZSwgc2hhcGVJbmZvLm91dGVyU2l6ZSwgc2hhcGVJbmZvLmRpbVNpemUsXG4gICAgICAgIHNoYXBlSW5mby5zbGljZVNpemVcbiAgICAgIF1cbiAgICB9LFxuICAgIGJhY2tlbmRcbiAgfSk7XG4gIGNvbnN0IGluZGljZXNTaXplID0gdXRpbC5zaXplRnJvbVNoYXBlKGluZGljZXMuc2hhcGUpO1xuICBjb25zdCBmbGF0dGVuSW5kZXggPSByZXNoYXBlKHtcbiAgICBpbnB1dHM6IHt4OiBpbmRpY2VzfSxcbiAgICBhdHRyczoge3NoYXBlOiBbc2hhcGVJbmZvLmJhdGNoU2l6ZSwgaW5kaWNlc1NpemUgLyBzaGFwZUluZm8uYmF0Y2hTaXplXX0sXG4gICAgYmFja2VuZFxuICB9KTtcbiAgY29uc3QgZmxhdHRlbk91dHB1dFNoYXBlID0gW1xuICAgIHNoYXBlSW5mby5iYXRjaFNpemUsIHNoYXBlSW5mby5vdXRlclNpemUsIGluZGljZXNTaXplIC8gc2hhcGVJbmZvLmJhdGNoU2l6ZSxcbiAgICBzaGFwZUluZm8uc2xpY2VTaXplXG4gIF07XG5cbiAgY29uc3Qgb3V0ID0gYmFja2VuZC5tYWtlT3V0cHV0KGZsYXR0ZW5PdXRwdXRTaGFwZSwgeC5kdHlwZSk7XG4gIGlmICh1dGlsLnNpemVGcm9tU2hhcGUoeC5zaGFwZSkgPT09IDApIHtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIGNvbnN0IHN0cmlkZXNTaXplID0gZmxhdHRlblguc2hhcGUubGVuZ3RoIC0gMTtcblxuICBjb25zdCB4RGF0YSA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChmbGF0dGVuWC5kYXRhSWQpO1xuICBjb25zdCB4SWQgPSB4RGF0YS5pZDtcblxuICBjb25zdCBpbmRpY2VzRGF0YSA9IGJhY2tlbmQuZGF0YUlkTWFwLmdldChmbGF0dGVuSW5kZXguZGF0YUlkKTtcbiAgY29uc3QgaW5kaWNlc0lkID0gaW5kaWNlc0RhdGEuaWQ7XG5cbiAgY29uc3Qgb3V0SWQgPSBiYWNrZW5kLmRhdGFJZE1hcC5nZXQob3V0LmRhdGFJZCkuaWQ7XG5cbiAgY29uc3QgeFN0cmlkZXNCeXRlcyA9IG5ldyBVaW50OEFycmF5KFxuICAgICAgbmV3IEludDMyQXJyYXkodXRpbC5jb21wdXRlU3RyaWRlcyhmbGF0dGVuWC5zaGFwZSkpLmJ1ZmZlcik7XG4gIGNvbnN0IG91dFN0cmlkZXNCeXRlcyA9IG5ldyBVaW50OEFycmF5KFxuICAgICAgbmV3IEludDMyQXJyYXkodXRpbC5jb21wdXRlU3RyaWRlcyhmbGF0dGVuT3V0cHV0U2hhcGUpKS5idWZmZXIpO1xuXG4gIHdhc21HYXRoZXIoXG4gICAgICB4SWQsIENwcERUeXBlW3guZHR5cGVdLCB4U3RyaWRlc0J5dGVzLCBzdHJpZGVzU2l6ZSwgaW5kaWNlc0lkLFxuICAgICAgc2hhcGVJbmZvLmJhdGNoU2l6ZSwgb3V0U3RyaWRlc0J5dGVzLCBvdXRJZCk7XG5cbiAgYmFja2VuZC5kaXNwb3NlRGF0YShmbGF0dGVuWC5kYXRhSWQpO1xuICBiYWNrZW5kLmRpc3Bvc2VEYXRhKGZsYXR0ZW5JbmRleC5kYXRhSWQpO1xuXG4gIC8vIHJlc2hhcGVcbiAgb3V0LnNoYXBlID0gc2hhcGVJbmZvLm91dHB1dFNoYXBlO1xuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgY29uc3QgZ2F0aGVyVjJDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogR2F0aGVyVjIsXG4gIGJhY2tlbmROYW1lOiAnd2FzbScsXG4gIHNldHVwRnVuYzogc2V0dXAsXG4gIGtlcm5lbEZ1bmM6IGdhdGhlclYyIGFzIHVua25vd24gYXMgS2VybmVsRnVuY1xufTtcbiJdfQ==
