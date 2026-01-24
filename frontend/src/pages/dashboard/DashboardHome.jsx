import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import apiClient from '../../services/api'
import {
    Users, FileText, Activity, AlertCircle,
    TrendingUp, Calendar, Clock, CheckCircle
} from 'lucide-react'

const DashboardHome = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalPatients: 0,
        recentReports: 0,
        pendingAnalysis: 0,
        todayAppointments: 0
    })
    const [recentPatients, setRecentPatients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Fetch patients
            const patientsResponse = await apiClient.get('/patients?page=0&size=5')

            let patientList = []
            let totalCount = 0

            if (Array.isArray(patientsResponse.data)) {
                patientList = patientsResponse.data.slice(0, 5)
                totalCount = patientsResponse.data.length
            } else {
                patientList = patientsResponse.data.content || []
                totalCount = patientsResponse.data.totalElements || 0
            }

            setRecentPatients(patientList)
            setStats(prev => ({ ...prev, totalPatients: totalCount }))

            // You can add more API calls here for other stats
            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
        }
    }

    const StatCard = ({ icon: Icon, title, value, trend, color }) => (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.email?.split('@')[0] || 'Doctor'}
                    </h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your patients today</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        title="Total Patients"
                        value={stats.totalPatients}
                        trend="+12% from last month"
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={FileText}
                        title="Recent Reports"
                        value={stats.recentReports}
                        trend="+8% from last week"
                        color="bg-green-500"
                    />
                    <StatCard
                        icon={Activity}
                        title="Pending Analysis"
                        value={stats.pendingAnalysis}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        icon={Calendar}
                        title="Today's Appointments"
                        value={stats.todayAppointments}
                        color="bg-purple-500"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/patients"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                            <Users className="w-6 h-6 text-primary-600 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-900">View Patients</p>
                                <p className="text-sm text-gray-600">Manage patient records</p>
                            </div>
                        </Link>
                        <Link
                            to="/reports/upload"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                            <FileText className="w-6 h-6 text-primary-600 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-900">Upload Report</p>
                                <p className="text-sm text-gray-600">Add new medical reports</p>
                            </div>
                        </Link>
                        <Link
                            to="/ai/symptom-checker"
                            className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                            <Activity className="w-6 h-6 text-primary-600 mr-3" />
                            <div>
                                <p className="font-semibold text-gray-900">AI Symptom Checker</p>
                                <p className="text-sm text-gray-600">Analyze symptoms</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
                        <Link to="/patients" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All →
                        </Link>
                    </div>

                    {recentPatients.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No patients found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Visit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentPatients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                                        <span className="text-primary-600 font-semibold">
                                                            {patient.firstName?.[0]}{patient.lastName?.[0]}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {patient.firstName} {patient.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{patient.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {patient.gender}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
