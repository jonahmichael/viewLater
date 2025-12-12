import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './Sidebar.css';

const Sidebar = () => {
  const {
    sections,
    tags,
    selectedSection,
    selectedTags,
    setSelectedSection,
    setSelectedTags,
    createSection,
    updateSection,
    deleteSection
  } = useContext(DataContext);

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    if (editingSectionId) {
      await updateSection(editingSectionId, sectionName);
      setEditingSectionId(null);
    } else {
      await createSection(sectionName);
    }

    setSectionName('');
    setShowSectionForm(false);
  };

  const handleEditSection = (section) => {
    setSectionName(section.name);
    setEditingSectionId(section._id);
    setShowSectionForm(true);
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      await deleteSection(id);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <h3>Sections</h3>
          <button
            className="btn-icon"
            onClick={() => {
              setShowSectionForm(!showSectionForm);
              setEditingSectionId(null);
              setSectionName('');
            }}
          >
            {showSectionForm ? '✕' : '+'}
          </button>
        </div>

        {showSectionForm && (
          <form onSubmit={handleCreateSection} className="section-form">
            <input
              type="text"
              placeholder="Section name..."
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-small">
              {editingSectionId ? 'Update' : 'Add'}
            </button>
          </form>
        )}

        <div className="section-list">
          <div
            className={`section-item ${!selectedSection ? 'active' : ''}`}
            onClick={() => setSelectedSection(null)}
          >
            All Links
          </div>
          {sections.map((section) => (
            <div
              key={section._id}
              className={`section-item ${selectedSection === section._id ? 'active' : ''}`}
            >
              <span onClick={() => setSelectedSection(section._id)}>
                {section.name}
              </span>
              <div className="section-actions">
                <button
                  className="btn-action"
                  onClick={() => handleEditSection(section)}
                >
                  ✎
                </button>
                <button
                  className="btn-action"
                  onClick={() => handleDeleteSection(section._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Tags</h3>
        <div className="tag-list">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
