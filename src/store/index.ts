/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Appointment, DentalRecord, UserProfile, Invoice } from '../types';

// Constants for Local Storage key naming
const STORAGE_USER_KEY = 'drbabel_user_profile';
const STORAGE_APPOINTMENTS_KEY = 'drbabel_appointments';
const STORAGE_PATIENTS_KEY = 'drbabel_patients';
const STORAGE_RECORDS_KEY = 'drbabel_clinical_records';
const STORAGE_INVOICES_KEY = 'drbabel_invoices';
const STORAGE_TOKEN_KEY = 'drbabel_auth_token';

// Seed initial default patient users
const SEEDED_PATIENTS: UserProfile[] = [
  {
    id: 'USR-7731',
    fullName: 'Meera Deshmukh',
    email: 'meera.deshmukh@gmail.com',
    phone: '+91 98200 12345',
    age: 28,
    gender: 'Female',
    patientId: 'BABEL-2026-1049',
    registeredAt: '2026-02-28'
  },
  {
    id: 'USR-1182',
    fullName: 'Rahul Sharma',
    email: 'sharma.rahul90@gmail.com',
    phone: '+91 98111 88222',
    age: 42,
    gender: 'Male',
    patientId: 'BABEL-2026-1182',
    registeredAt: '2026-03-15'
  },
  {
    id: 'USR-1304',
    fullName: 'Priya Nair',
    email: 'priya.nair@hotmail.com',
    phone: '+91 97665 13045',
    age: 34,
    gender: 'Female',
    patientId: 'BABEL-2026-1304',
    registeredAt: '2026-04-01'
  },
  {
    id: 'USR-1490',
    fullName: 'Arjun Mehta',
    email: 'mehta.arjun@yahoo.com',
    phone: '+91 91223 14900',
    age: 55,
    gender: 'Male',
    patientId: 'BABEL-2026-1490',
    registeredAt: '2026-04-20'
  }
];

// Initial Mock Records mapped to patient clinical cases
const INITIAL_RECORDS: DentalRecord[] = [
  {
    id: 'REC-001',
    patientId: 'BABEL-2026-1049',
    date: '2026-05-12',
    treatmentType: 'Intraoral 3D Smile Mapping',
    toothNumbers: ['Full Arch'],
    notes: 'Completed digital scan with state-of-the-art intraoral scanner. Aesthetic smile mapping processed. Prepared veneer parameters for front upper anteriors (#7, #8, #9, #10). Symmetry calculations completed.',
    attachment: {
      name: 'smile_design_mapping_v2.png',
      type: '3D Scan',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60'
    },
    doctorName: 'Dr. Mehul Hasti ...',
    cost: 15000
  },
  {
    id: 'REC-002',
    patientId: 'BABEL-2026-1049',
    date: '2026-04-10',
    treatmentType: 'Painless Single-Sitting Root Canal',
    toothNumbers: ['#14 molar'],
    notes: 'Isolated upper left first molar. Automated rotary cleaning and shaping with continuous irrigation. Painless thermal obturation. Post-operative X-ray shows complete seal of dual pulp canals. Minimal swelling reported.',
    attachment: {
      name: 'root_canal_digital_xray.jpg',
      type: 'X-Ray',
      url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600&auto=format&fit=crop&q=60'
    },
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 12500
  },
  {
    id: 'REC-003',
    patientId: 'BABEL-2026-1049',
    date: '2026-02-28',
    treatmentType: 'Full Arch Hygiene & Clinical Polish',
    toothNumbers: ['All Teeth'],
    notes: 'Comprehensive ultrasonic scaling followed by six-step high-standard sterilization prophylaxis. Handled calculus deposit and micro-abrasive surface polish. Recommended custom interdental bristle routines.',
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 4500
  },
  {
    id: 'REC-004',
    patientId: 'BABEL-2026-1182',
    date: '2026-05-18',
    treatmentType: 'Painless Single-Sitting Root Canal',
    toothNumbers: ['#19 molar'],
    notes: 'Deep decay with irreversible pulpitis. Complete rotary file extirpation, ozone sanitation, thermal root obturation. Placed direct build-up core. Scheduled crown fitting next month.',
    attachment: {
      name: 'xray_molar_19.jpg',
      type: 'X-Ray',
      url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600&auto=format&fit=crop&q=60'
    },
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 13000
  },
  {
    id: 'REC-005',
    patientId: 'BABEL-2026-1304',
    date: '2026-05-20',
    treatmentType: 'Cosmetic Teeth Whitening',
    toothNumbers: ['Bleaching Arch'],
    notes: 'In-office light-activated whitening system using 35% hydrogen peroxide gel. Protected gums with pristine liquid dam boundaries. Achieved 4 shades improvement on the VITA shade guide.',
    attachment: {
      name: 'shade_improvement_records.jpg',
      type: 'Photo',
      url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e905d?w=600&auto=format&fit=crop&q=60'
    },
    doctorName: 'Dr. Mehul Hasti Babel',
    cost: 14000
  }
];

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
  },
  {
    id: 'APT-103',
    patientName: 'Rahul Sharma',
    mobileNumber: '+91 98111 88222',
    treatment: 'Zirconia Crown Fitting',
    date: '2026-06-08',
    time: '02:00 PM',
    status: 'confirmed',
    notes: 'Pre-prepared CAD crown ready for cementation on lower left lateral molar #19.',
    doctorName: 'Dr. Mehul Hasti Babel'
  },
  {
    id: 'APT-104',
    patientName: 'Priya Nair',
    mobileNumber: '+91 97665 13045',
    treatment: 'Laser Gum Therapy',
    date: '2026-06-10',
    time: '12:30 PM',
    status: 'pending',
    notes: 'Follow up check on gingival margin bio-laser scan.',
    doctorName: 'Dr. Mehul Hasti Babel'
  },
  {
    id: 'APT-105',
    patientName: 'Arjun Mehta',
    mobileNumber: '+91 91223 14900',
    treatment: 'Dental Implant Consultation',
    date: '2026-06-15',
    time: '05:00 PM',
    status: 'pending',
    notes: 'CBCT 3D Scan review for premium Nobel Biocare implant placement.',
    doctorName: 'Dr. Mehul Hasti Babel'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-1001',
    patientId: 'BABEL-2026-1049',
    patientName: 'Meera Deshmukh',
    date: '2026-05-12',
    items: [
      { description: 'Intraoral 3D Smile Mapping & Mockup Layout', cost: 15000 }
    ],
    subtotal: 15000,
    tax: 2700, // 18% GST standard clinical
    discount: 1500, // 10% premium trial discount
    total: 16200,
    status: 'paid'
  },
  {
    id: 'INV-1002',
    patientId: 'BABEL-2026-1049',
    patientName: 'Meera Deshmukh',
    date: '2026-04-10',
    items: [
      { description: 'Painless Root Canal & Laser Sterilization', cost: 12500 }
    ],
    subtotal: 12500,
    tax: 2250,
    discount: 0,
    total: 14750,
    status: 'paid'
  },
  {
    id: 'INV-1003',
    patientId: 'BABEL-2026-1182',
    patientName: 'Rahul Sharma',
    date: '2026-05-18',
    items: [
      { description: 'Computerized rotary RCT molar #19', cost: 13000 },
      { description: 'Prefabricated High-Aesthetic Crown fitting', cost: 18005 }
    ],
    subtotal: 31005,
    tax: 5580,
    discount: 3000,
    total: 33585,
    status: 'pending'
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
      await new Promise((resolve) => setTimeout(resolve, 350));
      
      // Admin backdoor credentials bypass
      if (
        credentials.email.toLowerCase() === 'admin@babeldental.com' || 
        credentials.email.toLowerCase() === 'dr.babel@babeldental.com'
      ) {
        const adminProfile: UserProfile = {
          id: 'ADMIN-001',
          fullName: 'Dr. Mehul Hasty Babel',
          email: credentials.email.toLowerCase(),
          phone: credentials.phone || '+91 99999 88888',
          age: 38,
          gender: 'Male',
          patientId: 'CLINICAL-DIR-01',
          registeredAt: '2015-05-10',
          isAdmin: true
        };
        saveState(STORAGE_USER_KEY, adminProfile);
        saveState(STORAGE_TOKEN_KEY, 'BABEL_JWT_TOKEN_ADMIN_AUTHENTICATED');
        return adminProfile;
      }
      
      // Patient user log in checks
      const storedPatients = loadState<UserProfile[]>(STORAGE_PATIENTS_KEY, SEEDED_PATIENTS);
      const matched = storedPatients.find(p => p.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (matched) {
        saveState(STORAGE_USER_KEY, matched);
        saveState(STORAGE_TOKEN_KEY, 'BABEL_MOCK_JWT_TOKEN_PATIENT');
        return matched;
      }
      
      // Sign-up a new mockup patient automatically on-the-fly
      const emailId = credentials.email || 'guest@example.com';
      const nameParts = emailId.split('@')[0];
      const patientName = nameParts.charAt(0).toUpperCase() + nameParts.slice(1);
      
      const newPatient: UserProfile = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: patientName,
        email: emailId,
        phone: credentials.phone || '+91 90000 00000',
        age: 30,
        gender: 'Not Specified',
        patientId: `BABEL-2026-${Math.floor(2000 + Math.random() * 7000)}`,
        registeredAt: new Date().toISOString().split('T')[0]
      };
      
      const currentPatients = [...storedPatients, newPatient];
      saveState(STORAGE_PATIENTS_KEY, currentPatients);
      saveState(STORAGE_USER_KEY, newPatient);
      saveState(STORAGE_TOKEN_KEY, 'BABEL_MOCK_JWT_TOKEN_NEW');
      return newPatient;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login credentials fail');
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
        state.token = action.payload.isAdmin ? 'BABEL_JWT_TOKEN_ADMIN' : 'BABEL_JWT_TOKEN_PATIENT';
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
      state.list.unshift(action.payload);
      saveState(STORAGE_APPOINTMENTS_KEY, state.list);
    },
    resetAppointments(state) {
      state.list = INITIAL_APPOINTMENTS;
      saveState(STORAGE_APPOINTMENTS_KEY, state.list);
    },
    updateAppointmentStatus(state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) {
      const apt = state.list.find(a => a.id === action.payload.id);
      if (apt) {
        apt.status = action.payload.status;
        saveState(STORAGE_APPOINTMENTS_KEY, state.list);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
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

const patientRegistrySlice = createSlice({
  name: 'patients',
  initialState: {
    list: loadState<UserProfile[]>(STORAGE_PATIENTS_KEY, SEEDED_PATIENTS),
    loading: false
  },
  reducers: {
    addPatient(state, action: PayloadAction<UserProfile>) {
      state.list.unshift(action.payload);
      saveState(STORAGE_PATIENTS_KEY, state.list);
    },
    editPatient(state, action: PayloadAction<UserProfile>) {
      const idx = state.list.findIndex(p => p.patientId === action.payload.patientId);
      if (idx !== -1) {
        state.list[idx] = action.payload;
        saveState(STORAGE_PATIENTS_KEY, state.list);
      }
    }
  }
});

const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    list: loadState<DentalRecord[]>(STORAGE_RECORDS_KEY, INITIAL_RECORDS),
    loading: false
  },
  reducers: {
    addClinicalRecord(state, action: PayloadAction<DentalRecord>) {
      state.list.unshift(action.payload);
      saveState(STORAGE_RECORDS_KEY, state.list);
    }
  }
});

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    list: loadState<Invoice[]>(STORAGE_INVOICES_KEY, INITIAL_INVOICES),
    loading: false
  },
  reducers: {
    addInvoice(state, action: PayloadAction<Invoice>) {
      state.list.unshift(action.payload);
      saveState(STORAGE_INVOICES_KEY, state.list);
    },
    payInvoiceAction(state, action: PayloadAction<string>) {
      const inv = state.list.find(i => i.id === action.payload);
      if (inv) {
        inv.status = 'paid';
        saveState(STORAGE_INVOICES_KEY, state.list);
      }
    }
  }
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activePath: 'home', // 'home' | 'about' | 'services' | 'gallery' | 'patient/dashboard' | ... | 'admin/dashboard' | ...
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
    patients: patientRegistrySlice.reducer,
    records: recordsSlice.reducer,
    invoices: invoicesSlice.reducer,
    ui: uiSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { logout, updateProfile } = authSlice.actions;
export const { addLocalAppointment, resetAppointments, updateAppointmentStatus } = appointmentsSlice.actions;
export const { addPatient, editPatient } = patientRegistrySlice.actions;
export const { addClinicalRecord } = recordsSlice.actions;
export const { addInvoice, payInvoiceAction } = invoicesSlice.actions;
export const { setPath, toggleMobileMenu, toggleAuthModal, showToast, clearToast } = uiSlice.actions;
