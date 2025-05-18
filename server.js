const ProxyChain = require('proxy-chain');

// Credentials for client authentication
type ClientCreds = { username: string; password: string };
const VALID_CREDENTIALS: ClientCreds = { username: 'lola', password: 'loli' };

// Create proxy server
const server = new ProxyChain.Server({
  port: 8000,
  hostname: '0.0.0.0', // listen on all interfaces

  // Called for each incoming client request
  prepareRequestFunction: async ({ request, username, password, connectionId }) => {
    console.log(`[${new Date().toISOString()}] Connection ${connectionId}: Incoming request for ${request.url}`);

    // Authenticate client
    if (username !== VALID_CREDENTIALS.username || password !== VALID_CREDENTIALS.password) {
      console.warn(`[${new Date().toISOString()}] Connection ${connectionId}: Authentication failed for user '${username}'`);
      return { requestAuthentication: true };
    }

    // On successful auth, route through Tor SOCKS5
    const upstreamProxyUrl = 'socks5://127.0.0.1:9050';
    console.log(`    Authenticated. Forwarding via ${upstreamProxyUrl}`);
    return { upstreamProxyUrl };
  },
});

// Event: when a proxy request is successfully established
server.on('request', (ctx) => {
  console.log(`[${new Date().toISOString()}] Processed request ${ctx.connectionId}: ${ctx.request.method} ${ctx.request.url}`);
});

// Event: when an error occurs in proxy processing
server.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] Proxy error:`, err);
});

// Start server
server.listen(() => {
  console.log(`[${new Date().toISOString()}] Rotating proxy listening on port 8000`);
});
