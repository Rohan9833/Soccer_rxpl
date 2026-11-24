// Client-side validation mirrors the server rules (the server is the source of truth).

export const LIMITS = {
  name: 100,
  company: 150,
  designation: 100,
  email: 254,
  mobile: 20,
  message: 1000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(v) {
  const errors = {};
  const t = (s) => (s || '').trim();

  if (t(v.name).length < 2) errors.name = 'Please enter your full name.';
  else if (t(v.name).length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

  if (t(v.company).length < 2) errors.company = 'Please enter your company name.';
  else if (t(v.company).length > LIMITS.company) errors.company = `Company must be under ${LIMITS.company} characters.`;

  if (t(v.designation).length < 2) errors.designation = 'Please enter your designation.';
  else if (t(v.designation).length > LIMITS.designation)
    errors.designation = `Designation must be under ${LIMITS.designation} characters.`;

  if (!EMAIL_RE.test(t(v.email)) || t(v.email).length > LIMITS.email) errors.email = 'Please enter a valid work email.';

  const digits = t(v.mobile).replace(/\D/g, '');
  if (!/^\+?[\d\s()-]+$/.test(t(v.mobile)) || digits.length < 8 || digits.length > 15)
    errors.mobile = 'Please enter a valid mobile number (8 to 15 digits).';

  if (t(v.message).length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

  return errors;
}
