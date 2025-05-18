const ProxyChain = require('proxy-chain');

// == Configuration: set your proxy credentials here ==
const VALID_CREDENTIALS = {
  username: 'bangkit',  // <-- set your desired username
  password: 'santai'    // <-- set your desired password
};

// Create the rotating proxy server
const server = new ProxyChain.Server({
  port: 8000,
  hostname: '0.0.0.0', // listen on all network interfaces

  // Called for each incoming client connection
  prepareRequestFunction: async ({ request, username, password, connectionId }) => {
    console.log(`[${new Date().toISOString()}] [CONNECT ${connectionId}] URL: ${request.url}`);

    // Authenticate the client
    if (username !== VALID_CREDENTIALS.username || password !== VALID_CREDENTIALS.password) {
      console.warn(`[${new Date().toISOString()}] [AUTH FAIL ${connectionId}] User='${username}'`);
      // Ask client for auth
      return { requestAuthentication: true };
    }

    console.log(`[${new Date().toISOString()}] [AUTH OK ${connectionId}] Forwarding via Tor SOCKS5`);
    // Forward through Tor SOCKS5 using socks5h to ensure DNS over Tor
    return {
      upstreamProxyUrl: 'socks5h://127.0.0.1:9050'
    };
  }
});

// Event: when a request is fully processed
server.on('request', (ctx) => {
  console.log(`[${new Date().toISOString()}] [PROCESSED ${ctx.connectionId}] ${ctx.request.method} ${ctx.request.url}`);
});

// Event: on error
server.on('error', (err) => {
  console.error(`[${new Date().toISOString()}] [ERROR]`, err);
});

// Event: on client error (e.g., connection reset)
server.on('clientError', ({ connectionId, error }) => {
  console.error(`[${new Date().toISOString()}] [CLIENT ERROR ${connectionId}]`, error.message);
});

// **New Event: on request failure upstream**
server.on('requestFailed', ({ connectionId, error }) => {
  console.error(`[${new Date().toISOString()}] [REQUEST FAILED ${connectionId}]`, error);
});

// Start the server
server.listen(() => {
  console.log(`[${new Date().toISOString()}] Rotating proxy listening on port 8000`);
});
