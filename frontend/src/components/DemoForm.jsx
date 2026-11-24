import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ASSETS } from '../data/content';
import { KickoffArt } from './Artwork';
import { LIMITS, validateLead } from '../lib/validation';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const FIELDS = [
  { name: 'name', label: 'Name', autoComplete: 'name', type: 'text' },
  { name: 'company', label: 'Company', autoComplete: 'organization', type: 'text' },
  { name: 'designation', label: 'Designation', autoComplete: 'organization-title', type: 'text' },
  { name: 'email', label: 'Work Email', autoComplete: 'email', type: 'email', inputMode: 'email' },
  { name: 'mobile', label: 'Mobile Number', autoComplete: 'tel', type: 'tel', inputMode: 'tel' },
];

const EMPTY = { name: '', company: '', designation: '', email: '', mobile: '', message: '', website: '' };

function Field({ f, value, error, onChange, onBlur }) {
  const id = `lead-${f.name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-white/80">
        {f.label} <span className="text-pink-electric">*</span>
      </label>
      <input
        id={id}
        name={f.name}
        type={f.type}
        inputMode={f.inputMode}
        autoComplete={f.autoComplete}
        maxLength={LIMITS[f.name]}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-xl border bg-night-950/60 px-4 py-3.5 text-white placeholder-white/30 outline-none transition focus:border-pink-electric focus:ring-2 focus:ring-pink-electric/30 ${
          error ? 'border-rose-400/80' : 'border-white/15'
        }`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default function DemoForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMsg, setServerMsg] = useState('');

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validateLead(next));
  };
  const onBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validateLead(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLead(values);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`lead-${first}`)?.focus();
      return;
    }
    setStatus('submitting');
    setServerMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      setStatus('error');
      setServerMsg(
        err instanceof TypeError ? 'We could not reach the server. Please check your connection and try again.' : err.message,
      );
    }
  };

  return (
    <section id="demo" className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* closing stadium visual */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img src={ASSETS.turf} alt="" loading="lazy" className="absolute inset-x-0 bottom-0 h-[55%] w-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950 via-night-950/85 to-night-950/30" />
        <div className="floodlight left-1/3 top-0 bg-violet-glow" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="eyebrow">Request a Demo</p>
          <h2 className="headline mt-4 text-[clamp(2.8rem,6.4vw,5.2rem)]">
            Ready to Kick Off Your <span className="text-gradient pr-2">Next Brand Drive?</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/75">
            Discover how Sales Soccer can bring football-inspired energy to your field-force campaigns.
          </p>
          <div className="relative mt-10 hidden max-w-md overflow-hidden rounded-[28px] border border-white/15 lg:block">
            <KickoffArt className="block h-72 w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-night-950/75 via-night-950/20 to-transparent" />
            <p className="headline absolute bottom-6 left-6 text-4xl">
              Dribble. Goal.
              <br />
              <span className="text-gradient">Lead.</span>
            </p>
          </div>
        </div>

        <div className="glass relative p-6 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
                role="status"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient shadow-glow">
                  <CheckCircle2 size={40} />
                </span>
                <h3 className="headline mt-6 text-5xl">Goal!</h3>
                <p className="mt-3 max-w-sm text-lg text-white/75">
                  Thank you. Your demo request has been received. The digiLATERAL team will be in touch soon.
                </p>
                <button type="button" className="btn-ghost mt-8" onClick={() => setStatus('idle')}>
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} noValidate onSubmit={onSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  {FIELDS.map((f) => (
                    <div key={f.name} className={f.name === 'name' ? 'sm:col-span-2' : ''}>
                      <Field f={f} value={values[f.name]} error={touched[f.name] && errors[f.name]} onChange={onChange} onBlur={onBlur} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label htmlFor="lead-message" className="mb-1.5 flex justify-between text-sm font-semibold text-white/80">
                      <span>
                        Message <span className="font-normal text-white/45">(optional)</span>
                      </span>
                      <span className="font-normal text-white/40">
                        {values.message.length}/{LIMITS.message}
                      </span>
                    </label>
                    <textarea
                      id="lead-message"
                      name="message"
                      rows={4}
                      maxLength={LIMITS.message}
                      value={values.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      aria-invalid={!!(touched.message && errors.message)}
                      className="w-full resize-none rounded-xl border border-white/15 bg-night-950/60 px-4 py-3.5 text-white outline-none transition focus:border-pink-electric focus:ring-2 focus:ring-pink-electric/30"
                      placeholder="Tell us about your upcoming brand drive"
                    />
                    {touched.message && errors.message && <p className="mt-1.5 text-sm text-rose-300">{errors.message}</p>}
                  </div>
                  {/* Honeypot for bots: hidden from people and assistive tech */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="lead-website">Website</label>
                    <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
                  </div>
                </div>

                {status === 'error' && (
                  <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" /> {serverMsg}
                  </p>
                )}

                <button type="submit" disabled={status === 'submitting'} className="btn-primary group mt-7 w-full">
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Request a Demo <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-xs text-white/45">
                  We use these details only to respond to your demo request.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
