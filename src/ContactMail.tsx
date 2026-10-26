'use client';

import { useState, type FormEvent, type MouseEvent } from 'react';
import { Icon } from './Icons';
import { HELLO_EMAIL, SECURITY_EMAIL } from './site';

type Kind = 'general' | 'security';

const kinds: {
  id: Kind;
  label: string;
  address: string;
  note: string;
}[] = [
  {
    id: 'general',
    label: 'General',
    address: HELLO_EMAIL,
    note: 'Questions, getting involved, or anything that isn’t a vulnerability.',
  },
  {
    id: 'security',
    label: 'Security',
    address: SECURITY_EMAIL,
    note: 'Report vulnerabilities privately. Don’t put them in public issues.',
  },
];

function mailHref(
  kind: Kind,
  name: string,
  email: string,
  organization: string,
  message: string,
) {
  const to = kind === 'security' ? SECURITY_EMAIL : HELLO_EMAIL;
  const who = name.trim();
  const subject =
    kind === 'security'
      ? `Security report${who ? ` from ${who}` : ''}`
      : `General inquiry${who ? ` from ${who}` : ''}`;
  const lines = [
    who && `Name: ${who}`,
    email.trim() && `Email: ${email.trim()}`,
    organization.trim() && `Organization: ${organization.trim()}`,
    message.trim() && `\n${message.trim()}`,
  ].filter(Boolean);
  const query = [`subject=${encodeURIComponent(subject)}`];
  if (lines.length) query.push(`body=${encodeURIComponent(lines.join('\n'))}`);
  return `mailto:${to}?${query.join('&')}`;
}

export default function ContactMail() {
  const [kind, setKind] = useState<Kind>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selected = kinds.find((entry) => entry.id === kind)!;
  const href = mailHref(kind, name, email, organization, message);
  const sendLabel = kind === 'security' ? 'Email security' : 'Send email';

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Add your name.';
    if (!email.trim()) next.email = 'Add an email we can reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'That email doesn’t look right.';
    }
    if (!message.trim()) next.message = 'Write a short message.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) window.location.assign(href);
  }

  function sendMail(event: MouseEvent<HTMLAnchorElement>) {
    if (!validate()) event.preventDefault();
  }

  return (
    <section
      className="container section-space page-section"
      aria-labelledby="mail-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">BY EMAIL</span>
          <h2 id="mail-title">
            Write to us.
            <br />
            <span className="serif-word">We’ll open your mail app.</span>
          </h2>
        </div>
        <p>
          General inquiries go to {HELLO_EMAIL}. Security reports go to{' '}
          {SECURITY_EMAIL}, privately. Nothing is sent from this page.
        </p>
      </div>

      <form className="mail-form" onSubmit={submitForm} noValidate>
        <div
          className="mail-kind"
          role="radiogroup"
          aria-label="What this email is about"
        >
          {kinds.map((entry) => (
            <label
              key={entry.id}
              className={kind === entry.id ? 'is-active' : undefined}
            >
              <input
                type="radio"
                name="mail-kind"
                value={entry.id}
                checked={kind === entry.id}
                onChange={() => setKind(entry.id)}
              />
              <span className="mail-kind-label">{entry.label}</span>
              <span className="mail-kind-address">{entry.address}</span>
            </label>
          ))}
        </div>
        <p className="mail-kind-note">{selected.note}</p>

        <div className="mail-table">
          <div className="mail-field">
            <label htmlFor="mail-name">Name</label>
            <div>
              <input
                id="mail-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'mail-name-error' : undefined}
              />
              {errors.name ? (
                <span id="mail-name-error" className="error-text">
                  {errors.name}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mail-field">
            <label htmlFor="mail-email">Email</label>
            <div>
              <input
                id="mail-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: '' }));
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'mail-email-error' : undefined}
              />
              {errors.email ? (
                <span id="mail-email-error" className="error-text">
                  {errors.email}
                </span>
              ) : null}
            </div>
          </div>
          <div className="mail-field">
            <label htmlFor="mail-organization">Organization</label>
            <div>
              <input
                id="mail-organization"
                name="organization"
                type="text"
                autoComplete="organization"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
              />
            </div>
          </div>
          <div className="mail-field">
            <label htmlFor="mail-message">Message</label>
            <div>
              <textarea
                id="mail-message"
                name="message"
                rows={5}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (errors.message)
                    setErrors((prev) => ({ ...prev, message: '' }));
                }}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? 'mail-message-error' : undefined
                }
              />
              {errors.message ? (
                <span id="mail-message-error" className="error-text">
                  {errors.message}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mail-send">
          <a className="button button-dark" href={href} onClick={sendMail}>
            {sendLabel} <Icon name="diagonal" size="var(--icon-size-site-18)" />
          </a>
          <span>Opens a message to {selected.address}</span>
        </div>
      </form>
    </section>
  );
}
