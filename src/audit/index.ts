import * as childProcess from 'child_process';
import { AuditOptions } from '../config';
import { IAudit } from '../types/npm-audit';
import { ArgumentResult } from '../arguments';

export const runAudit = (
  args: ArgumentResult,
  options: AuditOptions
): Promise<IAudit> => {
  return new Promise((resolve, reject) => {
    let stderr = '';
    let stdout = '';

    const command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
    const command_args = ['audit', '--json', '--loglevel=error'];

    if (options.severity) {
      command_args.push(`--audit-level=${options.severity}`);
    }
    if (options.ignoreDevelopmentDependencies) {
      command_args.push('--only=prod');
    }

    if (options.npmExtraParams) {
      command_args.push(...options.npmExtraParams);
    }

    const audit_proc = childProcess.spawn(command, command_args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    });

    audit_proc.stdout.on('data', (data) => {
      const holder = stdout;
      stdout = holder.concat(data);
    });

    audit_proc.stderr.on('data', (data) => {
      const holder = stderr;
      stderr = holder.concat(data);
    });

    audit_proc.on('close', (exit_code) => {
      if (exit_code !== 0 && !args.quiet) {
        console.error(`npm audit exited with code ${exit_code}.`);
      }
      if (
        stderr.length > 0 &&
        stderr !==
          'Debugger attached.\nWaiting for the debugger to disconnect...\n'
      ) {
        reject(stderr);
        return;
      }
      const auditData: IAudit = JSON.parse(stdout);
      if (!!auditData.error) {
        reject(auditData.error);
        return;
      }
      resolve(auditData);
    });
  });
};
