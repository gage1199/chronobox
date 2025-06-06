import { useState, useEffect } from 'react'

interface ProfileData {
  twoFactor: boolean
  phoneNumber?: string
  notifications: {
    emailOnUnlock: boolean
    notifyOnShare: boolean
    reminderAfterInactivity: boolean
  }
}

interface SecurityNotificationsSectionProps {
  profile: ProfileData
  onUpdate: (updates: Partial<ProfileData>) => void
  disabled?: boolean
}

export default function SecurityNotificationsSection({ 
  profile, 
  onUpdate, 
  disabled = false 
}: SecurityNotificationsSectionProps) {
  const [formData, setFormData] = useState({
    twoFactor: profile.twoFactor,
    phoneNumber: profile.phoneNumber || '',
    notifications: profile.notifications
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes
  useEffect(() => {
    const hasTwoFactorChange = formData.twoFactor !== profile.twoFactor
    const hasPhoneChange = formData.phoneNumber !== (profile.phoneNumber || '')
    const hasNotificationsChange = JSON.stringify(formData.notifications) !== JSON.stringify(profile.notifications)
    
    setHasChanges(hasTwoFactorChange || hasPhoneChange || hasNotificationsChange)
  }, [formData, profile])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate phone number if provided
    if (formData.phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      const cleanPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, '')
      
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phoneNumber = 'Please enter a valid phone number'
      }
    }

    // If two-factor is enabled, phone number should be provided
    if (formData.twoFactor && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required for two-factor authentication'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'phoneNumber') {
      setFormData(prev => ({ ...prev, phoneNumber: value as string }))
    } else if (field === 'twoFactor') {
      setFormData(prev => ({ ...prev, twoFactor: value as boolean }))
    } else if (field.startsWith('notifications.')) {
      const notificationKey = field.split('.')[1] as keyof typeof formData.notifications
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: value as boolean
        }
      }))
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = () => {
    if (!validateForm()) return

    const updates: Partial<ProfileData> = {}
    
    if (formData.twoFactor !== profile.twoFactor) {
      updates.twoFactor = formData.twoFactor
    }
    
    if (formData.phoneNumber !== (profile.phoneNumber || '')) {
      updates.phoneNumber = formData.phoneNumber.trim() || undefined
    }
    
    if (JSON.stringify(formData.notifications) !== JSON.stringify(profile.notifications)) {
      updates.notifications = formData.notifications
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(updates)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, '')
    
    // If it starts with +, preserve it
    if (cleaned.startsWith('+')) {
      return cleaned
    }
    
    // Otherwise, just return digits
    return cleaned.replace(/[^\d]/g, '')
  }

  return (
    <div className="space-y-6">
      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 ${
            errors.phoneNumber ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
          placeholder="+1234567890"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Used for account recovery and two-factor authentication.
        </p>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Two-Factor Authentication
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={() => handleInputChange('twoFactor', !formData.twoFactor)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
              formData.twoFactor 
                ? 'bg-amber-500' 
                : 'bg-slate-200 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                formData.twoFactor ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {formData.twoFactor && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Two-factor authentication is enabled. A phone number is required for SMS verification.
            </p>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          
          {/* Email on Unlock */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email when memories unlock
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get notified when a memory becomes available to you
              </p>
            </div>
            <button
              onClick={() => handleInputChange('notifications.emailOnUnlock', !formData.notifications.emailOnUnlock)}
              disabled={disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                formData.notifications.emailOnUnlock 
                  ? 'bg-amber-500' 
                  : 'bg-slate-200 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  formData.notifications.emailOnUnlock ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notify on Share */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Notify when trusted contact shares
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get notified when a trusted contact shares a memory with you
              </p>
            </div>
            <button
              onClick={() => handleInputChange('notifications.notifyOnShare', !formData.notifications.notifyOnShare)}
              disabled={disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                formData.notifications.notifyOnShare 
                  ? 'bg-amber-500' 
                  : 'bg-slate-200 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  formData.notifications.notifyOnShare ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reminder after Inactivity */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Inactivity reminders
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remind me if I haven't logged in for 30 days
              </p>
            </div>
            <button
              onClick={() => handleInputChange('notifications.reminderAfterInactivity', !formData.notifications.reminderAfterInactivity)}
              disabled={disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                formData.notifications.reminderAfterInactivity 
                  ? 'bg-amber-500' 
                  : 'bg-slate-200 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  formData.notifications.reminderAfterInactivity ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
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