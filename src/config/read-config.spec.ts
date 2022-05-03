import * as fs from 'node:fs';
import { AuditOptions, defaultOptions } from './default-config';
import { readConfig } from './read-config';

let options: AuditOptions;

jest.mock('node:fs');

describe('Read config file', () => {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    options = defaultOptions;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    spy = fs.readFile.mockImplementation(
      (
        path: string | number | Buffer | URL,
        callback: (err: NodeJS.ErrnoException | null, data: Buffer) => void
      ) => {
        if (path === 'aconfig.json') {
          return callback(null, Buffer.from(JSON.stringify(options)));
        }
        return callback(
          {
            message: `ENOENT: no such file or directory, open '${path}'`,
            name: 'Error',
            code: 'ENOENT',
            errno: -2,
            syscall: 'open',
            path: path.toString(),
          },
          Buffer.from('')
        );
      }
    );
  });

  it('should return default if no config is given', async () => {
    const result = await readConfig({
      quiet: true,
      generate_config: false,
      config: undefined,
      install: false,
    });
    expect(result).toEqual(defaultOptions);
    expect(spy).not.toBeCalled();
  });

  it('should throw if file does not exist', async () => {
    await readConfig({
      quiet: true,
      generate_config: false,
      config: 'nonexistent.json',
      install: false,
    })
      .then(() => {
        throw new Error('Should go to .catch, not enter .then');
      })
      .catch((err) => {
        expect(err).toBeTruthy();
      });
  });

  it('should read if file exists', async () => {
    options.ignoreDevelopmentDependencies = true;
    const config = await readConfig({
      quiet: true,
      generate_config: false,
      config: 'aconfig.json',
      install: false,
    });
    expect(config.ignoreDevelopmentDependencies).toBe(true);
  });
});
