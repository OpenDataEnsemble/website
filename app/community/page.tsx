import type { Metadata } from 'next';
import { asset } from '../../src/asset';
import EventFeature from '../../src/EventFeature';
import {
  events,
  kampala2026,
  kampalaChapters,
  kampalaPhotoCount,
} from '../../src/events';
import { Icon } from '../../src/Icons';
import LinkList from '../../src/LinkList';
import PhotoWall from '../../src/PhotoWall';
import {
  DOCS,
  FORUM,
  GITHUB,
  GITHUB_CONTRIBUTING,
  GITHUB_ISSUES,
  docs,
} from '../../src/site';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'Write code, improve the docs, test the apps, or help on the forum.',
};

const waysToHelp = [
  {
    label: 'CODE',
    title: 'Fix a bug or build a feature',
    description:
      'Start with issues labelled “good first issue” or “help wanted”. For anything significant, open an issue and talk it through first.',
    href: `${GITHUB_ISSUES}?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
    cta: 'Good first issues',
  },
  {
    label: 'DOCUMENTATION',
    title: 'Make the docs clearer',
    description:
      'If a section is confusing or out of date, improve it. The docs always need polish.',
    href: DOCS,
    cta: 'Open the docs',
  },
  {
    label: 'TESTING',
    title: 'Try it and tell us what breaks',
    description:
      'Run the apps, sync some data, and report anything that breaks or feels rough.',
    href: GITHUB_ISSUES,
    cta: 'Report an issue',
  },
  {
    label: 'FORUM',
    title: 'Help other people',
    description:
      'Answer questions, share how you use ODE, and swap ideas with others doing similar work.',
    href: FORUM,
    cta: 'Visit the forum',
  },
  {
    label: 'EXAMPLES',
    title: 'See how others use it',
    description:
      'Sample configurations and workflows from the ODE docs, ready to reuse or improve.',
    href: docs.examples,
    cta: 'Browse examples',
  },
];

export default function CommunityPage() {
  return (
    <>
      <section
        className="community-section section-space container"
        aria-labelledby="page-title"
      >
        <div className="community-art" aria-hidden="true">
          <div className="community-art-caption">
            ODE COMMUNITY DAYS · KAMPALA
          </div>
          <img
            className="ensemble-cast"
            src={asset('/brand/ensemble.png')}
            alt=""
          />
          <div className="community-art-bottom">
            <span>OPEN BY NATURE</span>
            <Icon name="diagonal" size="var(--icon-size-site-18)" />
          </div>
        </div>
        <div className="community-copy">
          <span className="eyebrow">
            <span className="status-dot" /> COMMUNITY
          </span>
          <h1 id="page-title" className="page-title">
            Good things happen
            <br />
            when we <span className="serif-word">ensemble.</span>
          </h1>
          <p>
            ODE is open source. The tools get better when more people use them,
            break them, and help fix them.
          </p>
          <p>
            If you collect data, write code, or care about the docs, there is
            something to do.
          </p>
          <a
            className="button button-dark"
            href={FORUM}
            target="_blank"
            rel="noreferrer"
          >
            Open the forum{' '}
            <Icon name="diagonal" size="var(--icon-size-site-18)" />
          </a>
          <a
            className="community-source"
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size="var(--icon-size-site-17)" /> Or read the
            source <Icon name="arrow" size="var(--icon-size-sm)" />
          </a>
        </div>
      </section>

      <section
        className="container section-space page-section"
        aria-labelledby="events-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">EVENTS WE’VE HELD</span>
            <h2 id="events-title">
              Where the ensemble
              <br />
              <span className="serif-word">meets in person.</span>
            </h2>
          </div>
          <p>
            Community days bring people together <br />
            to learn the tools and build side by side.
          </p>
        </div>
        <ol className="event-list">
          {events.map((event) => (
            <li key={event.href}>
              <EventFeature event={event} />
            </li>
          ))}
        </ol>
      </section>

      <section
        id="photo-wall"
        className="wall-section"
        aria-labelledby="wall-title"
      >
        <div className="container section-space">
          <div className="section-heading wall-heading">
            <div>
              <span className="eyebrow">
                THE PHOTO WALL · {kampala2026.edition.toUpperCase()}
              </span>
              <h2 id="wall-title">
                The whole day,
                <br />
                <span className="serif-word">frame by frame.</span>
              </h2>
            </div>
            <p>
              {kampalaPhotoCount} moments from {kampala2026.name}. Pick a part
              of the day, toss the prints around, or lay them out as a contact
              sheet. Open any photo to see it full screen.
            </p>
          </div>
          <PhotoWall
            chapters={kampalaChapters}
            title={`${kampala2026.name}, ${kampala2026.edition}`}
          />
        </div>
      </section>

      <section
        className="container section-space page-section"
        aria-labelledby="help-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">WAYS TO TAKE PART</span>
            <h2 id="help-title">
              More than one way
              <br />
              <span className="serif-word">to contribute.</span>
            </h2>
          </div>
          <p>
            Code, docs, testing, or conversation. <br />
            All of it helps.
          </p>
        </div>
        <LinkList items={waysToHelp} />
        <a
          className="inline-link page-section-link"
          href={GITHUB_CONTRIBUTING}
          target="_blank"
          rel="noreferrer"
        >
          Read the contributing guide{' '}
          <Icon name="diagonal" size="var(--icon-size-site-17)" />
        </a>
        <a
          className="inline-link page-section-link"
          href={docs.setup}
          target="_blank"
          rel="noreferrer"
        >
          Development setup{' '}
          <Icon name="diagonal" size="var(--icon-size-site-17)" />
        </a>
      </section>
    </>
  );
}
