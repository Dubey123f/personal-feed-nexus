import { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setSearchModalOpen } from '@/store/slices/uiSlice';
import { setSearchQuery, setSearchResults } from '@/store/slices/contentSlice';
import { searchContent } from '@/services/contentService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ContentCard } from './ContentCard';
import { ContentSkeleton } from './ContentSkeleton';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock recent searches and trending topics
const recentSearches = ['AI technology', 'climate change', 'cryptocurrency', 'movies 2024'];
const trendingTopics = ['blockchain', 'renewable energy', 'space exploration', 'digital art'];

export const SearchModal = () => {
  const dispatch = useAppDispatch();
  const { searchModalOpen } = useAppSelector((state) => state.ui);
  const { searchQuery, searchResults } = useAppSelector((state) => state.content);
  
  const [localQuery, setLocalQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        dispatch(setSearchResults([]));
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      
      try {
        const results = await searchContent(query);
        dispatch(setSearchResults(results));
        dispatch(setSearchQuery(query));
      } catch (error) {
        console.error('Search failed:', error);
        dispatch(setSearchResults([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, debouncedSearch]);

  const handleClose = () => {
    dispatch(setSearchModalOpen(false));
    setLocalQuery('');
    setHasSearched(false);
    dispatch(setSearchResults([]));
  };

  const handleQuickSearch = (query: string) => {
    setLocalQuery(query);
  };

  const clearSearch = () => {
    setLocalQuery('');
    setHasSearched(false);
    dispatch(setSearchResults([]));
  };

  return (
    <Dialog open={searchModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Content
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for news, movies, social posts..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-lg"
              autoFocus
            />
            {localQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!hasSearched && !loading ? (
            /* Initial State - Show recent searches and trending */
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Recent Searches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(search)}
                      className="text-sm"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Trending Topics
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleQuickSearch(topic)}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : loading ? (
            /* Loading State */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ContentSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((result) => (
                      <ContentCard key={result.id} content={result} layout="list" />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or browse our trending topics
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {trendingTopics.slice(0, 3).map((topic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSearch(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};