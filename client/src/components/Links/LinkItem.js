import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './Links.css';

const LinkItem = ({ link, onEdit }) => {
  const { deleteLink } = useContext(DataContext);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      await deleteLink(link._id);
    }
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="link-item">
      <div className="link-header">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
          {link.title || formatUrl(link.url)}
        </a>
        <div className="link-actions">
          <button onClick={() => onEdit(link)} className="btn-edit">✎</button>
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
