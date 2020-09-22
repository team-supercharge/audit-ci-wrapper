import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const get_npm_version = async (): Promise<number> => {
  const { stdout } = await execAsync('npm --version');
  const [major] = stdout.trim().split('.');
  const majorInt = parseInt(major);
  return majorInt;
};

export const checkNPMVersion = async (): Promise<void> => {
  if ((await get_npm_version()) < 6) {
    console.error('Update npm to version 6 at least. Run `npm i -g npm`.');
    process.exit(1);
  }
};
