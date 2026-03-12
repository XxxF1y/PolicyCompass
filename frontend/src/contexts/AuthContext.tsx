import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'enterprise' | 'park' | null;
type BackendRole = 'talent' | 'tech_enterprise' | 'transform_enterprise' | 'park' | 'admin' | null;

interface AuthUser {
    id: string;
    phone: string;
    role: Exclude<BackendRole, null>;
    status: string;
}

interface AuthSession {
    accessToken: string;
    user: AuthUser;
}

interface AuthContextType {
    role: Role;
    userRole: BackendRole;
    token: string | null;
    login: (selectedRole: Role) => void;
    loginWithSession: (session: AuthSession) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<Role>(null);
    const [userRole, setUserRole] = useState<BackendRole>(null);
    const [token, setToken] = useState<string | null>(null);

    const mapBackendRoleToAppRole = (rawRole: BackendRole): Role => {
        if (rawRole === 'park') return 'park';
        if (rawRole === 'talent' || rawRole === 'tech_enterprise' || rawRole === 'transform_enterprise' || rawRole === 'admin') {
            return 'enterprise';
        }
        return null;
    };

    // Load auth state from localStorage on mount
    useEffect(() => {
        const savedRole = localStorage.getItem('policy_compass_role') as Role;
        const savedUserRole = localStorage.getItem('policy_compass_user_role') as BackendRole;
        const savedToken = localStorage.getItem('policy_compass_token');

        if (savedRole === 'enterprise' || savedRole === 'park') {
            setRole(savedRole);
        }
        if (savedUserRole === 'talent' || savedUserRole === 'tech_enterprise' || savedUserRole === 'transform_enterprise' || savedUserRole === 'park' || savedUserRole === 'admin') {
            setUserRole(savedUserRole);
            if (savedRole !== mapBackendRoleToAppRole(savedUserRole)) {
                setRole(mapBackendRoleToAppRole(savedUserRole));
            }
        }
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const login = (selectedRole: Role) => {
        setRole(selectedRole);
        if (selectedRole) {
            localStorage.setItem('policy_compass_role', selectedRole);
        } else {
            localStorage.removeItem('policy_compass_role');
        }
    };

    const loginWithSession = (session: AuthSession) => {
        const appRole = mapBackendRoleToAppRole(session.user.role);
        setRole(appRole);
        setUserRole(session.user.role);
        setToken(session.accessToken);
        if (appRole) {
            localStorage.setItem('policy_compass_role', appRole);
        }
        localStorage.setItem('policy_compass_user_role', session.user.role);
        localStorage.setItem('policy_compass_token', session.accessToken);
        localStorage.setItem('policy_compass_user_id', session.user.id);
        localStorage.setItem('policy_compass_user_phone', session.user.phone);
    };

    const logout = () => {
        setRole(null);
        setUserRole(null);
        setToken(null);
        localStorage.removeItem('policy_compass_role');
        localStorage.removeItem('policy_compass_user_role');
        localStorage.removeItem('policy_compass_token');
        localStorage.removeItem('policy_compass_user_id');
        localStorage.removeItem('policy_compass_user_phone');
    };

    return (
        <AuthContext.Provider value={{ role, userRole, token, login, loginWithSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
