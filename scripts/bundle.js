'use strict';
const { writeFile } = require('fs').promises;
const { cyan, green } = require('chalk');
const { minify } = require('terser');
const builder = require('core-js-builder');
const { banner } = require('core-js-builder/config');

const PATH = './packages/core-js-bundle/';

function log(kind, name, code) {
  const size = (code.length / 1024).toFixed(2);
  // eslint-disable-next-line no-console -- output
  console.log(green(`${ kind }: ${ cyan(`${ PATH }${ name }.js`) }, size: ${ cyan(`${ size }KB`) }`));
}

async function bundle({ bundled, minified, options = {} }) {
  const source = await builder({ filename: `${ PATH }${ bundled }.js`, ...options });
  log('bundling', bundled, source);

  const { code, map } = await minify(source, {
    ecma: 5,
    ie8: true,
    keep_fnames: true,
    compress: {
      hoist_funs: false,
      hoist_vars: true,
      pure_getters: true,
      passes: 3,
      unsafe_proto: true,
      unsafe_undefined: true,
    },
    format: {
      max_line_len: 32000,
      preamble: banner,
      webkit: false,
    },
    sourceMap: {
      url: `${ minified }.js.map`,
    },
  });

  await writeFile(`${ PATH }${ minified }.js`, code);
  await writeFile(`${ PATH }${ minified }.js.map`, map);
  log('minification', minified, code);
}

bundle({ bundled: 'index', minified: 'minified' });
