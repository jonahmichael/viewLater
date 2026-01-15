import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import LinkItem from './LinkItem';
import LinkForm from './LinkForm';
import './Links.css';

const LinkList = () => {
  const { 
    links, 
    sections, 
    loading, 
    selectedSection,
    createSection 
  } = useContext(DataContext);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);

  const handleEdit = (link) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const handleCloseForm = () => {
    setShowLinkForm(false);
    setEditingLink(null);
    setCurrentSection(null);
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    
    await createSection(newSectionName);
    setNewSectionName('');
    setShowSectionForm(false);
  };

  const handleAddLinkToSection = (section) => {
    setCurrentSection(section);
    setShowLinkForm(true);
  };

  const getLinksForSection = (sectionId) => {
    return links.filter(link => link.section?._id === sectionId);
  };

  const getUnlistedLinks = () => {
    return links.filter(link => !link.section);
  };

  // If a specific section is selected in sidebar, show its detail view
  if (selectedSection && selectedSection !== 'unlisted') {
    const section = sections.find(s => s._id === selectedSection);
    const sectionLinks = getLinksForSection(selectedSection);

    return (
      <div className="section-detail-view">
        <div className="section-detail-header">
          <h2>📁 {section?.name}</h2>
          <button
            className="btn-add-link"
            onClick={() => handleAddLinkToSection(section)}
          >
            + Add Link
          </button>
        </div>

        {showLinkForm && (
          <LinkForm
            editingLink={editingLink}
            defaultSection={currentSection}
            onClose={handleCloseForm}
          />
        )}

        <div className="links-circle-grid">
          {sectionLinks.map((link) => (
            <LinkItem key={link._id} link={link} onEdit={handleEdit} viewMode="circle" />
          ))}
        </div>
      </div>
    );
  }

  // If unlisted is selected
  if (selectedSection === 'unlisted') {
    const unlistedLinks = getUnlistedLinks();

    return (
      <div className="section-detail-view">
        <div className="section-detail-header">
          <h2>📂 Unlisted Links</h2>
          <button
            className="btn-add-link"
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

        <div className="links-circle-grid">
          {unlistedLinks.map((link) => (
            <LinkItem key={link._id} link={link} onEdit={handleEdit} viewMode="circle" />
          ))}
        </div>
      </div>
    );
  }

  // Main grid view - show all sections as boxes
  return (
    <div className="sections-grid-view">
      <div className="grid-header">
        <h2>Your Sections</h2>
        <button
          className="btn-add-section"
          onClick={() => setShowSectionForm(!showSectionForm)}
        >
          {showSectionForm ? '✕ Cancel' : '+ Add Section'}
        </button>
      </div>

      {showSectionForm && (
        <form onSubmit={handleAddSection} className="inline-section-form">
          <input
            type="text"
            placeholder="Enter section name..."
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-submit">Create</button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="sections-grid">
          {/* Unlisted section box */}
          <div className="section-box unlisted-box">
            <div className="section-box-header">
              <h3>📂 Unlisted</h3>
              <button 
                className="btn-add-to-section"
                onClick={() => setShowLinkForm(true)}
              >
                +
              </button>
            </div>
            <div className="section-box-preview">
              {getUnlistedLinks().slice(0, 6).map((link) => (
                <div key={link._id} className="preview-circle">
                  {link.title?.[0] || '🔗'}
                </div>
              ))}
              {getUnlistedLinks().length > 6 && (
                <div className="preview-circle more">+{getUnlistedLinks().length - 6}</div>
              )}
            </div>
            <div className="section-box-footer">
              {getUnlistedLinks().length} links
            </div>
          </div>

          {/* Section boxes */}
          {sections.map((section) => {
            const sectionLinks = getLinksForSection(section._id);
            return (
              <div key={section._id} className="section-box">
                <div className="section-box-header">
                  <h3>📁 {section.name}</h3>
                  <button 
                    className="btn-add-to-section"
                    onClick={() => handleAddLinkToSection(section)}
                  >
                    +
                  </button>
                </div>
                <div className="section-box-preview">
                  {sectionLinks.slice(0, 6).map((link) => (
                    <div key={link._id} className="preview-circle">
                      {link.title?.[0] || '🔗'}
                    </div>
                  ))}
                  {sectionLinks.length > 6 && (
                    <div className="preview-circle more">+{sectionLinks.length - 6}</div>
                  )}
                </div>
                <div className="section-box-footer">
                  {sectionLinks.length} links
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showLinkForm && (
        <LinkForm
          editingLink={editingLink}
          defaultSection={currentSection}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default LinkList;
