import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { setLoading } from '@/store/slices/contentSlice';
import { getTrendingContent } from '@/services/contentService';
import { ContentCard } from './ContentCard';
import { ContentSkeleton } from './ContentSkeleton';
import { useState } from 'react';
import { ContentItem } from '@/store/slices/contentSlice';
import { TrendingUp, Flame } from 'lucide-react';

export const TrendingSection = () => {
  const dispatch = useAppDispatch();
  const [trendingItems, setTrendingItems] = useState<ContentItem[]>([]);
  const [loading, setLoadingState] = useState(true);

  useEffect(() => {
    const loadTrendingContent = async () => {
      setLoadingState(true);
      try {
        const content = await getTrendingContent();
        setTrendingItems(content);
      } catch (error) {
        console.error('Failed to load trending content:', error);
      } finally {
        setLoadingState(false);
      }
    };

    loadTrendingContent();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gradient">Trending Now</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative">
          <TrendingUp className="h-8 w-8 text-primary" />
          <Flame className="absolute -top-1 -right-1 h-4 w-4 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Trending Now</h1>
          <p className="text-muted-foreground">Popular content across all categories</p>
        </div>
      </div>

      {trendingItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trending content available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingItems.map((item, index) => (
            <div key={item.id} className="relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10 bg-gradient-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              )}
              <ContentCard content={item} layout="grid" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};