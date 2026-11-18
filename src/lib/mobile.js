export function normalizeMobile(value) {
  let number = String(value ?? '').trim().replace(/[ ()-]/g, '');
  if (number.startsWith('+91')) number = number.slice(3);
  if (!/^[6-9][0-9]{9}$/.test(number)) {
    throw new Error('Enter a valid 10-digit Indian mobile number, optionally starting with +91.');
  }
  return '+91' + number;
}
