import { tmpProjPath } from '@nx/plugin/testing';
import { dirname, join, basename } from 'path';
import * as ch from 'child_process';
import { execSync } from 'child_process';
import { getPackageManagerCommand } from 'nx/src/utils/package-manager';
import { mkdirSync, rmSync } from 'fs';

export function createTestProject() {
  const projectName = basename(tmpProjPath());
  const projectDirectory = tmpProjPath();

  // Ensure projectDirectory is empty
  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  execSync(
    `npx --yes create-nx-workspace@latest ${projectName} --preset apps --no-nxCloud --no-interactive`,
    {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    }
  );
  console.log(`Created test project in "${projectDirectory}"`);
}

export function addPackageToPackageJson(packageName: string) {
  const packageManagerCommand = getPackageManagerCommand();
  ch.execSync(`${packageManagerCommand.addDev} ${packageName}`, {
    cwd: tmpProjPath(),
  });
}
