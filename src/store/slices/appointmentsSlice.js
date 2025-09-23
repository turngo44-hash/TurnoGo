import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helpers
const parseTimeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Sample appointments (local demo data)
const sampleData = [
  {
    id: '1',
    clientName: 'Roberto Sánchez Mendoza',
    service: 'Corte y barba',
    date: new Date().toISOString().slice(0, 10), // store as YYYY-MM-DD
    time: '10:00',
    duration: 60,
    price: 25.0,
    professionalId: 'prof1',
    professionalName: 'Carlos Méndez',
    professionalImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    notes: 'Cliente regular, corte clásico con barba completa',
    status: 'confirmed',
  },
  {
    id: '2',
    clientName: 'Kevin Rodríguez',
    service: 'Afeitado rápido',
    date: new Date().toISOString().slice(0, 10),
    time: '11:15',
    duration: 15,
    price: 12.0,
    professionalId: 'prof2',
    professionalName: 'Laura Torres',
    professionalImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    notes: 'Solo afeitado rápido sin corte',
    status: 'confirmed',
  },
  {
    id: '3',
    clientName: 'Francisco Jiménez Vega',
    service: 'Corte completo + barba',
    date: new Date().toISOString().slice(0, 10),
    time: '13:00',
    duration: 60,
    price: 35.0,
    professionalId: 'prof1',
    professionalName: 'Carlos Méndez',
    professionalImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    notes: 'Cliente nuevo, corte moderno con degradado y barba perfilada',
    status: 'confirmed',
  },
  {
    id: '4',
    clientName: 'Alejandro Ruiz',
    service: 'Barba y bigote',
    date: new Date().toISOString().slice(0, 10),
    time: '13:00',
    duration: 45,
    price: 20.0,
    professionalId: 'prof2',
    professionalName: 'Laura Torres',
    professionalImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    notes: 'Arreglo de barba y bigote con recorte',
    status: 'pending',
  },
];

// Thunks
export const loadAppointments = createAsyncThunk('appointments/load', async () => {
  // Simulate async load (local)
  return new Promise((resolve) => {
    setTimeout(() => resolve(sampleData), 150);
  });
});

export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointment, { getState, rejectWithValue }) => {
    // appointment: { date: 'YYYY-MM-DD', time: 'HH:MM', duration, professionalId, ... }
    const state = getState();
    const items = state.appointments.items || [];

    // Compute new appointment start/end in minutes
    const newStart = parseTimeToMinutes(appointment.time);
    const newEnd = newStart + (appointment.duration || 0);

    // Find overlaps for same professional and same date
    const overlaps = items.some((a) => {
      if (a.professionalId !== appointment.professionalId) return false;
      if (a.date !== appointment.date) return false;
      const aStart = parseTimeToMinutes(a.time);
      const aEnd = aStart + a.duration;
      return Math.max(aStart, newStart) < Math.min(aEnd, newEnd);
    });

    if (overlaps) {
      return rejectWithValue({ message: 'El horario seleccionado se solapa con otra cita.' });
    }

    // Create a new appointment locally
    const newAppointment = {
      id: Date.now().toString(),
      ...appointment,
      status: appointment.status || 'pending',
    };

    // Simulate async save
    return new Promise((resolve) => {
      setTimeout(() => resolve(newAppointment), 150);
    });
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ appointmentId, status }, { getState, rejectWithValue }) => {
    // For local store we just return payload
    return { appointmentId, status };
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async ({ appointmentId, reason = '' }, { getState }) => {
    return { appointmentId, reason };
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAppointments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Error cargando citas';
      })

      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || 'No se pudo crear cita';
      })

      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const { appointmentId, status } = action.payload;
        const idx = state.items.findIndex((a) => a.id === appointmentId);
        if (idx !== -1) state.items[idx].status = status;
      })

      .addCase(cancelAppointment.fulfilled, (state, action) => {
        const { appointmentId } = action.payload;
        const idx = state.items.findIndex((a) => a.id === appointmentId);
        if (idx !== -1) state.items[idx].status = 'cancelled';
      });
  },
});

export default appointmentsSlice.reducer;
