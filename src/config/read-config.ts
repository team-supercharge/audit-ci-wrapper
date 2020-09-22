import * as fs from 'fs';
import { promisify } from 'util';
import { AuditOptions, defaultOptions } from './default-config';
import { ArgumentResult } from '../arguments';

export const readConfig = async (
  args: ArgumentResult
): Promise<AuditOptions> => {
  const readFileAsync = promisify(fs.readFile);
  let options = {
    ...defaultOptions,
  };
  if (args.config) {
    if (!args.quiet) {
      console.log('Reading config file.');
    }
    const text = await readFileAsync(args.config);
    const json = JSON.parse(text.toString());
    options = {
      ...options,
      ...json,
    };
  } else if (!args.quiet) {
    console.log('No config file is provided.');
  }
  return options;
};
