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
            <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        )
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-100">Patient not found</h2>
                    <Link to="/patients" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
                        Back to Patients
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <header className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/patients')}
                            className="mr-4 text-slate-400 hover:text-slate-100 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center mr-4">
                                <span className="text-2xl font-bold text-white">
                                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-100">
                                    {patient.firstName} {patient.lastName}
                                </h1>
                                <p className="text-slate-400 mt-1">Patient ID: {patient.id}</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to={`/patients/${id}/edit`}
                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:shadow-lg hover:shadow-cyan-900/40"
                    >
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Patient
                    </Link>
                </div>
            </header>

            {/* Tabs Card */}
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden backdrop-blur-md">

                {/* Tab Navigation */}
                <div className="border-b border-slate-700">
                    <nav className="flex">
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
                                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-cyan-500 text-cyan-400'
                                            : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
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
                            <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-cyan-400" />
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

                            {/* Contact & Emergency */}
                            <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-cyan-400" />
                                    Address
                                </h3>
                                <div className="space-y-2 text-sm text-slate-300">
                                    <p>{patient.address || 'No address provided'}</p>
                                    {patient.city && <p>{patient.city}, {patient.state} {patient.zipCode}</p>}
                                </div>

                                <h3 className="text-lg font-semibold text-slate-100 mt-6 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                                    Emergency Contact
                                </h3>
                                <div className="space-y-2 text-sm text-slate-300">
                                    <p><span className="font-medium text-slate-400">Name:</span> {patient.emergencyContact || 'N/A'}</p>
                                    <p><span className="font-medium text-slate-400">Phone:</span> {patient.emergencyPhone || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className="md:col-span-2 rounded-xl border border-slate-700 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">Patient Status</p>
                                        <div className="mt-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                patient.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {patient.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-400">Last Updated</p>
                                        <p className="text-lg font-semibold text-slate-100 mt-1">
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
                            <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                                    Allergies
                                </h3>
                                <p className="text-slate-300 whitespace-pre-wrap">
                                    {patient.allergies || 'No known allergies'}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
                                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                                    <Heart className="w-5 h-5 mr-2 text-red-400" />
                                    Medical History
                                </h3>
                                <p className="text-slate-300 whitespace-pre-wrap">
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
                                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-100 mb-2">No reports found</h3>
                                    <p className="text-slate-400 mb-4">No medical reports have been uploaded for this patient</p>
                                    <Link
                                        to="/reports/upload"
                                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:shadow-lg hover:shadow-cyan-900/40"
                                    >
                                        Upload Report
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reports.map((report) => (
                                        <div key={report.id} className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 hover:bg-slate-700/40 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center flex-1">
                                                    <FileText className="w-8 h-8 text-cyan-400 mr-4" />
                                                    <div>
                                                        <h4 className="font-semibold text-slate-100">{report.title}</h4>
                                                        <p className="text-sm text-slate-400">{report.reportType?.replace('_', ' ')}</p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/reports/${report.id}`}
                                                    className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
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
    )
}

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-sm">
        <Icon className="w-4 h-4 text-slate-500 mr-3" />
        <span className="font-medium text-slate-400 mr-2">{label}:</span>
        <span className="text-slate-200">{value}</span>
    </div>
)

export default PatientDetailPage