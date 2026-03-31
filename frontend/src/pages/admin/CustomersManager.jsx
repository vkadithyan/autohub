import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this customer? This will also remove their vehicles and bookings.")) {
      try {
        await api.delete(`/customers/${id}`);
        setCustomers(customers.filter(c => c.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete customer");
      }
    }
  };

  return (
    <div className="glass-panel">
      <h3>Customer Roster</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>#{c.id}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone || 'N/A'}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
