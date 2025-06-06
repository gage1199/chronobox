import { useState } from 'react'

interface TrustedContact {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface TrustedContactsSectionProps {
  trustedContacts: TrustedContact[]
  onUpdate: () => void
  disabled?: boolean
}

export default function TrustedContactsSection({ 
  trustedContacts, 
  onUpdate, 
  disabled = false 
}: TrustedContactsSectionProps) {
  const [newContacts, setNewContacts] = useState<Array<{ email: string; role: string }>>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roles = [
    { value: 'Executor', label: 'Executor', description: 'Primary person responsible for carrying out your digital will' },
    { value: 'Family', label: 'Family Member', description: 'Close family member who should have access' },
    { value: 'Friend', label: 'Close Friend', description: 'Trusted friend who should receive your memories' },
    { value: 'Attorney', label: 'Attorney/Legal', description: 'Legal representative or attorney' }
  ]

  const addNewContactRow = () => {
    setNewContacts(prev => [...prev, { email: '', role: 'Family' }])
  }

  const removeNewContactRow = (index: number) => {
    setNewContacts(prev => prev.filter((_, i) => i !== index))
  }

  const updateNewContact = (index: number, field: 'email' | 'role', value: string) => {
    setNewContacts(prev => prev.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    ))
  }

  const validateContacts = () => {
    for (const contact of newContacts) {
      if (!contact.email || !contact.role) {
        return false
      }
      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(contact.email)) {
        return false
      }
    }
    return true
  }

  const saveTrustedContacts = async () => {
    if (!validateContacts()) {
      setError('Please fill in all fields with valid email addresses')
      return
    }

    try {
      setSaving(true)
      setError(null)

      // Combine existing and new contacts
      const allContacts = [
        ...trustedContacts.map(tc => ({ email: tc.email, role: tc.role })),
        ...newContacts.filter(nc => nc.email && nc.role)
      ]

      const response = await fetch('/api/profile/trusted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts: allContacts })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update trusted contacts')
      }

      // Clear new contacts and refresh data
      setNewContacts([])
      onUpdate()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contacts')
    } finally {
      setSaving(false)
    }
  }

  const removeTrustedContact = async (contactId: string) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`/api/profile/trusted/${contactId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove contact')
      }

      onUpdate()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove contact')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Existing Trusted Contacts */}
      {trustedContacts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Current Trusted Contacts
          </h3>
          <div className="space-y-3">
            {trustedContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                        {contact.name?.charAt(0) || contact.email.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {contact.name || contact.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {contact.email} • {contact.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeTrustedContact(contact.id)}
                  disabled={disabled || saving}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Contacts */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Add Trusted Contacts
        </h3>
        
        {newContacts.length > 0 && (
          <div className="space-y-3 mb-4">
            {newContacts.map((contact, index) => (
              <div key={index} className="flex items-end space-x-3 p-3 border border-slate-200 dark:border-slate-600 rounded-lg">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateNewContact(index, 'email', e.target.value)}
                    disabled={disabled || saving}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white"
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="w-40">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Role
                  </label>
                  <select
                    value={contact.role}
                    onChange={(e) => updateNewContact(index, 'role', e.target.value)}
                    disabled={disabled || saving}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:text-white"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeNewContactRow(index)}
                  disabled={disabled || saving}
                  className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Contact Button */}
        <button
          onClick={addNewContactRow}
          disabled={disabled || saving}
          className="w-full p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Trusted Contact</span>
          </div>
        </button>
      </div>

      {/* Role Descriptions */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role Descriptions:</h4>
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
          {roles.map(role => (
            <div key={role.value}>
              <span className="font-medium">{role.label}:</span> {role.description}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Save Button */}
      {newContacts.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={saveTrustedContacts}
            disabled={disabled || saving || !validateContacts()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Trusted Contacts'
            )}
          </button>
        </div>
      )}

      {/* Requirement Notice */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        <p>At least one trusted contact is required to complete your profile setup.</p>
        <p>Trusted contacts will be able to access your memories according to your release policy.</p>
      </div>
    </div>
  )
} 