// src/components/ChatInput.js
import React, { useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import './ChatInput.css';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_ATTACHMENTS = 10;

function ChatInput({ sendMessage }) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() || files.length > 0) {
      if (files.length > 0) {
        const mediaFiles = files.map((file) => {
          const fileUrl = URL.createObjectURL(file); // Simulate file upload
          return { url: fileUrl, type: file.type.startsWith('video') ? 'video' : 'image' };
        });
        sendMessage({ text: message, media: mediaFiles });
        setFiles([]);
        setUploadProgress({});
      } else {
        sendMessage({ text: message });
      }
      setMessage('');
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} exceeds the 50MB limit.`);
        return false;
      }
      return true;
    });

    if (newFiles.length + files.length > MAX_ATTACHMENTS) {
      alert(`You can only upload a maximum of ${MAX_ATTACHMENTS} attachments.`);
      return;
    }

    setFiles([...files, ...newFiles]);
    handleUploadProgress(newFiles);
  };

  const handleUploadProgress = (newFiles) => {
    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = { ...prevProgress };
          if (newProgress[file.name] >= 100) {
            clearInterval(interval);
            newProgress[file.name] = 100;
          } else {
            newProgress[file.name] = (newProgress[file.name] || 0) + 10;
          }
          return newProgress;
        });
      }, 100);
    });
  };

  const handleCancelUpload = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
    setUploadProgress((prevProgress) => {
      const newProgress = { ...prevProgress };
      delete newProgress[fileName];
      return newProgress;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} exceeds the 50MB limit.`);
        return false;
      }
      return true;
    });

    if (newFiles.length + files.length > MAX_ATTACHMENTS) {
      alert(`You can only upload a maximum of ${MAX_ATTACHMENTS} attachments.`);
      return;
    }

    setFiles([...files, ...newFiles]);
    handleUploadProgress(newFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        multiple
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className="file-upload-icon">
        <FiImage />
      </label>
      {files.length > 0 && (
        <div className="upload-preview">
          {files.map((file) => (
            <div key={file.name} className="upload-preview-item">
              <img src={URL.createObjectURL(file)} alt={file.name} className="thumbnail" />
              {uploadProgress[file.name] < 100 && (
                <progress value={uploadProgress[file.name] || 0} max="100">{uploadProgress[file.name] || 0}%</progress>
              )}
              <button type="button" onClick={() => handleCancelUpload(file.name)} className="cancel-upload-icon">
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
      <button type="submit">Send</button>
    </form>
  );
}

export default ChatInput;
