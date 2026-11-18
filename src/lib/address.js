export function deliveryLocation(pincode, districts, pincodes) {
  const code = String(pincode || '').trim();
  const district = pincodes[code];
  const active = districts.find(value => value.toLowerCase() === district?.toLowerCase());
  if (!/^[0-9]{6}$/.test(code)) return { valid: false, district: '', message: 'Enter a valid 6-digit PIN code.' };
  if (!active) return { valid: false, district: '', message: 'Delivery is unavailable for this pincode. Please check with the store.' };
  return { valid: true, district: active, message: `Delivery available in ${active}.` };
}

export function validateAddress(address = {}, districts, pincodes) {
  if (!Object.values(address).some(value => String(value || '').trim())) return;
  const result = deliveryLocation(address.pincode, districts, pincodes);
  if (!result.valid) throw new Error(result.message);
  if (String(address.district || '').trim().toLowerCase() !== result.district.toLowerCase()) {
    throw new Error(`This PIN code belongs to ${result.district}. Please select the matching district.`);
  }
  if (!address.doorNo?.trim() || !address.street?.trim()) throw new Error('Enter your door / flat number and street.');
}
