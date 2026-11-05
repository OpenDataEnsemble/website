'use client';

import { useState, useEffect, useRef } from 'react';
import { asset } from './asset';
import { Icon } from './Icons';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl: string;
}

const DEFAULT_AVATAR = '/brand/avatar.png';

function mediaSrc(url: string) {
  if (url.startsWith('data:') || /^https?:\/\//.test(url)) return url;
  return asset(url);
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Amara Osei',
    role: 'Field Researcher',
    company: 'Wildlife Conservation Alliance',
    quote:
      'ODE transformed how we collect data in remote areas. No more lost observations when the signal drops.',
    avatarUrl: '/brand/avatar.png',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Lead Developer',
    company: 'Health Systems Initiative',
    quote:
      'Finally, an offline-first solution that actually works. Our field teams can focus on their work, not connectivity.',
    avatarUrl: '/brand/developer.png',
  },
  {
    id: '3',
    name: 'Sarah Kimani',
    role: 'Community Coordinator',
    company: 'Rural Development Program',
    quote:
      'The simplicity of ODE means our volunteers can start collecting data within minutes. Game changer for our work.',
    avatarUrl: '/brand/planner.png',
  },
  {
    id: '4',
    name: 'Prof. James Ndlovu',
    role: 'Research Director',
    company: 'Environmental Studies Lab',
    quote:
      'Reliable data collection in the field was always our bottleneck. ODE solved it elegantly.',
    avatarUrl: '/brand/ensemble.png',
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    role: 'Project Manager',
    company: 'Public Health Network',
    quote:
      'Being able to sync when ready, not when forced to, changed everything about our field operations.',
    avatarUrl: '/brand/laptop.png',
  },
];

const STORAGE_KEY = 'ode-testimonials';
const CARD_WIDTH = 420;
const SCROLL_SPEED = 0.3;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [offset, setOffset] = useState(0);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load testimonials from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.every(
            (t) => t.name && t.role && t.company && t.quote && t.avatarUrl,
          );
          if (valid) {
            setTestimonials(parsed);
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load testimonials from localStorage:', e);
    }
    setTestimonials(DEFAULT_TESTIMONIALS);
  }, []);

  // Save testimonials to localStorage
  useEffect(() => {
    if (testimonials.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
      } catch (e) {
        console.warn('Failed to save testimonials to localStorage:', e);
      }
    }
  }, [testimonials]);

  // Continuous scroll animation
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const animate = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setOffset((prev) => prev + SCROLL_SPEED * (delta / 16));
      animationRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const updateAnimation = () => {
      stopAnimation();
      if (reducedMotion.matches) return;
      lastTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(animate);
    };

    updateAnimation();
    reducedMotion.addEventListener('change', updateAnimation);

    return () => {
      stopAnimation();
      reducedMotion.removeEventListener('change', updateAnimation);
    };
  }, [isPaused, testimonials.length]);

  // Cleanup resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, 3000);
  };

  const handlePrev = () => {
    setOffset((prev) => prev - CARD_WIDTH);
    pauseTemporarily();
  };

  const handleNext = () => {
    setOffset((prev) => prev + CARD_WIDTH);
    pauseTemporarily();
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    if (resumeTimerRef.current) return;
    setIsPaused(false);
  };

  if (testimonials.length === 0) return null;

  const tripledTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  const loopWidth = testimonials.length * CARD_WIDTH;

  return (
    <>
      <section
        className="testimonials-section container section-space"
        aria-labelledby="testimonials-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="section-number">03 /</span> REAL VOICES
            </span>
            <h2 id="testimonials-title">
              Trusted by teams
              <br />
              <span className="serif-word">doing real work.</span>
            </h2>
          </div>
          <p>
            See what field researchers, developers,
            <br />
            and community leaders are saying.
          </p>
        </div>

        <div
          className="testimonials-carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="carousel-nav carousel-nav-prev"
            onClick={handlePrev}
            aria-label="Previous testimonials"
          >
            <Icon name="arrow" size="var(--icon-size-site-19)" />
          </button>

          <div className="testimonials-track-container">
            <div
              className="testimonials-track"
              style={{
                transform: `translateX(${-(((offset % loopWidth) + loopWidth) % loopWidth)}px)`,
                transition: isPaused ? 'transform 0.5s ease-out' : 'none',
                willChange: 'transform',
              }}
            >
              {tripledTestimonials.map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="testimonial-card"
                >
                  <div className="testimonial-quote">"{testimonial.quote}"</div>
                  <div className="testimonial-footer">
                    <img
                      src={mediaSrc(testimonial.avatarUrl || DEFAULT_AVATAR)}
                      alt=""
                      className="testimonial-avatar"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = mediaSrc(DEFAULT_AVATAR);
                      }}
                    />
                    <div className="testimonial-author">
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.role}</span>
                      <span className="testimonial-company">
                        {testimonial.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="carousel-nav carousel-nav-next"
            onClick={handleNext}
            aria-label="Next testimonials"
          >
            <Icon name="arrow" size="var(--icon-size-site-19)" />
          </button>
        </div>

        <div className="testimonials-footer">
          <button
            className="button button-outline"
            onClick={() => setIsFormOpen(true)}
          >
            Share Your Experience{' '}
            <Icon name="diagonal" size="var(--icon-size-site-18)" />
          </button>
        </div>
      </section>

      {isFormOpen && (
        <TestimonialForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(newTestimonial: Testimonial) => {
            setTestimonials([...testimonials, newTestimonial]);
            setIsFormOpen(false);
          }}
        />
      )}
    </>
  );
}

/* Testimonial Form Modal */

interface TestimonialFormProps {
  onClose: () => void;
  onSubmit: (testimonial: Testimonial) => void;
}

function TestimonialForm({ onClose, onSubmit }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    quote: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'File size must be less than 5MB',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview((reader.result as string) ?? '');
      setErrors((prev) => ({ ...prev, photo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.quote.trim()) newErrors.quote = 'Quote is required';
    if (formData.quote.length > 500)
      newErrors.quote = 'Quote must be 500 characters or less';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      role: formData.role.trim() || 'Team Member',
      company: formData.company.trim() || 'Community',
      quote: formData.quote.trim(),
      avatarUrl: photoPreview || DEFAULT_AVATAR,
    };

    setTimeout(() => {
      onSubmit(newTestimonial);
      setIsSubmitting(false);
    }, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className="testimonial-modal-overlay" onClick={onClose}>
      <div
        className="testimonial-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="testimonial-form-title"
        aria-modal="true"
      >
        <div className="testimonial-modal-header">
          <h3 id="testimonial-form-title">Share Your Experience</h3>
          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close form"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form
          id="testimonial-form"
          className="testimonial-form"
          onSubmit={handleSubmit}
        >
          {/* Photo upload */}
          <div className="form-group photo-group">
            <label className="form-label-static">Profile Photo</label>
            <div className="photo-upload">
              <label htmlFor="photo" className="photo-upload-label">
                <div className="photo-upload-preview">
                  <img
                    src={photoPreview || asset(DEFAULT_AVATAR)}
                    alt="Profile preview"
                  />
                </div>
                <div className="photo-upload-text">
                  <strong>
                    {photoPreview ? 'Change photo' : 'Upload a photo'}
                  </strong>
                  <span>PNG or JPG · Max 5MB</span>
                </div>
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="photo-upload-input"
              />
            </div>
            {errors.photo && <span className="error-text">{errors.photo}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name ?? ''}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Your full name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email ?? ''}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role ?? ''}
                onChange={handleChange}
                placeholder="e.g., Field Researcher"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Organization</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company ?? ''}
                onChange={handleChange}
                placeholder="e.g., Conservation Group"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="quote">
              Your Experience <span className="required">*</span>
              <span className="char-count">{formData.quote.length}/500</span>
            </label>
            <textarea
              id="quote"
              name="quote"
              value={formData.quote ?? ''}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Tell us about your experience with ODE..."
              className={errors.quote ? 'error' : ''}
            />
            {errors.quote && <span className="error-text">{errors.quote}</span>}
          </div>
        </form>

        <div className="testimonial-modal-footer">
          <button
            type="button"
            className="button button-outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="testimonial-form"
            className="button button-lime"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}{' '}
            <Icon name="check" size="var(--icon-size-site-18)" />
          </button>
        </div>
      </div>
    </div>
  );
}
