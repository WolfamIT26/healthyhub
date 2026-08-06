import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const openApiPath = 'openapi/openapi.yaml';
const openApi = readFileSync(openApiPath, 'utf8');
const operationIds = [...openApi.matchAll(/^ {6}operationId: "([^"]+)"$/gm)].map(
  (match) => match[1],
);
const duplicateOperationIds = operationIds.filter(
  (id, index) => operationIds.indexOf(id) !== index,
);
const specRows = countSpecRows('.spec/api/domains');

assert(
  operationIds.length === specRows,
  `OpenAPI operation count ${operationIds.length} != spec rows ${specRows}`,
);
assert(
  duplicateOperationIds.length === 0,
  `Duplicate operationId: ${[...new Set(duplicateOperationIds)].join(', ')}`,
);
assertRefsExist('openapi');

console.log(
  JSON.stringify({
    status: 'ok',
    operationCount: operationIds.length,
    uniqueOperationIds: new Set(operationIds).size,
    specRows,
  }),
);

function countSpecRows(dir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .reduce((total, file) => {
      const content = readFileSync(join(dir, file), 'utf8');
      return total + [...content.matchAll(/^\|\s*(GET|POST|PATCH|DELETE)\s*\|/gm)].length;
    }, 0);
}

function assertRefsExist(rootDir) {
  const files = walkYaml(rootDir);

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(/\$ref:\s*["']([^"']+)["']/g)) {
      const [targetRaw, pointerRaw = ''] = match[1].split('#');
      const targetFile = targetRaw ? normalize(join(dirname(file), targetRaw)) : normalize(file);
      assert(existsSync(targetFile), `${file} references missing file ${targetFile}`);

      if (!pointerRaw) continue;

      const targetContent = readFileSync(targetFile, 'utf8');
      const key = pointerRaw.replace(/^\//, '').split('/')[0];
      if (key !== 'components') {
        assert(
          new RegExp(`^${escapeRegExp(key)}:`, 'm').test(targetContent),
          `${file} references missing key ${key}`,
        );
      }
    }
  }
}

function walkYaml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = join(dir, entry.name);
    if (entry.isDirectory()) return walkYaml(target);
    return entry.name.endsWith('.yaml') || entry.name.endsWith('.yml') ? [target] : [];
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
