import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { MOCK_HISTORY, MOCK_APPOINTMENTS, MOCK_ORDERS, MOCK_DISEASE_PRESETS } from '../data/mockData';
import { useAuth } from './AuthContext';

const CropContext = createContext();

export const CropProvider = ({ children }) => {
  const { user } = useAuth();
  const farmerId = user?.id || 'usr-farmer-01';

  const [historyList, setHistoryList] = useState(() => {
    const saved = localStorage.getItem(`cropcare_history_${farmerId}`);
    return saved ? JSON.parse(saved) : MOCK_HISTORY;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem(`cropcare_appointments_${farmerId}`);
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(`cropcare_orders_${farmerId}`);
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [currentDiagnosis, setCurrentDiagnosis] = useState(MOCK_DISEASE_PRESETS.tomato_blight);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with Backend on farmerId change (Farmer data isolation)
  const syncWithBackend = useCallback(async () => {
    if (!farmerId) return;
    setLoading(true);
    try {
      // 1. Fetch Scans
      const scansRes = await api.scans.getAll(farmerId);
      if (scansRes && scansRes.scans) {
        setHistoryList(scansRes.scans);
      }

      // 2. Fetch Orders
      const ordersRes = await api.orders.getAll(farmerId);
      if (ordersRes && ordersRes.orders) {
        setOrders(ordersRes.orders);
      }

      // 3. Fetch Bookings / Appointments
      const bookingsRes = await api.bookings.getAll(farmerId);
      if (bookingsRes && bookingsRes.appointments) {
        setAppointments(bookingsRes.appointments);
      }
    } catch (err) {
      console.warn('Backend sync failed, using local offline data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [farmerId]);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  useEffect(() => {
    localStorage.setItem(`cropcare_history_${farmerId}`, JSON.stringify(historyList));
  }, [historyList, farmerId]);

  useEffect(() => {
    localStorage.setItem(`cropcare_appointments_${farmerId}`, JSON.stringify(appointments));
  }, [appointments, farmerId]);

  useEffect(() => {
    localStorage.setItem(`cropcare_orders_${farmerId}`, JSON.stringify(orders));
  }, [orders, farmerId]);

  // Add new scan with persistent backend upload
  const addDiagnosisToHistory = async (diagnosis, userAnswers, imageFileOrUrl) => {
    let savedScan = null;

    try {
      if (imageFileOrUrl instanceof File) {
        const formData = new FormData();
        formData.append('image', imageFileOrUrl);
        formData.append('crop', userAnswers?.crop || diagnosis.crop);
        formData.append('duration', userAnswers?.duration || '3-5 days');
        formData.append('affectedArea', userAnswers?.affectedArea || 'Localized (< 20%)');
        formData.append('weather', userAnswers?.weather || 'Humid');
        formData.append('location', userAnswers?.location || 'Main Field');
        formData.append('notes', userAnswers?.notes || '');
        if (userAnswers?.symptoms) {
          formData.append('symptoms', JSON.stringify(userAnswers.symptoms));
        }

        const res = await api.scans.create(formData, farmerId);
        savedScan = res.scan;
      } else {
        const payload = {
          presetImageUrl: typeof imageFileOrUrl === 'string' ? imageFileOrUrl : diagnosis.imageUrl,
          crop: userAnswers?.crop || diagnosis.crop,
          duration: userAnswers?.duration || '3-5 days',
          affectedArea: userAnswers?.affectedArea || 'Localized (< 20%)',
          weather: userAnswers?.weather || 'Humid',
          location: userAnswers?.location || 'Main Field',
          notes: userAnswers?.notes || '',
          symptoms: userAnswers?.symptoms || []
        };
        const res = await api.scans.create(payload, farmerId);
        savedScan = res.scan;
      }
    } catch (err) {
      console.warn('Backend scan persist failed, falling back to local entry:', err.message);
      // Fallback local scan entry
      savedScan = {
        id: `hist-${Date.now()}`,
        farmerId,
        cropName: `${diagnosis.crop} (${userAnswers?.crop || 'Custom'})`,
        fieldLocation: userAnswers?.location || 'Main Field',
        uploadDate: new Date().toISOString().split('T')[0],
        diseaseName: diagnosis.diseaseName || `Suspected ${diagnosis.crop} Infection`,
        severity: diagnosis.severity || 'Moderate',
        status: 'Active (Under Treatment)',
        statusType: 'warning',
        originalImage: typeof imageFileOrUrl === 'string' ? imageFileOrUrl : diagnosis.imageUrl,
        followUpImage: null,
        treatmentTaken: 'Recommended treatments initiated pending agronomist confirmation.',
        notes: `Reported symptoms: ${userAnswers?.symptoms?.join(', ') || 'Observed leaf lesions'}. Affected: ${userAnswers?.affectedArea || 'Localized'}.`,
        expertAssigned: 'Not assigned yet',
        isDemo: true,
        demoNotice: null
      };
    }

    setHistoryList(prev => [savedScan, ...prev.filter(item => item.id !== savedScan.id)]);
    setCurrentDiagnosis(diagnosis);
    return savedScan;
  };

  // Add follow-up progress image
  const addFollowUpImage = async (historyId, followUpFileOrUrl, notes) => {
    try {
      if (followUpFileOrUrl instanceof File) {
        const formData = new FormData();
        formData.append('followUpImage', followUpFileOrUrl);
        formData.append('notes', notes || '');
        const res = await api.scans.addFollowUp(historyId, formData, farmerId);
        if (res.scan) {
          setHistoryList(prev => prev.map(item => item.id === historyId ? res.scan : item));
          return res.scan;
        }
      } else {
        const res = await api.scans.addFollowUp(historyId, { followUpImageUrl: followUpFileOrUrl, notes }, farmerId);
        if (res.scan) {
          setHistoryList(prev => prev.map(item => item.id === historyId ? res.scan : item));
          return res.scan;
        }
      }
    } catch (err) {
      console.warn('Follow-up API update failed, saving locally:', err.message);
    }

    // Local fallback update
    setHistoryList(prev =>
      prev.map(item => {
        if (item.id === historyId) {
          return {
            ...item,
            followUpImage: typeof followUpFileOrUrl === 'string' ? followUpFileOrUrl : item.followUpImage,
            status: 'Improving (Recovery in Progress)',
            statusType: 'success',
            notes: notes ? `${item.notes || ''} | Follow-up: ${notes}` : item.notes
          };
        }
        return item;
      })
    );
  };

  // Submit expert booking request
  const bookAppointment = async (appointmentData) => {
    let savedApt = null;
    try {
      const res = await api.bookings.create(farmerId, appointmentData);
      savedApt = res.appointment;
    } catch (err) {
      console.warn('Booking API call failed, saving locally:', err.message);
      savedApt = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        farmerId,
        status: 'Demo Request Submitted (Pending Confirmation)',
        meetingLink: appointmentData.type === 'Online Video Call' ? 'https://meet.cropcare-ai.com/room/apt-demo-live' : null,
        isDemo: true,
        ...appointmentData
      };
    }

    setAppointments(prev => [savedApt, ...prev]);
    return savedApt;
  };

  // Place demo order
  const placeOrder = async (orderData) => {
    let savedOrder = null;
    try {
      const res = await api.orders.create(farmerId, orderData);
      savedOrder = res.order;
    } catch (err) {
      console.warn('Order API call failed, saving locally:', err.message);
      savedOrder = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        farmerId,
        date: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
        trackingNumber: `AGRI-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        ...orderData
      };
    }

    setOrders(prev => [savedOrder, ...prev]);
    return savedOrder;
  };

  return (
    <CropContext.Provider
      value={{
        historyList,
        appointments,
        orders,
        currentDiagnosis,
        setCurrentDiagnosis,
        addDiagnosisToHistory,
        addFollowUpImage,
        bookAppointment,
        placeOrder,
        loading,
        error,
        syncWithBackend
      }}
    >
      {children}
    </CropContext.Provider>
  );
};

export const useCrop = () => useContext(CropContext);
