import { spawn } from 'node:child_process';
const children = [
  spawn(process.execPath, ['server/index.mjs'], { stdio: 'inherit', env: process.env }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', env: process.env }),
];
let shuttingDown = false;
function stop(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
for (const child of children) {
  child.on('error', () => stop(1));
  child.on('exit', code => stop(code || 0));
}
