import React, { useId } from 'react';
import { useShop } from '../context/ShopContext';
import pincodes from '../data/deliveryPincodes.json';
import { deliveryLocation } from '../lib/address';

export const DeliveryFields = ({ value, onChange }) => {
  const districtId = useId();
  const { deliveryDistricts, zonesError } = useShop();
  const location = deliveryLocation(value.pincode, deliveryDistricts, pincodes);
  const mismatch = location.valid && value.district && value.district !== location.district;
  return <div className="mn-delivery-fields">
    <label>Area / Locality<input name="locality" autoComplete="address-line2" maxLength={150} value={value.locality || ''} onChange={e => onChange({ ...value, locality: e.target.value })} /></label>
    <label>Village / Town / City<input name="city" autoComplete="address-level2" maxLength={150} value={value.city || ''} onChange={e => onChange({ ...value, city: e.target.value })} /></label>
    <label>Pincode<input name="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={value.pincode || ''} onChange={e => {
      const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
      const next = deliveryLocation(pincode, deliveryDistricts, pincodes);
      onChange({ ...value, pincode, district: next.district });
    }} /></label>
    <div><label htmlFor={districtId}>District</label><select id={districtId} name="district" autoComplete="address-level1" value={value.district || ''} onChange={e => onChange({ ...value, district: e.target.value })}>
      <option value="">Select delivery district</option>
      {value.district && !deliveryDistricts.includes(value.district) && <option value={value.district} disabled>{value.district} (unavailable)</option>}
      {deliveryDistricts.map(district => <option key={district}>{district}</option>)}
    </select></div>
    {(value.pincode || zonesError) && <p className="mn-field-feedback" role="status">{zonesError ? 'Delivery districts could not be loaded. Please retry before saving.' : mismatch ? `This PIN code belongs to ${location.district}. Please select the matching district.` : location.message}</p>}
    <p>Tamil Nadu, India</p>
  </div>;
};
