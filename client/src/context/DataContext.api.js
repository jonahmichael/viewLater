import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sections
  const fetchSections = async () => {
    try {
      const response = await api.get('/sections');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setError('Failed to load sections');
    }
  };

  // Fetch links with optional filters
  const fetchLinks = async (filters = {}) => {
    try {
      const params = {};
      
      if (filters.section) {
        params.section = filters.section;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }

      const response = await api.get('/links', { params });
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching links:', error);
      setError('Failed to load links');
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const response = await api.get('/links/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Create section
  const createSection = async (name, description = '', color = '#6366f1') => {
    try {
      const response = await api.post('/sections', { name, description, color });
      setSections([...sections, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating section:', error);
      setError('Failed to create section');
      throw error;
    }
  };

  // Update section
  const updateSection = async (id, updates) => {
    try {
      const response = await api.put(`/sections/${id}`, updates);
      setSections(sections.map(s => s.id === id ? response.data : s));
      return response.data;
    } catch (error) {
      console.error('Error updating section:', error);
      setError('Failed to update section');
      throw error;
    }
  };

  // Delete section
  const deleteSection = async (id) => {
    try {
      await api.delete(`/sections/${id}`);
      setSections(sections.filter(s => s.id !== id));
      // Refresh links as they may have been moved to unlisted
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting section:', error);
      setError('Failed to delete section');
      throw error;
    }
  };

  // Create link
  const createLink = async (linkData) => {
    try {
      const response = await api.post('/links', linkData);
      setLinks([response.data, ...links]);
      // Update tags if new ones were added
      await fetchTags();
      return response.data;
    } catch (error) {
      console.error('Error creating link:', error);
      setError('Failed to create link');
      throw error;
    }
  };

  // Update link
  const updateLink = async (id, updates) => {
    try {
      const response = await api.put(`/links/${id}`, updates);
      setLinks(links.map(l => l.id === id ? response.data : l));
      // Update tags if they changed
      await fetchTags();
      return response.data;
    } catch (error) {
      console.error('Error updating link:', error);
      setError('Failed to update link');
      throw error;
    }
  };

  // Delete link
  const deleteLink = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      setLinks(links.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
      setError('Failed to delete link');
      throw error;
    }
  };

  // Search links
  const searchLinks = async (query) => {
    setSearchQuery(query);
  };

  // Filter by tags
  const filterByTags = (tagList) => {
    setSelectedTags(tagList);
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSections(),
          fetchLinks(),
          fetchTags()
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load application data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch links when search or tag filters change
  useEffect(() => {
    if (!loading) {
      fetchLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedTags]);

  const value = {
    // State
    sections,
    links,
    tags,
    selectedSection,
    setSelectedSection,
    selectedTags,
    searchQuery,
    loading,
    error,
    
    // Section operations
    createSection,
    updateSection,
    deleteSection,
    
    // Link operations
    createLink,
    updateLink,
    deleteLink,
    
    // Utility operations
    searchLinks,
    filterByTags,
    fetchLinks,
    fetchSections,
    fetchTags
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
