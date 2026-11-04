import React from 'react';
import { useCrop } from '../../context/CropContext';
import { Package, Truck, ShoppingBag, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrdersPage = () => {
  const { orders } = useCrop();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Medicine Orders & Dispatches
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track real-time shipment of your ordered fungicides, bio-pesticides, and farm inputs.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More Medicines</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Order certified bio-pesticides and fertilizers directly from our agricultural marketplace.
          </p>
          <Link
            to="/marketplace"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">Order #{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Placed on {order.date} • Tracking: <span className="font-mono text-emerald-700">{order.trackingNumber}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-lg font-black text-slate-900">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 ml-2">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivery to: <strong>{order.deliveryAddress}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">Payment: {order.paymentMethod}</span>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
