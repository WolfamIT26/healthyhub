const webPort = process.env.WEB_PORT ?? '3000';
const apiPort = process.env.API_PORT ?? '3001';
const phpMyAdminPort = process.env.PHPMYADMIN_PORT ?? '8080';

const checks = [
  ['web', `http://127.0.0.1:${webPort}`],
  ['api-live', `http://127.0.0.1:${apiPort}/api/v1/health/live`],
  ['api-ready', `http://127.0.0.1:${apiPort}/api/v1/health/ready`],
  ['phpmyadmin', `http://127.0.0.1:${phpMyAdminPort}`],
];

const results = await Promise.all(
  checks.map(async ([name, url]) => {
    try {
      const response = await fetch(url);
      return { name, url, ok: response.ok, status: response.status };
    } catch (error) {
      return {
        name,
        url,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }),
);

const failed = results.filter((result) => !result.ok);
console.log(JSON.stringify({ results }, null, 2));

if (failed.length > 0) {
  process.exit(1);
}
