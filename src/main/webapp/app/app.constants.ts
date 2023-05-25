// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;
declare const __CONNECTION_METHOD__: string;
declare const __SERVICE_URL__: string;
declare const __CAS_SERVER_URL__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;
export const CONNECTION_METHOD = __CONNECTION_METHOD__;
export const SERVICE_URL = __SERVICE_URL__;
export const CAS_SERVER_URL = __CAS_SERVER_URL__;
