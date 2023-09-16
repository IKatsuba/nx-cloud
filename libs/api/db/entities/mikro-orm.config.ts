// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ReflectMetadataProvider } = require('@mikro-orm/core');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Workspace } = require('./src');
module.exports = {
  type: 'postgresql',
  clientUrl: 'postgresql://localhost:5432/postgres',
  metadataProvider: ReflectMetadataProvider,
  entities: [Workspace],
};
