import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  image?: string;
  url?: string;
  publishedAt: string;
  category: string;
  source: string;
  isFavorite?: boolean;
}

interface ContentState {
  items: ContentItem[];
  searchResults: ContentItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  hasMore: boolean;
  page: number;
}

const initialState: ContentState = {
  items: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: '',
  hasMore: true,
  page: 1,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
    appendItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = [...state.items, ...action.payload];
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateItem: (state, action: PayloadAction<ContentItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    reorderItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetContent: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setLoading,
  setError,
  setItems,
  appendItems,
  setSearchResults,
  setSearchQuery,
  updateItem,
  reorderItems,
  setHasMore,
  setPage,
  incrementPage,
  resetContent,
} = contentSlice.actions;

export default contentSlice.reducer;