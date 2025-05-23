import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch {
      role = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/');
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Inicio</Link>
      {token && role === 'socio' && (
        <Link to="/mis-actividades" style={{ marginRight: '10px' }}>Mis actividades</Link>
      )}
      {token && role === 'admin' && (
        <Link to="/admin" style={{ marginRight: '10px' }}>Administrar</Link>
      )}
      {token ? (
        <button onClick={handleLogout}>Cerrar sesión</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
