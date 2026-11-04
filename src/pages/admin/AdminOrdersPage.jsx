import React, { useState } from 'react';
import { useCrop } from '../../context/CropContext';

export const AdminOrdersPage = () => {
  const { orders } = useCrop();
  const [ordersList, setOrdersList] = useState([
    ...orders,
    {
      id: 'ORD-76219',
      date: '2026-10-12',
      items: [{ name: 'Trichoderma Viride Bio-Fungicide Powder', quantity: 3, price: 220 }],
      totalAmount: 660,
      paymentMethod: 'UPI',
      status: 'Delivered',
      trackingNumber: 'AGRI-EXP-441209',
      deliveryAddress: 'Village Sanwer, Indore, Madhya Pradesh'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('All');

  const handleUpdateStatus = (id, newStatus) => {
    setOrdersList(prev =>
      prev.map(ord => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
  };

  const filtered = ordersList.filter(o =>
    statusFilter === 'All' ? true : o.status === statusFilter
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Dispatch queue for agricultural medicines and farm supplies.
          </p>
        </div>

        <div className="flex gap-2">
          {['All', 'Confirmed', 'In Transit', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Delivery Coordinates</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{ord.id}</p>
                    <p className="text-[10px] text-slate-500">{ord.date} • {ord.paymentMethod}</p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      {ord.items.map((it, idx) => (
                        <p key={idx} className="text-slate-300">
                          {it.name} <span className="text-slate-500 font-mono">(x{it.quantity})</span>
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {ord.deliveryAddress}
                  </td>
                  <td className="p-4 font-extrabold text-white text-sm">
                    ₹{ord.totalAmount}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ord.status === 'In Transit'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded-lg text-xs py-1 px-2 outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
