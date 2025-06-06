import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Shield, 
  Bell, 
  Upload,
  Plus,
  Trash2,
  Save
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const ProfileSetupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    displayName: 'John Doe',
    dateOfBirth: '',
    timeZone: 'America/New_York',
    digitalWill: '',
    defaultRelease: 'VISIBLE_IMMEDIATELY',
    phoneNumber: '',
    twoFactor: false,
    emailUnlock: true,
    emailContact: true,
    emailInactivity: false
  });

  const [trustedContacts, setTrustedContacts] = useState([
    { id: 1, name: 'Jane Doe', email: 'jane@example.com', role: 'Spouse' }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Calculate profile completion percentage
  const calculateProgress = () => {
    const fields = [
      formData.displayName,
      formData.dateOfBirth,
      formData.timeZone,
      formData.defaultRelease,
      trustedContacts.length > 0
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = calculateProgress();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasChanges(true);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const addContact = () => {
    if (newContact.name && newContact.email && newContact.role) {
      setTrustedContacts(prev => [
        ...prev,
        { ...newContact, id: Date.now() }
      ]);
      setNewContact({ name: '', email: '', role: '' });
      setHasChanges(true);
    }
  };

  const removeContact = (id: number) => {
    setTrustedContacts(prev => prev.filter(contact => contact.id !== id));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Replace with actual API call
    console.log('Saving profile:', {
      ...formData,
      trustedContacts
    });
    
    setTimeout(() => {
      setLoading(false);
      setHasChanges(false);
      alert('Profile saved successfully!');
    }, 1500);
  };

  return (
    <DashboardLayout pageTitle="Complete Your Profile Setup">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Profile Completion</h2>
            <span className="text-2xl font-bold text-amber-600">{progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-amber-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-gray-600">
            {progress < 100 
              ? `Complete ${100 - progress}% more to finish your profile setup`
              : 'Congratulations! Your profile is complete'
            }
          </p>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-amber-600" />
                    </div>
                    <Button variant="secondary" size="sm" disabled>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Photo upload coming soon
                  </p>
                </div>

                <Input
                  label="Display Name"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Your preferred name"
                />

                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  helpText="Used for legacy planning purposes"
                />

                <div>
                  <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    id="timeZone"
                    name="timeZone"
                    value={formData.timeZone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (EST/EDT)</option>
                    <option value="America/Chicago">Central Time (CST/CDT)</option>
                    <option value="America/Denver">Mountain Time (MST/MDT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Legacy Settings */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">Legacy Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="digitalWill" className="block text-sm font-medium text-gray-700 mb-1">
                    Digital Will Summary
                  </label>
                  <textarea
                    id="digitalWill"
                    name="digitalWill"
                    rows={4}
                    value={formData.digitalWill}
                    onChange={handleInputChange}
                    placeholder="Brief summary of your digital legacy wishes..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Digital will functionality coming soon
                  </p>
                </div>

                <div>
                  <label htmlFor="defaultRelease" className="block text-sm font-medium text-gray-700 mb-1">
                    Default Release Policy
                  </label>
                  <select
                    id="defaultRelease"
                    name="defaultRelease"
                    value={formData.defaultRelease}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="VISIBLE_IMMEDIATELY">Visible Immediately</option>
                    <option value="HOLD_UNTIL_DEATH">Hold Until Death</option>
                    <option value="HOLD_30_DAYS">Hold for 30 Days After Creation</option>
                    <option value="HOLD_1_YEAR">Hold for 1 Year After Creation</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    This will be the default for new memories
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Trusted Contacts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">Trusted Contacts</h3>
              </div>
              <span className="text-sm text-gray-500">
                {trustedContacts.length} contact{trustedContacts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Existing Contacts */}
            {trustedContacts.length > 0 && (
              <div className="mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Name</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Email</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Role</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trustedContacts.map((contact) => (
                        <tr key={contact.id} className="border-b border-gray-100">
                          <td className="py-3 text-sm text-gray-900">{contact.name}</td>
                          <td className="py-3 text-sm text-gray-600">{contact.email}</td>
                          <td className="py-3 text-sm text-gray-600">{contact.role}</td>
                          <td className="py-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeContact(contact.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Add New Contact */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Add Trusted Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Name"
                  name="name"
                  type="text"
                  value={newContact.name}
                  onChange={handleContactChange}
                  placeholder="Contact's full name"
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={newContact.email}
                  onChange={handleContactChange}
                  placeholder="contact@example.com"
                />
                
                <div>
                  <label htmlFor="newContactRole" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="newContactRole"
                    name="role"
                    value={newContact.role}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select role</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Executor">Executor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={addContact}
                disabled={!newContact.name || !newContact.email || !newContact.role}
                className="mt-4"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </Card>

          {/* Security & Notifications */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security & Notifications</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Security</h4>
                <div className="space-y-3">
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    helpText="For account recovery and 2FA"
                  />
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="twoFactor"
                      checked={formData.twoFactor}
                      onChange={handleInputChange}
                      disabled
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Enable Two-Factor Authentication
                      </span>
                      <p className="text-xs text-gray-500">Coming soon</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="emailUnlock"
                      checked={formData.emailUnlock}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Email me when a memory unlocks
                      </span>
                      <p className="text-xs text-gray-500">
                        Get notified when scheduled memories become available
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="emailContact"
                      checked={formData.emailContact}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Notify me when a trusted contact shares a memory
                      </span>
                      <p className="text-xs text-gray-500">
                        Stay updated on shared content
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="emailInactivity"
                      checked={formData.emailInactivity}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Remind me after 30 days of inactivity
                      </span>
                      <p className="text-xs text-gray-500">
                        Gentle reminders to keep adding memories
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !hasChanges}
              size="lg"
              className="px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSetupPage; 