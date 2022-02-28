require('dotenv').config();

const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();

app.use(
  createProxyMiddleware('/api/', {
    target: process.env.PROXY_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  })
);

app.use(express.static('./www'));

app.get('/*', function (req, res) {
  res.sendFile('index.html', { root: 'www' });
});

app.listen(process.env.PORT || 8080);

console.log(`Running on port ${process.env.PORT || 8080}`);
