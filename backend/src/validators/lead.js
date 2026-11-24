import validator from 'validator';

export const LIMITS = { name: 100, company: 150, designation: 100, email: 254, mobile: 20, message: 1000 };

const str = (v) => (typeof v === 'string' ? v : '');
// Strip control characters and collapse whitespace
const clean = (v) => validator.stripLow(str(v), true).replace(/\s+/g, ' ').trim();
const cleanMultiline = (v) => validator.stripLow(str(v), true).trim();

/**
 * Validates and normalises a demo request payload.
 * Returns { value, errors } where errors is keyed by the frontend field name.
 */
export function validateLead(body = {}) {
  const errors = {};
  const value = {
    name: clean(body.name),
    company: clean(body.company),
    designation: clean(body.designation),
    workEmail: clean(body.email).toLowerCase(),
    mobileNumber: clean(body.mobile),
    message: cleanMultiline(body.message),
  };

  const between = (s, min, max) => s.length >= min && s.length <= max;

  if (!between(value.name, 2, LIMITS.name)) errors.name = 'Please enter your full name.';
  if (!between(value.company, 2, LIMITS.company)) errors.company = 'Please enter your company name.';
  if (!between(value.designation, 2, LIMITS.designation)) errors.designation = 'Please enter your designation.';

  if (!value.workEmail || value.workEmail.length > LIMITS.email || !validator.isEmail(value.workEmail)) {
    errors.email = 'Please enter a valid work email.';
  }

  const digits = value.mobileNumber.replace(/\D/g, '');
  if (!/^\+?[\d\s()-]+$/.test(value.mobileNumber) || digits.length < 8 || digits.length > 15) {
    errors.mobile = 'Please enter a valid mobile number (8 to 15 digits).';
  }

  if (value.message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

  return { value, errors };
}
