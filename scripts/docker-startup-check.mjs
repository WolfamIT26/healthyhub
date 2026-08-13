const webPort = requiredPort('WEB_PORT');
const apiPort = requiredPort('API_PORT');
const phpMyAdminPort = process.env.PHPMYADMIN_PORT ?? '8080';

function requiredPort(name) {
  const value = process.env[name];
  const parsed = Number(value);
  if (!value || !Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`${name} phải được cấu hình bằng port hợp lệ.`);
  }
  return value;
}

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
