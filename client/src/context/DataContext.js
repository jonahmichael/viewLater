import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSections = localStorage.getItem('viewlater_sections');
    const savedLinks = localStorage.getItem('viewlater_links');
    
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
    if (savedLinks) {
      const parsedLinks = JSON.parse(savedLinks);
      setLinks(parsedLinks);
      updateTags(parsedLinks);
    }
  }, []);

  // Save sections to localStorage whenever they change
  useEffect(() => {
    if (sections.length > 0 || localStorage.getItem('viewlater_sections')) {
      localStorage.setItem('viewlater_sections', JSON.stringify(sections));
    }
  }, [sections]);

  // Save links to localStorage whenever they change
  useEffect(() => {
    if (links.length > 0 || localStorage.getItem('viewlater_links')) {
      localStorage.setItem('viewlater_links', JSON.stringify(links));
    }
  }, [links]);

  // Update tags from links
  const updateTags = (linksList) => {
    const allTags = linksList.flatMap(link => link.tags || []);
    const uniqueTags = [...new Set(allTags)];
    setTags(uniqueTags);
  };

  // Fetch sections (now just returns from state)
  const fetchSections = async () => {
    // Data is already in state from localStorage
    return sections;
  };

  // Fetch links with filters (now filters from state)
  const fetchLinks = async () => {
    setLoading(true);
    
    let filteredLinks = [...links];
    
    // Filter by section
    if (selectedSection && selectedSection !== 'unlisted') {
      filteredLinks = filteredLinks.filter(link => link.section?._id === selectedSection);
    } else if (selectedSection === 'unlisted') {
      filteredLinks = filteredLinks.filter(link => !link.section);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredLinks = filteredLinks.filter(link => 
        link.title?.toLowerCase().includes(query) || 
        link.url?.toLowerCase().includes(query) ||
        link.description?.toLowerCase().includes(query)
      );
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filteredLinks = filteredLinks.filter(link => 
        link.tags?.some(tag => selectedTags.includes(tag))
      );
    }
    
    setLoading(false);
    return filteredLinks;
  };

  // Fetch tags (now just returns from state)
  const fetchTags = async () => {
    return tags;
  };

  // Create section
  const createSection = async (name) => {
    const newSection = {
      _id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    setSections([...sections, newSection]);
    return { success: true, data: newSection };
  };

  // Update section
  const updateSection = async (id, name) => {
    setSections(sections.map(s => s._id === id ? { ...s, name } : s));
    return { success: true };
  };

  // Delete section
  const deleteSection = async (id) => {
    setSections(sections.filter(s => s._id !== id));
    // Also update links that were in this section
    setLinks(links.map(link => 
      link.section?._id === id ? { ...link, section: null } : link
    ));
    if (selectedSection === id) setSelectedSection(null);
    return { success: true };
  };

  // Create link
  const createLink = async (linkData) => {
    const section = sections.find(s => s._id === linkData.section);
    const newLink = {
      _id: Date.now().toString(),
      url: linkData.url,
      title: linkData.title,
      description: linkData.description,
      tags: linkData.tags || [],
      section: section ? { _id: section._id, name: section.name } : null,
      createdAt: new Date().toISOString()
    };
    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    updateTags(updatedLinks);
    return { success: true, data: newLink };
  };

  // Update link
  const updateLink = async (id, linkData) => {
    const section = sections.find(s => s._id === linkData.section);
    const updatedLinks = links.map(link => 
      link._id === id ? {
        ...link,
        url: linkData.url,
        title: linkData.title,
        description: linkData.description,
        tags: linkData.tags || [],
        section: section ? { _id: section._id, name: section.name } : null
      } : link
    );
    setLinks(updatedLinks);
    updateTags(updatedLinks);
    return { success: true };
  };

  // Delete link
  const deleteLink = async (id) => {
    const updatedLinks = links.filter(link => link._id !== id);
    setLinks(updatedLinks);
    updateTags(updatedLinks);
    return { success: true };
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchSections();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [selectedSection, selectedTags, searchQuery]);

  return (
    <DataContext.Provider
      value={{
        sections,
        links,
        tags,
        selectedSection,
        selectedTags,
        searchQuery,
        loading,
        setSelectedSection,
        setSelectedTags,
        setSearchQuery,
        createSection,
        updateSection,
        deleteSection,
        createLink,
        updateLink,
        deleteLink,
        fetchSections,
        fetchLinks,
        fetchTags
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
