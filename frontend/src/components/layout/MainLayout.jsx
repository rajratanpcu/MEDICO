import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
    Home, Users, FileText, Activity, MessageSquare,
    Settings, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const MainLayout = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Patients', href: '/patients', icon: Users },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'AI Chat', href: '/ai/chat', icon: MessageSquare },
        { name: 'Symptom Checker', href: '/ai/symptom-checker', icon: Activity },
    ]

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Activity className="w-8 h-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">MediCare</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                    {user?.email?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.email?.split('@')[0] || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">{user?.role || 'CLINICIAN'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className={`w-5 h-5 mr-3 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="px-4 py-4 border-t border-gray-200 space-y-1">
                        <Link
                            to="/settings"
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Settings className="w-5 h-5 mr-3 text-gray-500" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3 text-red-600" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-10 bg-white shadow">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center">
                            <Activity className="w-6 h-6 text-primary-600" />
                            <span className="ml-2 text-lg font-bold text-gray-900">MediCare</span>
                        </div>
                        <div className="w-6" /> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Page Content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout
