import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { User, Bell, Lock, Palette, Globe, Save } from 'lucide-react'

const SettingsPage = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
    const [settings, setSettings] = useState({
        // Profile settings
        displayName: user?.email?.split('@')[0] || '',
        email: user?.email || '',
        phone: '',

        // Notification settings
        emailNotifications: true,
        pushNotifications: false,
        reportAlerts: true,
        appointmentReminders: true,

        // Security settings
        twoFactorAuth: false,
        sessionTimeout: '30',

        // Appearance settings
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',

        // Privacy settings
        shareData: false,
        analyticsEnabled: true
    })

    const [saved, setSaved] = useState(false)

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }))
        setSaved(false)
    }

    const handleSave = () => {
        // In a real app, this would call an API
        console.log('Saving settings:', settings)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                                ? 'border-primary-600 text-primary-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-2" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.displayName}
                                                onChange={(e) => handleChange('displayName', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={settings.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={settings.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={user?.role || 'CLINICIAN'}
                                                disabled
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                                    <div className="space-y-4">
                                        <ToggleSetting
                                            label="Email Notifications"
                                            description="Receive notifications via email"
                                            checked={settings.emailNotifications}
                                            onChange={(checked) => handleChange('emailNotifications', checked)}
                                        />
                                        <ToggleSetting
                                            label="Push Notifications"
                                            description="Receive push notifications in your browser"
                                            checked={settings.pushNotifications}
                                            onChange={(checked) => handleChange('pushNotifications', checked)}
                                        />
                                        <ToggleSetting
                                            label="Report Alerts"
                                            description="Get notified when new reports are available"
                                            checked={settings.reportAlerts}
                                            onChange={(checked) => handleChange('reportAlerts', checked)}
                                        />
                                        <ToggleSetting
                                            label="Appointment Reminders"
                                            description="Receive reminders for upcoming appointments"
                                            checked={settings.appointmentReminders}
                                            onChange={(checked) => handleChange('appointmentReminders', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                                    <div className="space-y-6">
                                        <ToggleSetting
                                            label="Two-Factor Authentication"
                                            description="Add an extra layer of security to your account"
                                            checked={settings.twoFactorAuth}
                                            onChange={(checked) => handleChange('twoFactorAuth', checked)}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Session Timeout (minutes)
                                            </label>
                                            <select
                                                value={settings.sessionTimeout}
                                                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                            </select>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance & Language</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Theme
                                            </label>
                                            <select
                                                value={settings.theme}
                                                onChange={(e) => handleChange('theme', e.target.value)}
                                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="light">Light</option>
                                                <option value="dark">Dark</option>
                                                <option value="auto">Auto (System)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <select
                                                value={settings.language}
                                                onChange={(e) => handleChange('language', e.target.value)}
                                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="en">English</option>
                                                <option value="es">Spanish</option>
                                                <option value="fr">French</option>
                                                <option value="de">German</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date Format
                                            </label>
                                            <select
                                                value={settings.dateFormat}
                                                onChange={(e) => handleChange('dateFormat', e.target.value)}
                                                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            >
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                            {saved && (
                                <div className="text-green-600 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Settings saved successfully!
                                </div>
                            )}
                            <div className="ml-auto">
                                <button
                                    onClick={handleSave}
                                    className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ToggleSetting = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${checked ? 'bg-primary-600' : 'bg-gray-200'
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    </div>
)

export default SettingsPage
