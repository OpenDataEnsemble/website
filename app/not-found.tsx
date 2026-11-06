import Link from 'next/link';

import { DOCS, DOWNLOADS } from '../src/site';

export default function NotFound() {
  return (
    <section className="container section-space page-section">
      <span className="eyebrow">
        <span className="status-dot" /> 404
      </span>

      <h1 className="page-title">This page is not here.</h1>

      <p className="page-text">It may have moved, or the link is wrong.</p>

      <Link className="button button-dark" href="/">
        Back to the home page
      </Link>

      <p className="page-section-link">
        <a className="inline-link" href={DOCS} target="_blank" rel="noreferrer">
          Documentation
        </a>
      </p>

      <p className="page-section-link">
        <a
          className="inline-link"
          href={DOWNLOADS}
          target="_blank"
          rel="noreferrer"
        >
          Downloads
        </a>
      </p>

      <p className="page-section-link">
        <Link className="inline-link" href="/community">
          Community
        </Link>
      </p>

      <p className="page-section-link">
        <Link className="inline-link" href="/contact">
          Contact
        </Link>
      </p>
    </section>
  );
}
