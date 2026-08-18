import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subjectApi from '../../services/subjectApi';

export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const data = await subjectApi.getSubjects();
      return data.subjects || [];
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to fetch subjects');
    }
  }
);

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData, { rejectWithValue }) => {
    try {
      const data = await subjectApi.createSubject(subjectData);
      return data.subject;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to create subject');
    }
  }
);

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    subjects: [],
    loading: false,
    error: null,
    actionSuccessMessage: null,
    createdSubjectData: null, // to show joinCode popup
  },
  reducers: {
    clearSubjectError: (state) => {
      state.error = null;
      state.actionSuccessMessage = null;
      state.createdSubjectData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.push(action.payload);
        state.createdSubjectData = action.payload;
        state.actionSuccessMessage = `Subject created! Join Code: ${action.payload.joinCode}`;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubjectError } = subjectSlice.actions;
export default subjectSlice.reducer;
