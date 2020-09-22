#!/usr/bin/env node
import { parseArgs } from './arguments';
import { precheckAll } from './prechecks';
import { generateConfig, readConfig } from './config';
import { runAudit } from './audit';
import { parse } from './parser';
import { report } from './report';
import { install } from './install';

const args = parseArgs();

(async () => {
  if (args.install) {
    await install(args);
    return;
  }
  if (args.generate_config) {
    await generateConfig(args);
    return;
  }

  await precheckAll();
  const config = await readConfig(args);
  const auditResult = await runAudit(args, config);
  // const packageLock = await readPackageLockJson(args);
  const result = await parse(auditResult, args, config);
  await report(args, config, result);
})().catch((err) => {
  console.error('Error happened!');
  console.dir(err);
});
