import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk para cargar configuraciones iniciales
export const loadAppConfig = createAsyncThunk(
  'app/loadAppConfig',
  async (_, { rejectWithValue }) => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const preferences = await AsyncStorage.getItem('userPreferences');
      
      return {
        hasSeenOnboarding: hasSeenOnboarding === 'true',
        preferences: preferences ? JSON.parse(preferences) : {
          language: 'es',
          notifications: true,
          theme: 'light',
        },
      };
    } catch (error) {
      return rejectWithValue('Error cargando configuración');
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'app/completeOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      return true;
    } catch (error) {
      return rejectWithValue('Error guardando onboarding');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'app/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
      return preferences;
    } catch (error) {
      return rejectWithValue('Error guardando preferencias');
    }
  }
);

export const resetOnboarding = createAsyncThunk(
  'app/resetOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('hasSeenOnboarding');
      return false;
    } catch (error) {
      return rejectWithValue('Error reseteando onboarding');
    }
  }
);

const appSlice = createSlice({
  name: 'app',
  initialState: {
    hasSeenOnboarding: false,
    isAppReady: false,
    preferences: {
      language: 'es',
      notifications: true,
      theme: 'light',
    },
    error: null,
  },
  reducers: {
    setAppReady: (state) => {
      state.isAppReady = true;
    },
    clearAppError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAppConfig.fulfilled, (state, action) => {
        state.hasSeenOnboarding = action.payload.hasSeenOnboarding;
        state.preferences = action.payload.preferences;
        state.isAppReady = true;
      })
      .addCase(loadAppConfig.rejected, (state, action) => {
        state.error = action.payload;
        state.isAppReady = true; // Continuar aunque haya error
      })
      .addCase(completeOnboarding.fulfilled, (state) => {
        state.hasSeenOnboarding = true;
      })
      .addCase(resetOnboarding.fulfilled, (state) => {
        state.hasSeenOnboarding = false;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export const { setAppReady, clearAppError } = appSlice.actions;
export default appSlice.reducer;
