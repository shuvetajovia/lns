import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import pinData from '../data/deliveryPincodes.json';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    discountAmount,
    deliveryFee,
    cartTotal,
    user,
    setUser,
    showToast,
    checkPincode
  } = useShop();

  const [step, setStep] = useState(1); // 1: Delivery Details, 2: Review & Summary, 3: Order Placed

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

  const [editing, setEditing] = useState(false);
  React.useEffect(() => {
    if (!editing) setFormData(prev => ({ ...prev, name:user.name,phone:user.phone,email:user.email,...user.address }));
  }, [user.name,user.phone,user.email,JSON.stringify(user.address),editing]);
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
    if (!/^(?:\+91)?[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, ''))) errors.phone = 'Valid 10-digit mobile number required';
    if (!formData.doorNo.trim()) errors.doorNo = 'Door / flat number required';
    if (!formData.street.trim()) errors.street = 'Street or area name required';
    if (!formData.pincode || formData.pincode.length !== 6) errors.pincode = 'Valid 6-digit pincode required';
    if (!checkPincode(formData.pincode).valid) errors.pincode = 'Delivery is unavailable for this pincode. Please check with the store.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToSummary = async (e) => {
    e.preventDefault();
    if (validateStep1()) {
      // Save address to user context
      try { await setUser(prev => ({
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
      } catch (error) { showToast('Address could not be saved: ' + error.message, 'error'); return; }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (cart.length === 0) {
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
            {"Checkout"}
          </h1>

          {/* Stepper Steps */}
          {(
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
                  Review details
                </span>
              </div>
            </div>
          )}
        </div>

        <p role="status" className="mn-service-message">Online payments are awaiting setup. You can save your delivery address and keep items in your cart. No payment or order will be submitted.</p>
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

              <form onChange={() => setEditing(true)} className="mn-checkout-address-form" onSubmit={handleNextToSummary}>
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
                  <span>Save address & review</span>
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
        {step === 2 && <section className="mn-account-card" style={{maxWidth:720,margin:'0 auto'}}>
          <button onClick={() => setStep(1)}><ArrowLeft size={16} /> Edit delivery address</button>
          <h2>Review your saved details</h2>
          <p>{formData.name} · {formData.phone}</p>
          <p>{[formData.doorNo,formData.street,formData.landmark,formData.district,formData.pincode].filter(Boolean).join(', ')}</p>
          <p>Estimated total: ₹{cartTotal}. Final prices and availability will be checked when online ordering opens.</p>
          <button className="mn-btn mn-btn-burgundy" disabled>Online payments unavailable</button>
          <p>Your address is saved and your cart is unchanged. Contact the store if you need help.</p>
        </section>}
      </div>
    </div>
  );
};
