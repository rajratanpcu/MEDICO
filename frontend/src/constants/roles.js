export const USER_ROLES = {
  PATIENT: 'PATIENT',
  CLINICIAN: 'CLINICIAN',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
}

export const ROLE_PERMISSIONS = {
  PATIENT: ['view_own_records', 'view_own_reports', 'upload_report'],
  CLINICIAN: [
    'view_all_patients',
    'view_reports',
    'create_prescription',
    'manage_patients',
  ],
  ADMIN: ['manage_users', 'view_all_data', 'manage_system'],
}

export default USER_ROLES
