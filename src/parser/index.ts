import * as semver from 'semver';
import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IAudit, IVulnerability } from '../types/npm-audit';

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

export const parse = async (
  result: IAudit,
  args: ArgumentResult,
  config: AuditOptions
): Promise<IVulnerability[]> => {
  let vulnerabilities = Object.values(result.vulnerabilities);
  if (config.whitelist !== undefined) {
    vulnerabilities = removeByWhitelist(
      vulnerabilities,
      config.whitelist,
      args.quiet
    );
  }
  return vulnerabilities;
};
