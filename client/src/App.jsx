import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthSession } from './redux/slices/authSlice';
import AppRoutes from './routes/AppRoutes';

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
