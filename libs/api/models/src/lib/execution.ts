import { RunGroup, Task } from '@nx-cloud/api/models';

export interface Execution {
  runGroup: RunGroup;
  command: string;
  maxParallel: number;
  tasks: Task[];
  statusCode: number;
}
