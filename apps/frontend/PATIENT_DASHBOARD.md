# Patient Dashboard Design

## Overview

**Purpose**: Personal health management and wellness tracking
**Primary Users**: Patients monitoring their own health
**Goal**: Empower patients with accessible health data and actionable insights

---

## Layout Architecture

### Visual Hierarchy

```
┌────────────────────────────────────────────────────────────┐
│ HEADER                                                     │
│ • Logo & Branding                                          │
│ • Patient Name: "Welcome, Sarah"                           │
│ • Quick Actions: [Upload Results] [Schedule Appointment]  │
│ • Notifications: (Badge count)                             │
│ • Settings & Logout                                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ SECTION 1: ALERTS & TODAY'S FOCUS (If any)               │
│ • Critical alerts (top)                                    │
│ • Action items (appointments, medication due)             │
│ • Dismissed after read                                     │
│ Only shows when relevant                                   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ SECTION 2: TODAY'S VITALS (Quick Overview)                │
│ ┌──────────┬──────────┬──────────┬──────────┐             │
│ │ Heart    │ Blood    │ SpO2     │ Temp     │             │
│ │ Rate     │ Pressure │          │          │             │
│ │ 78 bpm   │ 120/80   │ 98%      │ 37.0°C   │             │
│ │ Normal ✓ │ Normal ✓ │ Normal ✓ │ Normal ✓ │             │
│ └──────────┴──────────┴──────────┴──────────┘             │
│                                                            │
│ [Last updated: 2 hours ago] [Take Measurement]            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ SECTION 3: KEY METRICS & HEALTH STATUS (3 cards)         │
│                                                            │
│ ┌─ WEIGHT TREND ─────────┐ ┌─ MEDICATIONS ──────────┐   │
│ │ Current: 72.5 kg       │ │ 3 active medications   │   │
│ │ Goal: 70 kg            │ │ Adherence: 95%         │   │
│ │ Status: +2.5 ↑ (trend) │ │ Status: On track ✓     │   │
│ │                        │ │                        │   │
│ │ [View Trend Chart]     │ │ [View Schedule]        │   │
│ └────────────────────────┘ └────────────────────────┘   │
│                                                            │
│ ┌─ UPCOMING APPOINTMENTS ────────────────────────────┐   │
│ │ Jan 25: Cardiology      Dr. Smith  10:00 AM ✓     │   │
│ │ Jan 28: Lab Work        Metro Lab  2:00 PM        │   │
│ │ Feb 1: Follow-up        Dr. Sarah  9:30 AM        │   │
│ │ [Schedule New] [View Calendar]                    │   │
│ └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ SECTION 4: RECENT ACTIVITY (Timeline)                    │
│                                                            │
│ Jan 22 - Weight recorded: 72.5 kg ✓                       │
│ Jan 22 - Medication taken: Metformin 500mg ✓              │
│ Jan 21 - Lab results received: Glucose 145 mg/dL ⚠        │
│ Jan 21 - Doctor's note: Continue exercise routine        │
│ Jan 20 - Blood pressure: 120/80 mmHg ✓                    │
│                                                            │
│ [View Full Timeline] [View All Records]                   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ SECTION 5: QUICK ACTION CARDS (At bottom)                │
│ ┌──────────────┬──────────────┬──────────────────────┐   │
│ │ 📋 Medical   │ 💊 Add       │ 📞 Message Doctor  │   │
│ │ Records      │ Measurement  │                    │   │
│ └──────────────┴──────────────┴──────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Header Section

```jsx
// PatientDashboardHeader.jsx
Component: PatientDashboardHeader

Props:
  - patientName: string
  - unreadNotifications: number
  - onUploadClick: function
  - onScheduleClick: function
  - onSettingsClick: function
  - onLogout: function

Features:
  - Greeting message: "Welcome, Sarah" (fetches current time)
  - Notification badge (shows count)
  - Primary CTA buttons (prominent)
  - User profile menu (name, role, logout)

Responsive:
  - Desktop: Full layout, buttons inline
  - Tablet: Grouped buttons
  - Mobile: Button text shortened to icons
```

### 2. Alert Banner Section

```jsx
// HealthAlert.jsx
Component: HealthAlert

Props:
  - alerts: Array<{
      id: string,
      type: 'critical' | 'warning' | 'info',
      title: string,
      description: string,
      action?: { label: string, onClick: function },
      dismissible: boolean
    }>
  - onDismiss: (id: string) => void

Types:
  - Critical: Red background, icon, dismiss button
  - Warning: Yellow background, icon, action button
  - Info: Blue background, icon

Examples:
  - "Blood pressure elevated: 158/92 mmHg"
  - "Medication reminder: Metformin due at 6:00 PM"
  - "Lab results available: Glucose check completed"
  - "Appointment in 2 days: Don't forget checkup"
```

### 3. Quick Vitals Card Group

```jsx
// QuickVitalsRow.jsx
Component: QuickVitalsRow

Props:
  - vitals: {
      heartRate: { value, unit, status },
      bloodPressure: { systolic, diastolic, unit, status },
      spO2: { value, unit, status },
      temperature: { value, unit, status }
    }
  - lastUpdate: timestamp
  - onTakeMeasurement: function

Sub-components:
  - VitalCard (reusable for each vital)
    - Displays: value (large, bold)
    - Shows: unit, status badge, trend
    - Color: status-based (green/yellow/red)

Responsive:
  - Desktop: 4 columns
  - Tablet: 2 columns × 2 rows
  - Mobile: 1 column, swipeable carousel
```

### 4. Key Metrics Cards

```jsx
// KeyMetricsSection.jsx

// Card 1: Weight Trend
Component: WeightTrendCard

Props:
  - currentWeight: number
  - goalWeight: number
  - unit: string
  - weeklyTrend: Array<{ date, weight }>
  - lastUpdate: timestamp

Display:
  ┌─ WEIGHT ─────────────────────┐
  │ Current: 72.5 kg              │
  │ Goal: 70 kg                   │
  │ Variance: +2.5 kg ↑           │
  │                               │
  │ [Sparkline chart trend]       │
  │ Weekly average: 72.8 kg       │
  │                               │
  │ [Add Weight] [View Chart]     │
  └───────────────────────────────┘

Features:
  - Mini sparkline chart
  - Progress toward goal
  - Variance indicator
  - Add button (floating action)


// Card 2: Medication Adherence
Component: MedicationAdherenceCard

Props:
  - activeMedications: number
  - adherenceRate: percentage
  - upcomingDoses: Array<{ drug, time, taken }>
  - thisWeekStats: { taken, missed, planned }

Display:
  ┌─ MEDICATIONS ─────────────────────┐
  │ 3 Active Medications               │
  │ Adherence This Week: 95% ✓         │
  │                                   │
  │ Daily: Mon✓ Tue✓ Wed✗ Thu✓       │
  │        Fri✓ Sat✓ Sun✓             │
  │                                   │
  │ Next dose: Metformin 500mg        │
  │ Today, 6:00 PM (in 2 hrs)        │
  │                                   │
  │ [View Schedule] [Add Reminder]    │
  └───────────────────────────────────┘

Features:
  - Daily checkmarks
  - Adherence percentage
  - Next dose highlight
  - Schedule management button


// Card 3: Upcoming Appointments
Component: UpcomingAppointmentsCard

Props:
  - appointments: Array<{
      id,
      type: string,
      doctor: string,
      date: datetime,
      location: string,
      status: 'scheduled' | 'pending' | 'completed'
    }>
  - maxShow: number (default 3)

Display:
  ┌─ UPCOMING APPOINTMENTS ─────────────┐
  │ Jan 25 · 10:00 AM                   │
  │ Cardiology Checkup                  │
  │ Dr. Smith | City Hospital           │
  │ [Add to Calendar] [Reschedule]     │
  │                                     │
  │ Jan 28 · 2:00 PM                   │
  │ Lab Work                            │
  │ Metro Lab | Downtown                │
  │ [Directions] [Cancel]              │
  │                                     │
  │ [Schedule New Appointment]          │
  └─────────────────────────────────────┘

Features:
  - Sorted by date (soonest first)
  - Doctor/location info
  - Quick actions (calendar, reschedule)
  - "Schedule New" CTA
```

### 5. Recent Activity Timeline

```jsx
// ActivityTimeline.jsx
Component: ActivityTimeline

Props:
  - activities: Array<{
      id,
      timestamp,
      type: 'weight' | 'medication' | 'lab' | 'note' | 'vital',
      title,
      details,
      status: 'completed' | 'pending' | 'warning'
    }>
  - maxShow: number (default 5)

Display:
  Jan 22 ─────────────────────────────
  │ ✓ Weight recorded: 72.5 kg
  │ Details: Measured at home
  │
  ├─ ✓ Medication taken: Metformin
  │ Details: 500mg at 8:00 AM
  │
  Jan 21 ─────────────────────────────
  ├─ ⚠ Lab results: Glucose 145 mg/dL
  │ Details: Slightly elevated, monitor
  │ [View Results]
  │
  ├─ 📝 Doctor's note received
  │ Details: Continue exercise routine
  │ [View Note]
  │
  Jan 20 ─────────────────────────────
  └─ ✓ Blood pressure: 120/80 mmHg

  [View Full Timeline] [See All Records]

Features:
  - Color-coded by type
  - Status indicators
  - Links to details
  - Reverse chronological order
  - "Show more" pagination
```

### 6. Quick Action Buttons (Bottom)

```jsx
// QuickActionsBar.jsx

Buttons (4-5):
  1. 📋 Medical Records
     → Navigate to records, documents, history
  
  2. 💊 Add Measurement
     → Form to input vital signs
  
  3. 📞 Message Doctor
     → Open messaging/contact form
  
  4. 🏥 Emergency Contacts
     → Quick access to emergency info
  
  5. ⚙️ Settings
     → Profile, preferences, privacy

Responsive:
  - Desktop: Inline buttons
  - Tablet: 2x2 grid
  - Mobile: Vertical stack or sliding carousel
```

---

## Data Requirements

### Patient Dashboard Data Model

```javascript
// Required data from backend
{
  // Patient Info
  patient: {
    id: UUID,
    firstName: string,
    lastName: string,
    age: number,
    dateOfBirth: date,
    gender: string,
    profileImage: url,
    medicalConditions: string[]
  },

  // Current Vitals (Latest)
  currentVitals: {
    heartRate: {
      value: number,
      unit: "bpm",
      status: "normal" | "warning" | "critical",
      timestamp: datetime,
      trend: "stable" | "increasing" | "decreasing"
    },
    bloodPressure: {
      systolic: number,
      diastolic: number,
      unit: "mmHg",
      status: "normal" | "warning" | "critical",
      timestamp: datetime
    },
    spO2: { value, unit, status, timestamp },
    temperature: { value, unit, status, timestamp },
    respiratoryRate: { value, unit, status, timestamp },
    weight: { value, unit, status, timestamp }
  },

  // Health Metrics
  healthMetrics: {
    weight: {
      current: { value: number, date: date },
      goal: number,
      history: [{ value, date }], // Last 30 days
      trend: "stable" | "increasing" | "decreasing"
    },
    bloodGlucose: {
      latest: { value, status, date },
      history: [{ value, date }] // Last 14 days
    },
    bloodPressureTrend: [{ systolic, diastolic, date }] // Last 30 days
  },

  // Medications
  medications: [
    {
      id: UUID,
      name: string,
      dosage: string,
      frequency: string, // "Once daily", "Twice daily", etc
      instructions: string,
      prescribedBy: string,
      startDate: date,
      endDate: date,
      status: "active" | "inactive" | "paused",
      adherenceThisWeek: percentage,
      nextDue: datetime
    }
  ],

  // Appointments
  appointments: [
    {
      id: UUID,
      type: string, // "Checkup", "Lab Work", "Surgery", etc
      doctor: string,
      location: string,
      date: datetime,
      duration: minutes,
      status: "scheduled" | "pending" | "completed" | "cancelled",
      notes: string
    }
  ],

  // Lab Results (Latest)
  labResults: [
    {
      id: UUID,
      testName: string,
      result: string,
      value: number,
      unit: string,
      referenceRange: { min, max },
      status: "normal" | "warning" | "critical",
      date: date,
      labName: string
    }
  ],

  // Recent Activity
  recentActivity: [
    {
      id: UUID,
      timestamp: datetime,
      type: "weight" | "medication" | "lab" | "note" | "vital",
      title: string,
      details: string,
      status: "completed" | "pending" | "warning"
    }
  ],

  // Alerts
  alerts: [
    {
      id: UUID,
      type: "critical" | "warning" | "info",
      title: string,
      description: string,
      suggestedAction: string,
      timestamp: datetime,
      dismissed: boolean
    }
  ]
}
```

### API Endpoints for Patient Dashboard

```javascript
// Core Dashboard Load
GET /api/patients/:patientId/dashboard
  → Returns: All data above (optimized for dashboard)
  → Cache: 5 minutes (vitals refresh more frequently)

// Real-time Vitals (if device integrated)
GET /api/patients/:patientId/vitals/latest
  → Returns: Current vitals only
  → Cache: 1 minute
  → Can subscribe via WebSocket

// Medication Adherence
GET /api/patients/:patientId/medications/adherence
  → Returns: Adherence stats for current week/month

// Activity Timeline
GET /api/patients/:patientId/activities?limit=10&offset=0
  → Returns: Paginated activity list

// Health Metrics Trends
GET /api/patients/:patientId/metrics/trends?metric=weight&days=30
  → Returns: Time series data for charts
```

---

## Responsive Design

### Mobile Layout (0-640px)

```
┌──────────────────────────────┐
│ Logo    Welcome, Sarah   🔔  │ Header
├──────────────────────────────┤
│                              │
│ [Alert if critical]          │ Alerts
│                              │
├──────────────────────────────┤
│ HR      BP      SpO2   TEMP  │ Vitals
│ 78bpm  120/80  98%   37°C    │ (Horizontal scroll)
├──────────────────────────────┤
│ Weight Trend Card            │ Metrics (Stacked)
├──────────────────────────────┤
│ Medication Card              │
├──────────────────────────────┤
│ Appointments Card            │
├──────────────────────────────┤
│ Activity Timeline            │
├──────────────────────────────┤
│ [Medical Records]            │ Quick Actions
│ [Add Measurement]            │ (Vertical Stack)
│ [Message Doctor]             │
└──────────────────────────────┘
```

### Tablet Layout (641-1024px)

```
┌──────────────────────────────────────────┐
│ Logo    Welcome, Sarah        🔔 👤      │ Header
├──────────────────────────────────────────┤
│ [Alert if critical]                      │ Alerts
├──────────────────────────────────────────┤
│ HR      BP      SpO2          TEMP       │ Vitals
│ 78bpm  120/80  98%           37°C       │ (2x2)
├──────────────────────────────────────────┤
│ Weight Trend    │  Medication Adherence │ Metrics
│                 │                       │ (2 columns)
├──────────────────────────────────────────┤
│ Upcoming Appointments (full width)       │
├──────────────────────────────────────────┤
│ Recent Activity Timeline                 │
├──────────────────────────────────────────┤
│ [Medical Records] [Add Measurement]      │ Quick Actions
│ [Message Doctor]  [Emergency Contacts]   │ (Horizontal)
└──────────────────────────────────────────┘
```

### Desktop Layout (1025px+)

Full layout as shown in Visual Hierarchy section above.

---

## Accessibility Features

### Keyboard Navigation

```
Tab Order:
1. Notification badge (if count > 0)
2. Upload Results button
3. Schedule Appointment button
4. Settings/Profile dropdown
5. Alert dismiss buttons (if present)
6. Vital cards (no focus needed, info only)
7. Metric cards (expandable links focusable)
8. Appointment links
9. Activity links
10. Quick action buttons (bottom)
```

### Screen Reader Optimization

```html
<!-- Example: Vital Sign Card -->
<div aria-label="Heart Rate Vital Sign">
  <span aria-hidden="true">❤️</span>
  <div aria-label="Current heart rate">
    <span aria-hidden="true">78</span> bpm
  </div>
  <div aria-label="Heart rate status: normal">
    Status: Normal <span aria-hidden="true">✓</span>
  </div>
  <div aria-label="Last updated 2 hours ago">
    Last: <time datetime="2024-01-22T16:30:00Z">2 hours ago</time>
  </div>
</div>

<!-- Alert Banner -->
<div role="alert" aria-live="assertive" aria-label="Alert">
  Blood pressure elevated: 158/92 mmHg
  <button aria-label="Dismiss alert">×</button>
</div>

<!-- Timeline -->
<ol role="list" aria-label="Recent health activity">
  <li><time datetime="2024-01-22">Jan 22</time> - Weight recorded</li>
</ol>
```

### Color Contrast

```
Text on card background: 4.5:1 ✓
Vital status badges: 3:1 + icon ✓
Links: Underlined + color ✓
Buttons: Clear focus state ✓
Charts: Legend + pattern + color ✓
```

---

## Loading & Error States

### Loading State

```
┌────────────────────────────────────────┐
│ Welcome, Sarah                         │
├────────────────────────────────────────┤
│ [Skeleton: Alert]                      │
├────────────────────────────────────────┤
│ [Skeleton: Vitals Row]                 │
├────────────────────────────────────────┤
│ [Skeleton: Metrics Cards] (3 cards)    │
├────────────────────────────────────────┤
│ [Skeleton: Appointments]               │
├────────────────────────────────────────┤
│ [Skeleton: Timeline]                   │
└────────────────────────────────────────┘

// Use skeleton loaders for faster perceived load
// Show cached data (last known vitals) if available
```

### Error State

```
┌────────────────────────────────────────┐
│ Welcome, Sarah                         │
├────────────────────────────────────────┤
│                                        │
│ ⚠ Unable to load dashboard data       │
│                                        │
│ This might be due to:                  │
│ • Connection issue                     │
│ • Server temporarily unavailable       │
│                                        │
│ [Retry] [Go to Medical Records]        │
│                                        │
│ Still need help? [Contact Support]     │
│                                        │
└────────────────────────────────────────┘

// Show what user can still do
// Offer alternatives
// Provide support contact
```

### Empty State (No Data Yet)

```
┌────────────────────────────────────────┐
│ Welcome, Sarah                         │
├────────────────────────────────────────┤
│                                        │
│ 📊 Your health dashboard is empty     │
│                                        │
│ Get started by:                        │
│                                        │
│ [+ Add Vitals]                         │
│ Record your blood pressure, weight...  │
│                                        │
│ [📤 Upload Results]                    │
│ Share lab results or reports           │
│                                        │
│ [📅 Schedule Checkup]                  │
│ Plan your next appointment             │
│                                        │
└────────────────────────────────────────┘
```

---

## Real-time Features

### Live Vital Updates

```javascript
// If wearable device integration available
// Update vitals every 60 seconds without full page reload

// Show loading indicator during update
Vitals: 78 bpm (last 5 secs ago) ⟳ Refreshing

// After update
Vitals: 79 bpm (now) ✓

// Failed update
Vitals: 78 bpm (data from 2 hrs ago)
[Last sync failed, retry]
```

### Notification Pushes

```
// Browser notification on critical event
Title: "Blood Pressure Alert"
Message: "Your BP is 158/92. Contact doctor if concerned."
Action: [View Results]

// In-app toast if user is active
┌──────────────────────────────┐
│ ⚠ Blood Pressure Alert       │
│ Your BP is elevated (158/92) │
│ [Learn More] [Dismiss]       │
└──────────────────────────────┘
```

---

## Performance Optimization

### Data Loading Strategy

```javascript
// Immediate (cached data)
- Patient name, profile
- Last known vitals
- Cached appointments

// Within 500ms (background load)
- Real-time vitals
- Recent lab results
- Activity timeline

// On demand (lazy load)
- Detailed health metrics
- Historical charts
- All medical records
- Full appointments calendar
```

### Chart Rendering

```javascript
// For weight trend chart over 30 days
- Don't render all 30 data points animated
- Use canvas library (Chart.js, Recharts)
- Load chart after other data
- Limit data points shown (every 3 days)
- Lazy load detailed view on click
```

---

## Integration Points

### With Other Components

```
PatientDashboard
├── AuthContext (user info, logout)
├── usePatients hook (fetch dashboard data)
├── useReports hook (recent reports)
├── useMedications hook (adherence)
├── useAppointments hook (upcoming)
├── useVitals hook (real-time if available)
└── Charts library (Recharts or Chart.js)

Related Pages:
├── MedicalRecordsPage (link from [Medical Records])
├── AppointmentSchedulingPage (link from [Schedule])
├── ReportUploadPage (link from [Upload Results])
├── MedicationPage (link from [Medications])
└── SettingsPage (link from settings menu)
```

---

## Component Checklist

### Components to Create

```
✅ PatientDashboardHeader
  - Logo, greeting, notifications, CTA buttons
  
✅ HealthAlertBanner
  - Alert display, dismiss functionality
  
✅ QuickVitalsRow
  - 4 vital cards in responsive grid
  
✅ VitalCard (sub-component)
  - Individual vital display with status
  
✅ WeightTrendCard
  - Sparkline chart, goal tracking
  
✅ MedicationAdherenceCard
  - Weekly adherence chart, next dose
  
✅ UpcomingAppointmentsCard
  - List of next 3 appointments
  
✅ ActivityTimeline
  - Chronological activity list
  
✅ QuickActionsBar
  - Bottom action buttons

✅ DashboardLayout (wrapper)
  - Responsive grid, sidebar
  
Optional: WelcomeTour
  - Guided tour for first-time users
  
Optional: HealthGoals
  - Mini section for user health goals
```

---

## Success Metrics

### Usability

- [ ] Dashboard loads in < 2 seconds
- [ ] Vitals visible within 500ms (cached data ok)
- [ ] All text readable at 14px minimum
- [ ] Touch targets > 44px
- [ ] Keyboard navigation works (tab through all interactive elements)
- [ ] Screen reader announces all content correctly

### Engagement

- [ ] Users open dashboard 5+ times/week
- [ ] Users take measurements within 1 week
- [ ] Medication adherence tracked for 80% of users
- [ ] Alerts are actionable (users respond to them)

### Data Quality

- [ ] < 5% data loading errors
- [ ] Real-time data updates within 1 minute
- [ ] No stale data older than 24 hours
- [ ] Lab results display with 99.9% accuracy

---

## Next Steps

1. Create React components in src/components/dashboard/patient/
2. Implement hooks in src/hooks/ for data fetching
3. Add responsive styling with Tailwind
4. Implement error boundaries
5. Add loading skeletons
6. Test accessibility with screen reader
7. Optimize performance (code splitting, lazy loading)
8. Add unit tests for components
9. Add E2E tests for critical flows
10. User testing with actual patients
