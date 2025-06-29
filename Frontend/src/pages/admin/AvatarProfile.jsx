import React, { useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';

const features = [
  { key: 'sex', icon: '🧑', options: ['man', 'woman'] },
  { key: 'hairStyle', icon: '💇‍♂️', options: ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'] },
  { key: 'eyeStyle', icon: '👀', options: ['circle', 'oval', 'smile'] },
  // add more as needed
];

const AvatarEditorModern = () => {
  const [config, setConfig] = useState(genConfig());
  const [activeFeature, setActiveFeature] = useState(null);
  const thumbnails = Array.from({ length: 10 }, () => genConfig());

  const handleFeatureClick = (key) => {
    setActiveFeature(key === activeFeature ? null : key);
  };

  const handleOptionSelect = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setActiveFeature(null);
  };

  const handleThumbnailClick = (newConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className=" min-h-screen text-white flex flex-col items-center py-10">
      <Avatar style={{ width: 160, height: 160 }} {...config} />

      {/* Feature buttons */}
      <div className="flex space-x-4 mt-8 bg-gray-800 p-2 rounded-full">
        {features.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFeatureClick(f.key)}
            className={`p-2 ${activeFeature === f.key ? 'bg-white text-black rounded-full' : ''}`}
          >
            {f.icon}
          </button>
        ))}
      </div>

      {/* Inline options for selected feature */}
      {activeFeature && (
        <div className="flex space-x-2 mt-4">
          {features
            .find((f) => f.key === activeFeature)
            .options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(activeFeature, opt)}
                className="px-3 py-1 bg-gray-700 rounded-full"
              >
                {opt}
              </button>
            ))}
        </div>
      )}

      {/* Thumbnails */}
      <div className="flex overflow-x-auto space-x-2 mt-10">
        {thumbnails.map((thumb, idx) => (
          <button key={idx} onClick={() => handleThumbnailClick(thumb)}>
            <Avatar
              style={{ width: 50, height: 50 }}
              {...thumb}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarEditorModern;
