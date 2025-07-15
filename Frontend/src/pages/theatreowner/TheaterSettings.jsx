import React, { useState, useRef, useEffect } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import { Camera, Upload, Settings, CircleAlert , CircleCheckBig ,  User, Palette, Shuffle } from 'lucide-react';
import TheatreApi from '@/axios/theatreapi';
import { toast } from 'sonner';

const features = [
  { key: 'hairStyle', icon: '💇‍♂️', label: 'Hair', options: ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'] },
  { key: 'eyeStyle', icon: '👀', label: 'Eyes', options: ['circle', 'oval', 'smile'] },
  { key: 'noseStyle', icon: '👃', label: 'Nose', options: ['short', 'long', 'round'] },
  { key: 'mouthStyle', icon: '👄', label: 'Mouth', options: ['laugh', 'smile', 'peace'] },
  { key: 'eyeBrowStyle', icon: '🤨', label: 'Brows', options: ['up', 'upWoman'] },
];

const TheatreSettings = () => {
  const [config, setConfig] = useState(genConfig());
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeTab, setActiveTab] = useState('avatar');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ownerImg, setOwnerImg] = useState({ profile_pic: null, avatar_config: null });
  const fileInputRef = useRef(null);
  const thumbnails = Array.from({ length: 8 }, () => genConfig());

  useEffect(() => {
    const getOwnerProfile = async () => {
      try {
        const res = await TheatreApi.get('/theatre-profile/');
        console.log(res.data)
        setOwnerImg({
          profile_pic: res.data.profile_pic,
          avatar_config: res.data.avatar_config ? res.data.avatar_config : genConfig()
        });
        if (res.data.avatar_config) {
          setConfig(res.data.avatar_config);
          setActiveTab('avatar');
        } else if (res.data.profile_pic) {
          setUploadedImage(res.data.profile_pic);
          setActiveTab('upload');
        }
      } catch (error) {
        console.error('Error fetching theatre owner profile:', error);
      }
    };
    getOwnerProfile();
  }, []);

  const handleFeatureClick = (key) => {
    setActiveFeature(key === activeFeature ? null : key);
  };

  const handleOptionSelect = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setActiveFeature(null);
  };

  const handleThumbnailClick = (newConfig) => {
    setConfig(newConfig);
    setUploadedImage(null);
  };

  const handleRandomize = () => {
    setConfig(genConfig());
    setUploadedImage(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast('File size exceeds 10MB limit',{
          icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
          style: {
            backgroundColor: '#fff3cd',
            color: '#856404',
          },
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (activeTab === 'upload' && uploadedImage) {
      const blob = await fetch(uploadedImage).then(res => res.blob());
      formData.append('owner_photo', blob, 'profile.jpg');
      formData.append('avatar_config', 'null');
    } else if (activeTab === 'avatar') {
      try {
        const configString = JSON.stringify(config)
        JSON.parse(configString)
        formData.append('avatar_config', configString);
        formData.append('owner_photo', ''); 
      }catch(error){
        console.log('Invalid Json for avatar config',error)
        toast('Invalid avatar configuration');
        return;

      }
    } else {
      toast('Please select an avatar or upload an image',{
        icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
        style: {
          backgroundColor: '#fff3cd',
          color: '#856404',
        },
      });
      return;
    }

    try {
    console.log('Sending formData:', Object.fromEntries(formData)); 
    const response = await TheatreApi.post('/theatre-profile/', formData , {
      headers : {
        'Content-Type': 'multipart/form-data',
      }
    });
      setOwnerImg({
        profile_pic: response.data.profile_pic,
        avatar_config: response.data.avatar_config
      });
      if (response.data.avatar_config) {
        setConfig(response.data.avatar_config);
      }
      toast(response.data.message,{
        icon: <CircleCheckBig className="w-6 h-6 text-green-500" />,
        style: {
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast(error.response?.data?.error || 'Failed to update profile',{
        icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
        style: {
          backgroundColor: '#fff3cd',
          color: '#856404',
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-slate-600">Customize your profile and preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Profile Image
        </h2>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'avatar'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            Custom Avatar
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
        </div>

        {activeTab === 'avatar' && (
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-2">
                  <Avatar style={{ width: '100%', height: '100%' }} {...config} />
                </div>
                <button
                  onClick={handleRandomize}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  title="Randomize Avatar"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700">Customize Features</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {features.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => handleFeatureClick(f.key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      activeFeature === f.key
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <div className="text-xs font-medium text-slate-600">{f.label}</div>
                  </button>
                ))}
              </div>

              {activeFeature && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-4">
                    Choose {features.find(f => f.key === activeFeature)?.label}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {features
                      .find((f) => f.key === activeFeature)
                      ?.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(activeFeature, opt)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                            config[activeFeature] === opt
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {opt.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Quick Select</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(thumb)}
                    className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-slate-200 hover:border-blue-400 transition-all duration-200 hover:scale-110 overflow-hidden shadow-md hover:shadow-lg"
                  >
                    <Avatar style={{ width: '100%', height: '100%' }} {...thumb} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : ownerImg.profile_pic ? (
                  <img
                    src={ownerImg.profile_pic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-16 h-16 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium mb-2">
                  Click to upload your photo
                </p>
                <p className="text-sm text-slate-500">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheatreSettings;