import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classApi from '../../services/classApi';

export const fetchClasses = createAsyncThunk(
  'classes/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await classApi.getClasses();
      return data.classes || [];
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to fetch classes');
    }
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchClassById',
  async (classId, { rejectWithValue }) => {
    try {
      const data = await classApi.getClassById(classId);
      return data.class;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to fetch class details');
    }
  }
);

export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const data = await classApi.createClass(classData);
      return data.class;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to create class');
    }
  }
);

export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ classId, data }, { rejectWithValue }) => {
    try {
      const res = await classApi.updateClass(classId, data);
      return res.class;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to update class');
    }
  }
);

export const deleteClass = createAsyncThunk(
  'classes/deleteClass',
  async (classId, { rejectWithValue }) => {
    try {
      await classApi.deleteClass(classId);
      return classId;
    } catch (err) {
      return rejectWithValue(err.friendlyMessage || 'Failed to deactivate class');
    }
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState: {
    classes: [],
    currentClass: null,
    loading: false,
    error: null,
    actionSuccessMessage: null,
  },
  reducers: {
    clearClassError: (state) => {
      state.error = null;
      state.actionSuccessMessage = null;
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Class By ID
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
        state.actionSuccessMessage = 'Class created successfully!';
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.currentClass?.id === action.payload.id) {
          state.currentClass = action.payload;
        }
        state.actionSuccessMessage = 'Class updated successfully!';
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete/Deactivate Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter((c) => c.id !== action.payload);
        state.actionSuccessMessage = 'Class deactivated successfully!';
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClassError, clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;
