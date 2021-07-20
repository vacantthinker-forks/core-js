import { modules } from 'core-js-compat/src/data.mjs';
import modulesByVersions from 'core-js-compat/src/modules-by-versions.mjs';

const defaults = new Set(modules);

for (const version of Object.values(modulesByVersions)) {
  for (const module of version) defaults.delete(module);
}

fs.writeJson('./packages/core-js-compat/modules-by-versions.json', {
  '3.0': [...defaults],
  ...modulesByVersions,
}, { spaces: '  ' });

// eslint-disable-next-line no-console -- output
console.log(chalk.green('modules-by-versions data rebuilt'));
