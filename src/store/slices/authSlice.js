import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseAuthService from '../../services/FirebaseAuthService';

// Async thunks para acciones asíncronas
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await FirebaseAuthService.loginWithEmail(email, password);
      
      if (result.success) {
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        return result.user;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name, businessCategoryId, countryId, phone }, { rejectWithValue }) => {
    try {
      const result = await FirebaseAuthService.registerWithEmail(email, password, { name, businessCategoryId, countryId, phone });
      
      if (result.success) {
        // Guardar en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        return result.user;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      return rejectWithValue('Error cargando usuario');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Cerrar sesión en Firebase
      await FirebaseAuthService.logout();
      // Remover de AsyncStorage
      await AsyncStorage.removeItem('user');
      return null;
    } catch (error) {
      return rejectWithValue('Error cerrando sesión');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false, // Para controlar el splash
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Load user from storage
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isInitialized = true;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.isInitialized = true;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setInitialized, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
