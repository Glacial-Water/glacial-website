// D283 / D285: one shared way for the six forms to send a request to the leads sheet.
// While leadEndpoint is empty nothing here does anything and every form behaves as before (WhatsApp).
import { leadEndpoint, leadReplyReadable, hoursLine, phoneDisplay, phoneTel } from '../data/site';

export const leadsOn = leadEndpoint !== '';
const MAX = 1000; // the receiving end drops anything longer than this, so the page never sends it

export type LeadKind = 'order' | 'subscription' | 'business' | 'area-check' | 'help';
export type LeadFields = { name?: string; mobile?: string; whatsapp?: string; email?: string; address?: string; area?: string; details?: string };

const el = (id: string) => document.getElementById(id) as HTMLInputElement | null;
const clip = (v: string | undefined) => (v || '').trim().slice(0, MAX);

async function post(kind: LeadKind, f: LeadFields, trap: string): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('form', kind);
  body.set('page', location.pathname);
  for (const k of ['name', 'mobile', 'whatsapp', 'email', 'address', 'area', 'details'] as const) body.set(k, clip(f[k]));
  body.set('website', trap.slice(0, MAX)); // the hidden trap field; a real visitor leaves it empty
  const ctl = new AbortController();
  const timer = window.setTimeout(() => ctl.abort(), 12000);
  try {
    if (leadReplyReadable) {
      // A plain form-encoded POST, no custom headers: the page can read the reply.
      const r = await fetch(leadEndpoint, { method: 'POST', body, signal: ctl.signal });
      if (!r.ok) return false;
      const text = await r.text();
      try {
        const j = JSON.parse(text);
        if (j && (j.ok === false || j.error || j.status === 'error' || j.result === 'error')) return false;
      } catch { /* a reply that is not JSON still means the request was taken */ }
      return true;
    }
    // The browser will not let the page read the reply: a request that left without a network error counts as sent.
    await fetch(leadEndpoint, { method: 'POST', mode: 'no-cors', body, signal: ctl.signal });
    return true;
  } catch {
    return false; // network error or no answer in 12 seconds
  } finally {
    window.clearTimeout(timer);
  }
}

export type LeadWiring = {
  kind: LeadKind;
  button: HTMLAnchorElement;
  /** every input or textarea id on this form (each gets the 1,000-character cap) */
  inputs: string[];
  /** ids that must be filled before sending (mobile always; email where ruled) */
  required: string[];
  mobileId: string;
  collect: () => LeadFields;
  /** elements replaced by the "We have your request" state */
  hide: () => HTMLElement[];
  /** the state is inserted before this element (or at the end of `host`) */
  host: HTMLElement;
  before?: HTMLElement | null;
};

export function wireLead(w: LeadWiring) {
  if (!leadsOn) return { setActive(_on: boolean) {} };
  // Mobile (and any ruled field) is required before the send; every field is capped.
  w.inputs.forEach((id) => { const e = el(id); if (e) e.maxLength = MAX; });
  w.required.forEach((id) => { const e = el(id); if (e) e.required = true; });

  // The hidden trap field: hidden from people, screen readers and autofill, never reachable by Tab.
  const trapWrap = document.createElement('div');
  trapWrap.setAttribute('aria-hidden', 'true');
  trapWrap.className = 'lead-trap';
  const trap = document.createElement('input');
  trap.type = 'text'; trap.name = 'website'; trap.tabIndex = -1; trap.autocomplete = 'off'; trap.setAttribute('aria-hidden', 'true');
  trapWrap.append(trap);
  w.button.before(trapWrap);

  const fallbackNote = document.createElement('p');
  fallbackNote.className = 'lead-fail';
  fallbackNote.setAttribute('role', 'alert');
  fallbackNote.hidden = true;
  w.button.after(fallbackNote);

  w.button.classList.add('lead-mode');
  let active = true;
  let busy = false;

  w.button.addEventListener('click', async (e) => {
    if (!active || e.defaultPrevented) return; // an earlier check on this button already stopped the click
    e.preventDefault();
    if (busy) return;
    for (const id of w.required) {
      const f = el(id);
      if (f && (!f.checkValidity() || !f.value.trim())) { f.reportValidity(); f.focus(); return; }
    }
    busy = true;
    w.button.setAttribute('aria-busy', 'true');
    w.button.setAttribute('aria-disabled', 'true'); // cannot be pressed again while the request is away
    const sentLabel = w.button.innerHTML;
    w.button.textContent = 'Sending…'; // visible on a phone while the request is away
    fallbackNote.hidden = true;
    const fields = w.collect();
    const ok = await post(w.kind, fields, trap.value);
    busy = false;
    w.button.removeAttribute('aria-busy');
    w.button.removeAttribute('aria-disabled');
    w.button.innerHTML = sentLabel; // the label comes back (on success the form is hidden anyway)
    if (!ok) {
      // The request must not be lost: phone and the same pre-filled WhatsApp link the form builds.
      fallbackNote.textContent = '';
      fallbackNote.append('We could not send that. Please call or message us. ');
      const tel = document.createElement('a'); tel.href = 'tel:' + phoneTel; tel.textContent = 'Call ' + phoneDisplay;
      const wa = document.createElement('a'); wa.href = w.button.href; wa.textContent = 'Message us on WhatsApp';
      fallbackNote.append(tel, ' · ', wa);
      fallbackNote.hidden = false;
      return;
    }
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event: 'site_form_sent', form_kind: w.kind }); // the form's kind only: no name, number, email or address
    w.hide().forEach((n) => { n.hidden = true; });
    trapWrap.hidden = true; fallbackNote.hidden = true;
    const box = document.createElement('div');
    box.className = 'lead-sent';
    box.setAttribute('role', 'status');
    box.tabIndex = -1;
    const h = document.createElement('h2'); h.textContent = 'We have your request';
    const p = document.createElement('p'); p.textContent = 'Our team will call you on ' + (fields.mobile || '').trim() + ' to confirm the details.';
    const hrs = document.createElement('p'); hrs.className = 'lead-hours'; hrs.textContent = hoursLine;
    box.append(h, p, hrs);
    if (w.before) w.before.before(box); else w.host.append(box);
    box.focus();
  });

  return {
    /** call with false while the page is in a mode that does not send a request (for example Order's walk-in) */
    setActive(on: boolean) {
      active = on;
      w.button.classList.toggle('lead-mode', on);
      trapWrap.hidden = !on;
    },
  };
}
