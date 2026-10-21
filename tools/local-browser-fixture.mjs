// Serve the real local files through Playwright routing, without network access.
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.ttf':'font/ttf','.pdf':'application/pdf','.mp4':'video/mp4'};
export async function useLocalFiles(page,root) {
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(!['127.0.0.1','study-garden.test'].includes(url.hostname)) return route.abort();
  const path=resolve(root,'.'+decodeURIComponent(url.pathname).replace(/\/$/,'/index.html'));
  if(!path.startsWith(resolve(root)+sep)) return route.abort();
  try {await route.fulfill({body:await readFile(path),contentType:types[extname(path)]||'application/octet-stream'});}
  catch {await route.fulfill({status:404,body:'Missing local asset'});}
 });
 return page;
}
