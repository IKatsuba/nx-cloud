import { readJson, runNxCommandAsync } from '@nrwl/nx-plugin/testing';
import { addPackageToPackageJson, createWorkspace } from './utils';

describe('api e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(async () => {
    createWorkspace();
    addPackageToPackageJson('@nrwl/nx-cloud');
    // const project = uniq('app');
    // await runNxCommandAsync(`generate @nrwl/node:application ${project}`);
  }, 120000);

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should configure Nx Cloud', async () => {
    await runNxCommandAsync(`generate @nrwl/nx-cloud:init`, {
      env: {
        ...process.env,
        NX_CLOUD_API: 'http://localhost:3333/',
      },
      silenceError: false,
    });

    const nxJson = readJson('nx.json');

    expect(nxJson.tasksRunnerOptions).toEqual({
      default: {
        runner: '@nrwl/nx-cloud',
        options: {
          cacheableOperations: ['build', 'lint', 'test', 'e2e'],
          accessToken: expect.any(String),
          url: 'http://localhost:3333/',
        },
      },
    });
  });
});
