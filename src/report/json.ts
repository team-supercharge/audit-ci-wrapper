import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IVulnerability } from '../types/npm-audit';
import { ReportFunction } from './report';

export const report: ReportFunction = async (
  args: ArgumentResult,
  options: AuditOptions,
  advisories: IVulnerability[]
): Promise<void> => {
  process.exitCode = advisories.length === 0 ? 0 : 1;
  console.log(JSON.stringify(advisories, undefined, 2));
};
