import { parseArgs } from './arguments';

describe('Arguments parser', () => {
  let args: string[];
  beforeEach(() => {
    args = process.argv;
  });

  it('should not generate config by default', () => {
    process.argv = [];
    const result = parseArgs();
    expect(result.generate_config).toBeFalsy();
    expect(result.generate_config).not.toBeUndefined();
  });
  it('should generate config if added', () => {
    process.argv = ['npx', 'audit', '-gc'];
    const result = parseArgs();
    expect(result.generate_config).toBeTruthy();
  });
  it('should not read config', () => {
    process.argv = [];
    const result = parseArgs();
    expect(result.config).toBeUndefined();
  });
  it('should read config if added', () => {
    process.argv = ['npx', 'audit', '-c', 'auditconfig.json'];
    const result = parseArgs();
    expect(result.config).toBe('auditconfig.json');
  });
  it('should show version and exit', () => {
    process.argv = ['npx', 'audit', 'version'];
    const mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((): never => {
        throw new Error();
      });
    expect(parseArgs).toThrow();
    expect(mockExit).toHaveBeenCalled();
  });

  afterEach(() => {
    process.argv = args;
  });
});
