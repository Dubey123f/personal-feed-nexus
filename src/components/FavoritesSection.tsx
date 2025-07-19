import { useMemo } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { getAllContent } from '@/services/contentService';
import { ContentCard } from './ContentCard';
import { Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FavoritesSection = () => {
  const { favoriteItems } = useAppSelector((state) => state.userPreferences);
  
  const favoriteContent = useMemo(() => {
    const allContent = getAllContent();
    return allContent.filter(item => favoriteItems.includes(item.id));
  }, [favoriteItems]);

  if (favoriteItems.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gradient">My Favorites</h1>
            <p className="text-muted-foreground">Content you've marked as favorite</p>
          </div>
        </div>

        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <HeartOff className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring content and click the heart icon to add items to your favorites.
          </p>
          <Button variant="outline">
            Browse Content
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500 fill-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-gradient">My Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteContent.length} favorite {favoriteContent.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteContent.map((item) => (
          <ContentCard key={item.id} content={item} layout="grid" />
        ))}
      </div>
    </div>
  );
};