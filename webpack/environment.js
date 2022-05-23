module.exports = {
  I18N_HASH: 'generated_hash',
  FRONT_URLDEV: 'http://localhost:9000/',
  FRONT_URLPROD: 'https://olivier.barais.fr/corrigeExamFront/',
  SERVER_API_URLPROD: 'https://api.gradescope.barais.fr/',
  SERVER_API_URLDEV: 'http://localhost:9000/',
  __VERSION__: process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : 'DEV',
  __DEBUG_INFO_ENABLED__: false,
};
