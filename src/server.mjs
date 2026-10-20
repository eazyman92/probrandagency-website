import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pageRoutes } from './build.mjs';

// Explicit local preview routes keep preparation documents and private references inaccessible.
const root = new URL('../', import.meta.url);
const routes = {
  '/styles.css': ['src/styles.css', 'text/css; charset=utf-8'],
  '/enhancements.css': ['src/enhancements.css', 'text/css; charset=utf-8'],
  '/app.js': ['src/app.js', 'text/javascript; charset=utf-8'],
  '/sketch.js': ['design/sketch/sketch.js', 'text/javascript; charset=utf-8'],
  '/images/logo.jpg': ['brand/logo/originals/probrand-agency-logo-original-v01.jpg', 'image/jpeg'],
  '/images/hero.png': ['assets/generated/hero/probrand-home-laptop-concept-v01.png', 'image/png'],
  '/images/founder.jpg': ['assets/reference/founder/aminata-jabateh-founder-reference-v01.jpg', 'image/jpeg'],
  '/images/book.jpg': ['assets/approved/books/why-most-nonprofits-dont-get-funded-cover-supplied-v01.jpg', 'image/jpeg']
};
for (const path of pageRoutes) routes[path] = [path === '/' ? 'public/index.html' : `public${path}/index.html`, 'text/html; charset=utf-8'];
const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
  const route = Object.hasOwn(routes, pathname) ? routes[pathname] : undefined;
  if (!route || !['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  try {
    const bytes = await readFile(fileURLToPath(new URL(route[0], root)));
    res.writeHead(200, {'Content-Type': route[1], 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow'});
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(500); res.end('Preview asset unavailable');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('ProBrand website preview: http://127.0.0.1:4173'));
