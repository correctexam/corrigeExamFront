module.exports = {
  I18N_HASH: 'generated_hash',
  FRONT_URL: process.env.hasOwnProperty('FRONT_URL') ? process.env.FRONT_URL : '/',
  SERVER_API_URL: process.env.hasOwnProperty('SERVER_API_URL') ? process.env.SERVER_API_URL : '/',
  // local, shib or cas
  __CONNECTION_METHOD__: process.env.hasOwnProperty('CONNECTION_METHOD') ? process.env.CONNECTION_METHOD : 'local',
  __CAS_SERVER_URL__: process.env.hasOwnProperty('CAS_SERVER_URL') ? process.env.CAS_SERVER_URL : 'https://cas-server.com',
  __SERVICE_URL__: process.env.hasOwnProperty('SERVICE_URL') ? process.env.SERVICE_URL : 'https://correct-exam.com',
  __VERSION__: process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : '1.6.0',
  __DEBUG_INFO_ENABLED__: false,
};
