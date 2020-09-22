export interface AuditOptions {
  whitelist?: Record<string, string> | undefined;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  ignoreDevelopmentDependencies: boolean;
  npmExtraParams?: string[] | undefined;
  reportType: string;
}

export const defaultOptions: AuditOptions = {
  severity: 'critical',
  ignoreDevelopmentDependencies: false,
  reportType: 'text',
};
