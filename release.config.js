module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-auth' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-db-entities' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-http-executions' }],
    [
      '@semantic-release/npm',
      { pkgRoot: './dist/libs/api-http-org-and-workspace' },
    ],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-http-ping' }],
    [
      '@semantic-release/npm',
      { pkgRoot: './dist/libs/api-http-report-client-error' },
    ],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-http-runs' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-http-save-metrics' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-http-stats' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-models' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-stats' }],
    ['@semantic-release/npm', { pkgRoot: './dist/libs/api-storage' }],
  ],
};
