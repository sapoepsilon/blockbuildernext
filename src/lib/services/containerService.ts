import { apiClient } from '../api/client';
import {
  Container,
  CreateContainerRequest,
  ContainerLogs,
  APIResponse,
} from '../types/api';

export class ContainerService {
  static async createContainer(
    request: CreateContainerRequest
  ): Promise<APIResponse<Container>> {
    return apiClient.post<Container>('/containers/create', request);
  }

  static async listContainers(): Promise<APIResponse<Container[]>> {
    return apiClient.get<Container[]>('/containers');
  }

  static async getContainer(id: string): Promise<APIResponse<Container>> {
    return apiClient.get<Container>(`/containers/${id}`);
  }

  static async deleteContainer(id: string): Promise<APIResponse<void>> {
    return apiClient.delete<void>(`/containers/${id}`);
  }

  static async getContainerLogs(id: string): Promise<APIResponse<ContainerLogs>> {
    return apiClient.get<ContainerLogs>(`/containers/${id}/logs`);
  }
}

// Health check service
export class HealthService {
  static async checkHealth(): Promise<APIResponse<{ status: string }>> {
    return apiClient.get<{ status: string }>('/health');
  }
}

// Project deployment service
export class DeploymentService {
  static async deployProject(projectId: string, config: unknown): Promise<APIResponse<void>> {
    return apiClient.post<void>(`/projects/${projectId}/deploy`, config);
  }

  static async getDeploymentStatus(
    projectId: string
  ): Promise<APIResponse<{ status: string; details?: string }>> {
    return apiClient.get<{ status: string; details?: string }>(
      `/projects/${projectId}/status`
    );
  }
}
