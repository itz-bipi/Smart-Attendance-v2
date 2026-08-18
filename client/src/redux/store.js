import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import subjectReducer from './slices/subjectSlice';
import enrollmentReducer from './slices/enrollmentSlice';
import attendanceReducer from './slices/attendanceSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classReducer,
    subjects: subjectReducer,
    enrollments: enrollmentReducer,
    attendance: attendanceReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
