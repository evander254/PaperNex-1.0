import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ requiredRole, skipProfileCheck = false }) => {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Check if profile is complete (only if not skipping check)
    if (!skipProfileCheck && (!profile?.first_name || !profile?.last_name || !profile?.phonenumber)) {
        return <Navigate to="/setup-profile" replace />;
    }

    if (requiredRole && profile?.role !== requiredRole) {
        // Fallback to dashboard if not admin
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
