import { RunGroup } from './run-group';
import { Task } from './task';

export interface Execution {
  runGroup: RunGroup;
  command: string;
  maxParallel: number;
  tasks: Task[];
  statusCode: number;
}
