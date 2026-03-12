import { apiClient } from './apiClient';

export type BackendRole = 'talent' | 'tech_enterprise' | 'transform_enterprise' | 'park' | 'admin';
export type RegisterRole = 'talent' | 'tech_enterprise' | 'transform_enterprise' | 'park';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

interface UserInfo {
    id: string;
    phone: string;
    role: BackendRole;
    status: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: UserInfo;
}

interface RegisterResponse {
    id: string;
    phone: string;
    role: RegisterRole;
    status: string;
    created_at: string;
}

export const AuthService = {
    async login(phone: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', {
            phone,
            password,
        });
        if (!response.data?.data) {
            throw new Error(response.data?.message || '登录失败');
        }
        return response.data.data;
    },

    async register(payload: {
        phone: string;
        password: string;
        role: RegisterRole;
        code?: string;
    }): Promise<RegisterResponse> {
        const response = await apiClient.post<ApiResponse<RegisterResponse>>('/api/v1/auth/register', payload);
        if (!response.data?.data) {
            throw new Error(response.data?.message || '注册失败');
        }
        return response.data.data;
    },
};
