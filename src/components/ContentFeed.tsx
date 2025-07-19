import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setItems, setLoading, setError } from '@/store/slices/contentSlice';
import { getContentByCategories } from '@/services/contentService';
import { ContentCard } from './ContentCard';
import { ContentSkeleton } from './ContentSkeleton';
import { DragDropProvider } from './DragDropProvider';
import { Button } from '@/components/ui/button';
import { RefreshCw, Grid, List } from 'lucide-react';
import { updateFeedLayout } from '@/store/slices/userPreferencesSlice';
import { cn } from '@/lib/utils';

export const ContentFeed = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.content);
  const { categories, feedLayout } = useAppSelector((state) => state.userPreferences);

  const loadContent = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    try {
      const content = await getContentByCategories(categories);
      dispatch(setItems(content));
    } catch (err) {
      dispatch(setError('Failed to load content. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadContent();
  }, [categories]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">My Personalized Feed</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadContent} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">My Personalized Feed</h1>
          <p className="text-muted-foreground mt-1">
            Curated content based on your preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadContent}
            disabled={loading}
            className="hover:bg-muted"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={feedLayout === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => dispatch(updateFeedLayout('grid'))}
              className="h-8 px-3"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={feedLayout === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => dispatch(updateFeedLayout('list'))}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content available for your selected categories.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your preferences in settings.
          </p>
        </div>
      ) : (
        <DragDropProvider>
          <div className={cn(
            "gap-6",
            feedLayout === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "flex flex-col space-y-4"
          )}>
            {items.map((item) => (
              <ContentCard 
                key={item.id} 
                content={item} 
                layout={feedLayout}
              />
            ))}
          </div>
        </DragDropProvider>
      )}
    </div>
  );
};