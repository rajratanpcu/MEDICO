# 🐛 Bug Fix: Patient Date of Birth Error

## Issue
You reported: `error dateOfBirth must not be null` when adding a patient.

## Root Cause
- The Frontend Form was sending the date as `dob` (e.g. `{ "dob": "1990-01-01" }`).
- The Backend expects `dateOfBirth` (e.g. `{ "dateOfBirth": "1990-01-01" }`).
- Because of this mismatch, the backend saw the date as empty/null and rejected the request.

## Fix Applied
- **Updated `PatientForm.jsx`**: Renamed the field `dob` to `dateOfBirth` to match the backend requirement.

## Result
- **Add Patient** will now work correctly.
- **Edit Patient** will now correctly show the existing Date of Birth (previously it might have been blank).

## Action Required
- Reload the page.
- Try adding the patient again.
