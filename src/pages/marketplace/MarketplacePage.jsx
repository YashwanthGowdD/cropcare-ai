import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Star,
  Eye,
  X,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';
import { MOCK_MEDICINES } from '../../data/mockData';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const MarketplacePage = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState(MOCK_MEDICINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [priceSort, setPriceSort] = useState('default');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [modalQty, setModalQty] = useState(1);

  // Sync products from persistent backend database (single source of truth)
  useEffect(() => {
    let isMounted = true;
    api.products.getAll()
      .then((res) => {
        if (isMounted && res?.products?.length) {
          setProducts(res.products);
        }
      })
      .catch((err) => {
        console.warn('Backend product fetch failed, fallback to local data:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Fungicides',
    'Insecticides',
    'Bio-Pesticides',
    'Herbicides',
    'Plant Growth Promoters'
  ];

  const crops = [
    'All',
    'Tomato',
    'Rice / Paddy',
    'Wheat',
    'Cotton',
    'Potato',
    'Chilli'
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'All' || prod.category.toLowerCase() === selectedCategory.toLowerCase();

      // Crop
      const matchesCrop =
        selectedCrop === 'All' ||
        prod.cropCompatibility.some((c) =>
          c.toLowerCase().includes(selectedCrop.toLowerCase())
        ) ||
        prod.cropCompatibility.includes('All Crops');

      return matchesSearch && matchesCategory && matchesCrop;
    }).sort((a, b) => {
      if (priceSort === 'low-high') return a.price - b.price;
      if (priceSort === 'high-low') return b.price - a.price;
      if (priceSort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedCrop, priceSort]);

  const handleOpenModal = (prod) => {
    setSelectedProductForModal(prod);
    setModalQty(1);
  };

  const handleAddToCartFromModal = () => {
    if (selectedProductForModal) {
      addToCart(selectedProductForModal, modalQty);
      setSelectedProductForModal(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Title & Demo Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Certified Agricultural Inputs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Agri-Medicine & Crop Care Store
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Order lab-certified bio-fungicides, safe insect repellents, and micronutrients formulated to cure diagnosed plant diseases.
          </p>
        </div>

        {/* Certified Quality Badge */}
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-2xl text-xs max-w-sm flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Certified Quality Catalog. Direct farm delivery with verified active ingredients.</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        
        {/* Top: Search bar & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine name, active ingredient (e.g. Copper, Neem, Tricyclazole)..."
              className="w-full text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="md:col-span-4 flex gap-2">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="w-full text-sm py-3 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-slate-700"
            >
              <option value="default">Sort: Recommended</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Crop Compatibility Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Compatible Crop:
          </span>
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

      </div>

      {/* Product Results Grid */}
      <div>
        <div className="flex justify-between items-center mb-4 text-xs text-slate-500 font-medium">
          <span>Showing {filteredProducts.length} certified agri-medicines</span>
          {(selectedCategory !== 'All' || selectedCrop !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCrop('All');
                setSearchQuery('');
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching medicines found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, category, or selected crop filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {product.discount}
                  </span>
                  
                  {product.inStock ? (
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>In Stock</span>
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      Out of Stock
                    </span>
                  )}

                  <button
                    onClick={() => handleOpenModal(product)}
                    className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-bold text-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Quick View Details</span>
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium">{product.volume}</span>
                    </div>

                    <h3
                      onClick={() => handleOpenModal(product)}
                      className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors cursor-pointer"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {product.cropCompatibility.slice(0, 3).map((c) => (
                        <span key={c} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black text-slate-900">₹{product.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                        title="View Full Specifications"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                        disabled={!product.inStock}
                        className={`p-2.5 rounded-xl text-white transition-all shadow-sm ${
                          product.inStock
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                            : 'bg-slate-300 cursor-not-allowed'
                        }`}
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Product Photo */}
              <div className="md:col-span-5 aspect-square md:aspect-auto bg-slate-900 relative">
                <img
                  src={selectedProductForModal.imageUrl}
                  alt={selectedProductForModal.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow">
                  {selectedProductForModal.discount}
                </span>
              </div>

              {/* Product Info */}
              <div className="md:col-span-7 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {selectedProductForModal.category}
                    </span>
                    <span className="text-slate-400 font-medium">
                      Manufacturer: {selectedProductForModal.manufacturer}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 mt-2">
                    {selectedProductForModal.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Package Volume: <strong>{selectedProductForModal.volume}</strong>
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-black text-slate-900">₹{selectedProductForModal.price}</span>
                    <span className="text-sm text-slate-400 line-through">₹{selectedProductForModal.originalPrice}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      GST Included
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <p><strong>Active Ingredient:</strong> {selectedProductForModal.activeIngredient}</p>
                    <p><strong>Target Issues:</strong> {selectedProductForModal.targetIssues.join(', ')}</p>
                    <p><strong>Dosage Guidance:</strong> {selectedProductForModal.dosage}</p>
                    <p className="text-amber-800 bg-amber-50 p-2 rounded-lg">
                      <strong>Precautions:</strong> {selectedProductForModal.precautions}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">Quantity</span>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                        className="p-2 hover:bg-slate-200 text-slate-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1 text-sm font-bold text-slate-900">{modalQty}</span>
                      <button
                        onClick={() => setModalQty(modalQty + 1)}
                        className="p-2 hover:bg-slate-200 text-slate-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCartFromModal}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart (₹{selectedProductForModal.price * modalQty})</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
