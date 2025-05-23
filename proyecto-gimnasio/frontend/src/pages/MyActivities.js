import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function MyActivities() {
  const [activities, setActivities] = useState([]);
  const userID = localStorage.getItem('user_id');

  const load = async () => {
    try {
      const res = await API.get(`/users/${userID}/activities`);
      setActivities(res.data);
    } catch (err) {
      console.error('Error al obtener actividades del usuario', err);
    }
  };

  useEffect(() => {
    if (userID) load();
  }, [userID]);

  if (!userID) return <p>Debes iniciar sesión para ver tus actividades.</p>;

  return (
    <div>
      <h2>Mis Actividades</h2>
      {activities.length === 0 ? (
        <p>No estás inscripto en ninguna actividad aún.</p>
      ) : (
        <ul>
          {activities.map((a) => (
            <li key={a.ID}>
              <Link to={`/activities/${a.ID}`}>
                {a.name} - {a.day} a las {a.hour} hs ({a.category})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
