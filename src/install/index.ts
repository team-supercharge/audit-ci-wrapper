import { readFile, access, writeFile } from 'fs';
import { promisify } from 'util';
import { ArgumentResult } from '../arguments';
import { generateConfig } from '../config';

const accessAsync = promisify(access);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export const install = async (args: ArgumentResult): Promise<void> => {
  const packageJson = './package.json';
  try {
    await accessAsync(packageJson);
  } catch {
    console.log();
    return;
  }
  const json = JSON.parse((await readFileAsync(packageJson)).toString());
  json.scripts.audit =
    'npx @team-supercharge/audit-ci-wrapper --config auditconfig.json';
  await writeFileAsync(packageJson, JSON.stringify(json, undefined, 2));
  generateConfig(args);
  console.log(
    'Run `npm install --save-dev @team-supercharge/audit-ci-wrapper` to finish.'
  );
};
