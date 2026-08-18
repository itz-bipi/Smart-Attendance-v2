import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceApi from '../../services/attendanceApi';

// Teacher Start Attendance Session
export const startAttendanceSession = createAsyncThunk(
  'attendance/startAttendanceSession',
  async ({ subjectId, latitude, longitude }, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.startAttendanceSession({
        subjectId,
        latitude,
        longitude,
      });
      return data.session;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to start attendance session');
    }
  }
);

// Teacher Fetch Active Session
export const getActiveSession = createAsyncThunk(
  'attendance/getActiveSession',
  async (subjectId, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.getActiveSession(subjectId);
      return data.session;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'No active attendance session');
    }
  }
);

// Teacher Close Session
export const closeAttendanceSession = createAsyncThunk(
  'attendance/closeAttendanceSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.closeAttendanceSession(sessionId);
      return data.session;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to close session');
    }
  }
);

// Student Fetch My Active Sessions
export const getMyActiveSessions = createAsyncThunk(
  'attendance/getMyActiveSessions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.getMyActiveSessions();
      return data.sessions || [];
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to fetch active sessions');
    }
  }
);

// Student Generate Token
export const generateStudentAttendanceToken = createAsyncThunk(
  'attendance/generateStudentAttendanceToken',
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.generateStudentAttendanceToken(sessionId);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to generate attendance token');
    }
  }
);

// Student Verify Token (Confirm Attendance)
export const verifyStudentAttendanceToken = createAsyncThunk(
  'attendance/verifyStudentAttendanceToken',
  async (token, { rejectWithValue }) => {
    try {
      const data = await attendanceApi.verifyStudentAttendanceToken(token);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Attendance verification failed');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    activeTeacherSession: null,
    activeStudentSessions: [],
    liveAttendees: [],
    closedSessionSummary: null,
    lastVerificationResult: null,
    generatedStudentToken: null,
    loading: false,
    error: null,
    actionSuccessMessage: null,
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
      state.actionSuccessMessage = null;
      state.lastVerificationResult = null;
    },
    clearActiveTeacherSession: (state) => {
      state.activeTeacherSession = null;
      state.liveAttendees = [];
    },
    clearClosedSessionSummary: (state) => {
      state.closedSessionSummary = null;
    },
    addLiveAttendee: (state, action) => {
      // Check if student already in list
      const exists = state.liveAttendees.some((att) => att.id === action.payload.id || att.studentId === action.payload.studentId);
      if (!exists) {
        state.liveAttendees.unshift({
          ...action.payload,
          markedAt: action.payload.markedAt || new Date().toISOString(),
        });
      }
    },
    setStudentActiveSessionFromSocket: (state, action) => {
      // When socket notifies session started
      const exists = state.activeStudentSessions.some((s) => s.id === action.payload.sessionId);
      if (!exists) {
        state.activeStudentSessions.unshift({
          id: action.payload.sessionId,
          subjectId: action.payload.subjectId,
          classId: action.payload.classId,
          startedAt: action.payload.startedAt,
          expiresAt: action.payload.expiresAt,
          allowedRadius: action.payload.allowedRadius,
          token: action.payload.token,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Session (Teacher)
      .addCase(startAttendanceSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.liveAttendees = [];
      })
      .addCase(startAttendanceSession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTeacherSession = action.payload;
        state.actionSuccessMessage = 'Attendance session is now live!';
      })
      .addCase(startAttendanceSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Active Session (Teacher)
      .addCase(getActiveSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActiveSession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTeacherSession = action.payload;
      })
      .addCase(getActiveSession.rejected, (state, action) => {
        state.loading = false;
        state.activeTeacherSession = null;
        state.error = action.payload;
      })

      // Close Session (Teacher)
      .addCase(closeAttendanceSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeAttendanceSession.fulfilled, (state, action) => {
        state.loading = false;
        state.closedSessionSummary = {
          session: action.payload,
          attendees: [...state.liveAttendees],
        };
        state.activeTeacherSession = null;
        state.actionSuccessMessage = 'Attendance session closed successfully!';
      })
      .addCase(closeAttendanceSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get My Active Sessions (Student)
      .addCase(getMyActiveSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyActiveSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.activeStudentSessions = action.payload;
      })
      .addCase(getMyActiveSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate Token (Student)
      .addCase(generateStudentAttendanceToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateStudentAttendanceToken.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedStudentToken = action.payload.token;
      })
      .addCase(generateStudentAttendanceToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Token (Student)
      .addCase(verifyStudentAttendanceToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastVerificationResult = null;
      })
      .addCase(verifyStudentAttendanceToken.fulfilled, (state, action) => {
        state.loading = false;
        state.lastVerificationResult = {
          success: true,
          message: action.payload.message || 'Attendance marked successfully!',
          session: action.payload.session,
          timestamp: new Date().toISOString(),
        };
      })
      .addCase(verifyStudentAttendanceToken.rejected, (state, action) => {
        state.loading = false;
        state.lastVerificationResult = {
          success: false,
          error: action.payload,
          timestamp: new Date().toISOString(),
        };
      });
  },
});

export const {
  clearAttendanceError,
  clearActiveTeacherSession,
  clearClosedSessionSummary,
  addLiveAttendee,
  setStudentActiveSessionFromSocket,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
