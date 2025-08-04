const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { SocksProxyAgent } = require('socks-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3000;

// Final base
const proxyHost = 'https://live.dinesh29.com.np';

const proxyAgent = new SocksProxyAgent(
  'socks5h://@bdiix_bypass:@bdiix_bypass@circle.bypassempire.com:1080'
);

// 🎯 Match: /jiotv/:id/stream_0.m3u8
app.use('/jiotv/:id/stream_0.m3u8', (req, res, next) => {
  const { id } = req.params;

  const target = `${proxyHost}/stream/jiotv/${id}/stream_0.m3u8`;

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    agent: proxyAgent,
    selfHandleResponse: false,
    pathRewrite: () => '', // no rewrite needed
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Origin', proxyHost);
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    },
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`✅ Proxy live: http://localhost:${PORT}/jiotv/{id}/stream_0.m3u8`);
});
