import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useShop();

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div 
          className="mn-toast"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'var(--color-burgundy)',
            color: 'var(--color-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-gold)',
            flexShrink: 0
          }}>
            <Sparkles size={14} />
          </div>
          <div>
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
