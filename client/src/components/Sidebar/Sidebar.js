import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const {
    sections,
    selectedSection,
    setSelectedSection,
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

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Sections</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-section">
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
              onClick={() => handleSectionClick(null)}
            >
              📌 All Sections
            </div>
            <div
              className={`section-item ${selectedSection === 'unlisted' ? 'active' : ''}`}
              onClick={() => handleSectionClick('unlisted')}
            >
              📂 Unlisted
            </div>
            {sections.map((section) => (
              <div
                key={section._id}
                className={`section-item ${selectedSection === section._id ? 'active' : ''}`}
              >
                <span onClick={() => handleSectionClick(section._id)}>
                  📁 {section.name}
                </span>
                <div className="section-actions">
                  <button onClick={() => handleEditSection(section)}>✎</button>
                  <button onClick={() => handleDeleteSection(section._id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
