export interface Dependency {
  version: string;
  integrity: string;
  resolved: string;
  bundled: boolean;
  dev: boolean;
  optional: boolean;
  requires: boolean;
  dependencies: Record<string, Dependency>;
}

export interface PackageLock extends Dependency {
  name: string;
  version: string;
  lockfileVersion: number;
  packageIntegrity?: string;
  preserveSymlinks?: boolean;
  requires: boolean;
}
