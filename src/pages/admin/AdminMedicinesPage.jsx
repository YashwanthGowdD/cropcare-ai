import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { MOCK_MEDICINES } from '../../data/mockData';

export const AdminMedicinesPage = () => {
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  // New Medicine Form State
  const [newMed, setNewMed] = useState({
    name: '',
    category: 'Fungicides',
    price: 350,
    originalPrice: 450,
    volume: '500 ml',
    activeIngredient: '',
    stockCount: 50,
    manufacturer: 'AgriNova Labs',
    cropCompatibility: 'Tomato, Potato, Chilli',
    description: 'Certified broad-spectrum foliar treatment.'
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine product?')) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleStartEdit = (med) => {
    setEditingId(med.id);
    setEditPrice(med.price);
    setEditStock(med.stockCount);
  };

  const handleSaveEdit = (id) => {
    setMedicines(prev =>
      prev.map(m =>
        m.id === id
          ? {
              ...m,
              price: Number(editPrice),
              stockCount: Number(editStock),
              inStock: Number(editStock) > 0
            }
          : m
      )
    );
    setEditingId(null);
  };

  const handleCreateMedicine = (e) => {
    e.preventDefault();
    const created = {
      id: `med-${Date.now()}`,
      name: newMed.name,
      category: newMed.category,
      targetIssues: ['Foliar Lesions', 'Blight'],
      cropCompatibility: newMed.cropCompatibility.split(',').map(s => s.trim()),
      price: Number(newMed.price),
      originalPrice: Number(newMed.originalPrice),
      discount: '25% OFF',
      rating: 4.8,
      reviewsCount: 1,
      inStock: Number(newMed.stockCount) > 0,
      stockCount: Number(newMed.stockCount),
      volume: newMed.volume,
      activeIngredient: newMed.activeIngredient,
      manufacturer: newMed.manufacturer,
      imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      description: newMed.description,
      dosage: '2ml per liter of water',
      precautions: 'Wear gloves during preparation'
    };

    setMedicines([created, ...medicines]);
    setIsAddModalOpen(false);
    setNewMed({
      name: '',
      category: 'Fungicides',
      price: 350,
      originalPrice: 450,
      volume: '500 ml',
      activeIngredient: '',
      stockCount: 50,
      manufacturer: 'AgriNova Labs',
      cropCompatibility: 'Tomato, Potato, Chilli',
      description: 'Certified broad-spectrum foliar treatment.'
    });
  };

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Medicine & Agri-Input Inventory
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage product stock levels, retail pricing, and certified agricultural listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="text-xs px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl outline-none"
          />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Package Volume</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Stock Units</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((med) => {
                const isEditing = editingId === med.id;

                return (
                  <tr key={med.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={med.imageUrl}
                          alt={med.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{med.name}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{med.activeIngredient}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-purple-300 font-medium">{med.category}</td>
                    <td className="p-4 text-slate-400">{med.volume}</td>
                    
                    {/* Price with Inline Edit */}
                    <td className="p-4 font-bold text-white">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-20 px-2 py-1 bg-slate-800 border border-purple-500 rounded text-white text-xs"
                        />
                      ) : (
                        `₹${med.price}`
                      )}
                    </td>

                    {/* Stock with Inline Edit */}
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="w-16 px-2 py-1 bg-slate-800 border border-purple-500 rounded text-white text-xs"
                        />
                      ) : (
                        `${med.stockCount} units`
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        med.inStock && med.stockCount > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {med.inStock && med.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(med.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-slate-700 text-white rounded hover:bg-slate-600"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(med)}
                            className="text-slate-400 hover:text-purple-300 p-1"
                            title="Edit Price/Stock"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(med.id)}
                            className="text-slate-400 hover:text-red-400 p-1"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MEDICINE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Add Certified Agri-Medicine</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="e.g. Copper Shield 50 WP"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category *</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  >
                    <option value="Fungicides">Fungicides</option>
                    <option value="Insecticides">Insecticides</option>
                    <option value="Bio-Pesticides">Bio-Pesticides</option>
                    <option value="Herbicides">Herbicides</option>
                    <option value="Plant Growth Promoters">Plant Growth Promoters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Package Volume *</label>
                  <input
                    type="text"
                    required
                    value={newMed.volume}
                    onChange={(e) => setNewMed({ ...newMed, volume: e.target.value })}
                    placeholder="e.g. 500 ml or 1 kg"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newMed.price}
                    onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={newMed.stockCount}
                    onChange={(e) => setNewMed({ ...newMed, stockCount: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Active Ingredient *</label>
                <input
                  type="text"
                  required
                  value={newMed.activeIngredient}
                  onChange={(e) => setNewMed({ ...newMed, activeIngredient: e.target.value })}
                  placeholder="e.g. Copper Oxychloride 50% WP"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save & Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
