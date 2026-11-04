import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCrop } from '../../context/CropContext';
import { useAuth } from '../../context/AuthContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    tax,
    total
  } = useCart();

  const { placeOrder } = useCrop();
  const { user } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'upi' | 'cod' | 'netbanking'
  const [shippingAddress, setShippingAddress] = useState(
    user?.village ? `${user.village}, ${user.district}, ${user.state}` : 'Kisan Nagar, Pune District, Maharashtra'
  );
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress || !shippingAddress.trim()) {
      setOrderError('Please provide a valid delivery address.');
      return;
    }
    setIsSubmittingOrder(true);
    setOrderError('');

    try {
      const newOrder = await placeOrder({
        items: cartItems.map(item => ({
          name: item.medicine.name,
          quantity: item.quantity,
          price: item.medicine.price,
          imageUrl: item.medicine.imageUrl
        })),
        totalAmount: total,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (Demo)' : `${paymentMethod.toUpperCase()} (Demo)`,
        deliveryAddress: shippingAddress
      });
      setPlacedOrderId(newOrder.id);
      await clearCart();
      setCheckoutStep('success');
    } catch (err) {
      console.error('Order placement error:', err);
      setOrderError(err.message || 'Failed to place order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
    }, 300);
  };

  const freeShippingThreshold = 799;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-emerald-100">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              <h2 className="text-lg font-bold">
                {checkoutStep === 'cart' && 'Agricultural Cart'}
                {checkoutStep === 'checkout' && 'Complete Order'}
                {checkoutStep === 'success' && 'Order Placed!'}
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg hover:bg-emerald-700/50 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart View */}
          {checkoutStep === 'cart' && (
            <>
              {/* Free delivery progress */}
              <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100">
                <div className="flex justify-between items-center text-xs font-medium text-emerald-900 mb-1">
                  <span>
                    {subtotal >= freeShippingThreshold ? (
                      <strong className="text-emerald-700">🎉 Eligible for FREE Express Farm Delivery!</strong>
                    ) : (
                      <>Add ₹{freeShippingThreshold - subtotal} more for <strong>FREE Farm Delivery</strong></>
                    )}
                  </span>
                  <span>{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                      Explore our certified agricultural medicines, bio-fungicides and pest control products.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all shadow-sm"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div
                      key={item.medicine.id}
                      className="flex gap-4 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors"
                    >
                      <img
                        src={item.medicine.imageUrl}
                        alt={item.medicine.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                            {item.medicine.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.medicine.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.medicine.volume} • {item.medicine.category}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 py-1 text-xs font-semibold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-gray-900 text-sm">
                            ₹{item.medicine.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary and Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        GST (5% agri tax)
                      </span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        Delivery Charges
                      </span>
                      <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shipping}`}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
                      <span>Estimated Total</span>
                      <span className="text-emerald-700">₹{total}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={clearCart}
                      className="px-3 py-2.5 text-xs font-medium text-gray-600 hover:text-red-600 border border-gray-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setCheckoutStep('checkout')}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Checkout View */}
          {checkoutStep === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">Delivery Address</h3>
                  <p className="text-xs text-gray-500 mb-2">Medicines will be dispatched to your registered agricultural location.</p>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Enter full farm address, village, district, pincode"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">Payment Method</h3>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">Cash on Delivery (COD)</p>
                        <p className="text-xs text-gray-500">Pay cash directly when order reaches your farm</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">UPI / QR Code</p>
                        <p className="text-xs text-gray-500">GPay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </label>
                  </div>
                </div>

                {orderError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <span>{orderError}</span>
                  </div>
                )}

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Order will be dispatched directly to your registered farm location.</span>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">CropCare 100% Genuine Guarantee:</span> All fertilizers and bio-pesticides are batch-certified with verified active ingredients.
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Total ({cartItems.length})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax & Delivery</span>
                    <span>₹{tax + shipping}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                    <span>Total Amount Payable</span>
                    <span className="text-emerald-700">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmittingOrder ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Success View */}
          {checkoutStep === 'success' && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Order Confirmed!</h3>
              <p className="text-sm text-emerald-700 font-medium mt-1">Order #{placedOrderId}</p>
              
              <div className="my-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-left w-full space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Farm Dispatch In Progress</span>
                </div>
                <p>Expected delivery to your farm within <strong>24-48 hours</strong>.</p>
                <p>Payment: <strong>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online UPI'}</strong></p>
                <p>Delivery: <strong>{shippingAddress}</strong></p>
              </div>

              <div className="w-full space-y-2">
                <Link
                  to="/farmer/orders"
                  onClick={closeDrawer}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
                >
                  Track in My Orders
                </Link>
                <button
                  onClick={closeDrawer}
                  className="w-full py-2.5 px-4 text-gray-600 hover:bg-gray-100 font-medium rounded-xl text-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
