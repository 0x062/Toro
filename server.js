// server.js
const { Server } = require('proxy-chain');

// Ganti sesuai keinginan
const ALLOWED_USER = 'myuser';
const ALLOWED_PASS = 'mypassword';

const server = new Server({
  port: 8000,
  prepareRequestFunction: ({ username, password }) => {
    // Autentikasi client
    if (username !== ALLOWED_USER || password !== ALLOWED_PASS) {
      return { requestAuthentication: true };
    }
    // Generate SOCKS cred acak untuk isolasi Tor
    const rand = () => Math.random().toString(36).slice(2,10);
    const su = rand(), sp = rand();
    return {
      upstreamProxyUrl: `socks5h://${su}:${sp}@127.0.0.1:9050`
    };
  }
});

server.listen(() => {
  console.log('🔀 Rotating proxy berjalan di port 8000');
});
