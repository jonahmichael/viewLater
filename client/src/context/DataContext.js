import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [sections, setSections] = useState([]);
  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch sections
  const fetchSections = async () => {
    if (!user) return;
    try {
      const response = await api.get('/sections');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // Fetch links with filters
  const fetchLinks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params = {};
      if (selectedSection) params.section = selectedSection;
      if (searchQuery) params.search = searchQuery;
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');

      const response = await api.get('/links', { params });
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
    setLoading(false);
  };

  // Fetch tags
  const fetchTags = async () => {
    if (!user) return;
    try {
      const response = await api.get('/links/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Create section
  const createSection = async (name) => {
    try {
      const response = await api.post('/sections', { name });
      setSections([...sections, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Update section
  const updateSection = async (id, name) => {
    try {
      const response = await api.put(`/sections/${id}`, { name });
      setSections(sections.map(s => s._id === id ? response.data : s));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Delete section
  const deleteSection = async (id) => {
    try {
      await api.delete(`/sections/${id}`);
      setSections(sections.filter(s => s._id !== id));
      if (selectedSection === id) setSelectedSection(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Create link
  const createLink = async (linkData) => {
    try {
      const response = await api.post('/links', linkData);
      setLinks([response.data, ...links]);
      fetchTags(); // Refresh tags
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Update link
  const updateLink = async (id, linkData) => {
    try {
      const response = await api.put(`/links/${id}`, linkData);
      setLinks(links.map(l => l._id === id ? response.data : l));
      fetchTags(); // Refresh tags
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Delete link
  const deleteLink = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      setLinks(links.filter(l => l._id !== id));
      fetchTags(); // Refresh tags
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    if (user) {
      fetchSections();
      fetchTags();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user, selectedSection, selectedTags, searchQuery]);

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
