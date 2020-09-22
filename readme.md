# audit-ci-wrapper

![Node.js Package](https://github.com/csutorasr/audit-ci-wrapper/workflows/Node.js%20Package/badge.svg)

This package wrappes the result of `npm audit` and creates a report.

`json` and `text` report types currently supported.

Fails with exit code 1 if any package has vulnerabilities that matches the criterias.

## Running

It can run without installation.

```bash
npx audit-ci-wrapper
```

Or can be added to the project.

```bash
npx audit-ci-wrapper --install
npm install --save-dev audit-ci-wrapper
npm run audit
```

It can be done manually. Install, generate an auditconfig file and add to the project.

```bash
npm install --save-dev audit-ci-wrapper
npx audit-ci-wrapper --generate-config
```

```json
{
  "scripts": {
    "audit": "npx audit-ci-wrapper --config auditconfig.json"
  }
}
```

```bash
npm run audit
```

## Options

```
usage: audit-ci-wrapper [-h] [-c CONFIG] [-gc] [-i] [-q] [-v]

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
