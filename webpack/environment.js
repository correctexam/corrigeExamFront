module.exports = {
  I18N_HASH: 'generated_hash',
  SERVER_API_URLPROD: 'https://api.gradescope.barais.fr/',
  SERVER_API_URLDEV: '',
  __VERSION__: process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : 'DEV',
  __DEBUG_INFO_ENABLED__: false,
};
