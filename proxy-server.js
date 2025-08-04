const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { SocksProxyAgent } = require('socks-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3000;

const targetHost = 'https://live.dinesh29.com';

const proxyAgent = new SocksProxyAgent('socks5h://@bdiix_bypass:@bdiix_bypass@circle.bypassempire.com:1080');

app.use('/stream/jiotv/:channel/:playlist', (req, res, next) => {
  const { channel, playlist } = req.params;
  const targetUrl = `${targetHost}/stream/jiotv/${channel}/${playlist}`;

  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: false,
    agent: proxyAgent,
    pathRewrite: () => '',
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Origin', 'https://live.dinesh29.com');
      proxyReq.setHeader('User-Agent', 'RANAPK');
    },
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`🔥 Proxy running on http://localhost:${PORT}`);
});
