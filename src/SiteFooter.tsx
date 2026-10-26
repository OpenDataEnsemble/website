import Link from 'next/link';
import Brand from './Brand';
import DemoButton from './DemoButton';
import { Icon } from './Icons';
import {
  DOCS,
  DOWNLOADS,
  FORUM,
  GITHUB,
  GITHUB_CONTRIBUTING,
  GITHUB_ISSUES,
  LINKEDIN,
  TIKTOK,
  docs,
} from './site';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand light />
            <p>Open-source field data tools.</p>
          </div>
          <div className="footer-links">
            <div>
              <h3>EXPLORE</h3>
              <Link href="/#platform">The platform</Link>
              <Link href="/about">About</Link>
              <DemoButton>
                Try the demo <Icon name="diagonal" size="var(--icon-size-xs)" />
              </DemoButton>
            </div>
            <div>
              <h3>DOCS</h3>
              <a href={DOCS} target="_blank" rel="noreferrer">
                Overview
              </a>
              <a href={docs.gettingStarted} target="_blank" rel="noreferrer">
                Getting started
              </a>
              <a href={DOWNLOADS} target="_blank" rel="noreferrer">
                Downloads
              </a>
              <a href={docs.using} target="_blank" rel="noreferrer">
                Using ODE
              </a>
              <a href={docs.reference} target="_blank" rel="noreferrer">
                Reference
              </a>
            </div>
            <div>
              <h3>COMMUNITY</h3>
              <Link href="/community">Community</Link>
              <a href={FORUM} target="_blank" rel="noreferrer">
                Forum
              </a>
              <Link href="/contact">Contact</Link>
              <a href={GITHUB_CONTRIBUTING} target="_blank" rel="noreferrer">
                Contribute
              </a>
              <a href={GITHUB_ISSUES} target="_blank" rel="noreferrer">
                Share an idea{' '}
                <Icon name="diagonal" size="var(--icon-size-xs)" />
              </a>
            </div>
            <div>
              <h3>CONTACT</h3>
              <a href={GITHUB} target="_blank" rel="noreferrer">
                GitHub <Icon name="diagonal" size="var(--icon-size-xs)" />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer">
                LinkedIn <Icon name="diagonal" size="var(--icon-size-xs)" />
              </a>
              <a href={TIKTOK} target="_blank" rel="noreferrer">
                TikTok <Icon name="diagonal" size="var(--icon-size-xs)" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Open Data Ensemble</span>
          <span>
            Built for places that aren’t always online.{' '}
            <Icon name="globe" size="var(--icon-size-site-14)" />
          </span>
          <nav className="footer-legal" aria-label="Legal">
            <a href={docs.privacy} target="_blank" rel="noreferrer">
              Privacy
            </a>
            <a href={docs.terms} target="_blank" rel="noreferrer">
              Terms
            </a>
            <a href={docs.accountDeletion} target="_blank" rel="noreferrer">
              Account deletion
            </a>
            <a href={docs.license} target="_blank" rel="noreferrer">
              License
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
