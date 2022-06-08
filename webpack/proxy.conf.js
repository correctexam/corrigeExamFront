function setupProxy({ tls }) {
  const conf = [
    {
      context: ['/api', '/services', '/management', 'swagger-ui', '/v3/api-docs', '/h2-console', '/auth', '/health'],
      target: `http${tls ? 's' : ''}://127.0.0.1:8080`,
      secure: false,
      changeOrigin: tls,
    },
  ];
  return conf;
}

module.exports = setupProxy;
