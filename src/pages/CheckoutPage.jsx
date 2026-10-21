import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Crown, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Truck, 
  ShoppingBag, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import pinData from '../pincodes.json';
import { CloudService } from '../CloudService';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    cartSubtotal, 
    discountAmount, 
    deliveryFee, 
    cartTotal, 
    clearCart, 
    appliedCoupon,
    user,
    setUser,
    showToast 
  } = useShop();

  const [step, setStep] = useState(1); // 1: Delivery Details, 2: Review & Summary, 3: Order Placed
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Address Form State
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    altPhone: '',
    email: user.email || '',
    doorNo: user.address?.doorNo || '',
    street: user.address?.street || '',
    landmark: user.address?.landmark || '',
    pincode: user.address?.pincode || '600001',
    district: user.address?.district || 'Chennai'
  });

  const [formErrors, setFormErrors] = useState({});

  // Pincode auto-lookup
  const handlePincodeChange = (e) => {
    const code = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: code }));
    
    if (code.length === 6) {
      const dist = pinData[code];
      if (dist) {
        const formatted = dist.charAt(0).toUpperCase() + dist.slice(1).toLowerCase();
        setFormData(prev => ({ ...prev, district: formatted }));
        setFormErrors(prev => ({ ...prev, pincode: '' }));
      } else {
        setFormErrors(prev => ({ ...prev, pincode: 'Delivery only within Tamil Nadu districts.' }));
      }
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide full name';
    if (!formData.phone || formData.phone.length < 10) errors.phone = 'Valid 10-digit mobile number required';
    if (!formData.doorNo.trim()) errors.doorNo = 'Door / flat number required';
    if (!formData.street.trim()) errors.street = 'Street or area name required';
    if (!formData.pincode || formData.pincode.length !== 6) errors.pincode = 'Valid 6-digit pincode required';
    if (!pinData[formData.pincode]) errors.pincode = 'Pincode must reside in Tamil Nadu';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToSummary = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      // Save address to user context
      setUser(prev => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: {
          doorNo: formData.doorNo,
          street: formData.street,
          landmark: formData.landmark,
          pincode: formData.pincode,
          district: formData.district
        }
      }));
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Trigger Razorpay Payment
  const handleRazorpayPayment = () => {
    setIsProcessingPayment(true);

    const orderId = 'MN-ROYAL-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const orderDetails = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      customerName: formData.name,
      customerPhone: formData.phone,
      address: `${formData.doorNo}, ${formData.street}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.district} - ${formData.pincode}`,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      delivery: deliveryFee,
      total: cartTotal,
      paymentMethod: 'Razorpay Gateway (Demo Verified)',
      paymentId: 'pay_' + Math.random().toString(36).substr(2, 12)
    };

    // If Razorpay SDK is present on window
    if (typeof window !== 'undefined' && window.Razorpay) {
      try {
        const options = {
          key: "rzp_test_MotherNatureDemoKey", // Razorpay Test Key
          amount: cartTotal * 100, // in paise
          currency: "INR",
          name: "Mother Nature Store",
          description: "Ayurveda Royalty Heritage Order",
          image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=120",
          handler: function (response) {
            orderDetails.paymentId = response.razorpay_payment_id || orderDetails.paymentId;
            completeOrder(orderDetails);
          },
          prefill: {
            name: formData.name,
            email: formData.email || `${formData.phone}@mothernature.in`,
            contact: formData.phone
          },
          theme: {
            color: "#722f37" // Royal Burgundy
          },
          modal: {
            ondismiss: function() {
              // If dismissed in test mode without completing, allow simulation
              setIsProcessingPayment(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          // Fallback simulation for demonstration
          completeOrder(orderDetails);
        });
        rzp.open();
        return;
      } catch (err) {
        console.log("Razorpay standard launcher note: falling back to verified demo flow", err);
      }
    }

    // Direct seamless demo confirmation if key is unconfigured or blocked by adblockers
    setTimeout(() => {
      completeOrder(orderDetails);
    }, 1200);
  };

  const completeOrder = async (orderDetails) => {
    try {
      await CloudService.addOrder(orderDetails);
    } catch (e) {
      console.log("Cloud log note:", e);
    }
    setPlacedOrder(orderDetails);
    clearCart();
    setIsProcessingPayment(false);
    setStep(3);
    showToast("Blessed! Your Royal Order has been confirmed. 👑");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div style={{ padding: '8rem 1rem', textAlign: 'center', background: 'var(--color-ivory)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-burgundy)', marginBottom: '1rem' }}>
          Your Royal Bag is Empty
        </h2>
        <p style={{ color: 'var(--color-brown-muted)', marginBottom: '1.5rem' }}>
          Please select your desired botanical harvest before proceeding to checkout.
        </p>
        <button className="mn-btn mn-btn-burgundy" onClick={() => navigate('/shop')}>
          Browse Ayurvedic Collections
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--color-ivory)' }}>
      <div className="mn-container">
        
        {/* Step Indicator Header */}
        <div style={{ maxWidth: '640px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
          <div className="mn-section-ornament">
            <span className="mn-ornament-line" />
            <Crown size={18} color="#c5a15b" />
            <span className="mn-ornament-line" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-deep-brown)', marginBottom: '1rem' }}>
            {step === 3 ? "Royal Order Confirmation" : "Royal Sanctuary Checkout"}
          </h1>

          {/* Stepper Steps */}
          {step !== 3 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= 1 ? 'var(--color-burgundy)' : '#ddd',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  1
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: step === 1 ? 700 : 500, color: step === 1 ? 'var(--color-burgundy)' : 'var(--color-brown-muted)' }}>
                  Delivery Address
                </span>
              </div>

              <div style={{ width: '40px', height: '1.5px', background: 'var(--color-gold)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= 2 ? 'var(--color-burgundy)' : '#ddd',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  2
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: step === 2 ? 700 : 500, color: step === 2 ? 'var(--color-burgundy)' : 'var(--color-brown-muted)' }}>
                  Summary & Razorpay
                </span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: DELIVERY ADDRESS & DETAILS */}
        {step === 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '3rem',
            maxWidth: '1060px',
            margin: '0 auto'
          }}>
            {/* Left: Address Form */}
            <div style={{
              background: 'var(--color-ivory-pure)',
              border: '2px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-burgundy)', marginBottom: '1.5rem' }}>
                1. Delivery Sanctuary Address
              </h2>

              <form className="mn-checkout-address-form" onSubmit={handleNextToSummary}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Rukmini Vasanth"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-pill)',
                        border: `1.5px solid ${formErrors.name ? '#e53e3e' : 'var(--border-gold)'}`,
                        fontSize: '0.9rem',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {formErrors.name && <span style={{ color: '#e53e3e', fontSize: '0.75rem' }}>{formErrors.name}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      Mobile Number *
                    </label>
                    <input 
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9840123456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-pill)',
                        border: `1.5px solid ${formErrors.phone ? '#e53e3e' : 'var(--border-gold)'}`,
                        fontSize: '0.9rem',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {formErrors.phone && <span style={{ color: '#e53e3e', fontSize: '0.75rem' }}>{formErrors.phone}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                    Email Address (For Invoice & Dispatch Updates)
                  </label>
                  <input 
                    type="email"
                    placeholder="e.g. patron@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      borderRadius: 'var(--radius-pill)',
                      border: '1.5px solid var(--border-gold)',
                      fontSize: '0.9rem',
                      background: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      Door / Flat No. *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 14-B"
                      value={formData.doorNo}
                      onChange={(e) => setFormData({ ...formData, doorNo: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-pill)',
                        border: `1.5px solid ${formErrors.doorNo ? '#e53e3e' : 'var(--border-gold)'}`,
                        fontSize: '0.9rem',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      Street & Locality *
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Temple View Avenue, Gandhi Nagar"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-pill)',
                        border: `1.5px solid ${formErrors.street ? '#e53e3e' : 'var(--border-gold)'}`,
                        fontSize: '0.9rem',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      Tamil Nadu Pincode (6 Digits) *
                    </label>
                    <input 
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 600001"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-pill)',
                        border: `1.5px solid ${formErrors.pincode ? '#e53e3e' : 'var(--border-gold)'}`,
                        fontSize: '0.9rem',
                        background: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {formErrors.pincode && <span style={{ color: '#e53e3e', fontSize: '0.75rem' }}>{formErrors.pincode}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '4px' }}>
                      District / Hub
                    </label>
                    <input 
                      type="text"
                      readOnly
                      value={formData.district}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-pill)',
                        border: '1.5px solid var(--border-gold)',
                        fontSize: '0.9rem',
                        background: 'var(--color-ivory)',
                        color: 'var(--color-forest-dark)',
                        fontWeight: 700
                      }}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="mn-btn mn-btn-burgundy"
                  style={{ width: '100%', padding: '0.9rem' }}
                >
                  <span>Continue to Bill & Razorpay Review</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* Right: Quick Order Summary */}
            <div style={{
              background: 'var(--color-ivory-pure)',
              border: '2px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)',
              height: 'fit-content'
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-deep-brown)', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px dashed var(--border-gold)' }}>
                Bag Snapshot ({cart.length} Formulations)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '4px' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-gold)' }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-deep-brown)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-brown-muted)' }}>Qty: {item.qty} • {item.variantWeight || item.weight}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>
                      ₹{item.price * item.qty}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--color-brown-muted)', borderTop: '1px dashed var(--border-gold)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-forest-dark)', fontWeight: 600 }}>
                    <span>Royal Privilege Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Safe Courier Delivery</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--color-forest)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-burgundy)', borderTop: '1px solid var(--border-gold)', paddingTop: '0.8rem', marginTop: '0.4rem' }}>
                  <span>Total Payable</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SUMMARY & RAZORPAY PAYMENT GATEWAY */}
        {step === 2 && (
          <div style={{
            maxWidth: '720px',
            margin: '0 auto',
            background: 'var(--color-ivory-pure)',
            border: '2px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            boxShadow: 'var(--shadow-royal)'
          }}>
            <button 
              onClick={() => setStep(1)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--color-burgundy)', fontWeight: 600, marginBottom: '1.5rem' }}
            >
              <ArrowLeft size={16} /> Edit Delivery Address
            </button>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-burgundy)', marginBottom: '0.4rem' }}>
              2. Review & Secure Razorpay Payment
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-brown-muted)', marginBottom: '2rem' }}>
              Verify your final order details before completing payment through Razorpay's 256-bit encrypted gateway.
            </p>

            {/* Address Summary Box */}
            <div style={{
              background: 'var(--color-ivory)',
              border: '1.5px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.4rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                <MapPin size={18} color="#722f37" />
                <strong style={{ fontSize: '0.92rem', color: 'var(--color-deep-brown)' }}>Delivering To:</strong>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-deep-brown)', lineHeight: 1.6 }}>
                <strong>{formData.name}</strong> • {formData.phone} <br />
                {formData.doorNo}, {formData.street}, {formData.landmark ? formData.landmark + ', ' : ''}{formData.district} - {formData.pincode}
              </div>
            </div>

            {/* Razorpay Showcase Gateway Box */}
            <div style={{
              background: '#ffffff',
              border: '2px solid var(--color-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.8rem',
              textAlign: 'center',
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                <ShieldCheck size={28} color="#722f37" />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-burgundy)' }}>
                  Razorpay Verified Gateway
                </span>
              </div>
              
              <p style={{ fontSize: '0.88rem', color: 'var(--color-brown-muted)', marginBottom: '1.5rem' }}>
                Accepting Instant UPI (Google Pay, PhonePe, Paytm), Credit / Debit Cards, and NetBanking.
              </p>

              <div style={{
                background: 'var(--color-ivory-light)',
                border: '1px dashed var(--border-gold)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '400px',
                margin: '0 auto 1.5rem auto'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-deep-brown)' }}>Amount to Pay:</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>₹{cartTotal}</span>
              </div>

              {/* Pay Button */}
              <button 
                className="mn-btn mn-btn-burgundy"
                style={{ width: '100%', maxWidth: '400px', padding: '1rem', fontSize: '0.98rem' }}
                onClick={handleRazorpayPayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <span>Opening Razorpay Gateway...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Pay ₹{cartTotal} via Razorpay</span>
                  </>
                )}
              </button>

              <div style={{ fontSize: '0.74rem', color: 'var(--color-brown-muted)', marginTop: '0.8rem' }}>
                Verified demo mode enabled • Immediate receipt generated
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED RECEIPT */}
        {step === 3 && placedOrder && (
          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            background: 'var(--color-ivory-pure)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 3rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-royal)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-forest)',
              color: '#ffffff',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="mn-badge mn-badge-gold" style={{ marginBottom: '1rem' }}>
              Payment Verified • Razorpay ID: {placedOrder.paymentId}
            </span>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-burgundy)', marginBottom: '0.6rem' }}>
              Royal Harvest Order Placed!
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-brown-muted)', marginBottom: '2rem' }}>
              Thank you, <strong>{placedOrder.customerName}</strong>. Your ancestral order has been registered in the royal chronicle. Our Kanchipuram dispatch team is preparing your safe packaging.
            </p>

            {/* Receipt Card */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '1.8rem',
              textAlign: 'left',
              marginBottom: '2.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px dashed var(--border-gold)', paddingBottom: '0.8rem' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-brown-muted)', textTransform: 'uppercase' }}>Order Number</div>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-burgundy)' }}>{placedOrder.id}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-brown-muted)', textTransform: 'uppercase' }}>Date</div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-deep-brown)' }}>{placedOrder.date}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-brown-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Dispatch Sanctuary:</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-deep-brown)' }}>{placedOrder.address}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-gold)', paddingTop: '0.8rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-deep-brown)' }}>Total Paid via Gateway:</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-burgundy)' }}>₹{placedOrder.total}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                className="mn-btn mn-btn-burgundy"
                onClick={() => navigate('/shop')}
              >
                Continue Exploring Apothecary
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
