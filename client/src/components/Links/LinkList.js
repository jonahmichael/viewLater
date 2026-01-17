import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import LinkItem from './LinkItem';
import LinkForm from './LinkForm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, X, Folder, FolderOpen } from 'lucide-react';

const LinkList = () => {
  const { 
    links, 
    sections, 
    loading, 
    selectedSection,
    setSelectedSection,
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Folder className="h-6 w-6" />
            {section?.name}
          </h2>
          <Button onClick={() => handleAddLinkToSection(section)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>

        {showLinkForm && (
          <LinkForm
            editingLink={editingLink}
            defaultSection={currentSection}
            onClose={handleCloseForm}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="h-6 w-6" />
            Unlisted Links
          </h2>
          <Button onClick={() => setShowLinkForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>

        {showLinkForm && (
          <LinkForm
            editingLink={editingLink}
            onClose={handleCloseForm}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
          {unlistedLinks.map((link) => (
            <LinkItem key={link._id} link={link} onEdit={handleEdit} viewMode="circle" />
          ))}
        </div>
      </div>
    );
  }

  // Main grid view - show all sections as boxes
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Sections</h2>
        <Button
          onClick={() => setShowSectionForm(!showSectionForm)}
          variant={showSectionForm ? "outline" : "default"}
        >
          {showSectionForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </>
          )}
        </Button>
      </div>

      {showSectionForm && (
        <form onSubmit={handleAddSection} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Enter section name..."
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            autoFocus
            className="flex-1"
          />
          <Button type="submit">Create</Button>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Unlisted section box */}
          <Card 
            className="hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => setSelectedSection('unlisted')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Unlisted
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLinkForm(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {getUnlistedLinks().slice(0, 6).map((link) => (
                  <div
                    key={link._id}
                    className="aspect-square rounded-full bg-accent flex items-center justify-center text-sm font-semibold"
                  >
                    {link.title?.[0] || '🔗'}
                  </div>
                ))}
                {getUnlistedLinks().length > 6 && (
                  <div className="aspect-square rounded-full bg-accent flex items-center justify-center text-xs">
                    +{getUnlistedLinks().length - 6}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {getUnlistedLinks().length} links
              </p>
            </CardFooter>
          </Card>

          {/* Section boxes */}
          {sections.map((section) => {
            const sectionLinks = getLinksForSection(section._id);
            return (
              <Card 
                key={section._id} 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => setSelectedSection(section._id)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    {section.name}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddLinkToSection(section);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {sectionLinks.slice(0, 6).map((link) => (
                      <div
                        key={link._id}
                        className="aspect-square rounded-full bg-accent flex items-center justify-center text-sm font-semibold"
                      >
                        {link.title?.[0] || '🔗'}
                      </div>
                    ))}
                    {sectionLinks.length > 6 && (
                      <div className="aspect-square rounded-full bg-accent flex items-center justify-center text-xs">
                        +{sectionLinks.length - 6}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {sectionLinks.length} links
                  </p>
                </CardFooter>
              </Card>
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
