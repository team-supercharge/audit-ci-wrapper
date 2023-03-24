# @team-supercharge/audit-ci-wrapper

![Node.js Package](https://github.com/team-supercharge/audit-ci-wrapper/workflows/Node.js%20Package/badge.svg)

## Features

This package wraps the result of `npm audit` and creates a report.

`json` and `text` report types currently supported.

Fails with exit code 1 if any package has vulnerabilities that matches the criteria.

The text reporter writes `probable root cause` text to the output, if that package is the one that causes the error.

## NPM version support

This package supports NPM 7 and 8 from `2.0.0`. If you want to use it with NPM 6, then install the latest [`1.x`](https://github.com/team-supercharge/audit-ci-wrapper/tree/v1.x) version.

## Running

It can run without installation.

```bash
npx @team-supercharge/audit-ci-wrapper
```

Or can be added to the project.

```bash
npx @team-supercharge/audit-ci-wrapper --install
npm install --save-dev @team-supercharge/audit-ci-wrapper
npm run audit
```

It can be done manually. Install, generate an auditconfig file and add to the project.

```bash
npm install --save-dev @team-supercharge/audit-ci-wrapper
npx @team-supercharge/audit-ci-wrapper --generate-config
```

```json
{
  "scripts": {
    "audit": "npx @team-supercharge/audit-ci-wrapper --config auditconfig.json"
  }
}
```

```bash
npm run audit
```

## Options

```
usage: @team-supercharge/audit-ci-wrapper [-h] [-c CONFIG] [-gc] [-i] [-q] [-v]

Audit wrapper application for npm.

optional arguments:
  -h, --help            show this help message and exit
  -c CONFIG, --config CONFIG
                        The config json file for auditing.
  -gc, --generate-config
                        Generates config file.
  -i, --install         Generates config file and add script to package.json.
  -q, --quiet           Turns off verbose logging.
  -v, --version         show program's version number and exit
```

## Configfile

The schema for the configfile can be found at `configschema.json`.

| Fieldname | Description | Values |
| --- | --- | --- |
| `severity` | Level of severity that makes audit fail. | `critical`, `high`, `moderate`, `low` |
| `ignoreDevelopmentDependencies` | If true development dependencies will be ignored. | `true`, `false` |
| `reportType` | The type of the output. | `text`, `json` |
| `npmExtraParams` | Extra parameters can be passed to `npm audit`, like `['--registry', '<URL>']` | `string[]` |
| `whitelist` | Object like `dependencies` of package.json. Key specifies a package name, the value is the whitelisted versions in semver format. | `Record<string, string>` |

## Contribution

To develop run `npm install`, `npm link` and `npm start`. This will run currently compiled version.

To run the test run `npm test` or `npm test:dev` to watch for changes.


## Release

In order to properly generate changelog and version tags, run `npm run release` once `master` is ready for it. Publish action will be triggered when newly created tag is released manually on Github UI.