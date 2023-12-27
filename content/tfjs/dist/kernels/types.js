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
// This enum must align with the enum defined in cc/backend.h.
export var CppDType;
(function (CppDType) {
  CppDType[(CppDType['float32'] = 0)] = 'float32';
  CppDType[(CppDType['int32'] = 1)] = 'int32';
  CppDType[(CppDType['bool'] = 2)] = 'bool';
  CppDType[(CppDType['string'] = 3)] = 'string';
  CppDType[(CppDType['complex64'] = 4)] = 'complex64';
})(CppDType || (CppDType = {}));
// Must match enum in cc/fusable_activations.h.
export var FusableActivation;
(function (FusableActivation) {
  FusableActivation[(FusableActivation['linear'] = 0)] = 'linear';
  FusableActivation[(FusableActivation['relu'] = 1)] = 'relu';
  FusableActivation[(FusableActivation['relu6'] = 2)] = 'relu6';
  FusableActivation[(FusableActivation['prelu'] = 3)] = 'prelu';
  FusableActivation[(FusableActivation['leakyrelu'] = 4)] = 'leakyrelu';
  FusableActivation[(FusableActivation['sigmoid'] = 5)] = 'sigmoid';
  FusableActivation[(FusableActivation['elu'] = 6)] = 'elu';
})(FusableActivation || (FusableActivation = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtd2FzbS9zcmMva2VybmVscy90eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCw4REFBOEQ7QUFDOUQsTUFBTSxDQUFOLElBQVksUUFNWDtBQU5ELFdBQVksUUFBUTtJQUNsQiw2Q0FBVyxDQUFBO0lBQ1gseUNBQVMsQ0FBQTtJQUNULHVDQUFRLENBQUE7SUFDUiwyQ0FBVSxDQUFBO0lBQ1YsaURBQWEsQ0FBQTtBQUNmLENBQUMsRUFOVyxRQUFRLEtBQVIsUUFBUSxRQU1uQjtBQUVELCtDQUErQztBQUMvQyxNQUFNLENBQU4sSUFBWSxpQkFRWDtBQVJELFdBQVksaUJBQWlCO0lBQzNCLDZEQUFVLENBQUE7SUFDVix5REFBUSxDQUFBO0lBQ1IsMkRBQVMsQ0FBQTtJQUNULDJEQUFTLENBQUE7SUFDVCxtRUFBYSxDQUFBO0lBQ2IsK0RBQVcsQ0FBQTtJQUNYLHVEQUFPLENBQUE7QUFDVCxDQUFDLEVBUlcsaUJBQWlCLEtBQWpCLGlCQUFpQixRQVE1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLy8gVGhpcyBlbnVtIG11c3QgYWxpZ24gd2l0aCB0aGUgZW51bSBkZWZpbmVkIGluIGNjL2JhY2tlbmQuaC5cbmV4cG9ydCBlbnVtIENwcERUeXBlIHtcbiAgZmxvYXQzMiA9IDAsXG4gIGludDMyID0gMSxcbiAgYm9vbCA9IDIsXG4gIHN0cmluZyA9IDMsXG4gIGNvbXBsZXg2NCA9IDRcbn1cblxuLy8gTXVzdCBtYXRjaCBlbnVtIGluIGNjL2Z1c2FibGVfYWN0aXZhdGlvbnMuaC5cbmV4cG9ydCBlbnVtIEZ1c2FibGVBY3RpdmF0aW9uIHtcbiAgbGluZWFyID0gMCxcbiAgcmVsdSA9IDEsXG4gIHJlbHU2ID0gMixcbiAgcHJlbHUgPSAzLFxuICBsZWFreXJlbHUgPSA0LFxuICBzaWdtb2lkID0gNSxcbiAgZWx1ID0gNlxufVxuIl19
