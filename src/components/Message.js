// src/components/Message.js
import React, { useState } from 'react';
import './Message.css';
import MessageOptions from './MessageOptions';

function formatDate(timestamp) {
  const now = new Date();
  const messageDate = new Date(timestamp);

  if (isNaN(messageDate.getTime())) {
    return "Invalid Date";
  }

  const isToday = now.toDateString() === messageDate.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();

  if (isToday) {
    return `Today at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return `Yesterday at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' at ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function Message({ message, onCopy, onEdit, onDelete }) {
  const { text, username, avatar, media, timestamp, edited, team } = message;
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setShowOptions(true);
  };

  const handleLongPress = () => {
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleEditChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedText(text);
    } else if (event.key === 'Enter') {
      onEdit({ ...message, text: editedText, edited: true });
      setIsEditing(false);
    }
  };

  return (
    <div
      className="message"
      onContextMenu={handleContextMenu}
      onTouchStart={(e) => {
        e.persist();
        this.longPressTimer = setTimeout(handleLongPress, 500);
      }}
      onTouchEnd={() => clearTimeout(this.longPressTimer)}
    >
      <div className="avatar" style={{ backgroundImage: avatar ? `url(${avatar})` : 'none' }}>
        {!avatar && username.charAt(0).toUpperCase()}
      </div>
      <div className="content">
        <div className="message-header">
          <span className="username">{username}</span>
          <span className="timestamp">{formatDate(timestamp)}</span>
        </div>
        <div className="message-body">
          {isEditing ? (
            <input
              type="text"
              value={editedText}
              onChange={handleEditChange}
              onKeyDown={handleEditKeyDown}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <div className="message-text">
              <p>{text}</p>
              {edited && <span className="edited-label">(edited)</span>}
            </div>
          )}
          {Array.isArray(media) && media.map((item, index) => (
            item.type === 'image' ? (
              <img key={index} src={item.url} alt="Uploaded" />
            ) : (
              <video key={index} src={item.url} controls />
            )
          ))}
        </div>
        <div className="team">{team}</div>
      </div>
      {showOptions && (
        <MessageOptions
          onCopy={() => onCopy(message)}
          onEdit={handleEdit}
          onDelete={() => onDelete(message)}
          onClose={handleCloseOptions}
        />
      )}
      {showOptions && <div className="message-options-overlay" onClick={handleCloseOptions}></div>}
    </div>
  );
}

export default Message;
