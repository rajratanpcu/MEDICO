import { usePatients, usePatientById, useCreatePatient, useUpdatePatient } from './usePatients'
import { useReports, usePatientReports, useUploadReport, useAnalyzeReport } from './useReports'
import { useForm } from './useForm'
import { useFileUpload } from './useFileUpload'
import { useLocalStorage } from './useLocalStorage'
import { useDebounce } from './useDebounce'
import { useFetch } from './useUseDoctors'
import { useAuth } from '../context/AuthContext'

export {
  usePatients,
  usePatientById,
  useCreatePatient,
  useUpdatePatient,
  useReports,
  usePatientReports,
  useUploadReport,
  useAnalyzeReport,
  useForm,
  useFileUpload,
  useLocalStorage,
  useDebounce,
  useFetch,
  useAuth,
}
