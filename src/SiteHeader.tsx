'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Brand from './Brand';
import { Icon } from './Icons';
import { DOCS, DOWNLOADS, GITHUB, pageLinks } from './site';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = (usePathname() || '/').replace(/\/$/, '') || '/';

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <span className="brand-descriptor">
          open data
          <br />
          ensemble
        </span>
        <nav
          aria-label="Main navigation"
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(false)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMenuOpen(false);
              document.getElementById('menu-toggle')?.focus();
            }
          }}
          id="main-navigation"
        >
          <Link href="/#platform">The platform</Link>
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={
                pathname === link.href
                  ? 'page'
                  : pathname.startsWith(`${link.href}/`)
                    ? 'true'
                    : undefined
              }
            >
              {link.label}
            </Link>
          ))}
          <a href={DOCS} target="_blank" rel="noreferrer">
            Documentation{' '}
            <Icon name="diagonal" size="var(--icon-size-site-13)" />
          </a>
          <a href={DOWNLOADS} target="_blank" rel="noreferrer">
            Downloads <Icon name="diagonal" size="var(--icon-size-site-13)" />
          </a>
          <Link className="mobile-start" href="/#get-started">
            Get started <Icon name="diagonal" size="var(--icon-size-sm)" />
          </Link>
        </nav>
        <a
          className="header-github"
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          aria-label="ODE on GitHub"
        >
          <Icon name="github" size="var(--icon-size-site-21)" />
        </a>
        <Link className="button button-dark header-cta" href="/#get-started">
          Get started <Icon name="diagonal" size="var(--icon-size-sm)" />
        </Link>
        <button
          id="menu-toggle"
          className="icon-button menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size="var(--icon-size-lg)" />
        </button>
      </div>
    </header>
  );
}
