import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import {
  Welcome, 
  Login, 
  Signup,
  Dashboard,
  NotFound,
  Tasks,
  Profile,
  KanbanBoard,
  SingleTask
} from './pages'; 

import AuthenticatedLayout from './layout/Authenticated.jsx';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/userSlice.js';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await axios.post('/api/v1/users/refresh', {}, { withCredentials: true });
        if (res.status === 200 && res.data?.data) {
          dispatch(login(res.data.data));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        setLoading(false); 
      }
    };

    refreshToken();
  }, [dispatch]);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/kanban' element={<KanbanBoard />} />
          <Route path="/task/:taskId" element={<SingleTask />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
