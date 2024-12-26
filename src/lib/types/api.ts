import { ReactNode } from "react";

export interface Container {
  id: string;
  name: string;
  image: string;
  image_id: string;
  command: string;
  status: string;
  state: string;
  created_at: string;
  started_at: string;
  finished_at: string;
  labels: Record<string, string>;
  ports: unknown;
  network_settings: {
    networks: Record<string, {
      ip_address: string;
      gateway: string;
      mac_address: string;
      network_id: string;
      aliases: string[] | null;
    }> | null;
    ip_address: string;
    gateway: string;
    mac_address: string;
  };
  mounts: Array<{
    type: string;
    source: string;
    destination: string;
    mode: string;
    rw: boolean;
  }> | null;
  platform: string;
  host_config: {
    network_mode: string;
    restart_policy: {
      name: string;
      maximum_retry_count: number;
    };
    auto_remove: boolean;
    memory: number;
    cpu_shares: number;
    cpu_quota: number;
    cpu_period: number;
  };
  restart_count: number;
  exit_code: number;
  // UI specific properties
  resources?: {
    cpuUsage?: ReactNode;
    memoryUsage?: ReactNode;
    cpu?: number;
    memory?: number;
  };
  projectPath: string;
  network: string;
  environment: Record<string, string>;
  cpuShares?: number;
  memoryLimit?: number;
  networkMode?: string;
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
