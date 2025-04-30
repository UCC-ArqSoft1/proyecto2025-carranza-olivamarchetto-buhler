import { useEffect, useState } from "react";

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error al obtener actividades:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Actividades disponibles</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.ID}>
            <strong>{activity.name}</strong> - {activity.day} - {activity.hour}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
