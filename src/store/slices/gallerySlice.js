import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para cargar las imágenes desde AsyncStorage
export const loadGalleryImages = createAsyncThunk(
  'gallery/loadGalleryImages',
  async (professionalId, { rejectWithValue }) => {
    try {
      const raw = await AsyncStorage.getItem(`gallery_${professionalId}`);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Error cargando imágenes:', err);
      return rejectWithValue('Error cargando imágenes de la galería');
    }
  }
);

// Función para guardar una nueva imagen
export const saveGalleryImage = createAsyncThunk(
  'gallery/saveGalleryImage',
  async ({ professionalId, imageInfo }, { getState, rejectWithValue }) => {
    try {
      // Obtenemos las imágenes actuales
      const { gallery } = getState();
      const currentImages = gallery.images || [];
      
      // Añadimos la nueva imagen
      const updatedImages = [imageInfo, ...currentImages];
      
      // Guardamos en AsyncStorage
      await AsyncStorage.setItem(`gallery_${professionalId}`, JSON.stringify(updatedImages));
      
      return { professionalId, images: updatedImages };
    } catch (err) {
      console.error('Error guardando imagen:', err);
      return rejectWithValue('Error guardando imagen en la galería');
    }
  }
);

// Función para eliminar una imagen
export const deleteGalleryImage = createAsyncThunk(
  'gallery/deleteGalleryImage',
  async ({ professionalId, imageId }, { getState, rejectWithValue }) => {
    try {
      // Obtenemos las imágenes actuales
      const { gallery } = getState();
      const currentImages = gallery.images || [];
      
      // Filtramos para eliminar la imagen
      const updatedImages = currentImages.filter(img => img.id !== imageId);
      
      // Guardamos en AsyncStorage
      await AsyncStorage.setItem(`gallery_${professionalId}`, JSON.stringify(updatedImages));
      
      return { professionalId, images: updatedImages };
    } catch (err) {
      console.error('Error eliminando imagen:', err);
      return rejectWithValue('Error eliminando imagen de la galería');
    }
  }
);

// Creamos el slice
const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    images: [],
    isLoading: false,
    error: null,
    currentProfessionalId: null,
  },
  reducers: {
    resetGallery: (state) => {
      state.images = [];
      state.currentProfessionalId = null;
    },
    setCurrentProfessionalId: (state, action) => {
      state.currentProfessionalId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Manejo de loadGalleryImages
      .addCase(loadGalleryImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadGalleryImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
        state.currentProfessionalId = action.meta.arg; // El ID del profesional
      })
      .addCase(loadGalleryImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Manejo de saveGalleryImage
      .addCase(saveGalleryImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveGalleryImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload.images;
      })
      .addCase(saveGalleryImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Manejo de deleteGalleryImage
      .addCase(deleteGalleryImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload.images;
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGallery, setCurrentProfessionalId } = gallerySlice.actions;
export default gallerySlice.reducer;