function setupProxy({ tls }) {
  return [
    {
      context: ['/api', '/services', '/management', 'swagger-ui', '/v3/api-docs', '/h2-console', '/auth', '/health'],
      target: `http${tls ? 's' : ''}://127.0.0.1:8080`,
      secure: false,
      changeOrigin: tls,
    },
  ];
}

module.exports = setupProxy;
