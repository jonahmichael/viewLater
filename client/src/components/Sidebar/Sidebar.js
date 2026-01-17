import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { X, Folder, FolderOpen, Layers, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40" 
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-80 bg-secondary border-r border-border z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-xl font-semibold">Sections</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSectionForm(!showSectionForm)}
            >
              {showSectionForm ? 'Cancel' : '+ New'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {showSectionForm && (
            <form onSubmit={handleCreateSection} className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Section name..."
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                autoFocus
              />
              <Button type="submit" size="sm">
                {editingSectionId ? 'Update' : 'Add'}
              </Button>
            </form>
          )}

          <div className="space-y-1">
            <button
              onClick={() => handleSectionClick(null)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                !selectedSection 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "hover:bg-accent/50"
              )}
            >
              <Layers className="h-4 w-4" />
              All Sections
            </button>

            <button
              onClick={() => handleSectionClick('unlisted')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                selectedSection === 'unlisted'
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              )}
            >
              <FolderOpen className="h-4 w-4" />
              Unlisted
            </button>

            {sections.map((section) => (
              <div
                key={section._id}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  selectedSection === section._id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent/50"
                )}
              >
                <button
                  onClick={() => handleSectionClick(section._id)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <Folder className="h-4 w-4" />
                  {section.name}
                </button>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSection(section);
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section._id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
