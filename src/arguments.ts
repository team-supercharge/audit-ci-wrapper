import { ArgumentParser } from 'argparse';
import { readFileSync } from 'node:fs';

const version = JSON.parse(
  readFileSync(`${__dirname}/../package.json`).toString()
).version;

export interface ArgumentResult {
  config: string | undefined;
  generate_config: boolean;
  quiet: boolean;
  install: boolean;
}

const parser = new ArgumentParser({
  description: 'Audit wrapper application for npm.',
});

parser.add_argument('-c', '--config', {
  help: 'The config json file for auditing.',
});
parser.add_argument('-gc', '--generate-config', {
  help: 'Generates config file.',
  action: 'store_true',
});
parser.add_argument('-i', '--install', {
  help: 'Generates config file and add script to package.json.',
  action: 'store_true',
});
parser.add_argument('-q', '--quiet', {
  help: 'Turns off verbose logging.',
  action: 'store_true',
});
parser.add_argument('-v', '--version', { action: 'version', version } as Record<
  string,
  unknown
>);

export const parseArgs = (): ArgumentResult => parser.parse_args();
