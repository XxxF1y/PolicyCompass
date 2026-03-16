import { apiClient } from './apiClient';
import type { ParkInsightsData, ParkInvestmentResponse, ParkPolicyPushItem } from '../types/park';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export const ParkService = {
    getInsights: async (): Promise<ParkInsightsData> => {
        const res = await apiClient.get<ApiResponse<ParkInsightsData>>('/api/v1/insights/park/insights');
        return res.data.data;
    },

    getInvestmentTargets: async (params?: {
        keyword?: string;
        opcStage?: string;
        aiDirection?: string;
        productType?: string;
        inPark?: boolean;
    }): Promise<ParkInvestmentResponse> => {
        const query: Record<string, string | boolean> = {};
        if (params?.keyword) query.keyword = params.keyword;
        if (params?.opcStage) query.opc_stage = params.opcStage;
        if (params?.aiDirection) query.ai_direction = params.aiDirection;
        if (params?.productType) query.product_type = params.productType;
        if (typeof params?.inPark === 'boolean') query.in_park = params.inPark;

        const res = await apiClient.get<ApiResponse<ParkInvestmentResponse>>('/api/v1/insights/park/investment-targets', {
            params: query,
        });
        return res.data.data;
    },

    getPolicyPushes: async (params?: { status?: string }): Promise<ParkPolicyPushItem[]> => {
        const query: Record<string, string> = {};
        if (params?.status) query.status = params.status;
        const res = await apiClient.get<ApiResponse<ParkPolicyPushItem[]>>('/api/v1/parks/mine/pushes', { params: query });
        return res.data.data || [];
    },

    createPolicyPush: async (payload: {
        policy_title: string;
        policy_level?: string;
        issuing_department?: string;
        publish_date?: string;
        deadline?: string;
        applicable_targets?: string[];
        regions?: string[];
        channels?: string[];
        target_tags?: string[];
        keywords?: string[];
        push_scope?: string;
        status?: string;
    }): Promise<ParkPolicyPushItem> => {
        const res = await apiClient.post<ApiResponse<ParkPolicyPushItem>>('/api/v1/parks/mine/pushes', payload);
        return res.data.data;
    },
};
