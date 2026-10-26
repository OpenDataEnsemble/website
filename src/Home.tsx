'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import FieldGlobe from './FieldGlobe';
import Demo from './Demo';
import EventTeaser from './EventTeaser';
import Testimonials from './Testimonials';
import { BrandMark, Icon, type IconName } from './Icons';
import LinkList from './LinkList';
import { asset } from './asset';
import { DOWNLOADS, GITHUB_PORTAL, docs } from './site';

const workflows: {
  label: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: IconName;
  features: string[];
  link: string;
}[] = [
  {
    label: 'Collect',
    name: 'Formulus',
    eyebrow: 'YOUR FIELD COMPANION',
    title: 'Out there is where it starts.',
    description:
      'Bring custom forms and apps to the field, capture photos and locations, and keep collecting after the signal drops.',
    icon: 'phone',
    features: [
      'Offline-first: By design',
      'Forms that fit your work',
      'Photos, audio & locations',
    ],
    link: docs.formulus,
  },
  {
    label: 'Synchronize',
    name: 'Synkronus',
    eyebrow: 'THE CONNECTION BETWEEN',
    title: 'Get everyone on the same page.',
    description:
      'When a connection comes back, Synkronus pulls observations together through one public API, from phones, desktops, and the web.',
    icon: 'sync',
    features: [
      'One API, many clients',
      'Observation & attachment sync',
      'Self-host on your terms',
    ],
    link: docs.synkronus,
  },
  {
    label: 'Explore',
    name: 'ODE Desktop',
    eyebrow: 'FROM OBSERVATION TO UNDERSTANDING',
    title: 'Make something of what you find.',
    description:
      'Manage observations on your desktop, build a custom app in the workbench, or export with the CLI for your own analysis tools.',
    icon: 'desktop',
    features: [
      'Local data management',
      'Forms & app workbench',
      'CLI exports for analysis',
    ],
    link: docs.odeDesktop,
  },
];

const moreLinks = [
  {
    label: 'ABOUT',
    title: 'What ODE is',
    description:
      'The tools in the ensemble, why they exist, and answers to common questions.',
    href: '/about',
    cta: 'Read about ODE',
  },
  {
    label: 'COMMUNITY',
    title: 'People around the tools',
    description:
      'Events, the forum, and ways to contribute code, docs, or testing.',
    href: '/community',
    cta: 'Meet the community',
  },
  {
    label: 'CONTACT',
    title: 'Questions, bugs, security',
    description:
      'The forum, GitHub issues, and a private address for security reports.',
    href: '/contact',
    cta: 'Get in touch',
  },
];

function HeroVisual({ onDemo }: { onDemo: () => void }) {
  return (
    <div
      className="hero-visual"
      aria-label="An illustrated connected globe with a sample field observation"
    >
      <div className="visual-coordinate coordinate-top">
        00° 20′ 51.4″ N <span>↗</span>
      </div>
      <div className="visual-orbit-label">WORKS BEYOND THE SIGNAL</div>
      <FieldGlobe />
      <img className="hero-avatar" src={asset('/brand/avatar.png')} alt="" />
      <img className="hero-bird" src={asset('/brand/birdie.png')} alt="" />
      <div className="field-tag">
        <span className="status-dot" />
        <span>
          Made for the world
          <br />
          <strong>outside your Wi-Fi.</strong>
        </span>
        <Icon name="globe" size="var(--icon-size-site-30)" />
      </div>
      <div className="globe-pin pin-one">
        <Icon name="pin" size="var(--icon-size-site-18)" />
        <span>Kampala, UG</span>
      </div>
      <div className="globe-pin pin-two">
        <span className="tiny-dot" />
        <span>Collecting out there</span>
      </div>
      <button
        className="observation-card"
        onClick={onDemo}
        aria-label="Try the offline field observation demo"
      >
        <div className="observation-card-top">
          <span className="observation-icon">
            <Icon name="leaf" size="var(--icon-size-site-22)" />
          </span>
          <div>
            <strong>Field observation</strong>
            <span>Sample pin · Kampala</span>
          </div>
          <Icon name="diagonal" size="var(--icon-size-site-17)" />
        </div>
        <div className="observation-map" aria-hidden="true">
          <svg viewBox="0 0 320 104" preserveAspectRatio="xMidYMid slice">
            <rect width="320" height="104" fill="var(--color-neutral-white)" />
            <path
              d="M-10 82C38 23 48 87 94 36S165 4 201 44 280 10 340 39M-10 107C43 49 56 112 104 60S172 29 210 65 284 32 340 65"
              fill="none"
              stroke="var(--color-site-d3dec1)"
              strokeWidth="var(--stroke-site-20)"
            />
            <path
              d="m-20 13 85 29 47-16 97 61 119-16"
              stroke="var(--color-site-fffef6)"
              strokeWidth="var(--stroke-site-7)"
              fill="none"
            />
            <path
              d="m240-10-20 45 28 31-12 46"
              stroke="var(--color-site-c5d9df)"
              strokeWidth="var(--stroke-site-9)"
              fill="none"
            />
            <path
              d="m95 119 16-64 65-38 9-27"
              stroke="var(--color-site-fffef6)"
              strokeWidth="var(--stroke-site-4)"
              fill="none"
            />
            <circle
              cx="153"
              cy="49"
              r="18"
              fill="var(--color-brand-primary-500)"
              opacity="var(--opacity-site-0-14)"
            />
            <circle
              cx="153"
              cy="49"
              r="8"
              fill="var(--color-brand-primary-800)"
              stroke="var(--color-neutral-white)"
              strokeWidth="var(--stroke-site-3)"
            />
          </svg>
          <span>
            <Icon name="pin" size="var(--icon-size-site-11)" /> 0.3476° N,
            32.5825° E
          </span>
        </div>
        <div className="observation-card-bottom">
          <span>
            <span className="status-dot" /> Saved on device
          </span>
          <span>
            <Icon name="offline" size="var(--icon-size-site-13)" /> Offline
          </span>
        </div>
      </button>
      <div className="sync-card">
        <span className="sync-card-icon">
          <Icon name="check" size="var(--icon-size-site-18)" />
        </span>
        <div>
          <strong>Ready to sync</strong>
          <span>When a connection returns.</span>
        </div>
      </div>
      <div className="visual-coordinate coordinate-bottom">
        SAVED ON DEVICE <span>✳</span>
      </div>
      <span className="visual-spark spark-one" aria-hidden="true">
        ✳
      </span>
      <span className="visual-spark spark-two" aria-hidden="true">
        +
      </span>
    </div>
  );
}

function WorkflowPreview({ active }: { active: number }) {
  if (active === 0)
    return (
      <div className="workflow-preview collect-preview">
        <div className="preview-window-top">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>FORMULUS / FIELD KIT</span>
          <Icon name="offline" size="var(--icon-size-sm)" />
        </div>
        <div className="mini-form">
          <span className="small-eyebrow">ENVIRONMENTAL MONITORING</span>
          <h4>
            A closer look at
            <br />
            the world around us.
          </h4>
          <div className="mini-form-row">
            <span>
              <Icon name="pin" size="var(--icon-size-site-15)" /> Location
              captured
            </span>
            <Icon name="check" size="var(--icon-size-site-14)" />
          </div>
          <div className="mini-form-row">
            <span>
              <Icon name="leaf" size="var(--icon-size-site-15)" /> Woodland
              habitat
            </span>
            <Icon name="check" size="var(--icon-size-site-14)" />
          </div>
          <div className="mini-save">
            Observation saved <Icon name="check" size="var(--icon-size-sm)" />
          </div>
          <span className="preview-caption">
            Sample interface · works without a network
          </span>
        </div>
      </div>
    );
  if (active === 1)
    return (
      <div className="workflow-preview sync-preview">
        <div className="preview-window-top">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>SYNKRONUS / CONNECTED</span>
          <Icon name="sync" size="var(--icon-size-sm)" />
        </div>
        <div className="sync-diagram">
          <div className="device-nodes">
            <span>
              <Icon name="phone" size="var(--icon-size-site-25)" />
            </span>
            <span>
              <Icon name="desktop" size="var(--icon-size-site-25)" />
            </span>
            <span>
              <Icon name="code" size="var(--icon-size-site-25)" />
            </span>
          </div>
          <div className="connection-lines" />
          <div className="server-node">
            <BrandMark />
            <strong>Synkronus</strong>
            <span>One shared API</span>
          </div>
          <span className="preview-caption">
            Your devices. Your server. In sync.
          </span>
        </div>
      </div>
    );
  return (
    <div className="workflow-preview explore-preview">
      <div className="preview-window-top">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>ODE DESKTOP / OBSERVATIONS</span>
        <Icon name="desktop" size="var(--icon-size-sm)" />
      </div>
      <div className="mini-table">
        <div className="mini-table-heading">
          <span>Field observations</span>
          <span>Sample dataset</span>
        </div>
        <div className="table-row table-head">
          <span>OBSERVATION</span>
          <span>HABITAT</span>
          <span>STATUS</span>
        </div>
        {['Woodland', 'Wetland', 'Grassland', 'Woodland'].map(
          (habitat, index) => (
            <div className="table-row" key={index}>
              <span>OBS–00{index + 1}</span>
              <span>{habitat}</span>
              <span className="table-status">
                <Icon name="check" size="var(--icon-size-xs)" /> Synced
              </span>
            </div>
          ),
        )}
        <div className="mini-export">
          <Icon name="layers" size="var(--icon-size-site-17)" />
          <span>Export when you need it.</span>
          <Icon name="diagonal" size="var(--icon-size-site-15)" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const workflow = workflows[activeWorkflow];

  function onTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % workflows.length;
    else if (event.key === 'ArrowLeft')
      next = (index + workflows.length - 1) % workflows.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = workflows.length - 1;
    else return;
    event.preventDefault();
    setActiveWorkflow(next);
    tabsRef.current[next]?.focus();
  }

  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="status-dot" /> OPEN SOURCE · OFFLINE FIRST{' '}
            <Icon name="diagonal" size="var(--icon-size-site-13)" />
          </div>
          <h1 id="hero-title">
            Good data.
            <br />
            From the field.
            <br />
            <span className="anywhere">
              Offline.
              <svg
                viewBox="0 0 470 22"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M5 15Q210-1 465 11M43 20Q260 7 405 17" />
              </svg>
            </span>
          </h1>
          <p className="hero-description">
            Formulus stores observations on the phone.
            <br className="desktop-break" /> Synkronus brings them together when
            a connection returns.
          </p>
          <p className="hero-subtext">
            Open-source tools for field data collection.
            <br className="desktop-break" /> Host them yourself, or start from
            the docs.
          </p>
          <div className="hero-actions">
            <a className="button button-lime" href="#get-started">
              Get the field tools{' '}
              <Icon name="diagonal" size="var(--icon-size-site-19)" />
            </a>
            <button className="text-button" onClick={() => setDemoOpen(true)}>
              <span className="play-icon">
                <Icon name="play" size="var(--icon-size-xs)" />
              </span>{' '}
              See how it works
            </button>
          </div>
          <div className="hero-footnote">
            <span>
              <Icon name="check" size="var(--icon-size-site-13)" />{' '}
              Offline-first
            </span>
            <span>
              <Icon name="check" size="var(--icon-size-site-13)" />{' '}
              Self-hostable
            </span>
            <span>
              <Icon name="check" size="var(--icon-size-site-13)" /> Open source
            </span>
          </div>
        </div>
        <HeroVisual onDemo={() => setDemoOpen(true)} />
        <div className="hero-bottom">
          <span>OFFLINE IN THE FIELD. YOUR SERVER WHEN YOU GET BACK.</span>
          <a href="#platform" aria-label="Explore the platform">
            <span>THE PLATFORM</span>
            <Icon name="arrow" size="var(--icon-size-site-17)" />
          </a>
        </div>
      </section>
      <section
        className="purpose-strip"
        aria-label="Made for many kinds of fieldwork"
      >
        <div className="container purpose-inner">
          <p>
            Built for <br />
            <strong>field work.</strong>
          </p>
          <span>
            <Icon name="leaf" size="var(--icon-size-site-22)" /> Conservation
          </span>
          <span>
            <Icon name="heart" size="var(--icon-size-site-22)" /> Public health
          </span>
          <span>
            <Icon name="people" size="var(--icon-size-site-22)" /> Communities
          </span>
          <span>
            <Icon name="flask" size="var(--icon-size-site-22)" /> Research
          </span>
          <span className="purpose-more">
            And other field work{' '}
            <Icon name="diagonal" size="var(--icon-size-sm)" />
          </span>
        </div>
      </section>
      <section
        className="platform-section section-space container"
        id="platform"
        aria-labelledby="platform-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="section-number">01 /</span> BETTER TOGETHER
            </span>
            <h2 id="platform-title">
              Different instruments.
              <br />
              <span className="serif-word">One ensemble.</span>
            </h2>
          </div>
          <p>
            From a first observation to a dataset you can use. <br />
            The tools share one API,
            <br className="desktop-break" /> so you can collect, sync, and
            export without switching stacks.
          </p>
        </div>
        <div
          className="workflow-tabs"
          role="tablist"
          aria-label="Explore the ODE workflow"
        >
          {workflows.map((item, index) => (
            <button
              key={item.label}
              ref={(element) => {
                tabsRef.current[index] = element;
              }}
              id={`workflow-tab-${index}`}
              role="tab"
              aria-selected={activeWorkflow === index}
              aria-controls={`workflow-panel-${index}`}
              tabIndex={activeWorkflow === index ? 0 : -1}
              className={activeWorkflow === index ? 'active' : ''}
              onClick={() => setActiveWorkflow(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span className="tab-number">0{index + 1}</span>
              <Icon name={item.icon} size="var(--icon-size-md)" />
              <span>{item.label}</span>
              <Icon name="arrow" size="var(--icon-size-site-19)" />
            </button>
          ))}
        </div>
        <div
          className={`workflow-panel workflow-panel-${activeWorkflow}`}
          role="tabpanel"
          id={`workflow-panel-${activeWorkflow}`}
          aria-labelledby={`workflow-tab-${activeWorkflow}`}
          tabIndex={0}
        >
          <div className="workflow-copy" key={workflow.name}>
            <span className="product-name">
              <span className="product-icon">
                <Icon name={workflow.icon} size="var(--icon-size-site-22)" />
              </span>
              {workflow.name}
            </span>
            <span className="small-eyebrow">{workflow.eyebrow}</span>
            <h3>{workflow.title}</h3>
            <p>{workflow.description}</p>
            <ul>
              {workflow.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" size="var(--icon-size-site-15)" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              className="inline-link"
              href={workflow.link}
              target="_blank"
              rel="noreferrer"
            >
              Explore {workflow.name}{' '}
              <Icon name="diagonal" size="var(--icon-size-site-17)" />
            </a>
          </div>
          <div className="workflow-art">
            <span className="workflow-art-grid" aria-hidden="true" />
            <img
              key={activeWorkflow}
              className="workflow-mascot"
              src={asset(
                [
                  '/brand/field.png',
                  '/brand/developer.png',
                  '/brand/planner.png',
                ][activeWorkflow],
              )}
              alt=""
            />
            <WorkflowPreview active={activeWorkflow} />
            <span className="workflow-art-note">
              <span className="status-dot" /> BUILT FOR FIELD WORK
            </span>
          </div>
        </div>
        <div className="platform-note">
          <Icon name="code" size="var(--icon-size-site-17)" />
          <p>
            Also part of the ensemble.{' '}
            <a href={GITHUB_PORTAL} target="_blank" rel="noreferrer">
              Web Portal <Icon name="diagonal" size="var(--icon-size-xs)" />
            </a>
            <span>·</span>
            <a href={docs.synkronusCli} target="_blank" rel="noreferrer">
              Command-line tools{' '}
              <Icon name="diagonal" size="var(--icon-size-xs)" />
            </a>
            <span>·</span>
            <a href={docs.architecture} target="_blank" rel="noreferrer">
              One shared API <Icon name="diagonal" size="var(--icon-size-xs)" />
            </a>
          </p>
        </div>
      </section>
      <section
        className="container section-space page-section"
        aria-labelledby="more-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="section-number">02 /</span> GET TO KNOW US
            </span>
            <h2 id="more-title">
              There’s more
              <br />
              <span className="serif-word">to the ensemble.</span>
            </h2>
          </div>
          <p>
            Who we are, how to take part, <br />
            and where to find us.
          </p>
        </div>
        <LinkList items={moreLinks} />
      </section>
      <EventTeaser />
      <Testimonials />
      <section
        className="cta-section"
        id="get-started"
        aria-labelledby="cta-title"
      >
        <div className="container cta-inner">
          <span className="eyebrow">
            <span className="status-dot" /> GET THE TOOLS
          </span>
          <h2 id="cta-title">
            Take ODE
            <br />
            <span className="serif-word">into the field.</span>
          </h2>
          <p>Read the docs, or download a release and try it on a device.</p>
          <div className="cta-actions">
            <a
              className="button button-dark"
              href={docs.gettingStarted}
              target="_blank"
              rel="noreferrer"
            >
              Get started with ODE{' '}
              <Icon name="diagonal" size="var(--icon-size-site-19)" />
            </a>
            <a
              className="button button-outline"
              href={DOWNLOADS}
              target="_blank"
              rel="noreferrer"
            >
              Get the latest release{' '}
              <Icon name="arrow" size="var(--icon-size-site-18)" />
            </a>
          </div>
          <span className="cta-decoration decoration-one" aria-hidden="true">
            ✳
          </span>
          <span className="cta-decoration decoration-two" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>
      {demoOpen && <Demo onClose={() => setDemoOpen(false)} />}
    </>
  );
}
