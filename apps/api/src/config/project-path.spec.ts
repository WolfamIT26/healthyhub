import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  resolveEnvironmentFilePaths,
  resolveProjectFile,
  resolveProjectRoot,
} from './project-path';

describe('project path resolution', () => {
  it('finds the workspace root from an npm workspace directory', () => {
    const projectRoot = resolveProjectRoot();

    expect(resolveProjectRoot(join(projectRoot, 'apps', 'api'))).toBe(projectRoot);
    expect(resolveProjectFile('package.json', join(projectRoot, 'apps', 'api'))).toBe(
      join(projectRoot, 'package.json'),
    );
  });

  it('resolves environment files from the workspace root', () => {
    const projectRoot = resolveProjectRoot();

    expect(resolveEnvironmentFilePaths('development', join(projectRoot, 'apps', 'api'))).toEqual([
      join(projectRoot, '.env.development'),
      join(projectRoot, '.env'),
    ]);
  });
});
