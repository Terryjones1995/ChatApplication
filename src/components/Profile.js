// src/components/Profile.js
import React, { useState } from 'react';
import './Profile.css';
import ProfileEditModal from './ProfileEditModal';

function Profile({ profile, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (updatedProfile) => {
    onProfileUpdate(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile-avatar" style={{ backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none' }}>
          {!profile.avatar && profile.username.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-username">{profile.username}</div>
          <div className="profile-status">Online</div>
        </div>
        <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
      </div>
      {isEditing && (
        <ProfileEditModal
          currentProfile={profile}
          onSave={handleSaveProfile}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export default Profile;
