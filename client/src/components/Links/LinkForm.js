import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import './Links.css';

const LinkForm = ({ editingLink, defaultSection, onClose }) => {
  const { sections, createLink, updateLink } = useContext(DataContext);
  
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    section: defaultSection?._id || '',
    tags: ''
  });

  useEffect(() => {
    if (editingLink) {
      setFormData({
        url: editingLink.url,
        title: editingLink.title || '',
        description: editingLink.description || '',
        section: editingLink.section?._id || '',
        tags: editingLink.tags?.join(', ') || ''
      });
    } else if (defaultSection) {
      setFormData(prev => ({
        ...prev,
        section: defaultSection._id
      }));
    }
  }, [editingLink, defaultSection]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const linkData = {
      url: formData.url,
      title: formData.title,
      description: formData.description,
      section: formData.section,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (editingLink) {
      await updateLink(editingLink._id, linkData);
    } else {
      await createLink(linkData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingLink ? 'Edit Link' : 'Add New Link'}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>URL *</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Optional title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Section</label>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
            >
              <option value="">Unlisted (No section)</option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separate tags with commas (e.g., blog, tutorial, video)"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingLink ? 'Update' : 'Add'} Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkForm;
