import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

const LinkItem = ({ link, onEdit, viewMode = 'card' }) => {
  const { deleteLink } = useContext(DataContext);

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this link?')) {
      await deleteLink(link._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(link);
  };

  const formatUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getInitials = (title) => {
    if (!title) return '🔗';
    return title.substring(0, 2).toUpperCase();
  };

  const handleLinkClick = (e) => {
    if (viewMode === 'circle') {
      window.open(link.url, '_blank', 'noopener noreferrer');
    }
  };

  // Circle view mode for inside sections
  if (viewMode === 'circle') {
    return (
      <div className="group relative flex flex-col items-center gap-2">
        <button
          onClick={handleLinkClick}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-lg font-bold",
            "bg-accent hover:bg-accent/80 transition-colors",
            "border-2 border-border hover:border-primary"
          )}
        >
          {getInitials(link.title)}
        </button>
        <p className="text-xs text-center line-clamp-2 max-w-[100px]">
          {link.title || formatUrl(link.url)}
        </p>
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 bg-background/80"
            onClick={handleEdit}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 bg-background/80 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  // Card view mode (default)
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-base">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <LinkIcon className="h-4 w-4" />
            {link.title || formatUrl(link.url)}
            <ExternalLink className="h-3 w-3 opacity-50" />
          </a>
        </CardTitle>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {link.description && (
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">{link.description}</p>
        </CardContent>
      )}

      <CardFooter className="flex flex-col items-start gap-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {link.tags?.map((tag, index) => {
            const tagName = typeof tag === 'object' ? tag.name : tag;
            return (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-md bg-accent"
              >
                {tagName}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
          {link.section && (
            <span className="flex items-center gap-1">
              📁 {link.section.name}
            </span>
          )}
          <span className="ml-auto">{formatUrl(link.url)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LinkItem;
