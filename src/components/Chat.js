// src/components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatInput from './ChatInput';
import Message from './Message';
import Profile from './Profile';

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
    };
  });

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
      timestamp: new Date().toISOString(),
    };
    socket.emit('message', messageToSend);
  };

  const updateMessagesWithProfile = (updatedProfile) => {
    const updatedMessages = messages.map((message) => ({
      ...message,
      username: updatedProfile.username,
      avatar: updatedProfile.avatar,
    }));
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('profile', JSON.stringify(updatedProfile));
    updateMessagesWithProfile(updatedProfile);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput sendMessage={sendMessage} />
      <Profile profile={profile} onProfileUpdate={handleProfileUpdate} />
    </div>
  );
}

export default Chat;
