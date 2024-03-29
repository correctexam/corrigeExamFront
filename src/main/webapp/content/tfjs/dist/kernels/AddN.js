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
import { AddN, util } from '@tensorflow/tfjs-core';
import { CppDType } from './types';
let wasmFunc;
function setupFunc(backend) {
  wasmFunc = backend.wasm.cwrap(AddN, null /* void */, [
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
  wasmFunc(inputIdsBytes, inputIds.length, CppDType[out.dtype], outId);
  return out;
}
export const addNConfig = {
  kernelName: AddN,
  backendName: 'wasm',
  setupFunc,
  kernelFunc: addn,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWRkTi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9rZXJuZWxzL0FkZE4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLElBQUksRUFBd0MsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFJdkYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUVqQyxJQUFJLFFBRVEsQ0FBQztBQUViLFNBQVMsU0FBUyxDQUFDLE9BQW9CO0lBQ3JDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNuRCxPQUFPO1FBQ1AsUUFBUTtRQUNSLFFBQVE7UUFDUixRQUFRLEVBQUcsU0FBUztLQUNyQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxJQUFJLENBQUMsSUFBa0Q7SUFDOUQsTUFBTSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsR0FBRyxJQUFJLENBQUM7SUFDL0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVqRSxvQ0FBb0M7SUFDcEMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkMsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckUsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEUsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuRCxRQUFRLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVyRSxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQWlCO0lBQ3RDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFdBQVcsRUFBRSxNQUFNO0lBQ25CLFNBQVM7SUFDVCxVQUFVLEVBQUUsSUFBNkI7Q0FDMUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtBZGROLCBLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIFRlbnNvckluZm8sIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7QmFja2VuZFdhc219IGZyb20gJy4uL2JhY2tlbmRfd2FzbSc7XG5cbmltcG9ydCB7Q3BwRFR5cGV9IGZyb20gJy4vdHlwZXMnO1xuXG5sZXQgd2FzbUZ1bmM6XG4gICAgKGlucHV0SWRzOiBVaW50OEFycmF5LCBpbnB1dElkc0xlbjogbnVtYmVyLCBkdHlwZTogbnVtYmVyLCBvdXRJZDogbnVtYmVyKSA9PlxuICAgICAgICB2b2lkO1xuXG5mdW5jdGlvbiBzZXR1cEZ1bmMoYmFja2VuZDogQmFja2VuZFdhc20pOiB2b2lkIHtcbiAgd2FzbUZ1bmMgPSBiYWNrZW5kLndhc20uY3dyYXAoQWRkTiwgbnVsbCAvKiB2b2lkICovLCBbXG4gICAgJ2FycmF5JywgICAvLyBpbnB1dF9pZHNcbiAgICAnbnVtYmVyJywgIC8vIGlucHV0X2lkcy5sZW5ndGhcbiAgICAnbnVtYmVyJywgIC8vIGR0eXBlXG4gICAgJ251bWJlcicsICAvLyBvdXRfaWRcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIGFkZG4oYXJnczoge2lucHV0czogVGVuc29ySW5mb1tdLCBiYWNrZW5kOiBCYWNrZW5kV2FzbX0pIHtcbiAgY29uc3Qge2lucHV0cywgYmFja2VuZH0gPSBhcmdzO1xuICBjb25zdCBvdXQgPSBiYWNrZW5kLm1ha2VPdXRwdXQoaW5wdXRzWzBdLnNoYXBlLCBpbnB1dHNbMF0uZHR5cGUpO1xuXG4gIC8vIFNob3J0LWNpcmN1aXQgemVyby1zaXplZCB0ZW5zb3JzLlxuICBpZiAodXRpbC5zaXplRnJvbVNoYXBlKG91dC5zaGFwZSkgPT09IDApIHtcbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgY29uc3QgaW5wdXRJZHMgPSBpbnB1dHMubWFwKHggPT4gYmFja2VuZC5kYXRhSWRNYXAuZ2V0KHguZGF0YUlkKS5pZCk7XG4gIGNvbnN0IGlucHV0SWRzQnl0ZXMgPSBuZXcgVWludDhBcnJheShuZXcgSW50MzJBcnJheShpbnB1dElkcykuYnVmZmVyKTtcbiAgY29uc3Qgb3V0SWQgPSBiYWNrZW5kLmRhdGFJZE1hcC5nZXQob3V0LmRhdGFJZCkuaWQ7XG4gIHdhc21GdW5jKGlucHV0SWRzQnl0ZXMsIGlucHV0SWRzLmxlbmd0aCwgQ3BwRFR5cGVbb3V0LmR0eXBlXSwgb3V0SWQpO1xuXG4gIHJldHVybiBvdXQ7XG59XG5cbmV4cG9ydCBjb25zdCBhZGROQ29uZmlnOiBLZXJuZWxDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IEFkZE4sXG4gIGJhY2tlbmROYW1lOiAnd2FzbScsXG4gIHNldHVwRnVuYyxcbiAga2VybmVsRnVuYzogYWRkbiBhcyB1bmtub3duIGFzIEtlcm5lbEZ1bmMsXG59O1xuIl19
