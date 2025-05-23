import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import ActivityDetail from './pages/ActivityDetail';
import MyActivities from './pages/MyActivities';
import Navbar from './components/Navbar';


function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      {/* Aquí puedes agregar un componente de Header o Footer si lo deseas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={token ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/mis-actividades" element={<MyActivities />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
