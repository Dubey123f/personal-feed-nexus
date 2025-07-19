import { useState } from 'react';
import { Heart, ExternalLink, Share, Bookmark, Clock, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { addFavorite, removeFavorite } from '@/store/slices/userPreferencesSlice';
import { ContentItem } from '@/store/slices/contentSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentCardProps {
  content: ContentItem;
  layout: 'grid' | 'list';
}

export const ContentCard = ({ content, layout }: ContentCardProps) => {
  const dispatch = useAppDispatch();
  const { favoriteItems } = useAppSelector((state) => state.userPreferences);
  const [imageLoading, setImageLoading] = useState(true);
  
  const isFavorite = favoriteItems.includes(content.id);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(content.id));
    } else {
      dispatch(addFavorite(content.id));
    }
  };

  const getTypeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'news':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'movie':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'social':
        return 'bg-green-500/10 text-green-600 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (layout === 'list') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="content-card flex gap-4 cursor-grab active:cursor-grabbing"
      >
        {content.image && (
          <div className="w-32 h-24 flex-shrink-0 relative overflow-hidden rounded-lg">
            {imageLoading && (
              <div className="absolute inset-0 shimmer rounded-lg" />
            )}
            <img
              src={content.image}
              alt={content.title}
              onLoad={() => setImageLoading(false)}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
            />
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getTypeColor(content.type)}>
                  {content.type}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {content.source}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                {content.title}
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-2">
                {content.description}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className="ml-2 flex-shrink-0"
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(content.publishedAt)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {content.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="content-card cursor-grab active:cursor-grabbing"
    >
      {content.image && (
        <div className="relative overflow-hidden">
          {imageLoading && (
            <div className="absolute inset-0 shimmer rounded-lg" />
          )}
          <img
            src={content.image}
            alt={content.title}
            onLoad={() => setImageLoading(false)}
            className={cn(
              "content-card-image",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
          />
          <div className="absolute top-3 left-3">
            <Badge className={getTypeColor(content.type)}>
              {content.type}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 bg-background/80 hover:bg-background"
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">
            {content.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {content.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {content.source}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(content.publishedAt)}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {content.category}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};