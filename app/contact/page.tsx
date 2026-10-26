import type { Metadata } from 'next';
import ContactMail from '../../src/ContactMail';
import LinkList from '../../src/LinkList';
import PageIntro from '../../src/PageIntro';
import { FORUM, GITHUB_ISSUES, docs } from '../../src/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Ask questions on the ODE community forum, report bugs on GitHub, or write to us for a general inquiry or a private security report.',
};

const channels = [
  {
    label: 'QUESTIONS & IDEAS',
    title: 'Community forum',
    description:
      'Ask how something works or how to set it up, share how you use ODE, or float an idea.',
    href: FORUM,
    cta: 'Ask on the forum',
  },
  {
    label: 'BUGS & CHANGES',
    title: 'GitHub issues',
    description:
      'Found something broken, or have a concrete change in mind? Search existing reports first, then open an issue.',
    href: GITHUB_ISSUES,
    cta: 'Open an issue',
  },
  {
    label: 'SELF-SERVE',
    title: 'Getting help',
    description:
      'Docs, GitHub, and email in one place, plus what to include when you report a problem.',
    href: docs.gettingHelp,
    cta: 'Help resources',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="CONTACT"
        title={
          <>
            How to
            <br />
            <span className="serif-word">reach us.</span>
          </>
        }
        image="/brand/bird.png"
      >
        <p className="page-lead">
          Questions belong on the forum. Bugs and patches go on GitHub. Write to
          us below for a general inquiry or a private security report.
        </p>
        <p className="page-text">
          Search existing issues before opening a new one.
        </p>
      </PageIntro>

      <section
        className="container page-section page-section-flush"
        aria-label="Ways to get in touch"
      >
        <LinkList items={channels} />
      </section>
      <ContactMail />
    </>
  );
}
