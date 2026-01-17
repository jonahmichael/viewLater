import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          <DialogDescription>
            {editingLink ? 'Update the link details below' : 'Fill in the details to save a new link'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Optional title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Unlisted (No section)</option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separate tags with commas"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingLink ? 'Update' : 'Add'} Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkForm;
