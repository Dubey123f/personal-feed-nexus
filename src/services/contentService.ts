import { ContentItem } from '../store/slices/contentSlice';

// News API configuration
const NEWS_API_KEY = '92a8d983aab74a7cb53f43a8a2f8abf2';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Mock data for demonstration
export const mockNewsData: ContentItem[] = [
  {
    id: '1',
    type: 'news',
    title: 'AI Revolution in Healthcare: New Breakthrough in Medical Diagnosis',
    description: 'Scientists have developed an AI system that can diagnose diseases with 95% accuracy, revolutionizing healthcare delivery worldwide.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date().toISOString(),
    category: 'technology',
    source: 'TechNews',
  },
  {
    id: '2',
    type: 'news',
    title: 'Global Climate Summit Reaches Historic Agreement',
    description: 'World leaders unite on ambitious climate targets, setting unprecedented goals for carbon neutrality by 2030.',
    image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    category: 'environment',
    source: 'Global News',
  },
  {
    id: '3',
    type: 'news',
    title: 'Cryptocurrency Market Sees Major Recovery',
    description: 'Bitcoin and major altcoins surge as institutional investors show renewed confidence in digital assets.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    category: 'finance',
    source: 'CryptoDaily',
  },
];

export const mockMovieData: ContentItem[] = [
  {
    id: '4',
    type: 'movie',
    title: 'Dune: Part Two',
    description: 'The epic continuation of Paul Atreides journey as he unites with Chani and the Fremen.',
    image: 'https://images.unsplash.com/photo-1489599511446-51fb3a33e01a?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date().toISOString(),
    category: 'science-fiction',
    source: 'MovieDB',
  },
  {
    id: '5',
    type: 'movie',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date(Date.now() - 1800000).toISOString(),
    category: 'biography',
    source: 'MovieDB',
  },
];

export const mockSocialData: ContentItem[] = [
  {
    id: '6',
    type: 'social',
    title: 'Amazing sunset captured from my balcony! 🌅',
    description: 'Mother nature never fails to amaze me. This view from my new apartment is absolutely breathtaking.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date(Date.now() - 900000).toISOString(),
    category: 'photography',
    source: 'Instagram',
  },
  {
    id: '7',
    type: 'social',
    title: 'Just finished my first marathon! 🏃‍♂️',
    description: 'After months of training, I finally crossed the finish line. The feeling is indescribable!',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    url: '#',
    publishedAt: new Date(Date.now() - 1200000).toISOString(),
    category: 'fitness',
    source: 'Twitter',
  },
];

export const getAllContent = (): ContentItem[] => {
  return [...mockNewsData, ...mockMovieData, ...mockSocialData];
};

// Fetch real news from News API
const fetchNewsFromAPI = async (categories: string[]): Promise<ContentItem[]> => {
  try {
    const categoryMap: { [key: string]: string } = {
      'technology': 'technology',
      'environment': 'science',
      'finance': 'business',
      'sports': 'sports',
      'entertainment': 'entertainment',
      'health': 'health'
    };

    const newsItems: ContentItem[] = [];
    
    for (const category of categories) {
      const apiCategory = categoryMap[category] || 'general';
      const response = await fetch(
        `${NEWS_API_BASE_URL}/top-headlines?category=${apiCategory}&country=us&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const articles = data.articles?.map((article: any, index: number) => ({
          id: `news-${category}-${index}`,
          type: 'news' as const,
          title: article.title || 'No title',
          description: article.description || 'No description available',
          image: article.urlToImage || undefined,
          url: article.url || '#',
          publishedAt: article.publishedAt || new Date().toISOString(),
          category: category,
          source: article.source?.name || 'News API',
        })) || [];
        
        newsItems.push(...articles);
      }
    }
    
    return newsItems;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getContentByCategories = async (categories: string[]): Promise<ContentItem[]> => {
  const newsCategories = categories.filter(cat => 
    ['technology', 'environment', 'finance', 'sports', 'entertainment', 'health'].includes(cat)
  );
  
  const otherCategories = categories.filter(cat => 
    !['technology', 'environment', 'finance', 'sports', 'entertainment', 'health'].includes(cat)
  );

  // Fetch real news for supported categories
  const newsContent = newsCategories.length > 0 ? await fetchNewsFromAPI(newsCategories) : [];
  
  // Get mock data for other categories
  const allMockContent = [...mockMovieData, ...mockSocialData];
  const mockContent = otherCategories.length > 0 
    ? allMockContent.filter(item => otherCategories.includes(item.category))
    : [];

  // If no categories selected, return mix of real news and mock data
  if (categories.length === 0) {
    const defaultNews = await fetchNewsFromAPI(['technology', 'finance']);
    return [...defaultNews, ...mockMovieData, ...mockSocialData];
  }

  return [...newsContent, ...mockContent];
};

export const searchContent = async (query: string): Promise<ContentItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allContent = getAllContent();
  
  if (!query.trim()) {
    return [];
  }
  
  return allContent.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );
};

export const getTrendingContent = async (): Promise<ContentItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allContent = getAllContent();
  const shuffled = allContent.sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, 6);
};