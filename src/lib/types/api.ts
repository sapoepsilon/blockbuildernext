export interface Container {
  resources: any;
  image: ReactNode;
  ports: any;
  environment(environment: any): unknown;
  network: any;
  id: string;
  name: string;
  status: string;
  created: string;
  projectPath: string;
  env?: string[];
  cpuShares?: number;
  memoryLimit?: number;
  networkMode?: string;
  labels?: Record<string, string>;
}

export interface CreateContainerRequest {
  projectPath: string;
  name: string;
  env?: string[];
  cpuShares?: number;
  memoryLimit?: number;
  networkMode?: string;
  labels?: Record<string, string>;
}

export interface APIError {
  error: string;
  details?: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: APIError;
}

export interface ContainerLogs {
  logs: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  message?: string;
  timestamp: string;
}
