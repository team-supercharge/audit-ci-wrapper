import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IVulnerability } from '../types/npm-audit';

export type ReportFunction = (
  args: ArgumentResult,
  options: AuditOptions,
  advisories: IVulnerability[]
) => Promise<void>;
