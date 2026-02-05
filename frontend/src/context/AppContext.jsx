import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

// FIX: Remove trailing slash. 
// If VITE_API_URL is missing, it defaults to your Render URL (ensure no trailing slash there either)
const API_URL = (import.meta.env.VITE_API_URL || "https://s-a-enterprises.onrender.com").replace(/\/$/, "");

export const AppProvider = ({ children }) => {
  const [consumers, setConsumers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [jarRate, setJarRate] = useState(20);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sa_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // API_URL has no slash, so we add it here: /consumers/
      const cRes = await axios.get(`${API_URL}/consumers/`);
      setConsumers(cRes.data);

      const eRes = await axios.get(`${API_URL}/entries/`);
      setEntries(eRes.data);

      const rRes = await axios.get(`${API_URL}/rate`);
      setJarRate(rRes.data.rate);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const registerConsumer = async (newConsumer) => {
    try {
      const backendData = {
        name: newConsumer.name,
        mobile: newConsumer.mobile,
        house_no: newConsumer.house_no,
        area: newConsumer.area,
        // Send custom_rate (convert to float or null)
        custom_rate: newConsumer.custom_rate ? parseFloat(newConsumer.custom_rate) : null
      };
      const res = await axios.post(`${API_URL}/consumers/`, backendData);
      setConsumers([res.data, ...consumers]);
      return true;
    } catch (err) {
      alert(err.response?.data?.detail || "Registration Failed");
      return false;
    }
  };

  const updateConsumer = async (originalMobile, updatedData) => {
    try {
      const backendData = {
        name: updatedData.name,
        mobile: updatedData.mobile,
        house_no: updatedData.house_no,
        area: updatedData.area,
        // Send custom_rate
        custom_rate: updatedData.custom_rate ? parseFloat(updatedData.custom_rate) : null
      };
      const res = await axios.put(`${API_URL}/consumers/${originalMobile}`, backendData);
      setConsumers(consumers.map(c => c.mobile === originalMobile ? res.data : c));
      return true;
    } catch (err) {
      console.error("Update Failed:", err);
      alert("Update Failed");
      return false;
    }
  };

  const deleteConsumer = async (mobile) => {
    if (window.confirm('Delete consumer?')) {
      await axios.delete(`${API_URL}/consumers/${mobile}`);
      setConsumers(consumers.filter(c => c.mobile !== mobile));
    }
  };

  const addEntry = async (entryData) => {
    try {
      const res = await axios.post(`${API_URL}/entries/`, entryData);
      setEntries([res.data, ...entries]);
    } catch (err) { console.error(err); }
  };

  const editEntry = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/entries/${id}`, updatedData);
      setEntries(entries.map(e => e.id === id ? res.data : e));
    } catch (err) { console.error(err); }
  };

  const deleteEntry = async (id) => {
    if (window.confirm('Delete this entry?')) {
      await axios.delete(`${API_URL}/entries/${id}`);
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const updateRate = async (newRate) => {
    await axios.post(`${API_URL}/rate`, { rate: newRate });
    setJarRate(newRate);
  };

  const loginAdmin = (u, p) => {
    if (u === 'AdminSA' && p === 'SA@#$7060') {
      const adminUser = { role: 'admin', name: 'Owner' };
      setUser(adminUser);
      localStorage.setItem('sa_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const loginConsumer = (name, mobile) => {
    const exists = consumers.find(c => c.mobile === mobile);
    if (exists) {
      const consumerUser = { role: 'consumer', name: exists.name, mobile: exists.mobile };
      setUser(consumerUser);
      localStorage.setItem('sa_user', JSON.stringify(consumerUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sa_user');
  };

  return (
    <AppContext.Provider value={{
      consumers, entries, user, jarRate,
      loginAdmin, loginConsumer, logout,
      registerConsumer, deleteConsumer, updateConsumer,
      addEntry, editEntry, deleteEntry, updateRate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);