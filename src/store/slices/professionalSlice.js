import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadSelectedProfessional = createAsyncThunk(
  'professional/loadSelectedProfessional',
  async (_, { rejectWithValue }) => {
    try {
      const raw = await AsyncStorage.getItem('selectedProfessional');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return rejectWithValue('Error cargando profesional seleccionado');
    }
  }
);

export const saveSelectedProfessional = createAsyncThunk(
  'professional/saveSelectedProfessional',
  async (professional, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem('selectedProfessional', JSON.stringify(professional));
      return professional;
    } catch (err) {
      return rejectWithValue('Error guardando profesional');
    }
  }
);

export const clearSelectedProfessional = createAsyncThunk(
  'professional/clearSelectedProfessional',
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem('selectedProfessional');
      return null;
    } catch (err) {
      return rejectWithValue('Error limpiando profesional');
    }
  }
);

const slice = createSlice({
  name: 'professional',
  initialState: {
    selected: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSelectedProfessional.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(saveSelectedProfessional.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(clearSelectedProfessional.fulfilled, (state) => {
        state.selected = null;
      });
  },
});

export const { setSelected } = slice.actions;
export default slice.reducer;
