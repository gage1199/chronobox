import { useState, useEffect } from 'react'

interface ProfileData {
  willStatement?: string
  defaultRelease: 'VISIBLE_IMMEDIATELY' | 'HOLD_UNTIL_DEATH' | 'HOLD_FOR_DAYS_AFTER_CREATION'
  defaultReleaseAfterDays?: number
}

interface DigitalWillSectionProps {
  profile: ProfileData
  onUpdate: (updates: Partial<ProfileData>) => void
  disabled?: boolean
}

export default function DigitalWillSection({ 
  profile, 
  onUpdate, 
  disabled = false 
}: DigitalWillSectionProps) {
  const [formData, setFormData] = useState({
    willStatement: profile.willStatement || '',
    defaultRelease: profile.defaultRelease || 'VISIBLE_IMMEDIATELY',
    defaultReleaseAfterDays: profile.defaultReleaseAfterDays || 30
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [charCount, setCharCount] = useState(profile.willStatement?.length || 0)

  // Track changes
  useEffect(() => {
    const hasWillChange = formData.willStatement !== (profile.willStatement || '')
    const hasReleaseChange = formData.defaultRelease !== profile.defaultRelease
    const hasDaysChange = formData.defaultReleaseAfterDays !== (profile.defaultReleaseAfterDays || 30)
    
    setHasChanges(hasWillChange || hasReleaseChange || hasDaysChange)
  }, [formData, profile])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate will statement
    if (formData.willStatement.length > 500) {
      newErrors.willStatement = 'Will statement must be 500 characters or less'
    }

    // Validate days if using HOLD_FOR_DAYS_AFTER_CREATION
    if (formData.defaultRelease === 'HOLD_FOR_DAYS_AFTER_CREATION') {
      if (!formData.defaultReleaseAfterDays || formData.defaultReleaseAfterDays < 1) {
        newErrors.defaultReleaseAfterDays = 'Number of days must be at least 1'
      } else if (formData.defaultReleaseAfterDays > 365) {
        newErrors.defaultReleaseAfterDays = 'Number of days cannot exceed 365'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Update character count for will statement
    if (field === 'willStatement') {
      setCharCount((value as string).length)
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = () => {
    if (!validateForm()) return

    const updates: Partial<ProfileData> = {}
    
    if (formData.willStatement !== (profile.willStatement || '')) {
      updates.willStatement = formData.willStatement.trim()
    }
    
    if (formData.defaultRelease !== profile.defaultRelease) {
      updates.defaultRelease = formData.defaultRelease
    }
    
    if (formData.defaultReleaseAfterDays !== (profile.defaultReleaseAfterDays || 30)) {
      updates.defaultReleaseAfterDays = formData.defaultReleaseAfterDays
    }

    if (Object.keys(updates).length > 0) {
      onUpdate(updates)
    }
  }

  const releaseOptions = [
    {
      value: 'VISIBLE_IMMEDIATELY',
      label: 'Visible Immediately',
      description: 'Memories are visible to trusted contacts as soon as they are uploaded'
    },
    {
      value: 'HOLD_UNTIL_DEATH',
      label: 'Hold Until My Passing',
      description: 'Memories will only be released after my death is confirmed'
    },
    {
      value: 'HOLD_FOR_DAYS_AFTER_CREATION',
      label: 'Hold for Specific Days',
      description: 'Memories will be released after a specified number of days from creation'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Will Statement */}
      <div>
        <label htmlFor="willStatement" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Digital Will Statement
        </label>
        <div className="relative">
          <textarea
            id="willStatement"
            value={formData.willStatement}
            onChange={(e) => handleInputChange('willStatement', e.target.value)}
            disabled={disabled}
            rows={4}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 resize-none ${
              errors.willStatement ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
            }`}
            placeholder="Write a message for your loved ones about your digital memories..."
          />
          <div className="absolute bottom-2 right-2 text-xs text-slate-400 dark:text-slate-500">
            {charCount}/500
          </div>
        </div>
        {errors.willStatement && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.willStatement}</p>
        )}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          This message will be shown to your trusted contacts when your memories are released.
        </p>
      </div>

      {/* Default Release Policy */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Default Release Policy *
        </label>
        <div className="space-y-3">
          {releaseOptions.map((option) => (
            <div key={option.value} className="relative">
              <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                <input
                  type="radio"
                  name="defaultRelease"
                  value={option.value}
                  checked={formData.defaultRelease === option.value}
                  onChange={(e) => handleInputChange('defaultRelease', e.target.value)}
                  disabled={disabled}
                  className="mt-1 h-4 w-4 text-amber-500 focus:ring-amber-500 border-slate-300 dark:border-slate-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {option.description}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Days Input for HOLD_FOR_DAYS_AFTER_CREATION */}
      {formData.defaultRelease === 'HOLD_FOR_DAYS_AFTER_CREATION' && (
        <div>
          <label htmlFor="defaultReleaseAfterDays" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Days *
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="defaultReleaseAfterDays"
              value={formData.defaultReleaseAfterDays}
              onChange={(e) => handleInputChange('defaultReleaseAfterDays', parseInt(e.target.value) || 0)}
              disabled={disabled}
              min={1}
              max={365}
              className={`w-32 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800 ${
                errors.defaultReleaseAfterDays ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">days after memory creation</span>
          </div>
          {errors.defaultReleaseAfterDays && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.defaultReleaseAfterDays}</p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Memories will automatically become available after this many days.
          </p>
        </div>
      )}

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