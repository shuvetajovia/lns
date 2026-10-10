import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, AlertCircle, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

export const PincodeModal = () => {
  const { 
    isPincodeModalOpen, 
    setIsPincodeModalOpen, 
    deliveryPincode, 
    pincodeDistrict, 
    checkPincode, 
    showToast 
  } = useShop();

  const [inputCode, setInputCode] = useState(deliveryPincode || "");
  const [result, setResult] = useState(null);

  const handleVerify = (e) => {
    e.preventDefault();
    const res = checkPincode(inputCode);
    setResult(res);
    if (res.valid) {
      showToast(`Delivery confirmed to ${res.district}! 🌿`);
      setTimeout(() => {
        setIsPincodeModalOpen(false);
      }, 1200);
    }
  };

  if (!isPincodeModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="mn-drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsPincodeModalOpen(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--color-ivory-pure)',
            border: '2px solid var(--color-gold)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '460px',
            padding: '2rem',
            boxShadow: 'var(--shadow-royal)',
            position: 'relative'
          }}
        >
          <button 
            onClick={() => setIsPincodeModalOpen(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-deep-brown)' }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--color-burgundy)',
              color: 'var(--color-gold-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-gold)'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-burgundy)', fontWeight: 700 }}>
                Select Delivery Sanctuary
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                Direct Farm Express across Tamil Nadu
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--color-brown-muted)', marginBottom: '1.4rem' }}>
            Enter your 6-digit postal code to verify harvest availability, delivery timelines, and special local route schedules.
          </p>

          <form onSubmit={handleVerify} style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
            <input 
              type="text"
              maxLength={6}
              placeholder="e.g. 600001 or 631502"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{
                flex: 1,
                padding: '0.75rem 1.1rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-gold)',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#ffffff',
                color: 'var(--color-deep-brown)'
              }}
            />
            <button 
              type="submit"
              className="mn-btn mn-btn-burgundy mn-btn-sm"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              Verify
            </button>
          </form>

          {result && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: result.valid ? 'var(--color-forest-soft)' : 'rgba(114, 47, 55, 0.08)',
              border: `1px solid ${result.valid ? 'var(--color-sage)' : 'rgba(114, 47, 55, 0.3)'}`,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.86rem',
              color: result.valid ? 'var(--color-forest-dark)' : 'var(--color-burgundy)'
            }}>
              {result.valid ? (
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <strong>{result.valid ? "Deliverable Route:" : "Notice:"}</strong> {result.message}
              </div>
            </div>
          )}

          {/* Popular Hubs */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px dashed var(--border-gold)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-brown-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.6rem' }}>
              Frequent Delivery Hubs:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { name: "Chennai", code: "600001" },
                { name: "Kanchipuram", code: "631502" },
                { name: "Coimbatore", code: "641001" },
                { name: "Madurai", code: "625001" },
                { name: "Trichy", code: "620001" }
              ].map(hub => (
                <button
                  key={hub.code}
                  type="button"
                  onClick={() => {
                    setInputCode(hub.code);
                    const res = checkPincode(hub.code);
                    setResult(res);
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.76rem',
                    color: 'var(--color-deep-brown)',
                    fontWeight: 500
                  }}
                >
                  {hub.name} ({hub.code})
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
