// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatInput from './ChatInput';
import Message from './Message';
import Profile from './Profile';
import './Chat.css'; // Include the new CSS file

const socket = io('http://localhost:4000'); // Your backend server URL

function Chat() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : {
      username: "User",
      avatar: "https://via.placeholder.com/40",
      team: "Team Name", // Default team name
    };
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('Chat component mounted');
    socket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      console.log('Chat component unmounted');
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    console.log('Messages updated:', messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (message) => {
    console.log('Sending message:', message);
    const messageToSend = {
      ...message,
      username: profile.username,
      avatar: profile.avatar,
      team: profile.team,
      timestamp: new Date().toISOString(),
    };
    socket.emit('message', messageToSend);
  };

  const updateMessagesWithProfile = (updatedProfile) => {
    const updatedMessages = messages.map((message) => ({
      ...message,
      username: updatedProfile.username,
      avatar: updatedProfile.avatar,
      team: updatedProfile.team,
    }));
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    updateMessagesWithProfile(updatedProfile);
  };

  const copyMessage = (message) => {
    navigator.clipboard.writeText(message.text);
  };

  const editMessage = (updatedMessage) => {
    const updatedMessages = messages.map((msg) =>
      msg.timestamp === updatedMessage.timestamp ? updatedMessage : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const deleteMessage = (message) => {
    const updatedMessages = messages.filter(
      (msg) => msg.timestamp !== message.timestamp
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="chat-container">
      <div className="header">
        <span>Community Chat</span>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {menuOpen && (
        <div className="menu-items">
          <a href="#">Profile</a>
          <a href="#">Settings</a>
          <a href="#">Logout</a>
        </div>
      )}
      <div className="messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            onCopy={copyMessage}
            onEdit={editMessage}
            onDelete={deleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput sendMessage={sendMessage} />
      <Profile profile={profile} onProfileUpdate={handleProfileUpdate} />
    </div>
  );
}

export default Chat;
