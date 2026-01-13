/**
 * RealityTVTravel - Main Application JavaScript
 */

// ============================================
// Data Loading
// ============================================

let showsData = null;
let locationsData = null;

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

async function initData() {
  [showsData, locationsData] = await Promise.all([
    loadData('shows.json'),
    loadData('locations.json')
  ]);
  return { showsData, locationsData };
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function handleScroll() {
    if (window.scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

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
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(target * easeOut);

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
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
      });
    }
  });
}

// ============================================
// Emojis & Formatting
// ============================================

const showEmojis = {
  'the-bachelor': '🌹',
  'the-bachelorette': '🌹',
  'love-is-blind': '💍',
  'too-hot-to-handle': '🔥',
  'love-island-usa': '🏝️',
  'bachelor-in-paradise': '🌴',
  'perfect-match': '💘',
  'the-ultimatum': '💔',
  'temptation-island': '🍎',
  'fboy-island': '🏖️'
};

const locationEmojis = {
  'bachelor-mansion': '🏰',
  'playa-escondida-resort': '🏖️',
  'emerald-pavilion': '🌴',
  'casa-tau': '🏠',
  'grand-velas-riviera-maya': '🏨',
  'andaz-maui': '🌺',
  'sheraton-fiji': '🐚',
  'azura-beach-resort': '🌊'
};

const networkColors = {
  'ABC': { bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', accent: '#f4d03f' },
  'Netflix': { bg: 'linear-gradient(135deg, #1a0000 0%, #2d0000 100%)', accent: '#e50914' },
  'Peacock': { bg: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', accent: '#00d4aa' },
  'HBO Max': { bg: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', accent: '#b17acc' },
  'USA Network': { bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)', accent: '#2980b9' }
};

// Trending shows for badges
const trendingShows = ['love-is-blind', 'too-hot-to-handle', 'the-bachelor'];
const newShows = ['perfect-match', 'fboy-island'];

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

// ============================================
// Show Cards
// ============================================

function createShowCard(show) {
  const emoji = showEmojis[show.id] || '📺';
  const colors = networkColors[show.network] || networkColors['ABC'];
  const isTrending = trendingShows.includes(show.id);
  const isNew = newShows.includes(show.id);

  return `
    <a href="show.html?id=${show.id}" class="show-card">
      <div class="show-card-image" style="background: ${colors.bg}">
        <span class="show-card-network" style="color: ${colors.accent}">${show.network}</span>
        ${isTrending ? '<span class="badge badge-trending">🔥 Trending</span>' : ''}
        ${isNew ? '<span class="badge badge-new">✨ New</span>' : ''}
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

function createSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-card-image"></div>
      <div class="skeleton-card-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  `;
}

async function loadShowsGrid() {
  const grid = document.getElementById('shows-grid');
  if (!grid) return;

  // Show skeletons while loading
  grid.innerHTML = Array(6).fill(createSkeletonCard()).join('');

  const data = showsData || await loadData('shows.json');
  if (!data?.shows) {
    grid.innerHTML = '<p class="error-message">Failed to load shows.</p>';
    return;
  }

  // Only show first 6 on homepage
  grid.innerHTML = data.shows.slice(0, 6).map(show => createShowCard(show)).join('');
}

// ============================================
// Location Cards
// ============================================

function createLocationCard(location, shows) {
  const emoji = locationEmojis[location.id] || '📍';
  const showNames = location.shows?.map(showId => {
    const show = shows?.find(s => s.id === showId);
    return show?.name || showId;
  }).slice(0, 2).join(', ') || '';

  const categoryColors = {
    'mansion': 'linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%)',
    'luxury-villa': 'linear-gradient(135deg, #1a1a2e 0%, #4a3728 100%)',
    'beach-resort': 'linear-gradient(135deg, #0f4c5c 0%, #1a7f8e 100%)',
    'all-inclusive': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    'luxury-resort': 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)'
  };

  const bgStyle = categoryColors[location.category] || 'var(--gradient-hero)';

  return `
    <div class="location-card" data-country="${location.country}" data-price="${location.priceRange?.min || 0}">
      <div class="location-card-image" style="background: ${bgStyle}">
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
        ${location.highlights ? `
          <div class="location-card-highlights">
            ${location.highlights.slice(0, 2).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
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

  // Show skeletons while loading
  grid.innerHTML = Array(4).fill(createSkeletonCard()).join('');

  await initData();
  if (!locationsData?.locations) {
    grid.innerHTML = '<p class="error-message">Failed to load locations.</p>';
    return;
  }

  // Show first 4 on homepage
  grid.innerHTML = locationsData.locations
    .slice(0, 4)
    .map(location => createLocationCard(location, showsData?.shows))
    .join('');
}

// ============================================
// Shows Page with Search & Filters
// ============================================

async function loadShowsPage() {
  const grid = document.getElementById('all-shows-grid');
  const searchInput = document.getElementById('show-search');
  const filterBtns = document.querySelectorAll('.filter-btn[data-network]');

  if (!grid) return;

  await initData();
  if (!showsData?.shows) {
    grid.innerHTML = '<p class="error-message">Failed to load shows.</p>';
    return;
  }

  let currentFilter = 'all';
  let searchQuery = '';

  function renderShows() {
    let filtered = showsData.shows;

    // Apply network filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(show => show.network === currentFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(show =>
        show.name.toLowerCase().includes(query) ||
        show.network.toLowerCase().includes(query) ||
        show.description.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="no-results">No shows found matching your criteria.</p>';
    } else {
      grid.innerHTML = filtered.map(show => createShowCard(show)).join('');
    }
  }

  // Search handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderShows();
    });
  }

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.network;
      renderShows();
    });
  });

  renderShows();
}

// ============================================
// Locations Page with Search & Filters
// ============================================

async function loadLocationsPage() {
  const grid = document.getElementById('all-locations-grid');
  const searchInput = document.getElementById('location-search');
  const filterBtns = document.querySelectorAll('.filter-btn[data-country]');
  const sortSelect = document.getElementById('sort-locations');

  if (!grid) return;

  await initData();
  if (!locationsData?.locations) {
    grid.innerHTML = '<p class="error-message">Failed to load locations.</p>';
    return;
  }

  let currentFilter = 'all';
  let searchQuery = '';
  let sortBy = 'name';

  function renderLocations() {
    let filtered = [...locationsData.locations];

    // Apply country filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(loc => loc.country === currentFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(query) ||
        loc.city.toLowerCase().includes(query) ||
        loc.country.toLowerCase().includes(query) ||
        loc.shows?.some(s => s.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.priceRange?.min || 0) - (b.priceRange?.min || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.priceRange?.min || 0) - (a.priceRange?.min || 0));
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="no-results">No locations found matching your criteria.</p>';
    } else {
      grid.innerHTML = filtered.map(loc => createLocationCard(loc, showsData?.shows)).join('');
    }
  }

  // Search handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderLocations();
    });
  }

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.country;
      renderLocations();
    });
  });

  // Sort handler
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderLocations();
    });
  }

  renderLocations();
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
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Show not found</h1><a href="shows.html" class="btn btn-primary">Browse Shows</a></div>';
    return;
  }

  await initData();
  const show = showsData?.shows?.find(s => s.id === showId);

  if (!show) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Show not found</h1><a href="shows.html" class="btn btn-primary">Browse Shows</a></div>';
    return;
  }

  const emoji = showEmojis[show.id] || '📺';
  const colors = networkColors[show.network] || networkColors['ABC'];
  const showLocations = locationsData?.locations?.filter(loc => loc.shows?.includes(show.id)) || [];

  document.title = `${show.name} Filming Locations | RealityTVTravel`;

  container.innerHTML = `
    <div class="detail-header" style="background: ${colors.bg}">
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
              <span style="color: ${colors.accent}; font-weight: 700;">${show.network}</span>
              <span>${show.seasons} Seasons</span>
              <span>Since ${show.yearStarted || 'N/A'}</span>
              <span>${show.status === 'active' ? '🟢 Active' : '⚫ Ended'}</span>
            </div>
            <p class="detail-description">${show.description}</p>
          </div>
          <div class="detail-sidebar">
            <div style="text-align: center; margin-bottom: var(--space-lg);">
              <div style="font-size: 3rem; margin-bottom: var(--space-sm);">${emoji}</div>
              <span class="badge ${show.status === 'active' ? 'badge-bookable' : 'badge-show'}" style="font-size: 0.875rem;">
                ${show.status === 'active' ? 'Currently Airing' : 'Completed Series'}
              </span>
            </div>
            <div class="sidebar-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-lg);">
              <div style="text-align: center; padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${show.seasons}</div>
                <div style="font-size: 0.75rem; color: var(--color-gray-500); text-transform: uppercase;">Seasons</div>
              </div>
              <div style="text-align: center; padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${showLocations.length}</div>
                <div style="font-size: 0.75rem; color: var(--color-gray-500); text-transform: uppercase;">Locations</div>
              </div>
            </div>
            <div class="sidebar-cta">
              <a href="locations.html" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-sm);">Browse Locations</a>
              <a href="shows.html" class="btn btn-outline" style="width: 100%;">All Shows</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        ${showLocations.length > 0 ? `
          <div class="detail-section">
            <h2>📍 Filming Locations</h2>
            <div class="locations-grid">
              ${showLocations.map(loc => createLocationCard(loc, showsData?.shows)).join('')}
            </div>
          </div>
        ` : '<div class="detail-section"><p>No bookable locations available for this show yet.</p></div>'}

        ${show.faqs?.length > 0 ? `
          <div class="detail-section">
            <h2>❓ Frequently Asked Questions</h2>
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
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Location not found</h1><a href="locations.html" class="btn btn-primary">Browse Locations</a></div>';
    return;
  }

  await initData();
  const location = locationsData?.locations?.find(l => l.id === locationId);

  if (!location) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Location not found</h1><a href="locations.html" class="btn btn-primary">Browse Locations</a></div>';
    return;
  }

  const emoji = locationEmojis[location.id] || '📍';
  const showNames = location.shows?.map(showId => {
    const show = showsData?.shows?.find(s => s.id === showId);
    return show?.name || showId;
  }) || [];

  document.title = `${location.name} | RealityTVTravel`;

  const amenityEmojis = {
    'pool': '🏊', 'infinity-pool': '🏊', 'spa': '💆', 'beach-access': '🏖️',
    'restaurant': '🍽️', 'bar': '🍹', 'chef-available': '👨‍🍳', 'private-chef': '👨‍🍳',
    'butler-service': '🎩', 'gym': '💪', 'yoga': '🧘', 'surf-lessons': '🏄',
    'home-theater': '🎬', 'wine-cellar': '🍷', 'event-space': '🎉', '10-acres': '🌳',
    'mountain-views': '⛰️', 'ocean-views': '🌊', 'tennis-court': '🎾', 'all-inclusive': '✨',
    'multiple-pools': '🏊', 'fine-dining': '🍷', 'fitness-center': '💪', 'kids-club': '👶',
    'water-sports': '🚤', 'snorkeling': '🤿', 'adults-only': '🔞', 'surfing': '🏄', 'luau': '🌺'
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
              ${location.bookable ? '<span>✅ Bookable</span>' : ''}
            </div>
            <p class="detail-description">${location.address}</p>
            ${location.highlights ? `
              <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-top: var(--space-md);">
                ${location.highlights.map(h => `<span class="badge badge-show">${h}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="detail-sidebar">
            ${location.priceRange ? `
              <div class="sidebar-price">
                <span class="sidebar-price-label">Starting from</span>
                <div>
                  <span class="sidebar-price-value">${formatPrice(location.priceRange).split('/')[0]}</span>
                  <span class="sidebar-price-unit">/${location.priceRange.unit}</span>
                </div>
                ${location.priceRange.max ? `<div style="font-size: 0.875rem; color: var(--color-gray-500);">Up to $${location.priceRange.max.toLocaleString()}/night</div>` : ''}
              </div>
            ` : ''}
            ${location.bookingPlatform ? `<p style="font-size: 0.875rem; color: var(--color-gray-500); margin-bottom: var(--space-md);">Book via ${location.bookingPlatform}</p>` : ''}
            <div class="sidebar-cta">
              ${location.bookable && location.bookingUrl ? `
                <a href="${location.bookingUrl}" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-sm);" target="_blank" rel="noopener">
                  Book Now →
                </a>
              ` : location.bookable ? `
                <a href="#" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-sm);">
                  Check Availability
                </a>
              ` : ''}
              <a href="locations.html" class="btn btn-outline" style="width: 100%;">All Locations</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        ${location.amenities?.length > 0 ? `
          <div class="detail-section">
            <h2>🏨 Amenities</h2>
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
            <h2>📺 Featured On</h2>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-md);">
              ${location.featuredSeasons.map(fs => {
                const show = showsData?.shows?.find(s => s.id === fs.show);
                const showEmoji = showEmojis[fs.show] || '📺';
                return `
                  <a href="show.html?id=${fs.show}" style="background: var(--color-gray-50); padding: var(--space-md) var(--space-lg); border-radius: var(--radius-md); text-decoration: none; color: inherit; transition: all var(--transition-fast);" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                      <span style="font-size: 1.5rem;">${showEmoji}</span>
                      <div>
                        <strong>${show?.name || fs.show}</strong>
                        <div style="font-size: 0.875rem; color: var(--color-gray-500);">
                          ${fs.seasons.length > 5 ? `Seasons ${fs.seasons[0]}-${fs.seasons[fs.seasons.length-1]}` : `Seasons ${fs.seasons.join(', ')}`}
                        </div>
                      </div>
                    </div>
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${location.faqs?.length > 0 ? `
          <div class="detail-section">
            <h2>❓ Frequently Asked Questions</h2>
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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// Back to Top Button
// ============================================

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  function toggleVisibility() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================
// Newsletter Form
// ============================================

async function handleNewsletterSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput?.value;

  if (!email) {
    showToast('Please enter your email address.', 'error');
    return;
  }

  // Disable button and show loading state
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      showToast('Thanks for subscribing! You\'ll be the first to know about new locations.', 'success');
      form.reset();
    } else {
      throw new Error('Subscription failed');
    }
  } catch (error) {
    showToast('Oops! Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Make function globally available
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ============================================
// Social Sharing
// ============================================

function shareContent(platform, title, url) {
  const encodedUrl = encodeURIComponent(url || window.location.href);
  const encodedTitle = encodeURIComponent(title || document.title);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    copy: null
  };

  if (platform === 'copy') {
    navigator.clipboard.writeText(url || window.location.href).then(() => {
      showToast('Link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
    return;
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

window.shareContent = shareContent;

function createShareButtons(title) {
  return `
    <div class="share-buttons">
      <span class="share-label">Share:</span>
      <button class="share-btn share-twitter" onclick="shareContent('twitter', '${title}')" title="Share on Twitter">
        <span>𝕏</span>
      </button>
      <button class="share-btn share-facebook" onclick="shareContent('facebook', '${title}')" title="Share on Facebook">
        <span>f</span>
      </button>
      <button class="share-btn share-copy" onclick="shareContent('copy')" title="Copy link">
        <span>📋</span>
      </button>
    </div>
  `;
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initSmoothScroll();
  initBackToTop();
  animateCounters();
  initFAQ();

  // Load dynamic content based on page
  await Promise.all([
    loadShowsGrid(),
    loadLocationsGrid(),
    loadShowsPage(),
    loadLocationsPage(),
    loadShowDetail(),
    loadLocationDetail()
  ]);
});
