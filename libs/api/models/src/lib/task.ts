export interface Task {
  taskId: string;
  projectName: string;
  target: string;
  params: string;
  configuration: string;
  hash: string;
  startTime: string;
  endTime: string;
  cacheStatus: 'cache-miss' | 'local-cache-hit' | 'remote-cache-hit';
  isCompleted?: boolean;
}
