import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ContentFeed } from './ContentFeed';
import { TrendingSection } from './TrendingSection';
import { FavoritesSection } from './FavoritesSection';
import { SettingsModal } from './SettingsModal';
import { SearchModal } from './SearchModal';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { activeSection } = useAppSelector((state) => state.ui);
  const { darkMode } = useAppSelector((state) => state.userPreferences);

  // Apply dark mode on component mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'trending':
        return <TrendingSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'feed':
      default:
        return <ContentFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>

      <SettingsModal />
      <SearchModal />
    </div>
  );
};