import React, { useEffect, useState } from 'react';

const ProfilePage = ({ user }) => {
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {profile ? (
        <div>
          <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Contact:</strong> {profile.contactNumber}</p>
          <p><strong>State:</strong> {profile.state}</p>
          <p><strong>District:</strong> {profile.district}</p>
          <p><strong>Taluka:</strong> {profile.taluka}</p>
          <p><strong>Village:</strong> {profile.village}</p>
          <p><strong>Photo:</strong> <img src={profile.photo} alt="Profile" /></p>
          <button className="bg-blue-500 text-white px-4 py-2 mt-4">
            Request Profile Update
          </button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;