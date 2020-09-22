import { access } from 'fs';
import { promisify } from 'util';

export const checkLockFile = async (): Promise<void> => {
  try {
    await promisify(access)('package-lock.json');
  } catch (err) {
    console.error('Cannot read package-lock.json in this folder. Run `npm i`.');
    process.exit(1);
  }
};
