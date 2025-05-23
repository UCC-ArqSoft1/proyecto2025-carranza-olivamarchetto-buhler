import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');

  const loadActivities = async () => {
    try {
      const res = await API.get('/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error al cargar actividades', err);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const filtered = activities.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term) ||
      a.hour.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <h1>Actividades disponibles</h1>
      <input
        type="text"
        placeholder="Buscar por nombre, horario o categoría"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '300px', marginBottom: '20px' }}
      />
      <ul>
        {filtered.map((a) => (
            <Link to={`/activities/${a.ID}`}>
                <li key={a.ID}>
                    <strong>{a.name}</strong> - {a.day} a las {a.hour} hs ({a.category})
                </li>
            </Link>
        ))}
      </ul>
    </div>
  );
}
