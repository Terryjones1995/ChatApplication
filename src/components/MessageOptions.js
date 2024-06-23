// src/components/MessageOptions.js
import React, { useState } from 'react';
import './MessageOptions.css';

function MessageOptions({ onCopy, onEdit, onDelete, onClose }) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirmation(false);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="message-options">
      {showDeleteConfirmation ? (
        <>
          <div>Are you sure you want to delete?</div>
          <button onClick={confirmDelete}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </>
      ) : (
        <>
          <button onClick={onCopy}>Copy</button>
          <button onClick={onEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </>
      )}
    </div>
  );
}

export default MessageOptions;
