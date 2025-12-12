import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import LinkItem from './LinkItem';
import LinkForm from './LinkForm';
import './Links.css';

const LinkList = () => {
  const { links, sections, loading } = useContext(DataContext);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const handleCloseForm = () => {
    setShowLinkForm(false);
    setEditingLink(null);
  };

  if (sections.length === 0) {
    return (
      <div className="empty-state">
        <h2>Welcome to ViewLater! 👋</h2>
        <p>Start by creating a section in the sidebar to organize your links.</p>
      </div>
    );
  }

  return (
    <div className="link-list-container">
      <div className="link-list-header">
        <h2>Your Links</h2>
        <button
          className="btn-primary"
          onClick={() => setShowLinkForm(true)}
        >
          + Add Link
        </button>
      </div>

      {showLinkForm && (
        <LinkForm
          editingLink={editingLink}
          onClose={handleCloseForm}
        />
      )}

      {loading ? (
        <div className="loading">Loading links...</div>
      ) : links.length === 0 ? (
        <div className="empty-state">
          <p>No links found. Add your first link!</p>
        </div>
      ) : (
        <div className="links-grid">
          {links.map((link) => (
            <LinkItem key={link._id} link={link} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkList;
