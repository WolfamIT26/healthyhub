import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ignoredDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'logs',
  'storage',
]);
const ignoredFiles = new Set(['package-lock.json']);
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.yml', '.yaml', '.md']);
const patterns = [
  /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /(password|secret|token)\s*[:=]\s*["'][^"']{16,}["']/i,
];

const findings = [];

for (const file of walk('.')) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      findings.push(file);
      break;
    }
  }
}

if (findings.length > 0) {
  throw new Error(`Potential secret detected: ${[...new Set(findings)].join(', ')}`);
}

console.log(JSON.stringify({ status: 'ok', checked: 'source-files' }));

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const target = join(dir, name);
    if (ignoredFiles.has(name) || name.endsWith('.example')) return [];
    const stats = statSync(target);
    if (stats.isDirectory()) {
      return ignoredDirs.has(name) ? [] : walk(target);
    }

    const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
    return allowedExtensions.has(ext) ? [target] : [];
  });
}
