import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
for (const path of ['privacy', 'terms', 'cookies', 'unsubscribe']) {
  mkdirSync(`dist/${path}`, { recursive: true });
  copyFileSync('dist/index.html', `dist/${path}/index.html`);
}
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
