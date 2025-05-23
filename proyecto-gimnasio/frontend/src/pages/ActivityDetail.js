import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [message, setMessage] = useState('');

  const loadActivity = async () => {
    try {
      const res = await API.get(`/activities/${id}`);
      setActivity(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async () => {
    const userID = parseInt(localStorage.getItem('user_id'));
    if (!userID) {
      alert('Debes estar logueado como socio para inscribirte.');
      return;
    }

    try {
      await API.post('/activities/enroll', {
        user_id: userID,
        activity_id: activity.ID,
      });
      setMessage('¡Inscripción exitosa!');
    } catch (err) {
      setMessage('No se pudo completar la inscripción.');
    }
  };

  useEffect(() => {
    loadActivity();
  }, [id]);

  if (!activity) return <div>Cargando actividad...</div>;

  return (
    <div>
      <h2>{activity.name}</h2>
      <p><strong>Día:</strong> {activity.day}</p>
      <p><strong>Hora:</strong> {activity.hour}</p>
      <p><strong>Categoría:</strong> {activity.category}</p>
      <p><strong>Cupo:</strong> {activity.capacity}</p>
      {/* Aquí podrías agregar foto, duración, descripción, etc. si existieran */}
      <button onClick={handleEnroll}>Inscribirme</button>
      {message && <p>{message}</p>}
    </div>
  );
}
