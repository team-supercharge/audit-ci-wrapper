import * as fs from 'fs';
import { promisify } from 'util';
import { ArgumentResult } from '../arguments';
import { PackageLock } from './package-lock';

export const readPackageLockJson = async (
  args: ArgumentResult
): Promise<PackageLock> => {
  const fileName = './package-lock.json';
  if (!args.quiet) {
    console.log(`Reading ${fileName} file.`);
  }
  const readFileAsync = promisify(fs.readFile);
  const text = await readFileAsync(fileName);
  return JSON.parse(text.toString());
};
