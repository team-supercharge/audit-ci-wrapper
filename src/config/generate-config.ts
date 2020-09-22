import { writeFile } from 'fs';
import { promisify } from 'util';
import { ArgumentResult } from '../arguments';
import { defaultOptions } from './default-config';

const writeFileAsync = promisify(writeFile);

export const generateConfig = async (args: ArgumentResult): Promise<void> => {
  const fileName = './auditconfig.json';
  if (!args.quiet) {
    console.log(`Generating new config file to ${fileName}.`);
  }
  const optionsWithSchema = {
    $schema: './node_modules/audit-ci-wrapper/configschema.json',
    ...defaultOptions,
  };
  writeFileAsync(fileName, JSON.stringify(optionsWithSchema, undefined, 2));
};
