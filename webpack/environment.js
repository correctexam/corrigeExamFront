module.exports = {
  I18N_HASH: 'generated_hash',
  FRONT_URL: process.env.hasOwnProperty('FRONT_URL') ? process.env.FRONT_URL : '/',
  SERVER_API_URL: process.env.hasOwnProperty('SERVER_API_URL') ? process.env.SERVER_API_URL : '/',
  __VERSION__: process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : '0.9.0',
  __DEBUG_INFO_ENABLED__: false,
};
