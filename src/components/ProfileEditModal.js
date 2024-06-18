// src/components/ProfileEditModal.js
import React, { useState } from 'react';
import './ProfileEditModal.css';

function ProfileEditModal({ currentProfile, onSave, onClose }) {
  const [username, setUsername] = useState(currentProfile.username);
  const [avatar, setAvatar] = useState(currentProfile.avatar);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ username, avatar });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Avatar:
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {avatar && <img src={avatar} alt="Avatar preview" className="avatar-preview" />}
        </label>
        <div className="buttons">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal;
