import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IVulnerability } from '../types/npm-audit';
import { report as textReport } from './text';
import { report as jsonReport } from './json';

export const report = async (
  args: ArgumentResult,
  options: AuditOptions,
  advisories: IVulnerability[]
): Promise<void> => {
  switch (options.reportType) {
    case 'text':
      await textReport(args, options, advisories);
      return;
    case 'json':
      await jsonReport(args, options, advisories);
      return;
    default:
      console.error('Unknown report type.');
      process.exitCode = 1;
      return;
  }
};
