import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import appSlice from './slices/appSlice';
import professionalSlice from './slices/professionalSlice';
import gallerySlice from './slices/gallerySlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    app: appSlice,
    professional: professionalSlice,
    gallery: gallerySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones específicas si es necesario
        ignoredActions: [],
      },
    }),
});

export default store;
