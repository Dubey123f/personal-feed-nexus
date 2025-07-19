import { 
  Home, 
  TrendingUp, 
  Heart, 
  Settings, 
  Menu,
  Newspaper,
  Film,
  MessageCircle
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setActiveSection, toggleSidebar } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { id: 'feed', label: 'My Feed', icon: Home },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

const contentTypes = [
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'social', label: 'Social', icon: MessageCircle },
];

export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, activeSection } = useAppSelector((state) => state.ui);

  const handleSectionChange = (section: typeof activeSection) => {
    dispatch(setActiveSection(section));
  };

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 flex flex-col",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-gradient">Content Nexus</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="hover:bg-muted"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Navigation
            </p>
          )}
          
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-colors",
                  sidebarCollapsed ? "px-2" : "px-3",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                onClick={() => handleSectionChange(item.id as typeof activeSection)}
              >
                <Icon className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-3")} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>

        {/* Content Types */}
        <div className="space-y-1 pt-6">
          {!sidebarCollapsed && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Content Types
            </p>
          )}
          
          {contentTypes.map((type) => {
            const Icon = type.icon;
            
            return (
              <Button
                key={type.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-muted-foreground hover:text-foreground",
                  sidebarCollapsed ? "px-2" : "px-3"
                )}
              >
                <Icon className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-3")} />
                {!sidebarCollapsed && <span>{type.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            sidebarCollapsed ? "px-2" : "px-3"
          )}
          onClick={() => handleSectionChange('settings')}
        >
          <Settings className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-3")} />
          {!sidebarCollapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );
};