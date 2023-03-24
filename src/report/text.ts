import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IVulnerability, SeverityType } from '../types/npm-audit';
import { ReportFunction } from './report';
import { red, yellow, gray, green, Chalk } from 'chalk';

const severityColor: Record<SeverityType, Chalk> = {
  info: gray,
  low: green,
  moderate: yellow,
  high: yellow,
  critical: red,
};

export const report: ReportFunction = async (
  args: ArgumentResult,
  options: AuditOptions,
  vulnerabilities: IVulnerability[]
): Promise<void> => {
  if (vulnerabilities.length === 0) {
    console.log('No vulnerability is found.');
    return;
  }
  console.error('The following vulnerablitities are found:');
  vulnerabilities.forEach((vulnerability) => {
    const text = `${yellow(vulnerability.name)} Severity: ${severityColor[
      vulnerability.severity
    ](vulnerability.severity)}
${vulnerability.nodes.map((node) => `@${green(node)}`).join('\n')}
${vulnerability.fixAvailable ? 'fixable' : 'not fixable'}${
      vulnerability.via.filter((via) => typeof via !== 'string').length > 0
        ? red(' probable root cause')
        : ''
    }`;
    console.error(text.replace(new RegExp('\n', 'g'), '\n\t'));
  });
  process.exitCode = 1;
};
