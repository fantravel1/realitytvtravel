/**
 * RealityTVTravel - Main Application JavaScript
 */

// ============================================
// Data Loading
// ============================================

async function loadData(filename) {
  try {
    const response = await fetch(`_data/${filename}`);
    if (!response.ok) throw new Error(`Failed to load ${filename}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Scroll handler for nav styling
  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial state

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
}

// ============================================
// Counter Animation
// ============================================

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(start + (target - start) * easeOut);

          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + '+';
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ============================================
// FAQ Accordion
// ============================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

// ============================================
// Show Cards
// ============================================

const showEmojis = {
  'the-bachelor': '🌹',
  'love-is-blind': '💍',
  'too-hot-to-handle': '🔥',
  'love-island-usa': '🏝️',
  'bachelor-in-paradise': '🌴'
};

function createShowCard(show) {
  const emoji = showEmojis[show.id] || '📺';

  return `
    <a href="show.html?id=${show.id}" class="show-card">
      <div class="show-card-image">
        <span class="show-card-network">${show.network}</span>
        <span class="show-card-emoji">${emoji}</span>
      </div>
      <div class="show-card-body">
        <h3 class="show-card-title">${show.name}</h3>
        <p class="show-card-meta">${show.seasons} Seasons • ${show.destinations?.length || 0} Locations</p>
        <p class="show-card-description">${show.description}</p>
      </div>
    </a>
  `;
}

async function loadShowsGrid() {
  const grid = document.getElementById('shows-grid');
  if (!grid) return;

  const data = await loadData('shows.json');
  if (!data || !data.shows) return;

  grid.innerHTML = data.shows.map(show => createShowCard(show)).join('');
}

// ============================================
// Location Cards
// ============================================

const locationEmojis = {
  'bachelor-mansion': '🏰',
  'playa-escondida-resort': '🏖️',
  'emerald-pavilion': '🌴'
};

function formatPrice(priceRange) {
  if (!priceRange) return '';
  const { min, currency, unit } = priceRange;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(min);
  return `${formatted}/${unit}`;
}

function createLocationCard(location, shows) {
  const emoji = locationEmojis[location.id] || '📍';
  const showNames = location.shows?.map(showId => {
    const show = shows?.find(s => s.id === showId);
    return show?.name || showId;
  }).join(', ') || '';

  return `
    <div class="location-card">
      <div class="location-card-image">
        <div class="location-card-badges">
          ${location.bookable ? '<span class="badge badge-bookable">Bookable</span>' : ''}
          ${showNames ? `<span class="badge badge-show">${showNames}</span>` : ''}
        </div>
        <span class="location-card-emoji">${emoji}</span>
      </div>
      <div class="location-card-body">
        <h3 class="location-card-title">${location.name}</h3>
        <p class="location-card-location">
          <span>📍</span>
          ${location.city}, ${location.country}
        </p>
        ${location.priceRange ? `
          <div class="location-card-price">
            <span class="price-label">From</span>
            <span class="price-value">${formatPrice(location.priceRange).split('/')[0]}</span>
            <span class="price-unit">/${location.priceRange.unit}</span>
          </div>
        ` : ''}
        <div class="location-card-cta">
          <a href="location.html?id=${location.id}" class="btn btn-primary">View Details</a>
        </div>
      </div>
    </div>
  `;
}

async function loadLocationsGrid() {
  const grid = document.getElementById('locations-grid');
  if (!grid) return;

  const [locationsData, showsData] = await Promise.all([
    loadData('locations.json'),
    loadData('shows.json')
  ]);

  if (!locationsData || !locationsData.locations) return;

  grid.innerHTML = locationsData.locations
    .map(location => createLocationCard(location, showsData?.shows))
    .join('');
}

// ============================================
// Shows Page
// ============================================

async function loadShowsPage() {
  const grid = document.getElementById('all-shows-grid');
  if (!grid) return;

  const data = await loadData('shows.json');
  if (!data || !data.shows) {
    grid.innerHTML = '<p>Failed to load shows.</p>';
    return;
  }

  grid.innerHTML = data.shows.map(show => createShowCard(show)).join('');
}

// ============================================
// Locations Page
// ============================================

async function loadLocationsPage() {
  const grid = document.getElementById('all-locations-grid');
  if (!grid) return;

  const [locationsData, showsData] = await Promise.all([
    loadData('locations.json'),
    loadData('shows.json')
  ]);

  if (!locationsData || !locationsData.locations) {
    grid.innerHTML = '<p>Failed to load locations.</p>';
    return;
  }

  grid.innerHTML = locationsData.locations
    .map(location => createLocationCard(location, showsData?.shows))
    .join('');
}

// ============================================
// Show Detail Page
// ============================================

async function loadShowDetail() {
  const container = document.getElementById('show-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const showId = params.get('id');

  if (!showId) {
    container.innerHTML = '<p>Show not found.</p>';
    return;
  }

  const [showsData, locationsData] = await Promise.all([
    loadData('shows.json'),
    loadData('locations.json')
  ]);

  const show = showsData?.shows?.find(s => s.id === showId);

  if (!show) {
    container.innerHTML = '<p>Show not found.</p>';
    return;
  }

  const emoji = showEmojis[show.id] || '📺';

  // Get locations for this show
  const showLocations = locationsData?.locations?.filter(loc =>
    loc.shows?.includes(show.id)
  ) || [];

  document.title = `${show.name} Filming Locations | RealityTVTravel`;

  container.innerHTML = `
    <div class="detail-header">
      <div class="container">
        <div class="detail-breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="shows.html">Shows</a>
          <span>›</span>
          ${show.name}
        </div>
        <div class="detail-grid">
          <div class="detail-main">
            <div style="font-size: 4rem; margin-bottom: var(--space-md);">${emoji}</div>
            <h1>${show.name}</h1>
            <div class="detail-meta">
              <span><strong>${show.network}</strong></span>
              <span>${show.seasons} Seasons</span>
              <span>${show.destinations?.length || 0} Locations</span>
            </div>
            <p class="detail-description">${show.description}</p>
          </div>
          <div class="detail-sidebar">
            <div style="text-align: center; margin-bottom: var(--space-lg);">
              <span class="badge badge-show" style="font-size: 1rem; padding: var(--space-sm) var(--space-md);">${show.status === 'active' ? 'Currently Airing' : 'Completed'}</span>
            </div>
            <div class="sidebar-cta">
              <a href="locations.html" class="btn btn-primary">Browse Locations</a>
              <a href="shows.html" class="btn btn-outline">All Shows</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        ${showLocations.length > 0 ? `
          <div class="detail-section">
            <h2>Filming Locations</h2>
            <div class="locations-grid">
              ${showLocations.map(loc => createLocationCard(loc, showsData?.shows)).join('')}
            </div>
          </div>
        ` : ''}

        ${show.faqs?.length > 0 ? `
          <div class="detail-section">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-grid">
              ${show.faqs.map(faq => `
                <div class="faq-item">
                  <button class="faq-question">
                    <span>${faq.question}</span>
                    <span class="faq-icon">+</span>
                  </button>
                  <div class="faq-answer">
                    <p>${faq.answer}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Reinitialize FAQ after dynamic content load
  initFAQ();
}

// ============================================
// Location Detail Page
// ============================================

async function loadLocationDetail() {
  const container = document.getElementById('location-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const locationId = params.get('id');

  if (!locationId) {
    container.innerHTML = '<p>Location not found.</p>';
    return;
  }

  const [locationsData, showsData] = await Promise.all([
    loadData('locations.json'),
    loadData('shows.json')
  ]);

  const location = locationsData?.locations?.find(l => l.id === locationId);

  if (!location) {
    container.innerHTML = '<p>Location not found.</p>';
    return;
  }

  const emoji = locationEmojis[location.id] || '📍';
  const showNames = location.shows?.map(showId => {
    const show = showsData?.shows?.find(s => s.id === showId);
    return show?.name || showId;
  }) || [];

  document.title = `${location.name} | RealityTVTravel`;

  const amenityEmojis = {
    'pool': '🏊',
    'infinity-pool': '🏊',
    'spa': '💆',
    'beach-access': '🏖️',
    'restaurant': '🍽️',
    'bar': '🍹',
    'chef-available': '👨‍🍳',
    'private-chef': '👨‍🍳',
    'butler-service': '🎩',
    'gym': '💪',
    'yoga': '🧘',
    'surf-lessons': '🏄',
    'home-theater': '🎬',
    'wine-cellar': '🍷',
    'event-space': '🎉',
    '10-acres': '🌳',
    'mountain-views': '⛰️'
  };

  container.innerHTML = `
    <div class="detail-header">
      <div class="container">
        <div class="detail-breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="locations.html">Locations</a>
          <span>›</span>
          ${location.name}
        </div>
        <div class="detail-grid">
          <div class="detail-main">
            <div style="font-size: 4rem; margin-bottom: var(--space-md);">${emoji}</div>
            <h1>${location.name}</h1>
            <div class="detail-meta">
              <span>📍 ${location.city}, ${location.country}</span>
              ${showNames.length > 0 ? `<span>📺 ${showNames.join(', ')}</span>` : ''}
            </div>
            <p class="detail-description">${location.address}</p>
          </div>
          <div class="detail-sidebar">
            ${location.priceRange ? `
              <div class="sidebar-price">
                <span class="sidebar-price-label">Starting from</span>
                <div>
                  <span class="sidebar-price-value">${formatPrice(location.priceRange).split('/')[0]}</span>
                  <span class="sidebar-price-unit">/${location.priceRange.unit}</span>
                </div>
              </div>
            ` : ''}
            <div class="sidebar-cta">
              ${location.bookable ? `
                <a href="${location.bookingUrl || '#'}" class="btn btn-primary" ${location.bookingUrl ? 'target="_blank" rel="noopener"' : ''}>
                  Book Now
                </a>
              ` : ''}
              <a href="locations.html" class="btn btn-outline">All Locations</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        ${location.amenities?.length > 0 ? `
          <div class="detail-section">
            <h2>Amenities</h2>
            <div class="amenities-grid">
              ${location.amenities.map(amenity => `
                <div class="amenity">
                  <span>${amenityEmojis[amenity] || '✨'}</span>
                  <span>${amenity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${location.featuredSeasons?.length > 0 ? `
          <div class="detail-section">
            <h2>Featured Seasons</h2>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-md);">
              ${location.featuredSeasons.map(fs => {
                const show = showsData?.shows?.find(s => s.id === fs.show);
                return `
                  <div style="background: var(--color-gray-50); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md);">
                    <strong>${show?.name || fs.show}</strong>
                    <div style="font-size: 0.875rem; color: var(--color-gray-500);">
                      Seasons ${fs.seasons.join(', ')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${location.faqs?.length > 0 ? `
          <div class="detail-section">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-grid">
              ${location.faqs.map(faq => `
                <div class="faq-item">
                  <button class="faq-question">
                    <span>${faq.question}</span>
                    <span class="faq-icon">+</span>
                  </button>
                  <div class="faq-answer">
                    <p>${faq.answer}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Reinitialize FAQ after dynamic content load
  initFAQ();
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSmoothScroll();
  animateCounters();
  initFAQ();

  // Load dynamic content based on page
  loadShowsGrid();
  loadLocationsGrid();
  loadShowsPage();
  loadLocationsPage();
  loadShowDetail();
  loadLocationDetail();
});
