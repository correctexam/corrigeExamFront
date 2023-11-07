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
import { OnesLike } from '@tensorflow/tfjs-core';
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
export const onesLikeConfig = {
  kernelName: OnesLike,
  backendName: 'wasm',
  kernelFunc: onesLike,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT25lc0xpa2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2FzbS9zcmMva2VybmVscy9PbmVzTGlrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQTJCLFFBQVEsRUFBaUIsTUFBTSx1QkFBdUIsQ0FBQztBQUl6RixTQUFTLFFBQVEsQ0FBQyxJQUFvRDtJQUNwRSxNQUFNLEVBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFpQjtJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixXQUFXLEVBQUUsTUFBTTtJQUNuQixVQUFVLEVBQUUsUUFBaUM7Q0FDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtLZXJuZWxDb25maWcsIEtlcm5lbEZ1bmMsIE9uZXNMaWtlLCBPbmVzTGlrZUlucHV0c30gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcblxuaW1wb3J0IHtCYWNrZW5kV2FzbX0gZnJvbSAnLi4vYmFja2VuZF93YXNtJztcblxuZnVuY3Rpb24gb25lc0xpa2UoYXJnczoge2lucHV0czogT25lc0xpa2VJbnB1dHMsIGJhY2tlbmQ6IEJhY2tlbmRXYXNtfSkge1xuICBjb25zdCB7aW5wdXRzOiB7eH0sIGJhY2tlbmR9ID0gYXJncztcbiAgY29uc3Qgb3V0ID0gYmFja2VuZC5tYWtlT3V0cHV0KHguc2hhcGUsIHguZHR5cGUpO1xuICBjb25zdCBvdXRWYWxzID0gYmFja2VuZC50eXBlZEFycmF5RnJvbUhlYXAob3V0KTtcbiAgb3V0VmFscy5maWxsKDEpO1xuICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgY29uc3Qgb25lc0xpa2VDb25maWc6IEtlcm5lbENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogT25lc0xpa2UsXG4gIGJhY2tlbmROYW1lOiAnd2FzbScsXG4gIGtlcm5lbEZ1bmM6IG9uZXNMaWtlIGFzIHVua25vd24gYXMgS2VybmVsRnVuYyxcbn07XG4iXX0=
