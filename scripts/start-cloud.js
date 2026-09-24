const { spawn } = require('child_process');
const { Resolver } = require('dns').promises;
const net = require('net');
const path = require('path');

const PORT = 8081;
const cloudflared = path.join(process.env.LOCALAPPDATA, 'cloudflared', 'cloudflared.exe');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port);
  });

const waitForDns = async (hostname) => {
  const resolver = new Resolver();
  resolver.setServers(['1.1.1.1', '8.8.8.8']);

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const addresses = await resolver.resolve4(hostname);
      if (addresses.length > 0) return true;
    } catch {}
    await sleep(1000);
  }

  return false;
};

const main = async () => {
  if (!(await isPortFree(PORT))) {
    console.error(`${PORT}-port band. Boshqa terminalda Metro ishlab turibdi, avval uni yoping.`);
    process.exit(1);
  }

  const tunnel = spawn(cloudflared, ['tunnel', '--no-autoupdate', '--url', `http://localhost:${PORT}`]);
  let expo = null;
  let url = null;

  const stopAll = () => {
    tunnel.kill();
    if (expo) expo.kill();
    process.exit(0);
  };

  process.on('SIGINT', stopAll);
  process.on('SIGTERM', stopAll);

  const timeout = setTimeout(() => {
    console.error('Tunnel ochilmadi. Internet ulanishini tekshiring.');
    stopAll();
  }, 60_000);

  tunnel.on('exit', (code) => {
    if (!expo) {
      console.error(`cloudflared to'xtadi (kod ${code}).`);
      process.exit(1);
    }
  });

  tunnel.stderr.on('data', async (chunk) => {
    if (url) return;
    const match = chunk.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (!match) return;

    clearTimeout(timeout);
    url = match[0];

    console.log('Tunnel ochildi, manzil internetga tarqalishini kutyapmiz...');
    const resolved = await waitForDns(new URL(url).hostname);
    if (!resolved) {
      console.error('Tunnel manzili DNS da paydo bo\'lmadi. Qayta ishga tushiring.');
      stopAll();
      return;
    }
    await sleep(5000);

    console.log('');
    console.log('Tunnel tayyor:', url);
    console.log('Telefonda CEFR Mock -> Scan QR Code, yoki shu manzilni kiritib Connect');
    console.log('');

    expo = spawn('npx', ['expo', 'start', '--dev-client', '--port', String(PORT)], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, EXPO_PACKAGER_PROXY_URL: url },
    });

    expo.on('exit', stopAll);
  });
};

main();
