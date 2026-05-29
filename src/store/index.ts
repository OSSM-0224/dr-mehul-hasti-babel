/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, DentalRecord, UserProfile } from '../types';

// Constants for Local Storage key naming
const STORAGE_USER_KEY = 'drbabel_user_profile';
const STORAGE_APPOINTMENTS_KEY = 'drbabel_appointments';
const STORAGE_TOKEN_KEY = 'drbabel_auth_token';

// Initial Mock Records for a comprehensive medical portfolio
const INITIAL_RECORDS: DentalRecord[] = [
  {
    id: 'REC-001',
    date: '2026-05-12',
    treatmentType: 'Intraoral 3D Smile Mapping',
    toothNumbers: ['Full Arch'],
    notes: 'Completed digital scan with state-of-the-art intraoral scanner. Aesthetic smile mapping processed. Prepared veneer parameters for front upper anteriors (#7, #8, #9, #10). Symmetry calculations completed.',
    attachment: {
      name: 'smile_design_mapping_v2.png',
      type: '3D Scan',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 15000
  },
  {
    id: 'REC-002',
    date: '2026-04-10',
    treatmentType: 'Painless Single-Sitting Root Canal',
    toothNumbers: ['#14 molar'],
    notes: 'Isolated upper left first molar. Automated rotary cleaning and shaping with continuous irrigation. Painless thermal obturation. Post-operative X-ray shows complete seal of dual pulp canals. Minimal swelling reported.',
    attachment: {
      name: 'root_canal_digital_xray.jpg',
      type: 'X-Ray',
      url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 12500
  },
  {
    id: 'REC-003',
    date: '2026-02-28',
    treatmentType: 'Full Arch Hygiene & Clinical Polish',
    toothNumbers: ['All Teeth'],
    notes: 'Comprehensive ultrasonic scaling followed by six-step high-standard sterilization prophylaxis. Handled calculus deposit and micro-abrasive surface polish. Recommended custom interdental bristle routines.',
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 4500
  }
];

// Seed initial default user
const DEFAULT_USER: UserProfile = {
  id: 'USR-7731',
  fullName: 'Meera Deshmukh',
  email: 'meera.deshmukh@gmail.com',
  phone: '+91 98200 12345',
  age: 28,
  gender: 'Female',
  patientId: 'BABEL-2026-1049',
  registeredAt: '2026-02-28'
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-101',
    patientName: 'Meera Deshmukh',
    mobileNumber: '+91 98200 12345',
    treatment: 'Smile Designing',
    date: '2026-06-05',
    time: '11:00 AM',
    status: 'confirmed',
    notes: 'Trial fitting of first-set custom ceramic dental veneers.',
    doctorName: 'Dr. Mehul Hasti Babel'
  },
  {
    id: 'APT-102',
    patientName: 'Meera Deshmukh',
    mobileNumber: '+91 98200 12345',
    treatment: 'Routine Checkup & Digital Scan',
    date: '2026-04-10',
    time: '04:30 PM',
    status: 'completed',
    notes: 'Review root canal healing on tooth #14. Completed.',
    doctorName: 'Dr. Mehul Hasti Babel'
  }
];

// Helper to load state safely
const loadState = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  return defaultValue;
};

// Helper to save state safely
const saveState = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
};

// Async Thunks simulating network calls (Thunk Axios Style)
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; phone: string }, { rejectWithValue }) => {
    try {
      // Simulate network request delay (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Basic login verification: matching email string or seeding default
      const storedUser = loadState<UserProfile | null>(STORAGE_USER_KEY, null);
      if (storedUser && storedUser.email.toLowerCase() === credentials.email.toLowerCase()) {
        saveState(STORAGE_TOKEN_KEY, 'BABEL_MOCK_JWT_TOKEN_DESHMUKH');
        return storedUser;
      }
      
      // If logging in for the first time or default matching user "meera.deshmukh@gmail.com"
      const loggedUser = {
        ...DEFAULT_USER,
        email: credentials.email || DEFAULT_USER.email,
        phone: credentials.phone || DEFAULT_USER.phone,
        fullName: credentials.email ? credentials.email.split('@')[0].toUpperCase() : DEFAULT_USER.fullName
      };
      
      saveState(STORAGE_USER_KEY, loggedUser);
      saveState(STORAGE_TOKEN_KEY, 'BABEL_MOCK_JWT_TOKEN_NEW');
      return loggedUser;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const bookAppointmentThunk = createAsyncThunk(
  'appointments/book',
  async (appointmentData: Omit<Appointment, 'id' | 'status' | 'doctorName'>, { getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const state = getState() as RootState;
      const newId = `APT-${Math.floor(100 + Math.random() * 900)}`;
      
      const newAppointment: Appointment = {
        ...appointmentData,
        id: newId,
        status: 'pending',
        doctorName: 'Dr. Mehul Hasti Babel'
      };

      const currentList = [...state.appointments.list, newAppointment];
      saveState(STORAGE_APPOINTMENTS_KEY, currentList);
      return newAppointment;
    } catch (err: any) {
      return rejectWithValue('Booking appointment failed');
    }
  }
);

export const cancelAppointmentThunk = createAsyncThunk(
  'appointments/cancel',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const state = getState() as RootState;
      const updatedList = state.appointments.list.map((apt) => 
        apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
      );
      saveState(STORAGE_APPOINTMENTS_KEY, updatedList);
      return id;
    } catch (err: any) {
      return rejectWithValue('Cancellation failed');
    }
  }
);

// Slices
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadState<UserProfile | null>(STORAGE_USER_KEY, null),
    token: loadState<string | null>(STORAGE_TOKEN_KEY, null),
    loading: false,
    error: null as string | null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveState(STORAGE_USER_KEY, state.user);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = 'BABEL_MOCK_JWT_TOKEN';
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    list: loadState<Appointment[]>(STORAGE_APPOINTMENTS_KEY, INITIAL_APPOINTMENTS),
    loading: false,
    error: null as string | null
  },
  reducers: {
    addLocalAppointment(state, action: PayloadAction<Appointment>) {
      state.list.push(action.payload);
      saveState(STORAGE_APPOINTMENTS_KEY, state.list);
    },
    resetAppointments(state) {
      state.list = INITIAL_APPOINTMENTS;
      saveState(STORAGE_APPOINTMENTS_KEY, state.list);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
        const apt = state.list.find((a) => a.id === action.payload);
        if (apt) {
          apt.status = 'cancelled';
        }
      });
  }
});

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    list: INITIAL_RECORDS,
    loading: false
  },
  reducers: {}
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activePath: 'home', // 'home' | 'about' | 'services' | 'gallery' | 'patient/dashboard' | 'patient/appointments' | 'patient/records'
    mobileMenuOpen: false,
    authModalOpen: false,
    toastMessage: null as string | null,
    toastType: 'success' as 'success' | 'error'
  },
  reducers: {
    setPath(state, action: PayloadAction<string>) {
      state.activePath = action.payload;
    },
    toggleMobileMenu(state, action: PayloadAction<boolean | undefined>) {
      state.mobileMenuOpen = action.payload !== undefined ? action.payload : !state.mobileMenuOpen;
    },
    toggleAuthModal(state, action: PayloadAction<boolean | undefined>) {
      state.authModalOpen = action.payload !== undefined ? action.payload : !state.authModalOpen;
    },
    showToast(state, action: PayloadAction<{ message: string; type?: 'success' | 'error' }>) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || 'success';
    },
    clearToast(state) {
      state.toastMessage = null;
    }
  }
});

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    appointments: appointmentsSlice.reducer,
    records: recordsSlice.reducer,
    ui: uiSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { logout, updateProfile } = authSlice.actions;
export const { addLocalAppointment, resetAppointments } = appointmentsSlice.actions;
export const { setPath, toggleMobileMenu, toggleAuthModal, showToast, clearToast } = uiSlice.actions;
