import * as semver from 'semver';
import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IAudit, IVulnerability, SeverityType } from '../types/npm-audit';

function removeByWhitelist(
  vulnerabilities: IVulnerability[],
  whitelist: Record<string, string>,
  quiet: boolean
) {
  const validSemverWhiteList: Record<string, string> = Object.entries(
    whitelist
  ).reduce((acc, [module, whitelistedVersion]) => {
    const valid = semver.validRange(whitelistedVersion);
    if (!valid) {
      console.error(
        `Whitelisted version \`${whitelistedVersion}\` for module \`${module}\` is not a valid semver. This will be skipped.`
      );
      return acc;
    }
    return { ...acc, [module]: whitelistedVersion };
  }, {});
  vulnerabilities = vulnerabilities.map((vulnerability) => {
    const module = vulnerability.name;
    if (!(module in validSemverWhiteList)) {
      return vulnerability;
    }
    return {
      ...vulnerability,
      via: vulnerability.via.filter(
        (via) => !semver.intersects(via.range, validSemverWhiteList[module])
      ),
    };
  });
  vulnerabilities = vulnerabilities.filter((vulnerability) => {
    if (vulnerability.via.length !== 0) {
      return true;
    }
    if (!quiet) {
      console.log(
        `Ignoring ${vulnerability.name} as all findings are whitelisted.`
      );
    }
    return false;
  });
  return vulnerabilities;
}

function compareSeverity(
  severity: SeverityType,
  severity1: 'low' | 'moderate' | 'high' | 'critical'
) {
  const severityMap = {
    info: 0,
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4,
  };
  return severityMap[severity] - severityMap[severity1];
}

function removeBySeverity(
  vulnerabilities: IVulnerability[],
  severity: 'low' | 'moderate' | 'high' | 'critical'
) {
  return vulnerabilities.filter((vulnerability) => {
    return compareSeverity(vulnerability.severity, severity) >= 0;
  });
}

export const parse = async (
  result: IAudit,
  args: ArgumentResult,
  config: AuditOptions
): Promise<IVulnerability[]> => {
  let vulnerabilities = Object.values(result.vulnerabilities);
  vulnerabilities = removeBySeverity(vulnerabilities, config.severity);
  if (config.whitelist !== undefined) {
    vulnerabilities = removeByWhitelist(
      vulnerabilities,
      config.whitelist,
      args.quiet
    );
  }
  return vulnerabilities;
};
