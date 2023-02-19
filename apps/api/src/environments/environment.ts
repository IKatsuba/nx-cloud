import { ReflectMetadataProvider } from '@mikro-orm/core';
import {
  ExecutionEntity,
  TaskEntity,
  WorkspaceEntity,
} from '@nx-cloud/api/db/entities';

export const environment = {
  production: false,
  mikroOrm: {
    type: 'postgresql' as const,
    clientUrl: 'postgresql://localhost:5432/postgres',
    metadataProvider: ReflectMetadataProvider,
    entities: [WorkspaceEntity, TaskEntity, ExecutionEntity],
  },
};
