import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { Lead } from '../src/models/Lead.js';

const valid = {
  name: 'Asha Mehta',
  company: 'Acme Pharma',
  designation: 'Brand Manager',
  email: 'Asha.Mehta@AcmePharma.com',
  mobile: '+91 98200 00000',
  message: 'Planning a Q1 brand drive.',
};

function fakeModel() {
  const saved = [];
  return {
    saved,
    async create(doc) {
      // Run real Mongoose schema validation without a database
      const m = new Lead(doc);
      const err = m.validateSync();
      if (err) throw err;
      saved.push(m.toObject());
      return m;
    },
  };
}

const make = (opts = {}) => {
  const LeadModel = fakeModel();
  const app = createApp({ LeadModel, isDbReady: () => true, rateLimitMax: 100, corsOrigins: ['https://sales-soccer.example'], sendEmail: async () => {}, ...opts });
  return { app, LeadModel };
};

test('health endpoint', async () => {
  const { app } = make();
  const r = await request(app).get('/api/health');
  assert.equal(r.status, 200);
  assert.equal(r.body.status, 'ok');
});

test('stores a valid lead and normalises fields', async () => {
  const { app, LeadModel } = make();
  const r = await request(app).post('/api/leads').send(valid);
  assert.equal(r.status, 201);
  assert.equal(r.body.success, true);
  assert.equal(LeadModel.saved.length, 1);
  const s = LeadModel.saved[0];
  assert.equal(s.workEmail, 'asha.mehta@acmepharma.com');
  assert.equal(s.mobileNumber, '+91 98200 00000');
  assert.ok(s.submittedAt instanceof Date);
});

test('emails the lead notification after storing a valid request', async () => {\n  const sent = [];\n  const { app } = make({ sendEmail: async (lead) => sent.push(lead) });\n  const r = await request(app).post('/api/leads').send(valid);\n  assert.equal(r.status, 201);\n  assert.equal(r.body.emailSent, true);\n  assert.equal(sent.length, 1);\n  assert.equal(sent[0].workEmail, 'asha.mehta@acmepharma.com');\n});\n\ntest('email failure does not lose the saved lead or cause duplicate submission', async () => {\n  const { app, LeadModel } = make({ sendEmail: async () => { throw new Error('SMTP unavailable'); } });\n  const r = await request(app).post('/api/leads').send(valid);\n  assert.equal(r.status, 201);\n  assert.equal(r.body.success, true);\n  assert.equal(r.body.emailSent, false);\n  assert.equal(LeadModel.saved.length, 1);\n});\n\ntest('message is optional', async () => {
  const { app } = make();
  const r = await request(app).post('/api/leads').send({ ...valid, message: '' });
  assert.equal(r.status, 201);
});

test('rejects invalid fields with per-field errors', async () => {
  const { app, LeadModel } = make();
  const r = await request(app).post('/api/leads').send({ name: 'A', company: '', designation: '', email: 'nope', mobile: '12ab' });
  assert.equal(r.status, 400);
  assert.deepEqual(Object.keys(r.body.errors).sort(), ['company', 'designation', 'email', 'mobile', 'name']);
  assert.equal(LeadModel.saved.length, 0);
});

test('rejects overly long message', async () => {
  const { app } = make();
  const r = await request(app).post('/api/leads').send({ ...valid, message: 'x'.repeat(1001) });
  assert.equal(r.status, 400);
  assert.ok(r.body.errors.message);
});

test('honeypot submissions are accepted silently but not stored', async () => {
  const { app, LeadModel } = make();
  const r = await request(app).post('/api/leads').send({ ...valid, website: 'http://spam' });
  assert.equal(r.status, 201);
  assert.equal(LeadModel.saved.length, 0);
});

test('returns 503 when the database is unavailable', async () => {
  const { app } = make({ isDbReady: () => false });
  const r = await request(app).post('/api/leads').send(valid);
  assert.equal(r.status, 503);
});

test('malformed JSON returns 400', async () => {
  const { app } = make();
  const r = await request(app).post('/api/leads').set('Content-Type', 'application/json').send('{bad');
  assert.equal(r.status, 400);
});

test('CORS: allow-listed origin passes, unknown origin is blocked', async () => {
  const { app } = make();
  const ok = await request(app).post('/api/leads').set('Origin', 'https://sales-soccer.example').send(valid);
  assert.equal(ok.status, 201);
  assert.equal(ok.headers['access-control-allow-origin'], 'https://sales-soccer.example');
  const bad = await request(app).post('/api/leads').set('Origin', 'https://evil.example').send(valid);
  assert.equal(bad.status, 403);
});

test('rate limiting kicks in', async () => {
  const { app } = make({ rateLimitMax: 2 });
  await request(app).post('/api/leads').send(valid);
  await request(app).post('/api/leads').send(valid);
  const r = await request(app).post('/api/leads').send(valid);
  assert.equal(r.status, 429);
});

test('unknown API routes return JSON 404', async () => {
  const { app } = make();
  const r = await request(app).get('/api/nope');
  assert.equal(r.status, 404);
});
