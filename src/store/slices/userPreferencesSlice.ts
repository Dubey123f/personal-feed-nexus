import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  favoriteItems: string[];
  language: string;
  feedLayout: 'grid' | 'list';
  notificationsEnabled: boolean;
}

const initialState: UserPreferences = {
  categories: ['technology', 'business', 'entertainment'],
  darkMode: false,
  favoriteItems: [],
  language: 'en',
  feedLayout: 'grid',
  notificationsEnabled: true,
};

// Load from localStorage if available
const loadStateFromStorage = (): UserPreferences => {
  try {
    const savedState = localStorage.getItem('userPreferences');
    return savedState ? { ...initialState, ...JSON.parse(savedState) } : initialState;
  } catch {
    return initialState;
  }
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: loadStateFromStorage(),
  reducers: {
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('userPreferences', JSON.stringify(state));
      
      // Apply theme immediately
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favoriteItems.includes(action.payload)) {
        state.favoriteItems.push(action.payload);
        localStorage.setItem('userPreferences', JSON.stringify(state));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favoriteItems = state.favoriteItems.filter(id => id !== action.payload);
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    updateFeedLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.feedLayout = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
      localStorage.setItem('userPreferences', JSON.stringify(state));
    },
  },
});

export const {
  updateCategories,
  toggleDarkMode,
  addFavorite,
  removeFavorite,
  updateLanguage,
  updateFeedLayout,
  toggleNotifications,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;