'use strict';

const canonicalHref = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
const baseUrl = canonicalHref.endsWith('/') ? canonicalHref : `${canonicalHref}/`;
const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
const businessEmail = 'Info@electroderepairs.com';
const businessPhone = '+1-405-268-6305';
const businessAddress = {
  '@type': 'PostalAddress',
  streetAddress: '1025 N Main St',
  addressLocality: 'Newcastle',
  addressRegion: 'OK',
  postalCode: '73065',
  addressCountry: 'US',
};
const businessHours = ['Tu 10:00-18:00', 'We 10:00-18:00', 'Th 10:00-18:00', 'Fr 10:00-18:00', 'Sa 10:00-18:00'];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Electrode Repairs',
  description: pageDescription,
  url: canonicalHref,
  telephone: businessPhone,
  email: businessEmail,
  image: new URL('assets/images/building_front.jpg', baseUrl).toString(),
  logo: new URL('assets/images/logo.png', baseUrl).toString(),
  address: businessAddress,
  openingHours: businessHours,
  areaServed: 'Newcastle, OK',
  sameAs: ['https://www.instagram.com/electrode_repairs/', 'https://www.facebook.com/ElectrodeRepairs'],
};

const existingStructuredDataScript = document.getElementById('local-business-jsonld');
if (existingStructuredDataScript) {
  existingStructuredDataScript.remove();
}

const structuredDataScript = document.createElement('script');
structuredDataScript.id = 'local-business-jsonld';
structuredDataScript.type = 'application/ld+json';
structuredDataScript.text = JSON.stringify(structuredData);
document.head.appendChild(structuredDataScript);

const siteHeader = document.querySelector('[data-site-header]');
const navToggle = siteHeader?.querySelector('[data-nav-toggle]');
const siteNav = siteHeader?.querySelector('[data-site-nav]');
const serviceMenu = siteHeader?.querySelector('[data-service-menu]');
const serviceToggle = siteHeader?.querySelector('[data-service-toggle]');

function closeSiteNav() {
  if (!siteHeader || !navToggle) {
    return;
  }
  siteHeader.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
}

function closeServiceMenu() {
  if (!serviceMenu || !serviceToggle) {
    return;
  }
  serviceMenu.classList.remove('is-open');
  serviceToggle.setAttribute('aria-expanded', 'false');
}

if (siteHeader && navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const navIsOpen = siteHeader.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(navIsOpen));
    navToggle.setAttribute('aria-label', navIsOpen ? 'Close navigation' : 'Open navigation');
  });

  siteNav.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('a')) {
      closeSiteNav();
      closeServiceMenu();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && !siteHeader.contains(target)) {
      closeSiteNav();
      closeServiceMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSiteNav();
      closeServiceMenu();
    }
  });
}

if (serviceMenu && serviceToggle) {
  serviceToggle.addEventListener('click', () => {
    const serviceIsOpen = serviceMenu.classList.toggle('is-open');
    serviceToggle.setAttribute('aria-expanded', String(serviceIsOpen));
  });

  serviceMenu.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!serviceMenu.contains(document.activeElement)) {
        closeServiceMenu();
      }
    }, 0);
  });
}

const emailTrigger = document.querySelector('[data-email-trigger]');
const emailMenu = document.querySelector('[data-email-menu]');
const copyEmailButton = document.querySelector('[data-copy-email-btn]');
const openMailOption = emailMenu?.querySelector('a[href^="mailto:"][data-email-option]') || null;

function showEmailToast(message) {
  let toast = document.querySelector('.email-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'email-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');

  window.clearTimeout(showEmailToast.timeoutId);
  showEmailToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 1700);
}

function closeEmailMenu() {
  if (!emailTrigger || !emailMenu) {
    return;
  }
  emailMenu.hidden = true;
  emailTrigger.setAttribute('aria-expanded', 'false');
}

function openMailClient() {
  window.location.assign(`mailto:${businessEmail}`);
}

if (emailTrigger && emailMenu && copyEmailButton) {
  emailTrigger.addEventListener('click', () => {
    const menuIsOpen = !emailMenu.hidden;
    emailMenu.hidden = menuIsOpen;
    emailTrigger.setAttribute('aria-expanded', String(!menuIsOpen));
  });

  if (openMailOption) {
    openMailOption.addEventListener('click', (event) => {
      event.preventDefault();
      closeEmailMenu();
      openMailClient();

      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          showEmailToast('If Mail did not open, choose Copy Email.');
        }
      }, 900);
    });
  }

  copyEmailButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(businessEmail);
      showEmailToast('Copied to clipboard');
    } catch {
      showEmailToast('Copy failed. Opening mail app...');
      openMailClient();
    }
    closeEmailMenu();
  });

  emailMenu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('[data-email-option]')) {
      closeEmailMenu();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && !emailMenu.contains(target) && !emailTrigger.contains(target)) {
      closeEmailMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeEmailMenu();
    }
  });
}

const contactTopicField = document.querySelector('.contact-topic-field');
const nativeTopicSelect = contactTopicField?.querySelector('#topic');
const customTopic = contactTopicField?.querySelector('[data-contact-topic]');

if (contactTopicField && nativeTopicSelect && customTopic) {
  const topicTrigger = customTopic.querySelector('.contact-topic-trigger');
  const topicLabel = customTopic.querySelector('[data-contact-topic-label]');
  const topicMenu = customTopic.querySelector('.contact-topic-menu');
  const topicOptions = Array.from(customTopic.querySelectorAll('.contact-topic-option'));

  if (topicTrigger && topicLabel && topicMenu && topicOptions.length > 0) {
    customTopic.hidden = false;
    contactTopicField.classList.add('is-topic-enhanced');

    function closeTopicMenu({ focusTrigger = false } = {}) {
      customTopic.classList.remove('is-open');
      topicMenu.hidden = true;
      topicTrigger.setAttribute('aria-expanded', 'false');
      if (focusTrigger) {
        topicTrigger.focus();
      }
    }

    function syncTopicUi() {
      const selectedOption = nativeTopicSelect.selectedOptions[0] || null;
      const selectedValue = selectedOption?.value || '';
      const selectedText = selectedOption?.textContent?.trim() || 'Select a topic';

      topicLabel.textContent = selectedValue ? selectedText : 'Select a topic';
      topicTrigger.setAttribute('aria-invalid', String(!selectedValue));

      topicOptions.forEach((option, index) => {
        const isSelected = option.dataset.value === selectedValue;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
        option.tabIndex = isSelected ? 0 : -1;

        if (!selectedValue && index === 0) {
          option.tabIndex = 0;
        }
      });
    }

    function openTopicMenu() {
      customTopic.classList.add('is-open');
      topicMenu.hidden = false;
      topicTrigger.setAttribute('aria-expanded', 'true');

      const activeOption = topicOptions.find((option) => option.classList.contains('is-selected')) || topicOptions[0];
      if (activeOption) {
        activeOption.focus();
      }
    }

    function selectTopic(value) {
      if (!value) {
        return;
      }
      nativeTopicSelect.value = value;
      nativeTopicSelect.dispatchEvent(new Event('change', { bubbles: true }));
      closeTopicMenu({ focusTrigger: true });
    }

    function moveTopicFocus(step) {
      const currentIndex = topicOptions.findIndex((option) => option === document.activeElement);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + step + topicOptions.length) % topicOptions.length;
      topicOptions[nextIndex]?.focus();
    }

    syncTopicUi();

    topicTrigger.addEventListener('click', () => {
      if (topicMenu.hidden) {
        openTopicMenu();
        return;
      }
      closeTopicMenu();
    });

    topicTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openTopicMenu();
      }
    });

    topicMenu.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const option = target.closest('.contact-topic-option');
      if (option instanceof HTMLButtonElement) {
        selectTopic(option.dataset.value || '');
      }
    });

    topicMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeTopicMenu({ focusTrigger: true });
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveTopicFocus(1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveTopicFocus(-1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        topicOptions[0]?.focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        topicOptions[topicOptions.length - 1]?.focus();
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        const focusedOption = document.activeElement;
        if (focusedOption instanceof HTMLButtonElement && focusedOption.classList.contains('contact-topic-option')) {
          event.preventDefault();
          selectTopic(focusedOption.dataset.value || '');
        }
      }
    });

    nativeTopicSelect.addEventListener('change', syncTopicUi);

    const contactForm = nativeTopicSelect.form;
    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        if (nativeTopicSelect.value) {
          return;
        }
        event.preventDefault();
        openTopicMenu();
      });

      contactForm.addEventListener('reset', () => {
        window.setTimeout(syncTopicUi, 0);
      });
    }

    customTopic.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!customTopic.contains(document.activeElement)) {
          closeTopicMenu();
        }
      }, 0);
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!customTopic.contains(target)) {
        closeTopicMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeTopicMenu();
      }
    });
  }
}

const reviewsRotator = document.getElementById('reviews-rotator');

if (reviewsRotator) {
  const reviewSlides = Array.from(reviewsRotator.querySelectorAll('[data-review-slide]'));
  const reviewDots = Array.from(reviewsRotator.querySelectorAll('[data-review-dot]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeReviewIndex = reviewSlides.findIndex((slide) => slide.classList.contains('is-active'));
  let reviewIntervalId = 0;

  if (activeReviewIndex < 0) {
    activeReviewIndex = 0;
  }

  function setActiveReview(nextIndex) {
    if (reviewSlides.length === 0) {
      return;
    }
    const normalizedIndex = ((nextIndex % reviewSlides.length) + reviewSlides.length) % reviewSlides.length;
    activeReviewIndex = normalizedIndex;

    reviewSlides.forEach((slide, index) => {
      const isActive = index === normalizedIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    reviewDots.forEach((dot, index) => {
      const isActive = index === normalizedIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  function stopReviewRotation() {
    if (reviewIntervalId) {
      window.clearInterval(reviewIntervalId);
      reviewIntervalId = 0;
    }
  }

  function advanceReview() {
    setActiveReview(activeReviewIndex + 1);
  }

  function startReviewRotation() {
    if (prefersReducedMotion.matches || reviewSlides.length < 2) {
      return;
    }
    stopReviewRotation();
    reviewIntervalId = window.setInterval(advanceReview, 6800);
  }

  if (reviewSlides.length > 0) {
    setActiveReview(activeReviewIndex);
  }

  reviewDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveReview(index);
      startReviewRotation();
    });
  });

  reviewsRotator.addEventListener('mouseenter', stopReviewRotation);
  reviewsRotator.addEventListener('mouseleave', startReviewRotation);
  reviewsRotator.addEventListener('focusin', stopReviewRotation);
  reviewsRotator.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!reviewsRotator.contains(document.activeElement)) {
        startReviewRotation();
      }
    }, 0);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopReviewRotation();
      return;
    }
    startReviewRotation();
  });

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', () => {
      if (prefersReducedMotion.matches) {
        stopReviewRotation();
        return;
      }
      startReviewRotation();
    });
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener((event) => {
      if (event.matches) {
        stopReviewRotation();
        return;
      }
      startReviewRotation();
    });
  }

  startReviewRotation();
}
