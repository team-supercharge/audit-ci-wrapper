import { checkLockFile } from './lock';
import { checkNPMVersion } from './npm';

export const precheckAll = async (): Promise<void> => {
  await checkLockFile();
  await checkNPMVersion();
};
