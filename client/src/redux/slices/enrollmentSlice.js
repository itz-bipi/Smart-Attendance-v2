import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import enrollmentApi from '../../services/enrollmentApi';

export const joinSubject = createAsyncThunk(
  'enrollments/joinSubject',
  async (joinCode, { rejectWithValue }) => {
    try {
      const data = await enrollmentApi.joinSubject(joinCode);
      return data;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to join subject');
    }
  }
);

export const fetchMyEnrollments = createAsyncThunk(
  'enrollments/fetchMyEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await enrollmentApi.getMyEnrollments();
      return data.enrollments || [];
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to fetch enrollments');
    }
  }
);

export const fetchSubjectEnrollments = createAsyncThunk(
  'enrollments/fetchSubjectEnrollments',
  async (subjectId, { rejectWithValue }) => {
    try {
      const data = await enrollmentApi.getSubjectEnrollments(subjectId);
      return { subjectId, enrollments: data.enrollments || [] };
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to fetch subject enrollments');
    }
  }
);

export const updateEnrollmentStatus = createAsyncThunk(
  'enrollments/updateEnrollmentStatus',
  async ({ enrollmentId, status }, { rejectWithValue }) => {
    try {
      const data = await enrollmentApi.updateEnrollmentStatus(enrollmentId, status);
      return data.enrollment;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to update enrollment status');
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState: {
    myEnrollments: [],
    subjectEnrollments: [],
    currentSubjectId: null,
    loading: false,
    error: null,
    actionSuccessMessage: null,
  },
  reducers: {
    clearEnrollmentError: (state) => {
      state.error = null;
      state.actionSuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Join Subject (Student)
      .addCase(joinSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.actionSuccessMessage = 'Joined subject successfully!';
      })
      .addCase(joinSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Enrollments (Student)
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollments = action.payload;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Subject Enrollments (Teacher)
      .addCase(fetchSubjectEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectEnrollments = action.payload.enrollments;
        state.currentSubjectId = action.payload.subjectId;
      })
      .addCase(fetchSubjectEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Enrollment Status (Teacher)
      .addCase(updateEnrollmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEnrollmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjectEnrollments.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.subjectEnrollments[index].status = action.payload.status;
        }
        state.actionSuccessMessage = `Enrollment status changed to ${action.payload.status}`;
      })
      .addCase(updateEnrollmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnrollmentError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
