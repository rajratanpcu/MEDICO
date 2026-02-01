import { useQuery, useMutation } from '@tanstack/react-query'
import patientService from '../services/patientService'

export const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getPatients(filters),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}

export const usePatientById = (patientId) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.getPatientById(patientId),
    enabled: !!patientId,
  })
}

export const useCreatePatient = (options = {}) => {
  return useMutation({
    mutationFn: (patientData) => patientService.createPatient(patientData),
    ...options,
  })
}

export const useUpdatePatient = (options = {}) => {
  return useMutation({
    mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
    ...options,
  })
}
