import { readJson, runNxCommandAsync, tmpProjPath } from '@nx/plugin/testing';
import { addPackageToPackageJson, createTestProject } from './utils';
import { rmSync } from 'fs';
import { getPackageManagerCommand } from 'nx/src/utils/package-manager';
import { execSync } from 'child_process';
import { uniq } from '@nx/plugin/src/utils/testing-utils/nx-project';

describe('api e2e', () => {
  beforeAll(async () => {
    createTestProject();

    addPackageToPackageJson('nx-cloud');
  }, 120000);

  afterAll(() => {
    // rmSync(tmpProjPath(), {
    //   recursive: true,
    //   force: true,
    // });
  });

  it('should configure Nx Cloud', async () => {
    execSync(`npx nx generate nx-cloud:init`, {
      env: {
        ...process.env,
        NX_CLOUD_API: 'http://localhost:3000/',
      },
      cwd: tmpProjPath(),
    });

    const nxJson = readJson('nx.json');

    expect(nxJson.tasksRunnerOptions).toEqual({
      default: {
        runner: 'nx-cloud',
        options: {
          cacheableOperations: ['build', 'lint', 'test', 'e2e'],
          accessToken: expect.any(String),
          url: 'http://localhost:3000/',
        },
      },
    });
  });

  it('should get build results from Nx Cloud', async () => {
    await runNxCommandAsync(`g nx-cloud:init`, {
      env: {
        ...process.env,
        NX_CLOUD_API: 'http://localhost:3000/',
      },
    });

    const libName = uniq('lib');

    await runNxCommandAsync(`g @nx/js:library ${libName} --buildable`);

    await runNxCommandAsync(`build ${libName}`);

    rmSync(tmpProjPath('node_modules/.cache'), {
      recursive: true,
      force: true,
    });

    const result = await runNxCommandAsync(`build ${libName}`);

    expect(result.stdout).toContain('[remote cache]');
  }, 120000);
});
