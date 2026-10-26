import type { Metadata } from 'next';
import { Icon } from '../../src/Icons';
import LinkList from '../../src/LinkList';
import PageIntro from '../../src/PageIntro';
import { GITHUB_PORTAL, docs, faqs } from '../../src/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Open Data Ensemble is a collection of open-source and offline-first tools for collecting, syncing and working with field data.',
};

const tools = [
  {
    label: 'COLLECT',
    title: 'Formulus',
    description:
      'The mobile app. Custom forms and apps, photos, audio, and locations, offline by design.',
    href: docs.formulus,
    cta: 'Formulus reference',
  },
  {
    label: 'SYNCHRONIZE',
    title: 'Synkronus Server',
    description:
      'The server in the middle. One public API that brings observations and attachments together when a connection returns.',
    href: docs.synkronus,
    cta: 'Synkronus reference',
  },
  {
    label: 'RENDER',
    title: 'Formplayer',
    description:
      'The form renderer used in Formulus and ODE Desktop. JSON Schema, JSON Forms, and the field types you can actually rely on.',
    href: docs.formplayer,
    cta: 'Formplayer reference',
  },
  {
    label: 'EXPLORE',
    title: 'ODE Desktop',
    description:
      'Manage observations locally, build and test your next custom app in the workbench.',
    href: docs.odeDesktop,
    cta: 'ODE Desktop reference',
  },
  {
    label: 'CLI',
    title: 'Synkronus CLI',
    description:
      'Export observations, manage users and app bundles, and talk to the same public API from the command line.',
    href: docs.synkronusCli,
    cta: 'CLI reference',
  },
  {
    label: 'MANAGE',
    title: 'Web Portal',
    description:
      'Manage app bundles, users, observations, and exports in the browser.',
    href: GITHUB_PORTAL,
    cta: 'See the portal',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="ABOUT ODE"
        title={
          <>
            Open tools for data
            <br />
            <span className="serif-word">that has to travel.</span>
          </>
        }
        image="/brand/laptop.png"
      >
        <p className="page-lead">
          Open Data Ensemble (ODE, pronounced like “code”) is a set of
          open-source tools for collecting and synchronizing field data. They
          share one public API, so data can move into tools you already use.
        </p>
        <p className="page-text">
          People use it in conservation, public health, community work, and
          research, including places where the signal drops.
        </p>
      </PageIntro>

      <section
        className="container section-space page-section"
        aria-labelledby="tools-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE ENSEMBLE</span>
            <h2 id="tools-title">
              Different instruments.
              <br />
              <span className="serif-word">One ensemble.</span>
            </h2>
          </div>
          <p>
            Each tool does one job well. <br />
            Together they take an observation from the field to understanding.
          </p>
        </div>
        <LinkList items={tools} />
      </section>

      <section className="why-section" aria-labelledby="why-title">
        <div className="container section-space">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHY THESE TOOLS EXIST</span>
              <h2 id="why-title">
                Built for
                <br />
                <span className="serif-word">field work.</span>
              </h2>
            </div>
            <span className="why-asterisk" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="principle-grid">
            <article className="principle">
              <div className="principle-icon">
                <Icon name="offline" size="var(--icon-size-site-28)" />
              </div>
              <h3>
                No signal?
                <br />
                Keep collecting.
              </h3>
              <p>
                On a remote trail or a patchy connection, work still moves.
                Collect now. Synchronize when you’re ready.
              </p>
              <span className="principle-tag">OFFLINE BY DEFAULT</span>
            </article>
            <article className="principle">
              <div className="principle-icon">
                <Icon name="lock" size="var(--icon-size-site-27)" />
              </div>
              <h3>
                You host
                <br />
                the data.
              </h3>
              <p>
                Self-host your infrastructure and keep a local copy. Data should
                flow into your work, not get locked inside ours.
              </p>
              <span className="principle-tag">OWN YOUR INFRASTRUCTURE</span>
            </article>
            <article className="principle">
              <div className="principle-icon">
                <Icon name="code" size="var(--icon-size-site-29)" />
              </div>
              <h3>
                Open source.
                <br />
                Yours to change.
              </h3>
              <p>
                Make a form, build a custom app, or connect tools you already
                have. The code is public.
              </p>
              <span className="principle-tag">NO BLACK BOXES</span>
            </article>
          </div>
        </div>
      </section>

      <section
        className="faq-section container section-space"
        aria-labelledby="faq-title"
      >
        <div className="faq-heading">
          <span className="eyebrow">QUESTIONS</span>
          <h2 id="faq-title">
            A few things
            <br />
            <span className="serif-word">people ask.</span>
          </h2>
          <a
            className="inline-link"
            href={docs.gettingStarted}
            target="_blank"
            rel="noreferrer"
          >
            Read the docs{' '}
            <Icon name="diagonal" size="var(--icon-size-site-17)" />
          </a>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary>
                <span className="faq-number">0{index + 1}</span>
                <span>{faq.question}</span>
                <Icon name="plus" size="var(--icon-size-md)" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
