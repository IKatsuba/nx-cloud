import { readJson, runNxCommandAsync, tmpProjPath } from '@nx/plugin/testing';
import { addPackageToPackageJson, createTestProject } from './utils';
import { rmSync } from 'fs';
import { uniq } from '@nx/plugin/src/utils/testing-utils/nx-project';

describe('api e2e', () => {
  beforeAll(async () => {
    createTestProject();

    addPackageToPackageJson('nx-cloud@16.4.0');

    await runNxCommandAsync(`g nx-cloud:init`, {
      env: {
        ...process.env,
        NX_CLOUD_API: 'http://localhost:3000/',
      },
    });
  }, 120000);

  afterAll(() => {
    rmSync(tmpProjPath(), {
      recursive: true,
      force: true,
    });
  });

  it('should configure Nx Cloud', async () => {
    const nxJson = readJson('nx.json');

    expect(nxJson.tasksRunnerOptions).toEqual({
      default: {
        runner: 'nx-cloud',
        options: {
          accessToken: expect.any(String),
          url: 'http://localhost:3000/',
        },
      },
    });
  });

  it('should get build results from Nx Cloud', async () => {
    const libName = uniq('lib');

    await runNxCommandAsync(
      `g @nx/js:library ${libName}  --bundler=tsc --no-interactive`
    );

    await runNxCommandAsync(`build ${libName}`, {
      env: {
        ...process.env,
        NX_DAEMON: 'false',
      },
    });

    rmSync(tmpProjPath('.nx'), {
      recursive: true,
      force: true,
    });

    const result = await runNxCommandAsync(`build ${libName}`);

    expect(result.stdout).toContain('[remote cache]');
  }, 120000);
});
