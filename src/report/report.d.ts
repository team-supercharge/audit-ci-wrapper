import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IAdvisory } from '../types/npm-audit';

export type ReportFunction = (
  args: ArgumentResult,
  options: AuditOptions,
  advisories: IAdvisory[]
) => Promise<void>;
