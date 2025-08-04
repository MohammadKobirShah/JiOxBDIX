const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { SocksProxyAgent } = require('socks-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Correct Upstream Base URL
const proxyHost = 'https://live.dinesh29.com.np/stream';

const proxyAgent = new SocksProxyAgent(
  'socks5h://@bdiix_bypass:@bdiix_bypass@circle.bypassempire.com:1080'
);

// ✅ Handle both /jiotv/... and /stream/jiotv/...
app.use(['/stream/jiotv/:channel/:playlist', '/jiotv/:channel/:playlist'], (req, res, next) => {
  const { channel, playlist } = req.params;

  const target = `${proxyHost}/${channel}/${playlist}`;

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    agent: proxyAgent,
    selfHandleResponse: false,
    pathRewrite: () => '',
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Origin', 'https://live.dinesh29.com.np');
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    },
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`🌀 SOCKS5 Reverse Proxy running at http://localhost:${PORT}`);
});
