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
  let lastIgnoredModulesLength = -1;
  while (
    lastIgnoredModulesLength !== Object.keys(validSemverWhiteList).length
  ) {
    lastIgnoredModulesLength = Object.keys(validSemverWhiteList).length;
    vulnerabilities = vulnerabilities.map((vulnerability) => {
      return {
        ...vulnerability,
        via: vulnerability.via.filter((via) => {
          if (typeof via === 'string') {
            return !(via in validSemverWhiteList);
          }
          if (!(via.name in validSemverWhiteList)) {
            return true;
          }
          return semver.intersects(via.range, validSemverWhiteList[via.name]);
        }),
      };
    });
    for (const vulnerability of vulnerabilities.filter(
      (v) => v.via.length === 0
    )) {
      validSemverWhiteList[vulnerability.name] = vulnerability.range;
      if (!quiet) {
        console.log(
          `Ignoring ${vulnerability.name} as all findings are whitelisted.`
        );
      }
    }
    vulnerabilities = vulnerabilities.filter(
      (vulnerability) => vulnerability.via.length !== 0
    );
  }
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
