import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'README.md',
  'CAU_TRUC_THU_MUC.md',
  'docs/00-project-rules.md',
  'docs/01-folder-structure.md',
  'docs/implementation-foundation/README.md',
  'openapi/openapi.yaml',
  '.spec/api/README.md',
  '.spec/data-contracts/README.md',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing required document: ${file}`);
  }
}

const jsonFiles = ['package.json', 'workspace.json', 'build-workspace.json'];
for (const file of jsonFiles) {
  JSON.parse(readFileSync(file, 'utf8'));
}

console.log(JSON.stringify({ status: 'ok', checkedDocuments: requiredFiles.length }));
