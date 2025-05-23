import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ActivityForm from '../components/ActivityForm';

export default function AdminDashboard() {
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadActivities = async () => {
    const res = await API.get('/activities');
    setActivities(res.data);
    console.log(res.data); // debug
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const deleteActivity = async (id) => {
    console.log(id); // debug
    if (!window.confirm('¿Eliminar esta actividad?')) return;
    await API.delete(`/admin/activities/${id}`);
    loadActivities();
  };

  return (
    <div>
      <h2>Actividades</h2>
      <ActivityForm onSuccess={loadActivities} />
      <ul>
        {activities.map(a => (
            <li key={a.ID}>
            {a.name} - {a.day}
            <button onClick={() => setEditing(a)}>Editar</button>
            <button onClick={() => deleteActivity(a.ID)}>Eliminar</button>
            </li>
        ))}
        </ul>
      {editing && <ActivityForm activity={editing} onSuccess={() => { setEditing(null); loadActivities(); }} />}
    </div>
  );
}
