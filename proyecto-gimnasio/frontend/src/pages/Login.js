import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await API.post('/login', { username, password });
      localStorage.setItem('token', res.data.token);

      // ✅ decodificar token y extraer user_id
      const decoded = jwtDecode(res.data.token);
      localStorage.setItem('user_id', decoded.user_id);

      alert('Login exitoso');
      navigate('/admin');
    } catch (err) {
      alert('Error en login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Usuario" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Contraseña" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}

