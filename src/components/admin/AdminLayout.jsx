import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    ListOrdered,
    Settings,
    Users,
    CreditCard,
    User,
    LogOut
} from 'lucide-react';

export default function AdminLayout() {
    const { profile, signOut } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Requests', path: '/admin/requests', icon: ListOrdered },
        { name: 'Services', path: '/admin/services', icon: Settings },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
        { name: 'Profile', path: '/admin/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-[#030014] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0720] border-r border-white/10 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/10 shrink-0">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-blue-500 bg-clip-text text-transparent">
                        PaperNex Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                    ? 'bg-brand-500/20 text-brand-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-4">
                    <div className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white">
                            {profile?.first_name ? profile.first_name[0].toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{profile?.first_name} {profile?.last_name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-white/5 w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 max-h-screen">
                {/* Header (Mobile-only logic ideally goes here) */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 md:hidden">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-blue-500 bg-clip-text text-transparent">
                        PaperNex Admin
                    </h1>
                    <Link to="/admin/profile" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <User size={20} />
                    </Link>
                </header>

                <div className="flex-1 overflow-auto p-6 lg:p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
