import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Email</h2>
            <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">Account Created</h2>
            <p className="mt-1 text-sm text-gray-600">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 