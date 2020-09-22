import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IAdvisory } from '../types/npm-audit';
import { ReportFunction } from './report';
import { red, yellow, gray, green, Chalk } from 'chalk';

const severityColor: Record<'low' | 'moderate' | 'high' | 'critical', Chalk> = {
  low: gray,
  moderate: yellow,
  high: yellow,
  critical: red,
};

export const report: ReportFunction = async (
  args: ArgumentResult,
  options: AuditOptions,
  advisories: IAdvisory[]
): Promise<void> => {
  if (advisories.length === 0) {
    console.log('No vulnerability is found.');
    return;
  }
  console.error('The following vulnerablitities are found:');
  advisories.forEach((advisory) => {
    const text = `${yellow(advisory.module_name)} Severity: ${severityColor[
      advisory.severity
    ](advisory.severity)}
${advisory.url}
${advisory.findings
  .map(
    (finding) =>
      `@${green(finding.version)}
${finding.dev ? 'devDep' : 'prodDep'}
\t${finding.paths
        .join('\n\t')
        .replace(
          new RegExp(advisory.module_name, 'g'),
          red(advisory.module_name)
        )}`
  )
  .join('\n')}`;
    console.error(text.replace(new RegExp('\n', 'g'), '\n\t'));
  });
  process.exitCode = 1;
};
