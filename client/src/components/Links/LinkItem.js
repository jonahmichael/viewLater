import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './Links.css';

const LinkItem = ({ link, onEdit, viewMode = 'card' }) => {
  const { deleteLink } = useContext(DataContext);

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this link?')) {
      await deleteLink(link._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(link);
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getInitials = (title) => {
    if (!title) return '🔗';
    return title.substring(0, 2).toUpperCase();
  };

  const handleLinkClick = (e) => {
    if (viewMode === 'circle') {
      window.open(link.url, '_blank', 'noopener noreferrer');
    }
  };

  // Circle view mode for inside sections
  if (viewMode === 'circle') {
    return (
      <div className="link-circle" onClick={handleLinkClick}>
        <div className="circle-icon">
          {getInitials(link.title)}
        </div>
        <div className="circle-title">{link.title || formatUrl(link.url)}</div>
        <div className="circle-actions">
          <button onClick={handleEdit} className="btn-circle-edit" title="Edit">✎</button>
          <button onClick={handleDelete} className="btn-circle-delete" title="Delete">🗑</button>
        </div>
      </div>
    );
  }

  // Card view mode (default)
  return (
    <div className="link-item">
      <div className="link-header">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
          {link.title || formatUrl(link.url)}
        </a>
        <div className="link-actions">
          <button onClick={handleEdit} className="btn-edit">✎</button>
          <button onClick={handleDelete} className="btn-delete">🗑</button>
        </div>
      </div>

      {link.description && (
        <p className="link-description">{link.description}</p>
      )}

      <div className="link-footer">
        <span className="link-section">{link.section?.name}</span>
        <div className="link-tags">
          {link.tags?.map((tag, index) => (
            <span key={index} className="link-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="link-meta">
        {formatUrl(link.url)}
      </div>
    </div>
  );
};

export default LinkItem;
