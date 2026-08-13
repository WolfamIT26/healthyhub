import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export function resolveProjectRoot(startDirectory = process.cwd()): string {
  let currentDirectory = resolve(startDirectory);

  while (true) {
    if (
      existsSync(join(currentDirectory, 'package.json')) &&
      existsSync(join(currentDirectory, 'apps', 'api', 'package.json'))
    ) {
      return currentDirectory;
    }

    const parentDirectory = dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      throw new Error(`Không tìm thấy HealthyHub workspace từ ${startDirectory}.`);
    }
    currentDirectory = parentDirectory;
  }
}

export function resolveProjectFile(
  relativePath: string,
  startDirectory = process.cwd(),
): string | null {
  const candidate = join(resolveProjectRoot(startDirectory), relativePath);
  return existsSync(candidate) ? candidate : null;
}

export function resolveEnvironmentFilePaths(
  environment: string,
  startDirectory = process.cwd(),
): string[] {
  const projectRoot = resolveProjectRoot(startDirectory);
  return [join(projectRoot, `.env.${environment}`), join(projectRoot, '.env')];
}
