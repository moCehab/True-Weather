import assert from 'node:assert/strict';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const base=(process.env.PAGES_BASE_PATH||'').replace(/\/$/,'');
const output=resolve('dist/pages');
const html=readFileSync(resolve(output,'index.html'),'utf8');
for(const [,url] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(/^https?:/.test(url))continue;
 assert(url.startsWith(`${base}/`),`Wrong base path: ${url}`);
 assert(existsSync(resolve(output,url.slice(base.length+1))),`Missing asset: ${url}`);
}
const js=readdirSync(resolve(output,'assets')).filter(f=>f.endsWith('.js')).map(f=>readFileSync(resolve(output,'assets',f),'utf8')).join('');
assert(js.includes('https://api.open-meteo.com/v1/forecast'));
assert(js.includes('https://geocoding-api.open-meteo.com/v1/search'));
assert(!js.includes('/api/weather')&&!js.includes('/api/places'),'Server-only API dependency in static build');
assert(!js.includes('process.env'),'Unresolved server environment reference');
assert(existsSync(resolve(output,'weather-sky.png')));
console.log(`GitHub Pages output verified for ${base||'/'}: entrypoint, assets and direct live-data requests.`);
