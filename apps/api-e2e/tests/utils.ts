import {
  cleanup,
  runPackageManagerInstall,
  tmpProjPath,
} from '@nrwl/nx-plugin/testing';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as ch from 'child_process';
import { getPackageManagerCommand } from 'nx/src/utils/package-manager';

export function createWorkspace() {
  fsExtra.ensureDirSync(tmpProjPath());

  cleanup();
  const localTmpDir = path.dirname(tmpProjPath());

  ch.execSync(
    `node ${require.resolve(
      'nx'
    )} new proj --nx-workspace-root=${localTmpDir} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty`,
    {
      cwd: localTmpDir,
    }
  );

  runPackageManagerInstall();
}

export function addPackageToPackageJson(packageName: string) {
  const packageManagerCommand = getPackageManagerCommand();

  ch.execSync(`${packageManagerCommand.addDev} ${packageName}`, {
    cwd: tmpProjPath(),
  });
}
