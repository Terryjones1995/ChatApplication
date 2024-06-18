// src/components/Message.js
import React from 'react';
import './Message.css';

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

function Message({ message }) {
  const { text, username, avatar, media, timestamp } = message;

  return (
    <div className="message">
      <div className="avatar" style={{ backgroundImage: avatar ? `url(${avatar})` : 'none' }}>
        {!avatar && username.charAt(0).toUpperCase()}
      </div>
      <div className="content">
        <div className="message-header">
          <span className="username">{username}</span>
          <span className="timestamp">{formatDate(timestamp)}</span>
        </div>
        <div className="message-body">
          <p>{text}</p>
          {Array.isArray(media) && media.map((item, index) => (
            item.type === 'image' ? (
              <img key={index} src={item.url} alt="Uploaded" />
            ) : (
              <video key={index} src={item.url} controls />
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default Message;
