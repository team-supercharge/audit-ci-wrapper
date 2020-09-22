import * as semver from 'semver';
import { ArgumentResult } from '../arguments';
import { AuditOptions } from '../config';
import { IAdvisory, IAudit, IResolvedByAction } from '../types/npm-audit';

const generateSeverities = (
  level: 'low' | 'moderate' | 'high' | 'critical'
) => {
  const levels = ['low', 'moderate', 'high', 'critical'];
  switch (level) {
    case 'low':
      return levels.slice(0);
    case 'moderate':
      return levels.slice(1);
    case 'high':
      return levels.slice(2);
    case 'critical':
      return levels.slice(3);
  }
};

function getDevResolves(result: IAudit) {
  return result.actions.reduce(
    (acc, action) => [
      ...acc,
      ...action.resolves.filter((resolve) => resolve.dev),
    ],
    [] as IResolvedByAction[]
  );
}

function addDevForFindings(
  advisories: IAdvisory[],
  devResolves: IResolvedByAction[]
) {
  advisories = advisories.map((advisory) => ({
    ...advisory,
    findings: advisory.findings.map((finding) => ({
      ...finding,
      dev: finding.paths.every((path) =>
        devResolves
          .filter((resolve) => resolve.id === advisory.id)
          .some((resolve) => path.includes(resolve.path))
      ),
    })),
  }));
  return advisories;
}

function removeDevelopment(
  args: ArgumentResult,
  advisories: IAdvisory[],
  devResolves: IResolvedByAction[]
) {
  advisories = advisories.map((advisory) => ({
    ...advisory,
    findings: advisory.findings
      .filter((finding) => !finding.dev)
      .map((finding) => ({
        ...finding,
        paths: finding.paths.filter(
          (path) =>
            !devResolves
              .filter((resolve) => resolve.id === advisory.id)
              .some((resolve) => path.includes(resolve.path))
        ),
      })),
  }));
  advisories = advisories.filter((advisory) => {
    if (advisory.findings.length !== 0) {
      return true;
    }
    if (!args.quiet) {
      console.log(
        `Ignoring ${advisory.id} for ${advisory.module_name} as all findings are for development.`
      );
    }
    return false;
  });
  return advisories;
}

function removeBySeverity(
  config: AuditOptions,
  advisories: IAdvisory[],
  args: ArgumentResult
) {
  const notAllowedSeverities = generateSeverities(config.severity);
  advisories = advisories.filter((advisory) => {
    const severityIncluded = notAllowedSeverities.includes(advisory.severity);
    if (severityIncluded) {
      return true;
    }
    if (!args.quiet) {
      console.log(
        `Advisory ${advisory.id} for module ${advisory.module_name} will be ignored by severity filter.`
      );
    }
    return false;
  });
  return advisories;
}

function removeByWhitelist(
  config: AuditOptions,
  advisories: IAdvisory[],
  whitelist: Record<string, string>,
  quiet: boolean
) {
  const filteredWhiteList: Record<string, string> = Object.entries(
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
  advisories = advisories.map((advisory) => {
    const module = advisory.module_name;
    if (!(module in filteredWhiteList)) {
      return advisory;
    }
    return {
      ...advisory,
      findings: advisory.findings.filter(
        (finding) =>
          !semver.satisfies(finding.version, filteredWhiteList[module])
      ),
    };
  });
  advisories = advisories.filter((advisory) => {
    if (advisory.findings.length !== 0) {
      return true;
    }
    if (!quiet) {
      console.log(
        `Ignoring ${advisory.id} for ${advisory.module_name} as all findings are whitelisted.`
      );
    }
    return false;
  });
  return advisories;
}

export const parse = async (
  result: IAudit,
  args: ArgumentResult,
  config: AuditOptions
): Promise<IAdvisory[]> => {
  let advisories = Object.entries(result.advisories).map(([, advisory]) => ({
    ...advisory,
  }));
  advisories = removeBySeverity(config, advisories, args);
  if (config.whitelist !== undefined) {
    advisories = removeByWhitelist(
      config,
      advisories,
      config.whitelist,
      args.quiet
    );
  }
  const devResolves = getDevResolves(result);
  advisories = addDevForFindings(advisories, devResolves);
  if (config.ignoreDevelopmentDependencies) {
    advisories = removeDevelopment(args, advisories, devResolves);
  }
  return advisories;
};
