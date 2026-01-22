import { useQuery, useMutation } from '@tanstack/react-query'
import reportService from '../services/reportService'

export const useReports = (filters = {}) => {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: () => reportService.getReports(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const usePatientReports = (patientId) => {
  return useQuery({
    queryKey: ['patientReports', patientId],
    queryFn: () => reportService.getPatientReports(patientId),
    enabled: !!patientId,
  })
}

export const useUploadReport = (options = {}) => {
  return useMutation({
    mutationFn: (reportData) => reportService.uploadReport(reportData),
    ...options,
  })
}

export const useAnalyzeReport = (options = {}) => {
  return useMutation({
    mutationFn: (reportId) => reportService.analyzeReport(reportId),
    ...options,
  })
}

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (reportId) => {
      return reportService.downloadReport(reportId).then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `report-${reportId}.pdf`
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
  })
}
