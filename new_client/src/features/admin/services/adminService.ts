import { apiClient } from '../../../shared/api';
import type { 
  AdminStats,
  AdminActivity,
  UserManagement,
  PlaceManagement,
  ReviewManagement,
  GetUsersRequest,
  GetPlacesRequest,
  GetReviewsRequest,
  UpdateUserRequest,
  UpdatePlaceRequest,
  UpdateReviewRequest,
  CreatePlaceRequest,
  AdminUsersResponse,
  AdminPlacesResponse,
  AdminReviewsResponse
} from '../types';

class AdminService {
  private readonly baseUrl = '/api/admin';

  // Dashboard & Statistics
  async getDashboardStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  async getRecentActivity(limit = 20): Promise<AdminActivity[]> {
    const response = await apiClient.get<AdminActivity[]>(`${this.baseUrl}/activity?limit=${limit}`);
    return response.data;
  }

  // User Management
  async getUsers(params: GetUsersRequest = {}): Promise<AdminUsersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.role) searchParams.append('role', params.role);
    if (params.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}/users?${queryString}` : `${this.baseUrl}/users`;
    
    const response = await apiClient.get<AdminUsersResponse>(url);
    return response.data;
  }

  async getUser(userId: string): Promise<UserManagement> {
    const response = await apiClient.get<UserManagement>(`${this.baseUrl}/users/${userId}`);
    return response.data;
  }

  async updateUser(data: UpdateUserRequest): Promise<UserManagement> {
    const { userId, ...updateData } = data;
    const response = await apiClient.put<UserManagement>(`${this.baseUrl}/users/${userId}`, updateData);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/users/${userId}`);
  }

  async suspendUser(userId: string, reason?: string): Promise<UserManagement> {
    const response = await apiClient.patch<UserManagement>(`${this.baseUrl}/users/${userId}/suspend`, { reason });
    return response.data;
  }

  async unsuspendUser(userId: string): Promise<UserManagement> {
    const response = await apiClient.patch<UserManagement>(`${this.baseUrl}/users/${userId}/unsuspend`);
    return response.data;
  }

  // Place Management
  async getPlaces(params: GetPlacesRequest = {}): Promise<AdminPlacesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.type) searchParams.append('type', params.type);
    if (params.status) searchParams.append('status', params.status);
    if (params.createdBy) searchParams.append('createdBy', params.createdBy);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}/places?${queryString}` : `${this.baseUrl}/places`;
    
    const response = await apiClient.get<AdminPlacesResponse>(url);
    return response.data;
  }

  async getPlace(placeId: string): Promise<PlaceManagement> {
    const response = await apiClient.get<PlaceManagement>(`${this.baseUrl}/places/${placeId}`);
    return response.data;
  }

  async createPlace(data: CreatePlaceRequest): Promise<PlaceManagement> {
    const response = await apiClient.post<PlaceManagement>(`${this.baseUrl}/places`, data);
    return response.data;
  }

  async updatePlace(data: UpdatePlaceRequest): Promise<PlaceManagement> {
    const { placeId, ...updateData } = data;
    const response = await apiClient.put<PlaceManagement>(`${this.baseUrl}/places/${placeId}`, updateData);
    return response.data;
  }

  async deletePlace(placeId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/places/${placeId}`);
  }

  async approvePlace(placeId: string): Promise<PlaceManagement> {
    const response = await apiClient.patch<PlaceManagement>(`${this.baseUrl}/places/${placeId}/approve`);
    return response.data;
  }

  async rejectPlace(placeId: string, reason?: string): Promise<PlaceManagement> {
    const response = await apiClient.patch<PlaceManagement>(`${this.baseUrl}/places/${placeId}/reject`, { reason });
    return response.data;
  }

  // Review Management
  async getReviews(params: GetReviewsRequest = {}): Promise<AdminReviewsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.placeId) searchParams.append('placeId', params.placeId);
    if (params.userId) searchParams.append('userId', params.userId);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.baseUrl}/reviews?${queryString}` : `${this.baseUrl}/reviews`;
    
    const response = await apiClient.get<AdminReviewsResponse>(url);
    return response.data;
  }

  async getReview(reviewId: string): Promise<ReviewManagement> {
    const response = await apiClient.get<ReviewManagement>(`${this.baseUrl}/reviews/${reviewId}`);
    return response.data;
  }

  async updateReview(data: UpdateReviewRequest): Promise<ReviewManagement> {
    const { reviewId, ...updateData } = data;
    const response = await apiClient.put<ReviewManagement>(`${this.baseUrl}/reviews/${reviewId}`, updateData);
    return response.data;
  }

  async deleteReview(reviewId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/reviews/${reviewId}`);
  }

  async approveReview(reviewId: string): Promise<ReviewManagement> {
    const response = await apiClient.patch<ReviewManagement>(`${this.baseUrl}/reviews/${reviewId}/approve`);
    return response.data;
  }

  async rejectReview(reviewId: string, reason?: string): Promise<ReviewManagement> {
    const response = await apiClient.patch<ReviewManagement>(`${this.baseUrl}/reviews/${reviewId}/reject`, { reason });
    return response.data;
  }

  // Bulk Operations
  async bulkApproveReviews(reviewIds: string[]): Promise<ReviewManagement[]> {
    const response = await apiClient.patch<ReviewManagement[]>(`${this.baseUrl}/reviews/bulk/approve`, { reviewIds });
    return response.data;
  }

  async bulkRejectReviews(reviewIds: string[], reason?: string): Promise<ReviewManagement[]> {
    const response = await apiClient.patch<ReviewManagement[]>(`${this.baseUrl}/reviews/bulk/reject`, { reviewIds, reason });
    return response.data;
  }

  async bulkDeleteReviews(reviewIds: string[]): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/reviews/bulk/delete`, { reviewIds });
  }

  // Reports & Analytics
  async exportUsers(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/reports/users?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportPlaces(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/reports/places?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportReviews(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/reports/reviews?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const adminService = new AdminService();
