function setupProxy({ tls }) {
  return [
    {
      context: ['/api', '/services', '/management', 'swagger-ui', '/v3/api-docs', '/h2-console', '/auth', '/health'],
      target: `http${tls ? 's' : ''}://127.0.0.1:8082`,
      secure: false,
      changeOrigin: tls,
    },
    {
      // Proxy configuration for onnxruntime-web WASM files
      context: ['/onnxruntime-web'],
      target: `http://127.0.0.1:8080`, // Adjust to match your local development server
      secure: false,
      pathRewrite: {
        '^/onnxruntime-web': '/node_modules/onnxruntime-web/dist/',
      },
    },
  ];
}

module.exports = setupProxy;
