import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { 
  updateCategories, 
  toggleDarkMode, 
  updateLanguage,
  toggleNotifications 
} from '@/store/slices/userPreferencesSlice';
import { setSettingsModalOpen } from '@/store/slices/uiSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Save } from 'lucide-react';

const availableCategories = [
  'technology',
  'business',
  'entertainment',
  'sports',
  'science',
  'health',
  'environment',
  'finance',
  'politics',
  'travel',
  'food',
  'fashion',
  'photography',
  'fitness',
  'music',
  'movies',
  'books',
  'art',
  'education',
  'lifestyle'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

export const SettingsModal = () => {
  const dispatch = useAppDispatch();
  const { settingsModalOpen } = useAppSelector((state) => state.ui);
  const {
    categories,
    darkMode,
    language,
    notificationsEnabled
  } = useAppSelector((state) => state.userPreferences);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);

  const handleClose = () => {
    dispatch(setSettingsModalOpen(false));
  };

  const handleSave = () => {
    dispatch(updateCategories(selectedCategories));
    handleClose();
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Dialog open={settingsModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings & Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Content Categories */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Content Categories</Label>
              <p className="text-sm text-muted-foreground">
                Select the categories you're interested in to personalize your feed
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label 
                    htmlFor={category}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
            
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="capitalize">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Appearance</Label>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={() => dispatch(toggleDarkMode())}
              />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Language</Label>
            
            <Select
              value={language}
              onValueChange={(value) => dispatch(updateLanguage(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Notifications</Label>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new content and trends
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={() => dispatch(toggleNotifications())}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="btn-gradient">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};