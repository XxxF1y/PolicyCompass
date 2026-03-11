export interface RadarDataPoint {
    subject: string;
    A: number;
    fullMark: number;
}

export interface ProfileTip {
    id: string;
    content: string;
    actionLabel: string;
    type: 'warning' | 'success' | 'info' | 'bonus';
}

export interface ProfileAlert {
    title: string;
    description: string;
    missingCount?: number;
    tips: ProfileTip[];
}

export interface ProfileData {
    role: 'talent' | 'enterprise' | 'park';
    completionRate: number;
    radarData: RadarDataPoint[];
    alert: ProfileAlert;
}
