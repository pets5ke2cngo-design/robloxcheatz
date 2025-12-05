const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const commonOptions = {
  bundle: true,
  format: 'esm',
  target: ['es2020'],
  platform: 'browser',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
  },
  jsx: 'automatic',
  sourcemap: true,
  minify: !isWatch,
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  external: [],
  logLevel: 'info',
};

const buildConfigs = [
  {
    ...commonOptions,
    entryPoints: ['src/main.tsx'],
    outfile: 'public/dist/bundle.js',
  },
  {
    ...commonOptions,
    entryPoints: ['src/info.tsx'],
    outfile: 'public/dist/info-bundle.js',
  },
  {
    ...commonOptions,
    entryPoints: ['src/downgrade.tsx'],
    outfile: 'public/dist/downgrade-bundle.js',
  },
];

async function build() {
  try {
    if (isWatch) {
      // Watch mode for main bundle only
      const ctx = await esbuild.context(buildConfigs[0]);
      await ctx.watch();
      // Also build info bundle
      await esbuild.build(buildConfigs[1]);
      console.log('Watching for changes...');
    } else {
      // Build all bundles
      await Promise.all(buildConfigs.map(config => esbuild.build(config)));
      console.log('Build completed successfully!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
