import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import apiClient from '../../services/api'
import {
    ArrowLeft, Edit, User, Phone, Mail, MapPin,
    Calendar, Heart, AlertCircle, FileText, Activity
} from 'lucide-react'

const PatientDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [patient, setPatient] = useState(null)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        fetchPatientDetails()
    }, [id])

    const fetchPatientDetails = async () => {
        try {
            setLoading(true)
            const [patientResponse, reportsResponse] = await Promise.all([
                apiClient.get(`/patients/${id}`),
                apiClient.get(`/reports?patientId=${id}`).catch(() => ({ data: { content: [] } }))
            ])
            setPatient(patientResponse.data)
            setReports(reportsResponse.data.content || [])
            setLoading(false)
        } catch (error) {
            console.error('Error fetching patient details:', error)
            setLoading(false)
            alert('Failed to load patient details')
            navigate('/patients')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!patient) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Patient not found</h2>
                    <Link to="/patients" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
                        Back to Patients
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/patients')}
                                className="mr-4 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-2xl font-bold text-primary-600">
                                        {patient.firstName?.[0]}{patient.lastName?.[0]}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {patient.firstName} {patient.lastName}
                                    </h1>
                                    <p className="text-gray-600 mt-1">Patient ID: {patient.id}</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            to={`/patients/${id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                            <Edit className="w-5 h-5 mr-2" />
                            Edit Patient
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {[
                                { id: 'overview', label: 'Overview', icon: User },
                                { id: 'medical', label: 'Medical History', icon: Heart },
                                { id: 'reports', label: 'Reports', icon: FileText },
                            ].map((tab) => {
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
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-primary-600" />
                                        Personal Information
                                    </h3>
                                    <div className="space-y-3">
                                        <InfoRow icon={Mail} label="Email" value={patient.email} />
                                        <InfoRow icon={Phone} label="Phone" value={patient.phone || 'N/A'} />
                                        <InfoRow icon={Calendar} label="Date of Birth" value={patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'} />
                                        <InfoRow icon={User} label="Gender" value={patient.gender} />
                                        <InfoRow icon={Activity} label="Blood Group" value={patient.bloodGroup || 'N/A'} />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                                        Address
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p>{patient.address || 'No address provided'}</p>
                                        {patient.city && <p>{patient.city}, {patient.state} {patient.zipCode}</p>}
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4 flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                                        Emergency Contact
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <p><span className="font-medium">Name:</span> {patient.emergencyContact || 'N/A'}</p>
                                        <p><span className="font-medium">Phone:</span> {patient.emergencyPhone || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="md:col-span-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Patient Status</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                                <span className={`px-3 py-1 rounded-full text-sm ${patient.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {patient.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-600">Last Updated</p>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                                {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Medical History Tab */}
                        {activeTab === 'medical' && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                                        Allergies
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {patient.allergies || 'No known allergies'}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Heart className="w-5 h-5 mr-2 text-red-600" />
                                        Medical History
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {patient.medicalHistory || 'No medical history recorded'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div>
                                {reports.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                                        <p className="text-gray-500 mb-4">No medical reports have been uploaded for this patient</p>
                                        <Link
                                            to="/reports/upload"
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                                        >
                                            Upload Report
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reports.map((report) => (
                                            <div key={report.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center flex-1">
                                                        <FileText className="w-8 h-8 text-primary-600 mr-4" />
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{report.title}</h4>
                                                            <p className="text-sm text-gray-600">{report.reportType?.replace('_', ' ')}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/reports/${report.id}`}
                                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                                    >
                                                        View Details →
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-sm">
        <Icon className="w-4 h-4 text-gray-400 mr-3" />
        <span className="font-medium text-gray-700 mr-2">{label}:</span>
        <span className="text-gray-900">{value}</span>
    </div>
)

export default PatientDetailPage
