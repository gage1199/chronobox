import { useState, useEffect } from 'react'

interface ProfileData {
  name?: string
  dateOfBirth?: string
  timeZone?: string
}

interface BasicInfoSectionProps {
  profile: ProfileData
  onUpdate: (updates: Partial<ProfileData>) => void
  disabled?: boolean
}

export default function BasicInfoSection({ 
  profile, 
  onUpdate, 
  disabled = false 
}: BasicInfoSectionProps) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
    timeZone: profile.timeZone || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Auto-detect timezone on mount
  useEffect(() => {
    if (!profile.timeZone) {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      setFormData(prev => ({ ...prev, timeZone: detectedTimeZone }))
      setHasChanges(true)
    }
  }, [profile.timeZone])

  // Track changes
  useEffect(() => {
    const originalDateOfBirth = profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''
    const hasNameChange = formData.name !== (profile.name || '')
    const hasDateChange = formData.dateOfBirth !== originalDateOfBirth
    const hasTimeZoneChange = formData.timeZone !== (profile.timeZone || '')
    
    setHasChanges(hasNameChange || hasDateChange || hasTimeZoneChange)
  }, [formData, profile])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Display name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Display name must be at least 2 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Display name must be less than 50 characters'
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future'
      } else if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old'
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth'
      }
    }

    // Validate timezone
    if (!formData.timeZone) {
      newErrors.timeZone = 'Time zone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = () => {
    if (!validateForm()) return

    const updates: Partial<ProfileData> = {}
    
    if (formData.name !== (profile.name || '')) {
      updates.name = formData.name.trim()
    }
    
    if (formData.dateOfBirth !== (profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '')) {
      updates.dateOfBirth = formData.dateOfBirth
    }
    
    if (formData.timeZone !== (profile.timeZone || '')) {
      updates.timeZone = formData.timeZone
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(updates)
    }
  }

  // Popular timezones for easier selection
  const popularTimezones = [
    'America/New_York',
    'America/Chicago', 
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]

  return (
    <div className="space-y-6">
      {/* Display Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Display Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 ${
            errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
          placeholder="Your display name"
          maxLength={50}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Date of Birth *
        </label>
        <input
          type="date"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          disabled={disabled}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 ${
            errors.dateOfBirth ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dateOfBirth}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          This helps us understand when to release your memories according to your preferences.
        </p>
      </div>

      {/* Time Zone */}
      <div>
        <label htmlFor="timeZone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Time Zone *
        </label>
        <select
          id="timeZone"
          value={formData.timeZone}
          onChange={(e) => handleInputChange('timeZone', e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 ${
            errors.timeZone ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          <option value="">Select your time zone</option>
          <optgroup label="Popular Time Zones">
            {popularTimezones.map(tz => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, ' ')} ({new Date().toLocaleString('en-US', { timeZone: tz, timeZoneName: 'short' }).split(', ')[1]})
              </option>
            ))}
          </optgroup>
          <optgroup label="All Time Zones">
            {Intl.supportedValuesOf('timeZone').map(tz => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, ' ')}
              </option>
            ))}
          </optgroup>
        </select>
        {errors.timeZone && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.timeZone}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Used for scheduling memory releases and notifications.
        </p>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={disabled || Object.keys(errors).length > 0}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
} 