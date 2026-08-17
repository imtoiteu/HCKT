/* Static server for the HC-KT 2026 quiz app. Zero dependencies. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, 'public');
const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.webmanifest']);

const server = http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }

  if (urlPath === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok'); return; }
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  // resolve safely inside ROOT
  const file = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      // SPA fallback
      return send(path.join(ROOT, 'index.html'), 200);
    }
    send(file, 200, st);
  });

  function send(f, code, st) {
    const ext = path.extname(f).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=604800',
    };
    if (st) headers['Last-Modified'] = st.mtime.toUTCString();

    const accepts = (req.headers['accept-encoding'] || '');
    const gz = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(accepts);
    if (req.method === 'HEAD') { res.writeHead(code, headers).end(); return; }
    if (gz) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      res.writeHead(code, headers);
      fs.createReadStream(f).pipe(zlib.createGzip({ level: 6 })).pipe(res);
    } else {
      if (st) headers['Content-Length'] = st.size;
      res.writeHead(code, headers);
      fs.createReadStream(f).pipe(res);
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`HC-KT quiz app serving ${ROOT} on http://${HOST}:${PORT}`);
});
