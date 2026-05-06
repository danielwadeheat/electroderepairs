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

// cspell:ignore iPhone MacBook PlayStation Xbox Inspiron oneplus thinkpad allinone nord stylo razr moto thinq
const modernQuoteForm = document.getElementById('modern-quote-form');

if (modernQuoteForm) {
  const deviceGrid = document.getElementById('quote-device-grid');
  const modelGrid = document.getElementById('quote-model-grid');
  const modelTitle = document.getElementById('quote-model-title');
  const modelContextImage = document.getElementById('quote-model-context-image');
  const issueGrid = document.getElementById('quote-issue-grid');
  const modelCustomWrap = document.getElementById('quote-model-custom-wrap');
  const modelCustomInput = document.getElementById('quote-model-custom');
  const issueCustomWrap = document.getElementById('quote-issue-custom-wrap');
  const issueCustomInput = document.getElementById('quote-issue-custom');
  const panels = Array.from(modernQuoteForm.querySelectorAll('[data-step-panel]'));
  const indicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
  const nav = modernQuoteForm.querySelector('.quote-nav');
  const quoteWidgetShell = document.querySelector('.quote-widget-shell');
  const backBtn = document.getElementById('quote-back-btn');
  const finalBackBtn = document.getElementById('quote-final-back-btn');
  const nextBtn = document.getElementById('quote-next-btn');
  const submitStatus = document.getElementById('quote-submit-status');

  const hiddenDeviceName = document.getElementById('quote-hidden-device-name');
  const hiddenDeviceId = document.getElementById('quote-hidden-device-id');
  const hiddenModelName = document.getElementById('quote-hidden-model-name');
  const hiddenIssueName = document.getElementById('quote-hidden-issue-name');
  const hiddenModelId = document.getElementById('quote-hidden-model-id');
  const hiddenIssueId = document.getElementById('quote-hidden-issue-id');
  const hiddenModelInput = document.getElementById('quote-hidden-model-input');

  const reviewDevice = document.getElementById('quote-review-device');
  const reviewModel = document.getElementById('quote-review-model');
  const reviewIssue = document.getElementById('quote-review-issue');
  const reviewMedium = document.getElementById('quote-review-medium');

  const quoteImageBase = 'assets/images/quote-widget';
  const deviceImageSources = {
    iphone: {
      primary: `${quoteImageBase}/devices/iphone_transparent.webp`,
      fallback: `${quoteImageBase}/devices/iphone.svg`,
    },
    android: {
      primary: `${quoteImageBase}/devices/android_transparent.webp`,
      fallback: `${quoteImageBase}/devices/android.svg`,
    },
    tablet: {
      primary: `${quoteImageBase}/devices/tablet_transparent.webp`,
      fallback: `${quoteImageBase}/devices/tablet.svg`,
    },
    laptop: {
      primary: `${quoteImageBase}/devices/laptop_transparent.webp`,
      fallback: `${quoteImageBase}/devices/laptop.svg`,
    },
    console: {
      primary: `${quoteImageBase}/devices/ps4_transparent.webp`,
      fallback: `${quoteImageBase}/devices/console.svg`,
    },
    desktop: {
      primary: `${quoteImageBase}/devices/desktop_transparent.webp`,
      fallback: `${quoteImageBase}/devices/desktop.svg`,
    },
  };

  const issueCatalog = {
    screen_damage: { key: 'screen-damage', label: 'Screen Damage' },
    battery_issue: { key: 'battery-issue', label: 'Battery Issue' },
    charging_port_issue: { key: 'charging-port-issue', label: 'Charging Port Issue' },
    back_glass_damage: { key: 'back-glass-damage', label: 'Back Glass Damage' },
    camera_issue: { key: 'camera-issue', label: 'Camera Issue' },
    audio_issue: { key: 'audio-issue', label: 'Audio Issue' },
    digitizer_touch_issue: { key: 'digitizer-touch-issue', label: 'Digitizer/Touch Issue' },
    software_issue: { key: 'software-issue', label: 'Software Issue' },
    no_power: { key: 'no-power', label: 'No Power' },
    keyboard_issue: { key: 'keyboard-issue', label: 'Keyboard Issue' },
    generic_screen_issue: { key: 'generic-screen-issue', label: 'Screen Issue' },
    generic_charging_issue: { key: 'generic-charging-issue', label: 'Charging Issue' },
    overheating: { key: 'overheating', label: 'Overheating' },
    hdmi_port_issue: { key: 'hdmi-port-issue', label: 'HDMI Port Issue' },
    disc_drive_issue: { key: 'disc-drive-issue', label: 'Disc Drive Issue' },
    controller_sync_issue: { key: 'controller-sync-issue', label: 'Controller Sync Issue' },
    no_display: { key: 'no-display', label: 'No Display' },
    storage_boot_issue: { key: 'storage-boot-issue', label: 'Storage/Boot Issue' },
    upgrade_build_service: { key: 'upgrade-build-service', label: 'Upgrade/Build Service' },
    general_diagnostic: { key: 'general-diagnostic', label: 'General Diagnostic' },
    connectivity_issue: { key: 'connectivity-issue', label: 'Connectivity Issue' },
    other_issue: { key: 'other-issue', label: 'Other Issue', other: true },
  };

  function imagePath(type, key) {
    return `${quoteImageBase}/${type}/${key}.svg`;
  }

  function deviceImagePath(deviceKey) {
    return deviceImageSources[deviceKey]?.primary || imagePath('devices', deviceKey);
  }

  function deviceFallbackPath(deviceKey) {
    return deviceImageSources[deviceKey]?.fallback || imagePath('devices', deviceKey);
  }

  const quoteData = {
    devices: [
      { id: '1', key: 'iphone', label: 'iPhone', image: deviceImagePath('iphone') },
      { id: '2', key: 'android', label: 'Android Phone', image: deviceImagePath('android') },
      { id: '6', key: 'tablet', label: 'Tablet', image: deviceImagePath('tablet') },
      { id: '4', key: 'laptop', label: 'Laptop', image: deviceImagePath('laptop') },
      { id: '5', key: 'console', label: 'Gaming Console', image: deviceImagePath('console') },
      { id: '13', key: 'desktop', label: 'Desktop Services', image: deviceImagePath('desktop') },
      { id: '12', key: 'other', label: 'Other', image: imagePath('devices', 'other') },
    ],
    models: {
      iphone: [
        { key: 'iphone-17-pro-max', label: 'iPhone 17 Pro Max' },
        { key: 'iphone-17-pro', label: 'iPhone 17 Pro' },
        { key: 'iphone-17-plus', label: 'iPhone 17 Plus' },
        { key: 'iphone-17', label: 'iPhone 17' },
        { key: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max' },
        { key: 'iphone-16-pro', label: 'iPhone 16 Pro' },
        { key: 'iphone-16-plus', label: 'iPhone 16 Plus' },
        { key: 'iphone-16', label: 'iPhone 16' },
        { key: 'iphone-15-pro-max', label: 'iPhone 15 Pro Max' },
        { key: 'iphone-15-pro', label: 'iPhone 15 Pro' },
        { key: 'iphone-15-plus', label: 'iPhone 15 Plus' },
        { key: 'iphone-15', label: 'iPhone 15' },
        { key: 'iphone-14-pro-max', label: 'iPhone 14 Pro Max' },
        { key: 'iphone-14-pro', label: 'iPhone 14 Pro' },
        { key: 'iphone-14-plus', label: 'iPhone 14 Plus' },
        { key: 'iphone-14', label: 'iPhone 14' },
        { key: 'iphone-13-pro-max', label: 'iPhone 13 Pro Max' },
        { key: 'iphone-13-pro', label: 'iPhone 13 Pro' },
        { key: 'iphone-13', label: 'iPhone 13' },
        { key: 'iphone-13-mini', label: 'iPhone 13 Mini' },
        { key: 'iphone-se-3rd-gen', label: 'iPhone SE (3rd Gen)' },
        { key: 'iphone-12-pro-max', label: 'iPhone 12 Pro Max' },
        { key: 'iphone-12-pro', label: 'iPhone 12 Pro' },
        { key: 'iphone-12', label: 'iPhone 12' },
        { key: 'iphone-12-mini', label: 'iPhone 12 Mini' },
        { key: 'iphone-11-pro-max', label: 'iPhone 11 Pro Max' },
        { key: 'iphone-11-pro', label: 'iPhone 11 Pro' },
        { key: 'iphone-11', label: 'iPhone 11' },
        { key: 'iphone-se-2nd-gen', label: 'iPhone SE (2nd Gen)' },
        { key: 'iphone-xs-max', label: 'iPhone XS Max' },
        { key: 'iphone-xs', label: 'iPhone XS' },
        { key: 'iphone-xr', label: 'iPhone XR' },
        { key: 'iphone-x', label: 'iPhone X' },
        { key: 'iphone-8-plus', label: 'iPhone 8 Plus' },
        { key: 'iphone-8', label: 'iPhone 8' },
        { key: 'iphone-7-plus', label: 'iPhone 7 Plus' },
        { key: 'iphone-7', label: 'iPhone 7' },
        { key: 'iphone-se-1st-gen', label: 'iPhone SE (1st Gen)' },
        { key: 'iphone-6s-plus', label: 'iPhone 6s Plus' },
        { key: 'iphone-6s', label: 'iPhone 6s' },
        { key: 'iphone-6', label: 'iPhone 6' },
        { key: 'iphone-6-plus', label: 'iPhone 6 Plus' },
        { key: 'iphone-other', label: 'Other iPhone Model', other: true },
      ],
      android: [
        { key: 'android-samsung', label: 'Samsung' },
        { key: 'android-google', label: 'Google' },
        { key: 'android-oneplus', label: 'OnePlus' },
        { key: 'android-lg', label: 'LG' },
        { key: 'android-motorola', label: 'Motorola' },
        { key: 'android-other-brand', label: 'Other', other: true },
      ],
      tablet: [
        { key: 'tablet-ipad', label: 'iPad' },
        { key: 'tablet-samsung', label: 'Samsung Tablet' },
        { key: 'tablet-fire', label: 'Amazon Fire Tablet' },
        { key: 'tablet-other-type', label: 'Other Tablet', other: true },
      ],
      laptop: [
        { key: 'laptop-apple', label: 'Apple (MacBook)' },
        { key: 'laptop-dell', label: 'Dell' },
        { key: 'laptop-hp', label: 'HP' },
        { key: 'laptop-lenovo', label: 'Lenovo' },
        { key: 'laptop-asus', label: 'ASUS' },
        { key: 'laptop-acer', label: 'Acer' },
        { key: 'laptop-microsoft', label: 'Microsoft Surface' },
        { key: 'laptop-samsung', label: 'Samsung' },
        { key: 'laptop-msi', label: 'MSI' },
        { key: 'laptop-razer', label: 'Razer' },
        { key: 'laptop-alienware', label: 'Alienware' },
        { key: 'laptop-other', label: 'Other Laptop', other: true },
      ],
      console: [
        { key: 'console-ps5', label: 'PlayStation 5' },
        { key: 'console-ps4', label: 'PlayStation 4' },
        { key: 'console-xbox-series', label: 'Xbox Series X/S' },
        { key: 'console-xbox-one', label: 'Xbox One' },
        { key: 'console-switch', label: 'Nintendo Switch' },
        { key: 'console-other', label: 'Other Console', other: true },
      ],
      desktop: [
        { key: 'desktop-custom', label: 'Custom Desktop' },
        { key: 'desktop-dell', label: 'Dell Desktop' },
        { key: 'desktop-hp', label: 'HP Desktop' },
        { key: 'desktop-allinone', label: 'All-in-One PC' },
        { key: 'desktop-gaming', label: 'Gaming PC' },
        { key: 'desktop-other', label: 'Other Desktop', other: true },
      ],
      other: [{ key: 'other-custom-model', label: 'Other Device / Model', other: true }],
    },
    androidModels: {
      'android-samsung': [
        { key: 'samsung-galaxy-s25-ultra', label: 'Galaxy S25 Ultra' },
        { key: 'samsung-galaxy-s25-plus', label: 'Galaxy S25 Plus' },
        { key: 'samsung-galaxy-s25', label: 'Galaxy S25' },
        { key: 'samsung-galaxy-s24-ultra', label: 'Galaxy S24 Ultra' },
        { key: 'samsung-galaxy-s24-plus', label: 'Galaxy S24 Plus' },
        { key: 'samsung-galaxy-s24', label: 'Galaxy S24' },
        { key: 'samsung-galaxy-s23-ultra', label: 'Galaxy S23 Ultra' },
        { key: 'samsung-galaxy-s23-plus', label: 'Galaxy S23 Plus' },
        { key: 'samsung-galaxy-s23', label: 'Galaxy S23' },
        { key: 'samsung-galaxy-s22-ultra', label: 'Galaxy S22 Ultra' },
        { key: 'samsung-galaxy-s22-plus', label: 'Galaxy S22 Plus' },
        { key: 'samsung-galaxy-s22', label: 'Galaxy S22' },
        { key: 'samsung-galaxy-s21-ultra', label: 'Galaxy S21 Ultra' },
        { key: 'samsung-galaxy-s21-plus', label: 'Galaxy S21 Plus' },
        { key: 'samsung-galaxy-s21', label: 'Galaxy S21' },
        { key: 'samsung-galaxy-s20-ultra', label: 'Galaxy S20 Ultra' },
        { key: 'samsung-galaxy-s20-plus', label: 'Galaxy S20 Plus' },
        { key: 'samsung-galaxy-s20', label: 'Galaxy S20' },
        { key: 'samsung-galaxy-s10-plus', label: 'Galaxy S10 Plus' },
        { key: 'samsung-galaxy-s10', label: 'Galaxy S10' },
        { key: 'samsung-galaxy-s10e', label: 'Galaxy S10e' },
        { key: 'samsung-galaxy-s9-plus', label: 'Galaxy S9 Plus' },
        { key: 'samsung-galaxy-s9', label: 'Galaxy S9' },
        { key: 'samsung-galaxy-s8-plus', label: 'Galaxy S8 Plus' },
        { key: 'samsung-galaxy-s8', label: 'Galaxy S8' },
        { key: 'samsung-galaxy-s7-edge', label: 'Galaxy S7 Edge' },
        { key: 'samsung-galaxy-s7', label: 'Galaxy S7' },
        { key: 'samsung-galaxy-s6-edge-plus', label: 'Galaxy S6 Edge Plus' },
        { key: 'samsung-galaxy-s6-edge', label: 'Galaxy S6 Edge' },
        { key: 'samsung-galaxy-s6', label: 'Galaxy S6' },
        { key: 'samsung-galaxy-note-20-ultra', label: 'Galaxy Note20 Ultra' },
        { key: 'samsung-galaxy-note-20', label: 'Galaxy Note20' },
        { key: 'samsung-galaxy-note-10-plus', label: 'Galaxy Note10 Plus' },
        { key: 'samsung-galaxy-note-10', label: 'Galaxy Note10' },
        { key: 'samsung-galaxy-note-9', label: 'Galaxy Note9' },
        { key: 'samsung-galaxy-note-8', label: 'Galaxy Note8' },
        { key: 'samsung-galaxy-note-7-fe', label: 'Galaxy Note FE' },
        { key: 'samsung-galaxy-note-5', label: 'Galaxy Note5' },
        { key: 'samsung-galaxy-z-fold-6', label: 'Galaxy Z Fold6' },
        { key: 'samsung-galaxy-z-fold-5', label: 'Galaxy Z Fold5' },
        { key: 'samsung-galaxy-z-fold-4', label: 'Galaxy Z Fold4' },
        { key: 'samsung-galaxy-z-fold-3', label: 'Galaxy Z Fold3' },
        { key: 'samsung-galaxy-z-flip-6', label: 'Galaxy Z Flip6' },
        { key: 'samsung-galaxy-z-flip-5', label: 'Galaxy Z Flip5' },
        { key: 'samsung-galaxy-z-flip-4', label: 'Galaxy Z Flip4' },
        { key: 'samsung-galaxy-z-flip-3', label: 'Galaxy Z Flip3' },
        { key: 'samsung-galaxy-a55', label: 'Galaxy A55' },
        { key: 'samsung-galaxy-a54', label: 'Galaxy A54' },
        { key: 'samsung-galaxy-a53', label: 'Galaxy A53' },
        { key: 'samsung-galaxy-a52', label: 'Galaxy A52' },
        { key: 'samsung-galaxy-a51', label: 'Galaxy A51' },
        { key: 'samsung-galaxy-a50', label: 'Galaxy A50' },
        { key: 'samsung-galaxy-j-series', label: 'Galaxy J Series' },
        { key: 'samsung-other', label: 'Other Samsung Model', other: true },
      ],
      'android-google': [
        { key: 'google-pixel-10-pro-xl', label: 'Pixel 10 Pro XL' },
        { key: 'google-pixel-10-pro', label: 'Pixel 10 Pro' },
        { key: 'google-pixel-10', label: 'Pixel 10' },
        { key: 'google-pixel-9-pro-xl', label: 'Pixel 9 Pro XL' },
        { key: 'google-pixel-9-pro', label: 'Pixel 9 Pro' },
        { key: 'google-pixel-9', label: 'Pixel 9' },
        { key: 'google-pixel-9a', label: 'Pixel 9a' },
        { key: 'google-pixel-8-pro', label: 'Pixel 8 Pro' },
        { key: 'google-pixel-8', label: 'Pixel 8' },
        { key: 'google-pixel-8a', label: 'Pixel 8a' },
        { key: 'google-pixel-7-pro', label: 'Pixel 7 Pro' },
        { key: 'google-pixel-7', label: 'Pixel 7' },
        { key: 'google-pixel-7a', label: 'Pixel 7a' },
        { key: 'google-pixel-6-pro', label: 'Pixel 6 Pro' },
        { key: 'google-pixel-6', label: 'Pixel 6' },
        { key: 'google-pixel-6a', label: 'Pixel 6a' },
        { key: 'google-pixel-5a', label: 'Pixel 5a' },
        { key: 'google-pixel-5', label: 'Pixel 5' },
        { key: 'google-pixel-4a-5g', label: 'Pixel 4a (5G)' },
        { key: 'google-pixel-4a', label: 'Pixel 4a' },
        { key: 'google-pixel-4-xl', label: 'Pixel 4 XL' },
        { key: 'google-pixel-4', label: 'Pixel 4' },
        { key: 'google-pixel-3a-xl', label: 'Pixel 3a XL' },
        { key: 'google-pixel-3a', label: 'Pixel 3a' },
        { key: 'google-pixel-3-xl', label: 'Pixel 3 XL' },
        { key: 'google-pixel-3', label: 'Pixel 3' },
        { key: 'google-pixel-2-xl', label: 'Pixel 2 XL' },
        { key: 'google-pixel-2', label: 'Pixel 2' },
        { key: 'google-pixel-xl', label: 'Pixel XL' },
        { key: 'google-pixel', label: 'Pixel' },
        { key: 'google-pixel-9-pro-fold', label: 'Pixel 9 Pro Fold' },
        { key: 'google-pixel-fold', label: 'Pixel Fold' },
        { key: 'google-nexus-6p', label: 'Nexus 6P' },
        { key: 'google-nexus-5x', label: 'Nexus 5X' },
        { key: 'google-nexus-6', label: 'Nexus 6' },
        { key: 'google-other', label: 'Other Google Pixel', other: true },
      ],
      'android-oneplus': [
        { key: 'oneplus-13r', label: 'OnePlus 13R' },
        { key: 'oneplus-13', label: 'OnePlus 13' },
        { key: 'oneplus-12r', label: 'OnePlus 12R' },
        { key: 'oneplus-12', label: 'OnePlus 12' },
        { key: 'oneplus-11', label: 'OnePlus 11' },
        { key: 'oneplus-10t', label: 'OnePlus 10T' },
        { key: 'oneplus-10-pro', label: 'OnePlus 10 Pro' },
        { key: 'oneplus-9rt', label: 'OnePlus 9RT' },
        { key: 'oneplus-9-pro', label: 'OnePlus 9 Pro' },
        { key: 'oneplus-9', label: 'OnePlus 9' },
        { key: 'oneplus-8-pro', label: 'OnePlus 8 Pro' },
        { key: 'oneplus-8t', label: 'OnePlus 8T' },
        { key: 'oneplus-8', label: 'OnePlus 8' },
        { key: 'oneplus-7t-pro', label: 'OnePlus 7T Pro' },
        { key: 'oneplus-7t', label: 'OnePlus 7T' },
        { key: 'oneplus-7-pro', label: 'OnePlus 7 Pro' },
        { key: 'oneplus-7', label: 'OnePlus 7' },
        { key: 'oneplus-6t', label: 'OnePlus 6T' },
        { key: 'oneplus-6', label: 'OnePlus 6' },
        { key: 'oneplus-5t', label: 'OnePlus 5T' },
        { key: 'oneplus-5', label: 'OnePlus 5' },
        { key: 'oneplus-3t', label: 'OnePlus 3T' },
        { key: 'oneplus-3', label: 'OnePlus 3' },
        { key: 'oneplus-2', label: 'OnePlus 2' },
        { key: 'oneplus-1', label: 'OnePlus One' },
        { key: 'oneplus-nord-4', label: 'OnePlus Nord 4' },
        { key: 'oneplus-nord-3', label: 'OnePlus Nord 3' },
        { key: 'oneplus-nord-2', label: 'OnePlus Nord 2' },
        { key: 'oneplus-nord-n30', label: 'OnePlus Nord N30' },
        { key: 'oneplus-nord-n20', label: 'OnePlus Nord N20' },
        { key: 'oneplus-nord-n10', label: 'OnePlus Nord N10' },
        { key: 'oneplus-nord-series', label: 'OnePlus Nord Series' },
        { key: 'oneplus-open-2', label: 'OnePlus Open 2' },
        { key: 'oneplus-open', label: 'OnePlus Open' },
        { key: 'oneplus-other', label: 'Other OnePlus Model', other: true },
      ],
      'android-lg': [
        { key: 'lg-v60-thinq', label: 'LG V60 ThinQ' },
        { key: 'lg-v50-thinq', label: 'LG V50 ThinQ' },
        { key: 'lg-v40-thinq', label: 'LG V40 ThinQ' },
        { key: 'lg-v35-thinq', label: 'LG V35 ThinQ' },
        { key: 'lg-v30', label: 'LG V30' },
        { key: 'lg-v20', label: 'LG V20' },
        { key: 'lg-v10', label: 'LG V10' },
        { key: 'lg-g8-thinq', label: 'LG G8 ThinQ' },
        { key: 'lg-g7-thinq', label: 'LG G7 ThinQ' },
        { key: 'lg-g6', label: 'LG G6' },
        { key: 'lg-g5', label: 'LG G5' },
        { key: 'lg-g4', label: 'LG G4' },
        { key: 'lg-g3', label: 'LG G3' },
        { key: 'lg-wing', label: 'LG Wing' },
        { key: 'lg-velvet', label: 'LG Velvet' },
        { key: 'lg-q-series', label: 'LG Q Series' },
        { key: 'lg-k92', label: 'LG K92 5G' },
        { key: 'lg-k71', label: 'LG K71' },
        { key: 'lg-k51', label: 'LG K51' },
        { key: 'lg-k40', label: 'LG K40' },
        { key: 'lg-k30', label: 'LG K30' },
        { key: 'lg-k20', label: 'LG K20' },
        { key: 'lg-stylo-6', label: 'LG Stylo 6' },
        { key: 'lg-stylo-5', label: 'LG Stylo 5' },
        { key: 'lg-stylo-4', label: 'LG Stylo 4' },
        { key: 'lg-stylo-3', label: 'LG Stylo 3' },
        { key: 'lg-stylo-series', label: 'LG Stylo Series' },
        { key: 'lg-k-series', label: 'LG K Series' },
        { key: 'lg-v-series', label: 'LG V Series' },
        { key: 'lg-g-series', label: 'LG G Series' },
        { key: 'lg-other', label: 'Other LG Model', other: true },
      ],
      'android-motorola': [
        { key: 'motorola-edge-60-series', label: 'Motorola Edge 60 Series' },
        { key: 'motorola-edge-50-series', label: 'Motorola Edge 50 Series' },
        { key: 'motorola-edge-40-series', label: 'Motorola Edge 40 Series' },
        { key: 'motorola-edge-30-series', label: 'Motorola Edge 30 Series' },
        { key: 'motorola-edge-20-series', label: 'Motorola Edge 20 Series' },
        { key: 'motorola-edge-plus-2022', label: 'Motorola Edge Plus (2022)' },
        { key: 'motorola-edge-plus-2020', label: 'Motorola Edge Plus (2020)' },
        { key: 'motorola-razr-plus-2024', label: 'Motorola Razr Plus (2024)' },
        { key: 'motorola-razr-2024', label: 'Motorola Razr (2024)' },
        { key: 'motorola-razr-plus-2023', label: 'Motorola Razr Plus (2023)' },
        { key: 'motorola-razr-2023', label: 'Motorola Razr (2023)' },
        { key: 'motorola-razr-5g', label: 'Motorola Razr 5G' },
        { key: 'motorola-razr-2019', label: 'Motorola Razr (2019)' },
        { key: 'motorola-razr-series', label: 'Motorola Razr Series' },
        { key: 'motorola-moto-g-power-2025', label: 'Moto G Power (2025)' },
        { key: 'motorola-moto-g-power-2024', label: 'Moto G Power (2024)' },
        { key: 'motorola-moto-g-power-2023', label: 'Moto G Power (2023)' },
        { key: 'motorola-moto-g-stylus-2025', label: 'Moto G Stylus (2025)' },
        { key: 'motorola-moto-g-stylus-2024', label: 'Moto G Stylus (2024)' },
        { key: 'motorola-moto-g-stylus-2023', label: 'Moto G Stylus (2023)' },
        { key: 'motorola-moto-g-5g-series', label: 'Moto G 5G Series' },
        { key: 'motorola-moto-g-fast', label: 'Moto G Fast' },
        { key: 'motorola-moto-g-pure', label: 'Moto G Pure' },
        { key: 'motorola-moto-g-play-series', label: 'Moto G Play Series' },
        { key: 'motorola-moto-g-series', label: 'Moto G Series' },
        { key: 'motorola-moto-e32', label: 'Moto E32' },
        { key: 'motorola-moto-e22', label: 'Moto E22' },
        { key: 'motorola-moto-e13', label: 'Moto E13' },
        { key: 'motorola-moto-e7', label: 'Moto E7' },
        { key: 'motorola-moto-e6', label: 'Moto E6' },
        { key: 'motorola-moto-e5', label: 'Moto E5' },
        { key: 'motorola-moto-e-series', label: 'Moto E Series' },
        { key: 'motorola-moto-one-5g-ace', label: 'Moto One 5G Ace' },
        { key: 'motorola-moto-one-5g', label: 'Moto One 5G' },
        { key: 'motorola-moto-one-hyper', label: 'Moto One Hyper' },
        { key: 'motorola-moto-one-zoom', label: 'Moto One Zoom' },
        { key: 'motorola-moto-z4', label: 'Moto Z4' },
        { key: 'motorola-moto-z3', label: 'Moto Z3' },
        { key: 'motorola-moto-z2-force', label: 'Moto Z2 Force' },
        { key: 'motorola-moto-x4', label: 'Moto X4' },
        { key: 'motorola-moto-x-style', label: 'Moto X Style' },
        { key: 'motorola-moto-one-series', label: 'Moto One Series' },
        { key: 'motorola-other', label: 'Other Motorola Model', other: true },
      ],
      'android-other-brand': [{ key: 'android-other', label: 'Other Android Model', other: true }],
    },
    tabletModels: {
      'tablet-ipad': [
        { key: 'ipad-pro-13-m4', label: 'iPad Pro 13-inch (M4)' },
        { key: 'ipad-pro-11-m4', label: 'iPad Pro 11-inch (M4)' },
        { key: 'ipad-air-13-m2', label: 'iPad Air 13-inch (M2)' },
        { key: 'ipad-air-11-m2', label: 'iPad Air 11-inch (M2)' },
        { key: 'ipad-10th-gen', label: 'iPad (10th Gen)' },
        { key: 'ipad-9th-gen', label: 'iPad (9th Gen)' },
        { key: 'ipad-8th-gen', label: 'iPad (8th Gen)' },
        { key: 'ipad-7th-gen', label: 'iPad (7th Gen)' },
        { key: 'ipad-6th-gen', label: 'iPad (6th Gen)' },
        { key: 'ipad-5th-gen', label: 'iPad (5th Gen)' },
        { key: 'ipad-air-5th-gen', label: 'iPad Air (5th Gen)' },
        { key: 'ipad-air-4th-gen', label: 'iPad Air (4th Gen)' },
        { key: 'ipad-air-3rd-gen', label: 'iPad Air (3rd Gen)' },
        { key: 'ipad-air-2', label: 'iPad Air 2' },
        { key: 'ipad-air-1', label: 'iPad Air (1st Gen)' },
        { key: 'ipad-mini-7-a17-pro', label: 'iPad mini (A17 Pro)' },
        { key: 'ipad-mini-6th-gen', label: 'iPad mini (6th Gen)' },
        { key: 'ipad-mini-5th-gen', label: 'iPad mini (5th Gen)' },
        { key: 'ipad-mini-4', label: 'iPad mini 4' },
        { key: 'ipad-mini-3', label: 'iPad mini 3' },
        { key: 'ipad-mini-2', label: 'iPad mini 2' },
        { key: 'ipad-mini-1', label: 'iPad mini (1st Gen)' },
        { key: 'ipad-pro-12-9-6th-gen', label: 'iPad Pro 12.9-inch (6th Gen)' },
        { key: 'ipad-pro-12-9-5th-gen', label: 'iPad Pro 12.9-inch (5th Gen)' },
        { key: 'ipad-pro-12-9-4th-gen', label: 'iPad Pro 12.9-inch (4th Gen)' },
        { key: 'ipad-pro-12-9-3rd-gen', label: 'iPad Pro 12.9-inch (3rd Gen)' },
        { key: 'ipad-pro-12-9-2nd-gen', label: 'iPad Pro 12.9-inch (2nd Gen)' },
        { key: 'ipad-pro-12-9-1st-gen', label: 'iPad Pro 12.9-inch (1st Gen)' },
        { key: 'ipad-pro-11-4th-gen', label: 'iPad Pro 11-inch (4th Gen)' },
        { key: 'ipad-pro-11-3rd-gen', label: 'iPad Pro 11-inch (3rd Gen)' },
        { key: 'ipad-pro-11-2nd-gen', label: 'iPad Pro 11-inch (2nd Gen)' },
        { key: 'ipad-pro-11-1st-gen', label: 'iPad Pro 11-inch (1st Gen)' },
        { key: 'ipad-pro-10-5', label: 'iPad Pro 10.5-inch' },
        { key: 'ipad-pro-9-7', label: 'iPad Pro 9.7-inch' },
        { key: 'ipad-4th-gen', label: 'iPad (4th Gen)' },
        { key: 'ipad-3rd-gen', label: 'iPad (3rd Gen)' },
        { key: 'ipad-2', label: 'iPad 2' },
        { key: 'ipad-1', label: 'iPad (1st Gen)' },
        { key: 'ipad-other', label: 'Other iPad Model', other: true },
      ],
      'tablet-samsung': [{ key: 'tablet-samsung-generic', label: 'Samsung Tablet' }],
      'tablet-fire': [{ key: 'tablet-fire-generic', label: 'Amazon Fire Tablet' }],
      'tablet-other-type': [{ key: 'tablet-other-model', label: 'Other Tablet Model', other: true }],
    },
    issues: {
      iphone: [
        issueCatalog.screen_damage,
        issueCatalog.battery_issue,
        issueCatalog.charging_port_issue,
        issueCatalog.back_glass_damage,
        issueCatalog.camera_issue,
        issueCatalog.other_issue,
      ],
      android: [
        issueCatalog.screen_damage,
        issueCatalog.battery_issue,
        issueCatalog.charging_port_issue,
        issueCatalog.audio_issue,
        issueCatalog.camera_issue,
        issueCatalog.other_issue,
      ],
      tablet: [
        issueCatalog.screen_damage,
        issueCatalog.generic_charging_issue,
        issueCatalog.battery_issue,
        issueCatalog.digitizer_touch_issue,
        issueCatalog.software_issue,
        issueCatalog.other_issue,
      ],
      laptop: [
        issueCatalog.no_power,
        issueCatalog.keyboard_issue,
        issueCatalog.generic_screen_issue,
        issueCatalog.generic_charging_issue,
        issueCatalog.overheating,
        issueCatalog.other_issue,
      ],
      console: [
        issueCatalog.hdmi_port_issue,
        issueCatalog.no_power,
        issueCatalog.disc_drive_issue,
        issueCatalog.overheating,
        issueCatalog.controller_sync_issue,
        issueCatalog.other_issue,
      ],
      desktop: [
        issueCatalog.no_power,
        issueCatalog.no_display,
        issueCatalog.storage_boot_issue,
        issueCatalog.overheating,
        issueCatalog.upgrade_build_service,
        issueCatalog.other_issue,
      ],
      other: [
        issueCatalog.general_diagnostic,
        issueCatalog.no_power,
        issueCatalog.software_issue,
        issueCatalog.connectivity_issue,
        issueCatalog.other_issue,
      ],
    },
  };

  const state = {
    step: 1,
    device: null,
    model: null,
    androidBrand: null,
    tabletType: null,
    modelCustom: '',
    issues: [],
    issueCustom: '',
  };
  const quoteStateStorageKey = 'electrode-repairs.quote-widget.v1';
  let isRestoringQuoteState = false;

  if (quoteWidgetShell) {
    const setWidgetEngaged = () => {
      quoteWidgetShell.classList.add('is-engaged');
    };

    const clearWidgetEngaged = (target) => {
      if (!quoteWidgetShell.contains(target)) {
        quoteWidgetShell.classList.remove('is-engaged');
      }
    };

    quoteWidgetShell.addEventListener('pointerdown', setWidgetEngaged);
    quoteWidgetShell.addEventListener('focusin', setWidgetEngaged);

    document.addEventListener('pointerdown', (event) => {
      clearWidgetEngaged(event.target);
    });

    document.addEventListener('focusin', (event) => {
      clearWidgetEngaged(event.target);
    });
  }

  function makeChoiceButton({ label, image, imageFallback = '', group, key, isOther = false, showImage = true }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quote-choice';
    button.dataset.group = group;
    button.dataset.value = label;
    button.dataset.key = key;
    button.dataset.other = String(isOther);
    button.innerHTML = showImage
      ? `
      <span class="quote-choice-media"><img src="${image}" alt="" loading="lazy" decoding="async" /></span>
      <span class="quote-choice-label">${label}</span>
    `
      : `
      <span class="quote-choice-label">${label}</span>
    `;
    if (showImage) {
      const imageElement = button.querySelector('img');
      if (imageElement && imageFallback && imageFallback !== image) {
        imageElement.addEventListener('error', () => {
          if (imageElement.dataset.fallbackApplied === 'true') {
            return;
          }
          imageElement.dataset.fallbackApplied = 'true';
          imageElement.src = imageFallback;
        });
      }
    }
    if (!showImage) {
      button.classList.add('quote-choice-text-only');
    }
    if (isOther) {
      button.classList.add('quote-choice-other');
    }
    return button;
  }

  function updateModelContextImage() {
    if (!modelContextImage) {
      return;
    }
    if (!state.device) {
      modelContextImage.src = '';
      modelContextImage.alt = '';
      return;
    }

    let src = deviceImagePath(state.device.key);
    let fallbackSrc = deviceFallbackPath(state.device.key);
    let alt = `${state.device.label} model category preview`;

    if (state.device.key === 'other') {
      src = imagePath('devices', 'other');
      fallbackSrc = src;
    }

    modelContextImage.dataset.fallbackSrc = fallbackSrc;
    modelContextImage.onerror = () => {
      const fallback = modelContextImage.dataset.fallbackSrc;
      if (!fallback || modelContextImage.dataset.fallbackApplied === 'true') {
        return;
      }
      modelContextImage.dataset.fallbackApplied = 'true';
      modelContextImage.src = fallback;
    };
    modelContextImage.dataset.fallbackApplied = 'false';
    modelContextImage.src = src;
    modelContextImage.alt = alt;
  }

  function renderDevices() {
    deviceGrid.textContent = '';
    quoteData.devices.forEach((device) => {
      const button = makeChoiceButton({
        label: device.label,
        image: device.image,
        imageFallback: deviceFallbackPath(device.key),
        group: 'device',
        key: device.key,
        isOther: device.key === 'other',
      });
      if (state.device?.key === device.key) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        state.device = device;
        state.model = null;
        state.androidBrand = null;
        state.tabletType = null;
        state.modelCustom = '';
        state.issues = [];
        state.issueCustom = '';
        renderDevices();
        renderModels();
        renderIssues();
        goToStep(2);
      });
      deviceGrid.appendChild(button);
    });
  }

  function renderModels() {
    modelGrid.textContent = '';
    updateModelContextImage();
    if (!state.device) {
      modelTitle.textContent = 'Choose Model';
      modelCustomWrap.hidden = true;
      return;
    }

    const isAndroid = state.device.key === 'android';
    const isTablet = state.device.key === 'tablet';
    if (isAndroid && !state.androidBrand) {
      modelTitle.textContent = 'Choose Android Brand';
      const brandList = quoteData.models.android;
      brandList.forEach((brand) => {
        const isOther = Boolean(brand.other);
        const image = imagePath('models', brand.key);
        const button = makeChoiceButton({
          label: brand.label,
          image,
          group: 'android-brand',
          key: brand.key,
          isOther,
          showImage: false,
        });
        if (state.androidBrand === brand.key) {
          button.classList.add('is-selected');
        }
        button.addEventListener('click', () => {
          state.androidBrand = brand.key;
          state.model = null;
          state.modelCustom = '';
          state.issues = [];
          state.issueCustom = '';
          modelCustomInput.value = '';
          issueCustomInput.value = '';
          renderModels();
          renderIssues();
          persistQuoteState();
        });
        modelGrid.appendChild(button);
      });
      modelCustomWrap.hidden = true;
      return;
    }

    if (isTablet && !state.tabletType) {
      modelTitle.textContent = 'Choose Tablet Type';
      const tabletTypeList = quoteData.models.tablet;
      tabletTypeList.forEach((tabletType) => {
        const isOther = Boolean(tabletType.other);
        const button = makeChoiceButton({
          label: tabletType.label,
          image: '',
          group: 'tablet-type',
          key: tabletType.key,
          isOther,
          showImage: false,
        });
        if (state.tabletType === tabletType.key) {
          button.classList.add('is-selected');
        }
        button.addEventListener('click', () => {
          state.tabletType = tabletType.key;
          state.model = null;
          state.modelCustom = '';
          state.issues = [];
          state.issueCustom = '';
          modelCustomInput.value = '';
          issueCustomInput.value = '';
          renderModels();
          renderIssues();
          persistQuoteState();
        });
        modelGrid.appendChild(button);
      });
      modelCustomWrap.hidden = true;
      return;
    }

    modelTitle.textContent = isTablet && state.tabletType === 'tablet-ipad' ? 'Choose iPad Model' : 'Choose Model';
    const modelList = isAndroid
      ? quoteData.androidModels[state.androidBrand] || []
      : isTablet
        ? quoteData.tabletModels[state.tabletType] || []
        : quoteData.models[state.device.key] || [];
    modelList.forEach((model, index) => {
      const isOther = Boolean(model.other);
      const button = makeChoiceButton({
        label: model.label,
        image: '',
        group: 'model',
        key: model.key,
        isOther,
        showImage: false,
      });
      if (state.model?.key === model.key) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        state.model = { ...model, id: isOther ? '000' : String(index + 1) };
        if (!isOther) {
          state.modelCustom = '';
          modelCustomInput.value = '';
        }
        modelCustomWrap.hidden = !isOther;
        if (isOther) {
          modelCustomInput.focus();
        }
        renderModels();
        renderIssues();
        persistQuoteState();
      });
      modelGrid.appendChild(button);
    });
    modelCustomWrap.hidden = !(state.model && state.model.other);
  }

  function renderIssues() {
    issueGrid.textContent = '';
    const issueList = state.device ? quoteData.issues[state.device.key] || [] : [];
    issueList.forEach((issue, index) => {
      const isOther = Boolean(issue.other);
      const image = imagePath('issues', issue.key);
      const button = makeChoiceButton({ label: issue.label, image, group: 'issue', key: issue.key, isOther });
      if (state.issues.some((currentIssue) => currentIssue.key === issue.key)) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        const exists = state.issues.some((currentIssue) => currentIssue.key === issue.key);
        if (exists) {
          state.issues = state.issues.filter((currentIssue) => currentIssue.key !== issue.key);
          if (isOther) {
            state.issueCustom = '';
            issueCustomInput.value = '';
          }
        } else {
          state.issues.push({ ...issue, id: isOther ? '000' : String(index + 1) });
        }
        issueCustomWrap.hidden = !state.issues.some((currentIssue) => currentIssue.other);
        if (!issueCustomWrap.hidden) {
          issueCustomInput.focus();
        }
        renderIssues();
        persistQuoteState();
      });
      issueGrid.appendChild(button);
    });
    issueCustomWrap.hidden = !state.issues.some((currentIssue) => currentIssue.other);
  }

  function getModelListForCurrentSelection() {
    if (!state.device) {
      return [];
    }
    if (state.device.key === 'android') {
      return quoteData.androidModels[state.androidBrand] || [];
    }
    if (state.device.key === 'tablet') {
      return quoteData.tabletModels[state.tabletType] || [];
    }
    return quoteData.models[state.device.key] || [];
  }

  function getIssueListForCurrentSelection() {
    if (!state.device) {
      return [];
    }
    return quoteData.issues[state.device.key] || [];
  }

  function clearPersistedQuoteState() {
    try {
      window.sessionStorage.removeItem(quoteStateStorageKey);
    } catch {
      // Ignore storage access errors in restricted/private contexts.
    }
  }

  function persistQuoteState() {
    if (isRestoringQuoteState) {
      return;
    }

    const selectedMedium = modernQuoteForm.querySelector('input[name="medium"]:checked');
    const payload = {
      version: 1,
      savedAt: Date.now(),
      step: state.step,
      deviceKey: state.device?.key || null,
      androidBrand: state.androidBrand,
      tabletType: state.tabletType,
      modelKey: state.model?.key || null,
      modelCustom: state.modelCustom || '',
      issueKeys: state.issues.map((issue) => issue.key),
      issueCustom: state.issueCustom || '',
      medium: selectedMedium?.value || 'sms',
    };

    try {
      window.sessionStorage.setItem(quoteStateStorageKey, JSON.stringify(payload));
    } catch {
      // Ignore storage quota/access errors.
    }
  }

  function goToStep(nextStep) {
    state.step = Math.min(5, Math.max(1, nextStep));
    panels.forEach((panel, index) => {
      const isActive = index + 1 === state.step;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });
    indicators.forEach((indicator, index) => {
      const indicatorStep = index + 1;
      indicator.classList.toggle('is-active', indicatorStep === state.step);
      indicator.classList.toggle('is-done', indicatorStep < state.step);
    });
    backBtn.disabled = state.step === 1;
    backBtn.hidden = state.step === 1;
    nextBtn.hidden = state.step === 5;
    if (nav) {
      nav.hidden = state.step === 5;
      nav.style.display = state.step === 5 ? 'none' : 'flex';
    }
    persistQuoteState();
  }

  function scrollWidgetToTop() {
    if (!quoteWidgetShell) {
      return;
    }
    const scrollTarget = document.getElementById('instant-quote') || quoteWidgetShell;
    const stickyHeader = document.querySelector('.simple-header, .legal-header');
    const headerHeight = stickyHeader instanceof HTMLElement ? stickyHeader.getBoundingClientRect().height : 0;
    const topOffset = headerHeight + 12;
    const targetTop = window.scrollY + scrollTarget.getBoundingClientRect().top - topOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }

  function validateStep(step) {
    if (step === 1) {
      return Boolean(state.device);
    }
    if (step === 2) {
      if (state.device?.key === 'android' && !state.androidBrand) {
        return false;
      }
      if (state.device?.key === 'tablet' && !state.tabletType) {
        return false;
      }
      if (!state.model) {
        return false;
      }
      if (state.model.other) {
        state.modelCustom = modelCustomInput.value.trim();
        return state.modelCustom.length > 1;
      }
      return true;
    }
    if (step === 3) {
      if (state.issues.length === 0) {
        return false;
      }
      if (state.issues.some((issue) => issue.other)) {
        state.issueCustom = issueCustomInput.value.trim();
        return state.issueCustom.length > 1;
      }
      return true;
    }
    if (step === 4) {
      const requiredFields = [
        document.getElementById('quote-name'),
        document.getElementById('quote-email'),
        document.getElementById('quote-phone'),
      ];
      return requiredFields.every((field) => field && field.checkValidity());
    }
    return true;
  }

  function showValidationMessage(step) {
    if (step === 4) {
      modernQuoteForm.reportValidity();
      return;
    }
    if (step === 2 && state.model && state.model.other) {
      modelCustomInput.focus();
      return;
    }
    if (step === 3 && state.issues.some((issue) => issue.other)) {
      issueCustomInput.focus();
      return;
    }
    submitStatus.hidden = false;
    submitStatus.textContent = 'Please complete this step before continuing.';
  }

  function updateReview() {
    const selectedMedium = modernQuoteForm.querySelector('input[name="medium"]:checked');
    const modelDisplay = state.model?.other ? state.modelCustom : state.model?.label || '-';
    const issueLabels = state.issues.map((issue) => (issue.other ? state.issueCustom : issue.label)).filter(Boolean);

    reviewDevice.textContent = state.device ? state.device.label : '-';
    reviewModel.textContent = modelDisplay || '-';
    reviewIssue.textContent = issueLabels.join(', ') || '-';
    reviewMedium.textContent = selectedMedium ? selectedMedium.parentElement.textContent.trim() : '-';
  }

  function syncHiddenFields() {
    const modelLabel = state.model?.other ? state.modelCustom : state.model?.label || '';
    const issueLabel = state.issues
      .map((issue) => (issue.other ? state.issueCustom : issue.label))
      .filter(Boolean)
      .join(', ');
    const issueIds = state.issues.map((issue) => issue.id).join(',');

    hiddenDeviceName.value = state.device ? state.device.label : '';
    hiddenDeviceId.value = state.device ? state.device.id : '';
    hiddenModelName.value = modelLabel;
    hiddenIssueName.value = issueLabel;
    hiddenModelId.value = state.model ? state.model.id : '000';
    hiddenIssueId.value = issueIds || '000';
    hiddenModelInput.value = state.modelCustom || modelLabel;
  }

  function getMaxRestorableStep() {
    let maxStep = 1;

    if (validateStep(1)) {
      maxStep = 2;
    } else {
      return maxStep;
    }

    if (validateStep(2)) {
      maxStep = 3;
    } else {
      return maxStep;
    }

    if (validateStep(3)) {
      maxStep = 4;
    } else {
      return maxStep;
    }

    if (validateStep(4)) {
      maxStep = 5;
    }

    return maxStep;
  }

  function restoreQuoteState() {
    let savedState;
    try {
      const raw = window.sessionStorage.getItem(quoteStateStorageKey);
      if (!raw) {
        return false;
      }
      savedState = JSON.parse(raw);
    } catch {
      clearPersistedQuoteState();
      return false;
    }

    if (!savedState || typeof savedState !== 'object' || savedState.version !== 1) {
      clearPersistedQuoteState();
      return false;
    }

    const restoredDevice = quoteData.devices.find((device) => device.key === savedState.deviceKey) || null;
    if (!restoredDevice) {
      clearPersistedQuoteState();
      return false;
    }

    isRestoringQuoteState = true;
    let wasRestored = false;

    try {
      state.device = restoredDevice;
      state.androidBrand = null;
      state.tabletType = null;
      state.model = null;
      state.modelCustom = '';
      state.issues = [];
      state.issueCustom = '';

      if (state.device.key === 'android') {
        const brandExists = quoteData.models.android.some((brand) => brand.key === savedState.androidBrand);
        if (brandExists) {
          state.androidBrand = savedState.androidBrand;
        }
      }

      if (state.device.key === 'tablet') {
        const tabletTypeExists = quoteData.models.tablet.some((tabletType) => tabletType.key === savedState.tabletType);
        if (tabletTypeExists) {
          state.tabletType = savedState.tabletType;
        }
      }

      const modelList = getModelListForCurrentSelection();
      const modelIndex = modelList.findIndex((model) => model.key === savedState.modelKey);
      if (modelIndex >= 0) {
        const restoredModel = modelList[modelIndex];
        state.model = { ...restoredModel, id: restoredModel.other ? '000' : String(modelIndex + 1) };
        if (restoredModel.other && typeof savedState.modelCustom === 'string') {
          state.modelCustom = savedState.modelCustom.trim();
        }
      }

      const issueList = getIssueListForCurrentSelection();
      if (Array.isArray(savedState.issueKeys)) {
        state.issues = savedState.issueKeys
          .map((issueKey) => {
            const issueIndex = issueList.findIndex((issue) => issue.key === issueKey);
            if (issueIndex < 0) {
              return null;
            }
            const issue = issueList[issueIndex];
            return { ...issue, id: issue.other ? '000' : String(issueIndex + 1) };
          })
          .filter(Boolean);
      }

      if (
        state.issues.some((issue) => issue.other) &&
        typeof savedState.issueCustom === 'string' &&
        savedState.issueCustom.trim().length > 0
      ) {
        state.issueCustom = savedState.issueCustom.trim();
      }

      const savedMedium =
        savedState.medium === 'sms' || savedState.medium === 'call' || savedState.medium === 'email'
          ? savedState.medium
          : null;
      if (savedMedium) {
        const mediumInput = modernQuoteForm.querySelector(`input[name="medium"][value="${savedMedium}"]`);
        if (mediumInput instanceof HTMLElement) {
          mediumInput.checked = true;
        }
      }

      modelCustomInput.value = state.modelCustom;
      issueCustomInput.value = state.issueCustom;

      renderDevices();
      renderModels();
      renderIssues();

      const requestedStep = Number.isFinite(savedState.step) ? Math.trunc(savedState.step) : 1;
      const maxRestorableStep = getMaxRestorableStep();
      const restoredStep = Math.min(Math.max(1, requestedStep), maxRestorableStep);
      goToStep(restoredStep);
      wasRestored = true;
      return true;
    } finally {
      isRestoringQuoteState = false;
      if (wasRestored) {
        persistQuoteState();
      }
    }
  }

  function nextStep() {
    submitStatus.hidden = true;
    if (!validateStep(state.step)) {
      showValidationMessage(state.step);
      return;
    }
    if (state.step === 4) {
      updateReview();
    }
    goToStep(state.step + 1);
    scrollWidgetToTop();
  }

  backBtn.addEventListener('click', () => {
    submitStatus.hidden = true;
    goToStep(state.step - 1);
    scrollWidgetToTop();
  });

  finalBackBtn?.addEventListener('click', () => {
    submitStatus.hidden = true;
    goToStep(state.step - 1);
    scrollWidgetToTop();
  });

  nextBtn.addEventListener('click', nextStep);

  modelCustomInput.addEventListener('input', () => {
    state.modelCustom = modelCustomInput.value.trim();
    persistQuoteState();
  });

  issueCustomInput.addEventListener('input', () => {
    state.issueCustom = issueCustomInput.value.trim();
    persistQuoteState();
  });

  modernQuoteForm.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('input[name="medium"]')) {
      persistQuoteState();
    }
  });

  modernQuoteForm.addEventListener('submit', (event) => {
    if (state.step !== 5) {
      event.preventDefault();
      return;
    }
    syncHiddenFields();
    submitStatus.hidden = false;
    submitStatus.textContent = 'Submitting quote request...';
  });

  const submitFrame = document.querySelector('iframe[name="modern-quote-submit-frame"]');
  submitFrame?.addEventListener('load', () => {
    submitStatus.hidden = false;
    submitStatus.textContent = 'Quote request submitted. Our team will follow up shortly.';
    clearPersistedQuoteState();
  });

  if (!restoreQuoteState()) {
    renderDevices();
    renderModels();
    renderIssues();
    goToStep(1);
  }
}
