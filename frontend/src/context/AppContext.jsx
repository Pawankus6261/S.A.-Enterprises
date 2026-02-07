import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const API_URL = (import.meta.env.VITE_API_URL || "https://s-a-enterprises.onrender.com").replace(/\/$/, "");

export const AppProvider = ({ children }) => {
  const [consumers, setConsumers] = useState([]);
  const [entries, setEntries] = useState([]);

  // FIXED: Store rates as an object to prevent crash in Dashboard
  const [rates, setRates] = useState({ normal: 20, chilled: 30 });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sa_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cRes = await axios.get(`${API_URL}/consumers/`);
      setConsumers(cRes.data);

      const eRes = await axios.get(`${API_URL}/entries/`);
      setEntries(eRes.data);

      try {
        const rRes = await axios.get(`${API_URL}/rates`);
        if (rRes.data) {
          setRates(rRes.data);
        }
      } catch (e) {
        console.warn("Using default rates");
      }
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
        custom_rate: newConsumer.custom_rate ? parseFloat(newConsumer.custom_rate) : null
      };
      const res = await axios.post(`${API_URL}/consumers/`, backendData);
      setConsumers([res.data, ...consumers]);
      return true;
    } catch (err) {
      console.error(err.response?.data?.detail || "Registration Failed");
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
        custom_rate: updatedData.custom_rate ? parseFloat(updatedData.custom_rate) : null
      };

      const res = await axios.put(`${API_URL}/consumers/${originalMobile}`, backendData);
      setConsumers(consumers.map(c => c.mobile === originalMobile ? res.data : c));

      if (originalMobile !== updatedData.mobile) {
        setEntries(entries.map(e =>
          e.mobile === originalMobile ? { ...e, mobile: updatedData.mobile } : e
        ));
      }
      return true;
    } catch (err) {
      console.error(err.response?.data?.detail || "Update Failed");
      return false;
    }
  };

  const deleteConsumer = async (mobile) => {
    try {
      await axios.delete(`${API_URL}/consumers/${mobile}`);
      setConsumers(consumers.filter(c => c.mobile !== mobile));
    } catch (err) { console.error("Delete Failed:", err); }
  };

  const addEntry = async (entryData) => {
    try {
      const payload = {
        ...entryData,
        type: entryData.type || 'normal',
        price: entryData.price,
        is_paid: false
      };
      const res = await axios.post(`${API_URL}/entries/`, payload);
      setEntries([res.data, ...entries]);
    } catch (err) { console.error(err); }
  };

  const editEntry = async (id, updatedData) => {
    try {
      const payload = {
        qty: updatedData.qty,
        date: updatedData.date,
        type: updatedData.type || 'normal',
        price: updatedData.price,
        is_paid: updatedData.is_paid
      };
      const res = await axios.put(`${API_URL}/entries/${id}`, payload);
      setEntries(entries.map(e => e.id === id ? res.data : e));
    } catch (err) { console.error(err); }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API_URL}/entries/${id}`);
      setEntries(entries.filter(e => e.id !== id));
    } catch (err) { console.error("Delete Failed:", err); }
  };

  const updateGlobalRates = async (newNormal, newChilled) => {
    try {
      await axios.post(`${API_URL}/rates`, { normal: newNormal, chilled: newChilled });
      setRates({ normal: newNormal, chilled: newChilled });
    } catch (err) { console.error(err); }
  };

  // FIXED: Added this function which was missing
  const markMonthPaid = async (mobile, month, status) => {
    try {
      await axios.put(`${API_URL}/payments/mark-month`, { mobile, month, status });
      setEntries(entries.map(e => {
        if (e.mobile === mobile && e.date.startsWith(month)) {
          return { ...e, is_paid: status };
        }
        return e;
      }));
      return true;
    } catch (err) {
      console.error("Payment Update Failed:", err);
      return false;
    }
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
      consumers, entries, user, rates,
      loginAdmin, loginConsumer, logout,
      registerConsumer, deleteConsumer, updateConsumer,
      addEntry, editEntry, deleteEntry, updateGlobalRates,
      markMonthPaid
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);