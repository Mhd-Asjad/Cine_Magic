import React, { useState, useRef, useEffect } from 'react';
import { Settings, Palette, Shield, Globe, Save, Eye, EyeOff, Camera, Upload } from 'lucide-react';
import apiAdmin from '@/axios/api';
import { toast } from 'sonner';
import { CircleCheckBig , ShieldAlert } from 'lucide-react';
const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('security');
  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    primaryColor: '#3b82f6',
    allowRegistration: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const sections = [
    
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield,
      description: 'Manage your account security and password settings'
    },
    { 
      id: 'general', 
      label: 'General', 
      icon: Globe,
      description: 'Configure general application preferences'
    },
  ];
  useEffect(() => {
    fetchAdminSettings()
  },[])
  const fetchAdminSettings = async() => {
    try {
      const res = await apiAdmin.get('admin-settings/')
      const data = res.data;
      console.log(data)
      setAppSettings(prev =>  ({
        ...prev ,
        allowRegistration : data.allow_registration
      }))
    }catch(error){
      console.log('error while fetching admin settings', error)
    }
  }

  const handleSettingsSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await apiAdmin.post('admin-settings/', {
        'allow_registration' : appSettings.allowRegistration
      })
      if (res.status == 200 ){
        toast('settings updated successfully',{
          icon: <CircleCheckBig className="w-6 h-6 text-green-500" />,
          style: {
            backgroundColor: '#f0f9ff',
            color: '#0369a1',
          },
        });
      }
    }catch(error){
      console.log('error settings adding',error)
    }
  };

  const handlePasswordChange = async(e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast('New passwords do not match!',{
        icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
        style: {
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
        },
      });
      return;
    }
    console.log('Password change requested');

    try {
      const res = await apiAdmin.post('change-password/', {
        'old_password' : passwords.current,
        'new_password' : passwords.new
      })
      toast(res.data.message)
    }catch(error){
      console.log('error while changing password')
    }
    setPasswords({ current: '', new: '', confirm: '' });
  };

  // password changing section
  const renderSecurity = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Change Password
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Confirm new password"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Shield className="w-5 h-5" />
            <span>Update Password</span>
          </button>
        </div>
      </div>
    </div>
  );
  // handling general section
  const renderGeneral = () => (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-500" />
          Application Preferences
        </h3>
          <div className="space-y-4 mb-3">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <h4 className="font-medium text-gray-800">Allow Registration</h4>
                <p className="text-sm text-gray-600">Allow new users to register for the theatre</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appSettings.allowRegistration}
                  onChange={(e) => setAppSettings({...appSettings, allowRegistration: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          <button
            onClick={handleSettingsSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'security': return renderSecurity();
      case 'general': return renderGeneral();
      default: return renderSecurity();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 mt-10 to-white">
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 mb-8">
          <div className="flex space-x-1 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Description */}
        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            {sections.find(s => s.id === activeSection)?.description}
          </p>
        </div>

        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;