import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../services/authApi';
import { disconnectSocket } from '../../services/socketService';

// Fetch stored user if available in localStorage for quick hydration
const storedUser = localStorage.getItem('smart_attendance_user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getCurrentUser();
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Session expired');
    }
  }
);

export const loginTeacher = createAsyncThunk(
  'auth/loginTeacher',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.loginTeacher(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Login failed');
    }
  }
);

export const loginStudent = createAsyncThunk(
  'auth/loginStudent',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.loginStudent(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Login failed');
    }
  }
);

export const registerTeacher = createAsyncThunk(
  'auth/registerTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const data = await authApi.registerTeacher(teacherData);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Registration failed');
    }
  }
);

export const registerStudent = createAsyncThunk(
  'auth/registerStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const data = await authApi.registerStudent(studentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    role: initialUser?.role || null,
    isAuthenticated: !!initialUser,
    loading: false,
    sessionChecking: true,
    error: null,
    registerSuccessMessage: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.registerSuccessMessage = null;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      state.registerSuccessMessage = null;
      localStorage.removeItem('smart_attendance_user');
      disconnectSocket();
      // Expire cookie client-side as well
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('smart_attendance_user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth Session
      .addCase(checkAuthSession.pending, (state) => {
        state.sessionChecking = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.sessionChecking = false;
        if (action.payload?.user) {
          state.isAuthenticated = true;
          state.role = action.payload.user.role;
          if (!state.user) {
            state.user = { id: action.payload.user.id, role: action.payload.user.role };
          }
        }
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.sessionChecking = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        localStorage.removeItem('smart_attendance_user');
      })

      // Login Teacher
      .addCase(loginTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.teacher;
        state.role = 'teacher';
        state.error = null;
        localStorage.setItem('smart_attendance_user', JSON.stringify(action.payload.teacher));
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Student
      .addCase(loginStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.student;
        state.role = 'student';
        state.error = null;
        localStorage.setItem('smart_attendance_user', JSON.stringify(action.payload.student));
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Teacher
      .addCase(registerTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccessMessage = null;
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccessMessage = action.payload.message || 'Teacher registered successfully!';
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register Student
      .addCase(registerStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccessMessage = null;
      })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccessMessage = action.payload.message || 'Student registered successfully!';
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
