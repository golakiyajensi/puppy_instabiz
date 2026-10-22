import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const processes = [
  {
    name: 'api',
    args: ['--watch', 'server.js'],
    cwd: resolve(rootDir, 'server'),
  },
  {
    name: 'web',
    args: [resolve(rootDir, 'client', 'node_modules', 'vite', 'bin', 'vite.js')],
    cwd: resolve(rootDir, 'client'),
  },
];

const children = [];
let stopping = false;
let exitCode = 0;
let closedCount = 0;

function stop(code) {
  if (stopping) return;

  stopping = true;
  exitCode = code;

  for (const { child } of children) {
    if (child.pid && child.exitCode === null) {
      child.kill();
    }
  }
}

for (const processInfo of processes) {
  const child = spawn(process.execPath, processInfo.args, {
    cwd: processInfo.cwd,
    shell: false,
    stdio: 'inherit',
  });

  children.push({ child });

  child.on('error', (error) => {
    console.error(`[${processInfo.name}] Failed to start: ${error.message}`);
    stop(1);
  });

  child.on('close', (code) => {
    if (!stopping) {
      stop(code ?? 1);
    }

    closedCount += 1;
    if (closedCount === processes.length) {
      process.exitCode = exitCode;
    }
  });
}

process.on('SIGINT', () => stop(130));
process.on('SIGTERM', () => stop(143));
