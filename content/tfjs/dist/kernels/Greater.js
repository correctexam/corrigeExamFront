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
import { Greater } from '@tensorflow/tfjs-core';
import { createBinaryKernelConfig } from './binary_kernel';
const supportsFullBroadcast = false;
export const greaterConfig = createBinaryKernelConfig(Greater, supportsFullBroadcast, 'bool');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JlYXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13YXNtL3NyYy9rZXJuZWxzL0dyZWF0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLHVCQUF1QixDQUFDO0FBRTVELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpELE1BQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDO0FBQ3BDLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FDdEIsd0JBQXdCLENBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtHcmVhdGVyLCBLZXJuZWxDb25maWd9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbmltcG9ydCB7Y3JlYXRlQmluYXJ5S2VybmVsQ29uZmlnfSBmcm9tICcuL2JpbmFyeV9rZXJuZWwnO1xuXG5jb25zdCBzdXBwb3J0c0Z1bGxCcm9hZGNhc3QgPSBmYWxzZTtcbmV4cG9ydCBjb25zdCBncmVhdGVyQ29uZmlnOiBLZXJuZWxDb25maWcgPVxuICAgIGNyZWF0ZUJpbmFyeUtlcm5lbENvbmZpZyhHcmVhdGVyLCBzdXBwb3J0c0Z1bGxCcm9hZGNhc3QsICdib29sJyk7XG4iXX0=
