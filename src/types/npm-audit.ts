export enum SeverityType {
  INFO = 'info',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface IVulnerabilityVia {
  source: number;
  name: string;
  dependency: string;
  title: string;
  url: string;
  severity: SeverityType;
  range: string;
}
export interface IVulnerability {
  name: string;
  severity: SeverityType;
  isDirect: boolean;
  via: (IVulnerabilityVia | string)[];
  effects: string[];
  range: string;
  nodes: string[];
  fixAvailable: boolean;
}
export interface IVulnerabilities {
  info: number;
  low: number;
  moderate: number;
  high: number;
  critical: number;
}

export interface IDependencies {
  prod: number;
  dev: number;
  optional: number;
  peer: number;
  peerOptional: number;
  total: number;
}

export interface IMetadata {
  vulnerabilities: IVulnerabilities;
  dependencies: IDependencies;
}

export interface IAudit {
  auditReportVersion: 2;
  vulnerabilities: Record<string, IVulnerability>;
  metadata: IMetadata;
  error?: string;
}
