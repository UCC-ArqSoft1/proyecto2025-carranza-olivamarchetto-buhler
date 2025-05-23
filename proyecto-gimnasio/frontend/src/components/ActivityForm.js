import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function ActivityForm({ activity, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    day: '',
    hour: '',
    capacity: '',
    category: ''
  });

  useEffect(() => {
    if (activity) {
      setForm(activity);
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (activity) {
        // 👇 Este era el problema
        await API.put(`/admin/activities/${activity.ID}`, form);
        alert('Actividad actualizada');
      } else {
        await API.post('/admin/activities', form);
        alert('Actividad creada');
      }
      onSuccess();
    } catch (e) {
      alert('Error al guardar');
      console.error(e);
    }
  };

  return (
    <div>
      {['name', 'day', 'hour', 'capacity', 'category'].map(field => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
        />
      ))}
      <button onClick={handleSubmit}>{activity ? 'Actualizar' : 'Crear'}</button>
    </div>
  );
}
