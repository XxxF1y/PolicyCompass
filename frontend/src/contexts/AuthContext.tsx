import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'enterprise' | 'park' | null;

interface AuthContextType {
    role: Role;
    login: (selectedRole: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<Role>(null);

    // Load role from localStorage on mount
    useEffect(() => {
        const savedRole = localStorage.getItem('policy_compass_role') as Role;
        if (savedRole === 'enterprise' || savedRole === 'park') {
            setRole(savedRole);
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

    const logout = () => {
        setRole(null);
        localStorage.removeItem('policy_compass_role');
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
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
