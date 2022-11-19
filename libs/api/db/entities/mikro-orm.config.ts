const { ReflectMetadataProvider } = require('@mikro-orm/core');
const { Workspace } = require('./src');
module.exports = {
  type: 'postgresql',
  clientUrl: 'postgresql://localhost:5432/postgres',
  metadataProvider: ReflectMetadataProvider,
  entities: [Workspace],
};
