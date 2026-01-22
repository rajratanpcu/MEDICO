// DesignSystemShowcase.jsx
// Complete showcase of the medical design system

import React, { useState } from 'react'
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Heart,
  Users,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react'

export default function DesignSystemShowcase() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-medical-500" />
            <h1 className="text-h4 font-bold text-neutral-900">Medical Design System</h1>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-700" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-neutral-200 p-4 space-y-2">
            <a href="#colors" className="block text-body-md text-medical-600 hover:text-medical-700">
              Colors
            </a>
            <a href="#typography" className="block text-body-md text-medical-600 hover:text-medical-700">
              Typography
            </a>
            <a href="#components" className="block text-body-md text-medical-600 hover:text-medical-700">
              Components
            </a>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-50 to-neutral-50 py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-display-sm md:text-display-md font-bold text-neutral-900 mb-4">
            Professional Medical Design
          </h2>
          <p className="text-body-lg md:text-body-lg text-neutral-700 max-w-2xl">
            A comprehensive design system built for healthcare applications. Trustworthy, 
            accessible, and mobile-responsive.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Color Palette Section */}
        <section id="colors" className="mb-16">
          <h3 className="text-h2 font-bold text-neutral-900 mb-8">Color Palette</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Blue */}
            <ColorCard
              title="Primary Blue"
              description="Trust & Stability"
              color="bg-medical-500"
              hexCode="#0ea5e9"
              usage="Primary actions, headers, key UI"
            />

            {/* Calm Green */}
            <ColorCard
              title="Calm Green"
              description="Wellness & Success"
              color="bg-calm-500"
              hexCode="#22c55e"
              usage="Success messages, confirmations"
            />

            {/* Alert Red */}
            <ColorCard
              title="Alert Red"
              description="Critical & Urgent"
              color="bg-red-500"
              hexCode="#ef4444"
              usage="Critical alerts, emergencies"
            />

            {/* Warning Amber */}
            <ColorCard
              title="Warning Amber"
              description="Caution & Review"
              color="bg-amber-500"
              hexCode="#f59e0b"
              usage="Warnings, needs review"
            />

            {/* Success Green */}
            <ColorCard
              title="Success Green"
              description="Positive Outcomes"
              color="bg-green-500"
              hexCode="#10b981"
              usage="Confirmations, healthy status"
            />

            {/* Info Blue */}
            <ColorCard
              title="Info Blue"
              description="Information & Tips"
              color="bg-blue-500"
              hexCode="#3b82f6"
              usage="Informational notifications"
            />
          </div>

          {/* Neutral Colors */}
          <div className="mt-12">
            <h4 className="text-h4 font-semibold text-neutral-900 mb-6">Neutral Palette</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: '50', value: 'neutral-50', hex: '#fafafa' },
                { name: '100', value: 'neutral-100', hex: '#f5f5f5' },
                { name: '200', value: 'neutral-200', hex: '#efefef' },
                { name: '300', value: 'neutral-300', hex: '#e5e5e5' },
                { name: '700', value: 'neutral-700', hex: '#525252' },
                { name: '900', value: 'neutral-900', hex: '#262626' },
              ].map(shade => (
                <div key={shade.value} className="space-y-2">
                  <div className={`w-full h-24 rounded-lg bg-${shade.value} border border-neutral-200`} />
                  <div>
                    <p className="text-label font-medium text-neutral-900">{shade.name}</p>
                    <p className="text-caption text-neutral-600">{shade.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section id="typography" className="mb-16">
          <h3 className="text-h2 font-bold text-neutral-900 mb-8">Typography</h3>

          <div className="space-y-8">
            {/* Display */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8">
              <p className="text-label font-medium text-medical-600 mb-2">Display Large</p>
              <h1 className="text-display-md font-bold text-neutral-900">
                Welcome to Your Medical Dashboard
              </h1>
              <p className="text-caption text-neutral-600 mt-2">56px, Bold, Line height 1.1</p>
            </div>

            {/* H1 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8">
              <p className="text-label font-medium text-medical-600 mb-2">Heading 1</p>
              <h2 className="text-h1 font-bold text-neutral-900">
                Patient Management System
              </h2>
              <p className="text-caption text-neutral-600 mt-2">30px, Bold, Line height 1.3</p>
            </div>

            {/* H2 */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8">
              <p className="text-label font-medium text-medical-600 mb-2">Heading 2</p>
              <h3 className="text-h2 font-semibold text-neutral-900">
                Recent Patient Records
              </h3>
              <p className="text-caption text-neutral-600 mt-2">24px, Semibold, Line height 1.4</p>
            </div>

            {/* Body */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8">
              <p className="text-label font-medium text-medical-600 mb-4">Body Text</p>
              <p className="text-body-lg text-neutral-700 mb-4">
                <span className="inline-block bg-medical-100 px-2 py-1 rounded mr-2">Large (18px)</span>
                This is body large text, used for main content and important information 
                that requires emphasis and readability.
              </p>
              <p className="text-body-md text-neutral-700 mb-4">
                <span className="inline-block bg-medical-100 px-2 py-1 rounded mr-2">Medium (16px)</span>
                This is body medium text, the standard size for most content areas in the application.
              </p>
              <p className="text-body-sm text-neutral-700 mb-4">
                <span className="inline-block bg-medical-100 px-2 py-1 rounded mr-2">Small (14px)</span>
                This is body small text, used for secondary information and helper text.
              </p>
              <p className="text-body-xs text-neutral-600">
                <span className="inline-block bg-medical-100 px-2 py-1 rounded mr-2">Extra Small (12px)</span>
                This is body extra small, used for metadata and timestamps.
              </p>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section id="components" className="mb-16">
          <h3 className="text-h2 font-bold text-neutral-900 mb-8">Components</h3>

          {/* Buttons */}
          <div className="mb-12">
            <h4 className="text-h4 font-semibold text-neutral-900 mb-6">Buttons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
                <p className="text-label font-medium text-neutral-700">Primary Button</p>
                <button className="w-full bg-medical-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-medical-600 active:bg-medical-700 focus:ring-4 focus:ring-medical-200 transition-colors duration-200">
                  Primary Action
                </button>
                <button disabled className="w-full bg-neutral-300 text-neutral-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                  Disabled Button
                </button>
              </div>

              <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
                <p className="text-label font-medium text-neutral-700">Secondary Button</p>
                <button className="w-full bg-neutral-100 text-neutral-900 px-6 py-3 rounded-lg font-semibold border border-neutral-200 hover:bg-neutral-200 focus:ring-4 focus:ring-neutral-100 transition-colors duration-200">
                  Secondary Action
                </button>
                <button className="w-full bg-red-50 text-red-600 px-6 py-3 rounded-lg font-semibold border border-red-200 hover:bg-red-100 focus:ring-4 focus:ring-red-100 transition-colors duration-200">
                  Danger Action
                </button>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="mb-12">
            <h4 className="text-h4 font-semibold text-neutral-900 mb-6">Alert Components</h4>
            <div className="space-y-4">
              <Alert
                type="critical"
                title="Critical Alert"
                message="Immediate attention required for patient vitals"
                icon={<AlertCircle className="w-5 h-5" />}
              />
              <Alert
                type="warning"
                title="Warning"
                message="This record requires verification before proceeding"
                icon={<AlertTriangle className="w-5 h-5" />}
              />
              <Alert
                type="success"
                title="Success"
                message="Patient information updated successfully"
                icon={<CheckCircle className="w-5 h-5" />}
              />
              <Alert
                type="info"
                title="Information"
                message="New patient records are available for review"
                icon={<Info className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Input Fields */}
          <div className="mb-12">
            <h4 className="text-h4 font-semibold text-neutral-900 mb-6">Input Fields</h4>
            <div className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8 space-y-6">
              <div>
                <label className="text-label font-medium text-neutral-700 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 placeholder-neutral-400 text-body-md transition-colors duration-200"
                />
                <p className="text-caption text-neutral-500 mt-1">Helper text for additional context</p>
              </div>

              <div>
                <label className="text-label font-medium text-neutral-700 mb-2 block">
                  Patient ID
                </label>
                <input
                  type="text"
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-medical-500 focus:ring-4 focus:ring-medical-100 placeholder-neutral-400 text-body-md transition-colors duration-200"
                />
              </div>

              <div>
                <label className="text-label font-medium text-neutral-700 mb-2 block">
                  Disabled Input
                </label>
                <input
                  type="text"
                  value="This field is disabled"
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h4 className="text-h4 font-semibold text-neutral-900 mb-6">Card Layouts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                icon={<Users className="w-6 h-6 text-medical-600" />}
                title="Patients"
                value="1,234"
                description="Active patients in the system"
                trend="+12% from last month"
              />
              <Card
                icon={<FileText className="w-6 h-6 text-medical-600" />}
                title="Reports"
                value="567"
                description="Processed medical reports"
                trend="+24% from last month"
              />
              <Card
                icon={<Heart className="w-6 h-6 text-calm-600" />}
                title="Health Score"
                value="92/100"
                description="Average patient health index"
                trend="Stable"
              />
              <Card
                icon={<Settings className="w-6 h-6 text-neutral-600" />}
                title="System Status"
                value="Operational"
                description="All services running normally"
                trend="Uptime: 99.9%"
              />
            </div>
          </div>
        </section>

        {/* Responsive Section */}
        <section className="mb-16">
          <h3 className="text-h2 font-bold text-neutral-900 mb-8">Responsive Design</h3>
          
          <div className="bg-white border border-neutral-200 rounded-lg p-6 md:p-8 space-y-6">
            <div>
              <p className="text-label font-medium text-medical-600 mb-3">Responsive Grid</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="h-24 bg-medical-100 rounded-lg flex items-center justify-center text-neutral-700 font-semibold"
                  >
                    Column {i}
                  </div>
                ))}
              </div>
              <p className="text-caption text-neutral-600 mt-2">
                1 column on mobile, 2 on tablet, 3 on desktop
              </p>
            </div>

            <div>
              <p className="text-label font-medium text-medical-600 mb-3">Mobile Typography</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900">
                Responsive Text Scaling
              </h2>
              <p className="text-caption text-neutral-600 mt-2">
                Text sizes automatically scale based on screen size
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-100 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-h5 font-semibold mb-4">Design System</h4>
              <p className="text-body-sm text-neutral-400">
                Professional healthcare design guidelines for accessibility and usability.
              </p>
            </div>
            <div>
              <h4 className="text-h5 font-semibold mb-4">Colors</h4>
              <ul className="space-y-2 text-body-sm text-neutral-400">
                <li>Medical Blue #0ea5e9</li>
                <li>Calm Green #22c55e</li>
                <li>Alert Red #ef4444</li>
              </ul>
            </div>
            <div>
              <h4 className="text-h5 font-semibold mb-4">Typography</h4>
              <ul className="space-y-2 text-body-sm text-neutral-400">
                <li>Font: Inter, System UI</li>
                <li>Body: 16px</li>
                <li>Headings: 24-56px</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-body-sm text-neutral-500">
            <p>Medical Design System v1.0 | WCAG AA Accessible | Mobile Responsive</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Color Card Component
function ColorCard({ title, description, color, hexCode, usage }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`${color} h-32`} />
      <div className="p-4">
        <h4 className="text-h5 font-semibold text-neutral-900">{title}</h4>
        <p className="text-body-sm text-neutral-600">{description}</p>
        <p className="text-label font-mono text-medical-600 mt-2">{hexCode}</p>
        <p className="text-caption text-neutral-500 mt-3">{usage}</p>
      </div>
    </div>
  )
}

// Alert Component
function Alert({ type, title, message, icon }) {
  const styles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      text: 'text-red-900',
      subtext: 'text-red-800',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-900',
      subtext: 'text-amber-800',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-900',
      subtext: 'text-green-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-900',
      subtext: 'text-blue-800',
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex gap-3`}>
      <div className={`${style.icon} flex-shrink-0 mt-0.5`}>{icon}</div>
      <div>
        <h4 className={`font-semibold ${style.text}`}>{title}</h4>
        <p className={`text-body-sm ${style.subtext} mt-1`}>{message}</p>
      </div>
    </div>
  )
}

// Card Component
function Card({ icon, title, value, description, trend }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-medical-50 rounded-lg">
          {icon}
        </div>
        <span className="text-label font-medium text-calm-600">{trend}</span>
      </div>
      <h4 className="text-h5 font-semibold text-neutral-900">{title}</h4>
      <p className="text-display-sm font-bold text-medical-600 my-2">{value}</p>
      <p className="text-body-sm text-neutral-600">{description}</p>
    </div>
  )
}
