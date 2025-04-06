import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  dietary_preferences: string[];
  allergies: string[];
  cooking_skill: string;
  household_size: number;
}

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    full_name: '',
    avatar_url: null,
    dietary_preferences: [],
    allergies: [],
    cooking_skill: 'intermediate',
    household_size: 1,
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newPreference, setNewPreference] = useState('');

  // Common dietary preferences options
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Keto',
    'Paleo',
    'Low-Carb',
    'Low-Fat',
    'Pescatarian',
    'Mediterranean',
    'Dairy-Free',
  ];

  // Common allergies options
  const allergyOptions = [
    'Peanuts',
    'Tree Nuts',
    'Milk',
    'Eggs',
    'Fish',
    'Shellfish',
    'Soy',
    'Wheat',
    'Gluten',
  ];

  // Cooking skill levels
  const skillLevels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          dietary_preferences: data.dietary_preferences || [],
          allergies: data.allergies || [],
          cooking_skill: data.cooking_skill || 'intermediate',
          household_size: data.household_size || 1,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError(null);
      setSuccess(false);

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        dietary_preferences: profile.dietary_preferences,
        allergies: profile.allergies,
        cooking_skill: profile.cooking_skill,
        household_size: profile.household_size,
        updated_at: new Date(),
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy && !profile.allergies.includes(newAllergy)) {
      setProfile({
        ...profile,
        allergies: [...profile.allergies, newAllergy],
      });
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setProfile({
      ...profile,
      allergies: profile.allergies.filter(a => a !== allergy),
    });
  };

  const handleAddPreference = () => {
    if (newPreference && !profile.dietary_preferences.includes(newPreference)) {
      setProfile({
        ...profile,
        dietary_preferences: [...profile.dietary_preferences, newPreference],
      });
      setNewPreference('');
    }
  };

  const handleRemovePreference = (preference: string) => {
    setProfile({
      ...profile,
      dietary_preferences: profile.dietary_preferences.filter(p => p !== preference),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Update your personal information and preferences</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="input bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="fullName" className="label">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={profile.full_name || ''}
              onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              className="input"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="cookingSkill" className="label">
              Cooking Skill Level
            </label>
            <select
              id="cookingSkill"
              value={profile.cooking_skill}
              onChange={e => setProfile({ ...profile, cooking_skill: e.target.value })}
              className="input"
            >
              {skillLevels.map(skill => (
                <option key={skill} value={skill}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="householdSize" className="label">
              Household Size
            </label>
            <input
              type="number"
              id="householdSize"
              min="1"
              max="20"
              value={profile.household_size}
              onChange={e => setProfile({ ...profile, household_size: parseInt(e.target.value) })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.dietary_preferences.map(preference => (
                <div
                  key={preference}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {preference}
                  <button
                    type="button"
                    onClick={() => handleRemovePreference(preference)}
                    className="ml-2 focus:outline-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex">
              <select
                value={newPreference}
                onChange={e => setNewPreference(e.target.value)}
                className="input rounded-r-none flex-1"
              >
                <option value="">Select or type a preference...</option>
                {dietaryOptions
                  .filter(option => !profile.dietary_preferences.includes(option))
                  .map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAddPreference}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="label">Food Allergies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.allergies.map(allergy => (
                <div
                  key={allergy}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(allergy)}
                    className="ml-2 focus:outline-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex">
              <select
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                className="input rounded-r-none flex-1"
              >
                <option value="">Select or type an allergy...</option>
                {allergyOptions
                  .filter(option => !profile.allergies.includes(option))
                  .map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={handleAddAllergy}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className={`btn btn-primary w-full ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
