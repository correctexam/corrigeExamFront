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
import { RealDiv } from '@tensorflow/tfjs-core';
import { createBinaryKernelConfig } from './binary_kernel';
const supportsFullBroadcast = true;
export const realDivConfig = createBinaryKernelConfig(RealDiv, supportsFullBroadcast);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVhbERpdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9rZXJuZWxzL1JlYWxEaXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFlLE9BQU8sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRTVELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpELE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ25DLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FDdEIsd0JBQXdCLENBQUMsT0FBTyxFQUFFLHFCQUFxQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7S2VybmVsQ29uZmlnLCBSZWFsRGl2fSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2NyZWF0ZUJpbmFyeUtlcm5lbENvbmZpZ30gZnJvbSAnLi9iaW5hcnlfa2VybmVsJztcblxuY29uc3Qgc3VwcG9ydHNGdWxsQnJvYWRjYXN0ID0gdHJ1ZTtcbmV4cG9ydCBjb25zdCByZWFsRGl2Q29uZmlnOiBLZXJuZWxDb25maWcgPVxuICAgIGNyZWF0ZUJpbmFyeUtlcm5lbENvbmZpZyhSZWFsRGl2LCBzdXBwb3J0c0Z1bGxCcm9hZGNhc3QpO1xuIl19
