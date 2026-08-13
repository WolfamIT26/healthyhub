import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig(({ command, mode }) => {
  const fileEnvironment = loadEnv(mode, workspaceRoot, 'WEB_');
  const webPort =
    command === 'serve'
      ? parseRequiredPort(process.env.WEB_PORT ?? fileEnvironment.WEB_PORT, 'WEB_PORT')
      : undefined;

  return {
    envDir: workspaceRoot,
    plugins: [react()],
    resolve: {
      alias: {
        '@healthyhub/shared-utils': fileURLToPath(
          new URL('../../packages/shared-utils/src/index.ts', import.meta.url),
        ),
      },
    },
    server: {
      host: '0.0.0.0',
      port: webPort,
      strictPort: true,
    },
    preview: {
      host: '0.0.0.0',
      port: webPort,
      strictPort: true,
    },
  };
});

function parseRequiredPort(value: string | undefined, name: string): number {
  if (!value) {
    throw new Error(`${name} là biến môi trường bắt buộc khi chạy Vite server.`);
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`${name} phải là số nguyên dương và nhỏ hơn hoặc bằng 65535.`);
  }
  return parsed;
}
