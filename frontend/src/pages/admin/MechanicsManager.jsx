import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function MechanicsManager() {
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      const res = await api.get('/mechanics');
      setMechanics(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this mechanic?")) {
      try {
        await api.delete(`/mechanics/${id}`);
        setMechanics(mechanics.filter(m => m.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete mechanic");
      }
    }
  };

  return (
    <div className="glass-panel">
      <h3>Mechanic Workforce</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Specialty</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {mechanics.map(m => (
              <tr key={m.id}>
                <td>#{m.id}</td><td>{m.name}</td><td>{m.specialty}</td><td>{m.status.toUpperCase()}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(m.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
