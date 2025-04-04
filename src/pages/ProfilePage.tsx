import React from 'react';
import ProfileSettings from '../components/ProfileSettings';

const ProfilePage: React.FC = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>
      <ProfileSettings />
    </div>
  );
};

export default ProfilePage; 